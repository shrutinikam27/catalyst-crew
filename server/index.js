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
  { name: 'Koregaon Park', coords: [18.5362, 73.8940] }
];

const INCIDENT_TYPES = [
  { type: 'CRIME', subtypes: ['Theft', 'Harassment', 'Illegal Activity'], color: '#f43f5e' },
  { type: 'CIVIC', subtypes: ['Pothole', 'Street Light', 'Garbage', 'Water Leak'], color: '#f59e0b' }
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
    message: `${subtype} reported near ${area.name}. Response team notified.`,
    time: new Date().toISOString()
  };
};

// Socket Connection
io.on('connection', (socket) => {
  console.log('A user connected'.cyan);
  
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

// Port configuration
const PORT = process.env.PORT || 8080;

// Start server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`.bgCyan.white);
});
