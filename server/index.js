const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const colors = require('colors');
const morgan = require('morgan');
const dataFetcher = require('./services/dataFetcher');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Simulation Data for Real-time feed (Pune Specific)
const PUNE_AREAS = [
  { name: 'Shivaji Nagar', coords: [18.5312, 73.8445] },
  { name: 'Kothrud', coords: [18.5074, 73.8077] },
  { name: 'Hadapsar', coords: [18.5089, 73.9260] },
  { name: 'Viman Nagar', coords: [18.5679, 73.9143] },
  { name: 'Baner', coords: [18.5590, 73.7787] },
  { name: 'Koregaon Park', coords: [18.5362, 73.8940] },
  { name: 'Aundh', coords: [18.5580, 73.8075] },
  { name: 'Pimple Saudagar', coords: [18.5987, 73.7978] },
  { name: 'Wakad', coords: [18.5985, 73.7660] },
  { name: 'Hinjewadi', coords: [18.5913, 73.7389] },
  { name: 'Katraj', coords: [18.4529, 73.8546] },
  { name: 'Bibwewadi', coords: [18.4735, 73.8654] },
  { name: 'Kondhwa', coords: [18.4771, 73.8907] },
  { name: 'Warje', coords: [18.4842, 73.8037] },
  { name: 'Magarpatta', coords: [18.5137, 73.9242] },
  { name: 'Yerwada', coords: [18.5529, 73.8796] },
  { name: 'Pune Station', coords: [18.5289, 73.8744] },
  { name: 'Camp', coords: [18.5167, 73.8789] }
];

const INCIDENT_TYPES = [
  { type: 'CRIME', subtypes: ['Theft', 'Harassment', 'Illegal Activity'], color: '#f43f5e', source: 'Pune Police NCRB', url: 'http://punepolice.co.in/ncrb.php' },
  { type: 'CIVIC', subtypes: ['Pothole', 'Street Light', 'Garbage', 'Water Leak'], color: '#f59e0b', source: 'PMC Pune Care', url: 'http://bi.punecorporation.org/' },
  { type: 'FIRE', subtypes: ['Building Fire', 'Forest Fire', 'Short Circuit'], color: '#ea580c', source: 'Fire Brigade Dispatch' },
  { type: 'MEDICAL', subtypes: ['Cardiac Arrest', 'Accident', 'Critical Care'], color: '#10b981', source: 'Sassoon Hospital EMS' }
];

const generateMockPulse = () => {
  const area = PUNE_AREAS[Math.floor(Math.random() * PUNE_AREAS.length)];
  const category = INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)];
  const subtype = category.subtypes[Math.floor(Math.random() * category.subtypes.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    type: category.type,
    title: subtype,
    severity: Math.random() > 0.8 ? 'high' : 'moderate',
    coords: [area.coords[0] + (Math.random() - 0.5) * 0.02, area.coords[1] + (Math.random() - 0.5) * 0.02],
    location: area.name,
    isVerified: true,
    source: category.source,
    sourceUrl: category.url,
    message: `${subtype} reported near ${area.name}. (Source: ${category.source})`,
    time: new Date().toISOString()
  };
};

// ─── In-memory SOS alert store (fallback when Firestore rules are not yet set) ───
const activeSosAlerts = []; // { id, emergencyType, location, userName, notifyVolunteers, status, createdAt }

const EMERGENCY_VOLUNTEER_MAP = {
  Fire:     ['firebrigade', 'medical'],
  Crime:    ['crime'],
  Medical:  ['medical', 'crime'],
  Accident: ['firebrigade', 'medical', 'crime'],
};

// Socket Connection
io.on('connection', (socket) => {
  console.log('A user connected'.cyan);
  
  // Send existing pending SOS alerts immediately on connect (for volunteers already on dashboard)
  const pending = activeSosAlerts.filter(a => a.status === 'pending');
  if (pending.length > 0) {
    socket.emit('sos_alerts', pending);
  }

  // Send initial data pulse every 5 seconds
  const pulseInterval = setInterval(async () => {
    // Randomly choose between a simulation pulse and a verified data pulse
    if (Math.random() > 0.8) {
      const civicData = await dataFetcher.fetchCivicData();
      const verifiedPulse = {
        ...generateMockPulse(),
        title: civicData[0].title,
        isVerified: true,
        source: 'PMC Open Data'
      };
      socket.emit('city_pulse', verifiedPulse);
    } else {
      const pulse = generateMockPulse();
      socket.emit('city_pulse', pulse);
    }
  }, 5000);

  // Volunteer accepts an SOS alert
  socket.on('sos_accept', ({ alertId, volunteerId, volunteerName }) => {
    const alert = activeSosAlerts.find(a => a.id === alertId);
    if (alert && alert.status === 'pending') {
      alert.status = 'accepted';
      alert.acceptedBy = volunteerId;
      alert.acceptedByName = volunteerName;
      alert.acceptedAt = new Date().toISOString();
      // Notify all clients about the status change
      io.emit('sos_alerts', activeSosAlerts.filter(a => a.status === 'pending'));
      io.emit('sos_update', alert);
    }
  });

  // Volunteer resolves an SOS alert
  socket.on('sos_resolve', ({ alertId }) => {
    const alert = activeSosAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      alert.resolvedAt = new Date().toISOString();
      io.emit('sos_alerts', activeSosAlerts.filter(a => a.status === 'pending'));
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected'.red);
    clearInterval(pulseInterval);
  });
});

// Routes
app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Catalyst Crew API is running with Socket.IO support',
        version: '1.1.0'
    });
});

// ─── SOS REST endpoint (primary fallback when Firestore rules block anonymous writes) ───
app.post('/api/sos', (req, res) => {
  const { emergencyType, location, userId, userName } = req.body;

  if (!emergencyType || !location) {
    return res.status(400).json({ error: 'emergencyType and location are required' });
  }

  const alert = {
    id: 'sos-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6),
    emergencyType,
    location,                    // { latitude, longitude }
    userId: userId || null,
    userName: userName || 'Anonymous',
    notifyVolunteers: EMERGENCY_VOLUNTEER_MAP[emergencyType] || [],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  activeSosAlerts.push(alert);

  // Keep only the last 100 alerts in memory
  if (activeSosAlerts.length > 100) activeSosAlerts.shift();

  // Broadcast to all connected volunteer clients instantly
  io.emit('sos_alert_new', alert);
  io.emit('sos_alerts', activeSosAlerts.filter(a => a.status === 'pending'));

  console.log(`🆘 SOS Alert: ${emergencyType} from ${userName || 'Anonymous'} at ${location.latitude}, ${location.longitude}`.bgRed.white);

  res.status(201).json({ success: true, alertId: alert.id, alert });
});

// GET all pending SOS alerts (for volunteers who join late)
app.get('/api/sos', (req, res) => {
  res.json(activeSosAlerts.filter(a => a.status === 'pending'));
});

// Port configuration
const PORT = process.env.PORT || 8080;

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgCyan.white);
});
