import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './firebase/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import Features from './pages/Features';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ReportIssue from './pages/ReportIssue';
import Contact from './pages/Contact';
import SosDirectPage from './pages/SosDirectPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportIncident from './pages/citizen/ReportIncident';
import CitizenHeatmap from './pages/citizen/CitizenHeatmap';
import CitizenSOS from './pages/citizen/CitizenSOS';
import ComplaintTracking from './pages/citizen/ComplaintTracking';
import SafetyCompanion from './pages/citizen/SafetyCompanion';
import SafetyTips from './pages/citizen/SafetyTips';
import ProfileSettings from './pages/citizen/ProfileSettings';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';
import NearbyEmergencies from './pages/volunteer/NearbyEmergencies';
import ActiveMissions from './pages/volunteer/ActiveMissions';

// Police Pages
import PoliceDashboard from './pages/police/PoliceDashboard';
import PoliceHeatmap from './pages/police/PoliceHeatmap';
import IncidentManager from './pages/police/IncidentManager';
import PatrolOptimizer from './pages/police/PatrolOptimizer';
import PoliceProfileSettings from './pages/police/PoliceProfileSettings';

// Fire Pages
import FireDashboard from './pages/fire/FireDashboard';
import FireDispatch from './pages/fire/FireDispatch';

// Hospital Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import HospitalDispatch from './pages/hospital/HospitalDispatch';
import PatientAlerts from './pages/hospital/PatientAlerts';
import HospitalProfileSettings from './pages/hospital/HospitalProfileSettings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CityAnalytics from './pages/admin/CityAnalytics';
import AdminReports from './pages/admin/AdminReports';
import UserManagement from './pages/admin/UserManagement';
import SystemLogs from './pages/admin/SystemLogs';
import AIForecasts from './pages/admin/AIForecasts';

import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const auth = useAuth();
  const currentUser = auth?.currentUser;
  const loading = auth ? auth.loading : true;
  
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-indigo-600">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!currentUser) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
          <Route path="/sos" element={<SosDirectPage />} />
          <Route path="/about" element={<div className="p-20 text-center font-outfit font-black text-4xl dark:text-white uppercase">About SafeLink Platform</div>} />
          <Route path="/help" element={<div className="p-20 text-center font-outfit font-black text-4xl dark:text-white uppercase">SafeLink Help Center</div>} />

          {/* Citizen Dashboard Routes */}
          <Route path="/user" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<CitizenDashboard />} />
            <Route path="report" element={<ReportIncident />} />
            <Route path="map" element={<CitizenHeatmap />} />
            <Route path="tracking" element={<ComplaintTracking />} />
            <Route path="sos" element={<CitizenSOS />} />
            <Route path="safety" element={<SafetyCompanion />} />
            <Route path="tips" element={<SafetyTips />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="route" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Smart Safe Route Module Coming Soon</div>} />
          </Route>

          {/* Volunteer Dashboard Routes */}
          <Route path="/volunteer" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<VolunteerDashboard />} />
            <Route path="alerts" element={<NearbyEmergencies />} />
            <Route path="missions" element={<ActiveMissions />} />
            <Route path="profile" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Profile Module Coming Soon</div>} />
          </Route>

          {/* Police Dashboard Routes */}
          <Route path="/police" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<PoliceDashboard />} />
            <Route path="incidents" element={<IncidentManager />} />
            <Route path="patrol" element={<PatrolOptimizer />} />
            <Route path="map" element={<PoliceHeatmap />} />
            <Route path="profile" element={<PoliceProfileSettings />} />
          </Route>

          {/* Hospital Dashboard Routes */}
          <Route path="/hospital" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<HospitalDashboard />} />
            <Route path="dispatch" element={<HospitalDispatch />} />
            <Route path="alerts" element={<PatientAlerts />} />
            <Route path="profile" element={<HospitalProfileSettings />} />
          </Route>

          {/* Fire Dashboard Routes */}
          <Route path="/fire" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<FireDashboard />} />
            <Route path="dispatch" element={<FireDispatch />} />
            <Route path="hazmat" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Hazmat Tracking Coming Soon</div>} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<CityAnalytics />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="logs" element={<SystemLogs />} />
            <Route path="ai" element={<AIForecasts />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </SocketProvider>
    </AuthProvider>
  );
}

export default App;
