import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './firebase/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// Citizen Pages
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import ReportIncident from './pages/citizen/ReportIncident';
import CitizenHeatmap from './pages/citizen/CitizenHeatmap';

// Volunteer Pages
import VolunteerDashboard from './pages/volunteer/VolunteerDashboard';

// Police Pages
import PoliceDashboard from './pages/police/PoliceDashboard';

// Hospital Pages
import HospitalDashboard from './pages/hospital/HospitalDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
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
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Citizen Dashboard Routes */}
          <Route path="/user" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<CitizenDashboard />} />
            <Route path="report" element={<ReportIncident />} />
            <Route path="map" element={<CitizenHeatmap />} />
            <Route path="tracking" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Tracking Module Coming Soon</div>} />
            <Route path="sos" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">SOS Module Coming Soon</div>} />
            <Route path="tips" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Safety Tips Module Coming Soon</div>} />
          </Route>

          {/* Volunteer Dashboard Routes */}
          <Route path="/volunteer" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<VolunteerDashboard />} />
            <Route path="alerts" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Emergency Alerts Module Coming Soon</div>} />
            <Route path="missions" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Missions Module Coming Soon</div>} />
            <Route path="profile" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Profile Module Coming Soon</div>} />
          </Route>

          {/* Police Dashboard Routes */}
          <Route path="/police" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<PoliceDashboard />} />
            <Route path="incidents" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Incident Management Coming Soon</div>} />
            <Route path="patrol" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Patrol Optimizer Coming Soon</div>} />
            <Route path="map" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Crime Map Coming Soon</div>} />
          </Route>

          {/* Hospital Dashboard Routes */}
          <Route path="/hospital" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<HospitalDashboard />} />
            <Route path="dispatch" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Dispatch Board Coming Soon</div>} />
            <Route path="alerts" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">Patient Alerts Coming Soon</div>} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">City Analytics Coming Soon</div>} />
            <Route path="users" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">User Management Coming Soon</div>} />
            <Route path="logs" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">System Logs Coming Soon</div>} />
            <Route path="ai" element={<div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm text-center font-bold text-slate-500 uppercase tracking-widest">AI Forecasts Coming Soon</div>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
