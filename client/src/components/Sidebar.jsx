import React from 'react';
import { 
  Home, Map, AlertTriangle, MessageSquare, FileText, 
  Shield, PieChart, LineChart, Bell, Heart, Users, 
  Settings, User, ChevronRight, LogOut, Briefcase, 
  Activity, Cpu, Ambulance, Flame, Zap, Navigation, Mail
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

const roleMenus = {
  citizen: [
    { name: 'Overview', icon: Home, path: '/user' },
    { name: 'Risk Map', icon: Map, path: '/user/map' },
    { name: 'Safety Companion', icon: Navigation, path: '/user/safety' },
    { name: 'Report Incident', icon: AlertTriangle, path: '/user/report' },
    { name: 'Track Complaints', icon: FileText, path: '/user/tracking' },
    { name: 'Emergency SOS', icon: Zap, path: '/user/sos' },
    { name: 'Safety Tips', icon: Heart, path: '/user/tips' },
    { name: 'Profile Settings', icon: User, path: '/user/profile' },
  ],
  volunteer: [
    { name: 'Volunteer Hub', icon: Home, path: '/volunteer' },
    { name: 'Nearby Alerts', icon: Bell, path: '/volunteer/alerts' },
    { name: 'Active Missions', icon: Activity, path: '/volunteer/missions' },
    { name: 'My Profile', icon: User, path: '/volunteer/profile' },
    { name: 'Citizen Dashboard', icon: User, path: '/user' },
  ],
  police: [
    { name: 'Precinct Overview', icon: Home, path: '/police' },
    { name: 'Incident Manager', icon: FileText, path: '/police/incidents' },
    { name: 'Patrol Optimizer', icon: Map, path: '/police/patrol' },
    { name: 'Crime Heatmap', icon: Zap, path: '/police/map' },
  ],
  hospital: [
    { name: 'ER Dashboard', icon: Home, path: '/hospital' },
    { name: 'Dispatch Board', icon: Ambulance, path: '/hospital/dispatch' },
    { name: 'Patient Alerts', icon: Bell, path: '/hospital/alerts' },
  ],
  fire: [
    { name: 'Fire Command', icon: Home, path: '/fire' },
    { name: 'Dispatch Logs', icon: Flame, path: '/fire/dispatch' },
    { name: 'Hazmat Tracking', icon: AlertTriangle, path: '/fire/hazmat' },
  ],
  admin: [
    { name: 'City Command', icon: Home, path: '/admin' },
    { name: 'City Analytics', icon: PieChart, path: '/admin/analytics' },
    { name: 'Grievance & Reports', icon: MessageSquare, path: '/admin/reports' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'System Logs', icon: FileText, path: '/admin/logs' },
    { name: 'AI Forecasts', icon: Cpu, path: '/admin/ai' },
  ]
};

const Sidebar = ({ role = 'citizen', isOpen, onClose, onLogout, isVolunteer }) => {
  const location = useLocation();
  let menuItems = [...(roleMenus[role] || roleMenus.citizen)];

  if (role === 'citizen' && isVolunteer) {
    menuItems.push({ name: 'Volunteer Panel', icon: Shield, path: '/volunteer' });
  }

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 transition-transform duration-300 lg:translate-x-0",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex flex-col h-full">
        {/* Brand */}
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-xl font-outfit font-bold text-slate-900 dark:text-white leading-tight">SafeLink</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{role} Portal</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                )}
              >
                <item.icon size={18} className={cn("transition-colors", isActive ? "text-white" : "group-hover:text-indigo-600")} />
                <span>{item.name}</span>
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {role !== 'admin' && (
            <Link 
              to="/contact"
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all group"
            >
              <Mail size={18} className="group-hover:scale-110 transition-transform" />
              <span>Contact Support</span>
            </Link>
          )}
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
