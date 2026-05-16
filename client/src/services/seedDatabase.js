/**
 * Firestore Database Seeder — Populates initial data for SafeLink platform.
 * Run this once to bootstrap the database with police stations, hospitals,
 * fire stations, hotspots, risk zones, and initial analytics.
 * 
 * Usage: Import and call seedDatabase() from a component or console.
 */

import { setDocument, createDocument, COLLECTIONS } from './firestoreService';
import { serverTimestamp } from 'firebase/firestore';

const PUNE_POLICE_STATIONS = [
  { id: 'ps-shivajinagar', name: 'Shivaji Nagar Police Station', address: 'JM Road, Shivaji Nagar, Pune 411005', phone: '020-25510018', location: { lat: 18.5312, lng: 73.8445 }, jurisdiction: 'Shivaji Nagar', capacity: 45 },
  { id: 'ps-kothrud', name: 'Kothrud Police Station', address: 'Kothrud, Pune 411038', phone: '020-25382222', location: { lat: 18.5074, lng: 73.8077 }, jurisdiction: 'Kothrud', capacity: 38 },
  { id: 'ps-hadapsar', name: 'Hadapsar Police Station', address: 'Hadapsar Industrial Estate, Pune 411013', phone: '020-26871100', location: { lat: 18.5089, lng: 73.9260 }, jurisdiction: 'Hadapsar', capacity: 52 },
  { id: 'ps-vimannagar', name: 'Viman Nagar Police Station', address: 'Viman Nagar, Pune 411014', phone: '020-26630100', location: { lat: 18.5679, lng: 73.9143 }, jurisdiction: 'Viman Nagar', capacity: 35 },
  { id: 'ps-hinjewadi', name: 'Hinjewadi Police Station', address: 'Hinjewadi IT Park, Pune 411057', phone: '020-22933222', location: { lat: 18.5913, lng: 73.7389 }, jurisdiction: 'Hinjewadi', capacity: 40 },
  { id: 'ps-koregaonpark', name: 'Koregaon Park Police Station', address: 'North Main Road, Koregaon Park, Pune 411001', phone: '020-26131414', location: { lat: 18.5362, lng: 73.8940 }, jurisdiction: 'Koregaon Park', capacity: 42 },
  { id: 'ps-yerwada', name: 'Yerwada Police Station', address: 'Yerwada, Pune 411006', phone: '020-26684100', location: { lat: 18.5529, lng: 73.8796 }, jurisdiction: 'Yerwada', capacity: 48 },
  { id: 'ps-kondhwa', name: 'Kondhwa Police Station', address: 'Kondhwa Budruk, Pune 411048', phone: '020-26832100', location: { lat: 18.4771, lng: 73.8907 }, jurisdiction: 'Kondhwa', capacity: 36 },
];

const PUNE_HOSPITALS = [
  { id: 'h-sassoon', name: 'Sassoon General Hospital', address: 'Near Pune Railway Station, Pune 411001', phone: '020-26128000', location: { lat: 18.5245, lng: 73.8739 }, type: 'Government', beds: 1350, emergencyCapacity: 120, ambulances: 8 },
  { id: 'h-ruby', name: 'Ruby Hall Clinic', address: 'Sassoon Road, Pune 411001', phone: '020-66455000', location: { lat: 18.5288, lng: 73.8782 }, type: 'Private', beds: 550, emergencyCapacity: 60, ambulances: 5 },
  { id: 'h-jehangir', name: 'Jehangir Hospital', address: '32, Sassoon Road, Pune 411001', phone: '020-66813333', location: { lat: 18.5280, lng: 73.8765 }, type: 'Private', beds: 350, emergencyCapacity: 45, ambulances: 4 },
  { id: 'h-kem', name: 'KEM Hospital', address: 'Sardar Moodliar Road, Rasta Peth, Pune 411011', phone: '020-66032000', location: { lat: 18.5135, lng: 73.8600 }, type: 'Trust', beds: 800, emergencyCapacity: 80, ambulances: 6 },
  { id: 'h-deenanath', name: 'Deenanath Mangeshkar Hospital', address: 'Erandwane, Pune 411004', phone: '020-40151000', location: { lat: 18.5100, lng: 73.8263 }, type: 'Trust', beds: 800, emergencyCapacity: 70, ambulances: 5 },
];

const PUNE_FIRE_STATIONS = [
  { id: 'fs-shivajinagar', name: 'Shivaji Nagar Fire Station', address: 'Shivaji Nagar, Pune 411005', phone: '020-25501010', location: { lat: 18.5320, lng: 73.8460 }, vehicles: 6, personnel: 35 },
  { id: 'fs-swargate', name: 'Swargate Fire Station', address: 'Near Swargate Bus Stand, Pune 411037', phone: '020-24443434', location: { lat: 18.5018, lng: 73.8636 }, vehicles: 5, personnel: 30 },
  { id: 'fs-hadapsar', name: 'Hadapsar Fire Station', address: 'Hadapsar, Pune 411028', phone: '020-26872222', location: { lat: 18.5050, lng: 73.9300 }, vehicles: 4, personnel: 28 },
  { id: 'fs-aundh', name: 'Aundh Fire Station', address: 'Aundh, Pune 411007', phone: '020-25880303', location: { lat: 18.5590, lng: 73.8100 }, vehicles: 5, personnel: 32 },
];

const PUNE_HOTSPOTS = [
  { id: 'hs-hadapsar', location: { lat: 18.5089, lng: 73.9260 }, radius: 900, riskLevel: 'high', category: 'crime', incidentCount: 47, name: 'Hadapsar Industrial' },
  { id: 'hs-yerwada', location: { lat: 18.5529, lng: 73.8796 }, radius: 700, riskLevel: 'high', category: 'crime', incidentCount: 38, name: 'Yerwada' },
  { id: 'hs-punestation', location: { lat: 18.5289, lng: 73.8744 }, radius: 600, riskLevel: 'high', category: 'crime', incidentCount: 52, name: 'Pune Station' },
  { id: 'hs-aundh', location: { lat: 18.5580, lng: 73.8075 }, radius: 800, riskLevel: 'medium', category: 'accident', incidentCount: 28, name: 'Aundh' },
  { id: 'hs-hinjewadi', location: { lat: 18.5913, lng: 73.7389 }, radius: 900, riskLevel: 'medium', category: 'accident', incidentCount: 22, name: 'Hinjewadi IT Park' },
  { id: 'hs-kondhwa', location: { lat: 18.4771, lng: 73.8907 }, radius: 700, riskLevel: 'medium', category: 'civic', incidentCount: 19, name: 'Kondhwa' },
  { id: 'hs-central', location: { lat: 18.5204, lng: 73.8567 }, radius: 1000, riskLevel: 'low', category: 'safe', incidentCount: 5, name: 'Central Pune' },
  { id: 'hs-kothrud', location: { lat: 18.5074, lng: 73.8077 }, radius: 800, riskLevel: 'low', category: 'safe', incidentCount: 8, name: 'Kothrud' },
  { id: 'hs-baner', location: { lat: 18.5590, lng: 73.7787 }, radius: 800, riskLevel: 'low', category: 'safe', incidentCount: 6, name: 'Baner' },
];

const RISK_ZONES = [
  { id: 'rz-east', name: 'Pune East Zone', bounds: { north: 18.56, south: 18.48, east: 73.95, west: 73.88 }, riskScore: 78, factors: ['high crime density', 'industrial area', 'poor lighting'] },
  { id: 'rz-central', name: 'Pune Central Zone', bounds: { north: 18.54, south: 18.50, east: 73.89, west: 73.84 }, riskScore: 45, factors: ['moderate traffic', 'commercial hub', 'police presence'] },
  { id: 'rz-west', name: 'Pune West Zone', bounds: { north: 18.56, south: 18.49, east: 73.83, west: 73.73 }, riskScore: 28, factors: ['residential area', 'good infrastructure', 'active patrol'] },
  { id: 'rz-south', name: 'Pune South Zone', bounds: { north: 18.50, south: 18.44, east: 73.90, west: 73.83 }, riskScore: 55, factors: ['mixed land use', 'growing population', 'limited coverage'] },
];

const RESPONSE_TEAMS = [
  { id: 'rt-police-a', name: 'Alpha Squad', department: 'police', members: ['Sgt. Kulkarni', 'Ofc. Patil', 'Ofc. More'], status: 'available', currentLocation: { lat: 18.5074, lng: 73.8077 } },
  { id: 'rt-police-b', name: 'Bravo Unit', department: 'police', members: ['Sgt. Shinde', 'Ofc. Deshmukh', 'Ofc. Jadhav'], status: 'deployed', currentLocation: { lat: 18.5089, lng: 73.9260 } },
  { id: 'rt-ems-1', name: 'EMS Unit 1', department: 'hospital', members: ['Dr. Sharma', 'Paramedic Rane'], status: 'available', currentLocation: { lat: 18.5245, lng: 73.8739 } },
  { id: 'rt-ems-2', name: 'EMS Unit 2', department: 'hospital', members: ['Dr. Patel', 'Paramedic Gaikwad'], status: 'deployed', currentLocation: { lat: 18.5288, lng: 73.8782 } },
  { id: 'rt-fire-1', name: 'Fire Engine Alpha', department: 'fire', members: ['Chief Mukadam', 'FF Kale', 'FF Pawar'], status: 'available', currentLocation: { lat: 18.5320, lng: 73.8460 } },
  { id: 'rt-fire-2', name: 'Fire Engine Bravo', department: 'fire', members: ['Chief Thorat', 'FF Mane', 'FF Joshi'], status: 'available', currentLocation: { lat: 18.5018, lng: 73.8636 } },
];

export const seedDatabase = async () => {
  console.log('🌱 Starting SafeLink database seed...');
  
  try {
    // Seed Police Stations
    for (const station of PUNE_POLICE_STATIONS) {
      await setDocument(COLLECTIONS.POLICE_STATIONS, station.id, { ...station, createdAt: serverTimestamp(), lastUpdated: serverTimestamp() }, false);
    }
    console.log('✅ Police stations seeded');

    // Seed Hospitals
    for (const hospital of PUNE_HOSPITALS) {
      await setDocument(COLLECTIONS.HOSPITALS, hospital.id, { ...hospital, createdAt: serverTimestamp(), lastUpdated: serverTimestamp() }, false);
    }
    console.log('✅ Hospitals seeded');

    // Seed Fire Stations
    for (const station of PUNE_FIRE_STATIONS) {
      await setDocument(COLLECTIONS.FIRE_STATIONS, station.id, { ...station, createdAt: serverTimestamp(), lastUpdated: serverTimestamp() }, false);
    }
    console.log('✅ Fire stations seeded');

    // Seed Hotspots
    for (const hotspot of PUNE_HOTSPOTS) {
      await setDocument(COLLECTIONS.HOTSPOTS, hotspot.id, { ...hotspot, lastUpdated: serverTimestamp() }, false);
    }
    console.log('✅ Hotspots seeded');

    // Seed Risk Zones
    for (const zone of RISK_ZONES) {
      await setDocument(COLLECTIONS.RISK_ZONES, zone.id, { ...zone, lastCalculated: serverTimestamp() }, false);
    }
    console.log('✅ Risk zones seeded');

    // Seed Response Teams
    for (const team of RESPONSE_TEAMS) {
      await setDocument(COLLECTIONS.RESPONSE_TEAMS, team.id, { ...team, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }, false);
    }
    console.log('✅ Response teams seeded');

    // Seed Initial Analytics
    const today = new Date();
    const analyticsId = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    await setDocument(COLLECTIONS.ANALYTICS, analyticsId, {
      date: serverTimestamp(),
      totalComplaints: 127,
      totalEmergencies: 14,
      avgResponseTime: 8.4,
      resolutionRate: 87,
      hotspotCount: 9,
      departmentStats: {
        police: { activeOfficers: 142, resolvedCases: 89 },
        hospital: { ambulancesActive: 12, emergenciesHandled: 8 },
        fire: { vehiclesReady: 18, incidentsHandled: 3 }
      }
    }, false);
    console.log('✅ Analytics seeded');

    console.log('🎉 SafeLink database seed complete!');
    return true;
  } catch (error) {
    console.error('❌ Seed error:', error);
    return false;
  }
};
