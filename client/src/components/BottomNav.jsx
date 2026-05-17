import React from 'react';
import { 
  Home, Map, AlertTriangle, FileText, 
  User, PieChart, Activity, Zap, Shield, Bell, Ambulance, Flame, Cpu, Navigation
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/cn';

const roleMenus = {
  citizen: [
    { name: 'Home', icon: Home, path: '/user' },
    { name: 'Map', icon: Map, path: '/user/map' },
    { name: 'Report', icon: AlertTriangle, path: '/user/report' },
    { name: 'SOS', icon: Zap, path: '/user/sos' },
    { name: 'Profile', icon: User, path: '/user/profile' },
  ],
  volunteer: [
    { name: 'Hub', icon: Home, path: '/volunteer' },
    { name: 'Alerts', icon: Bell, path: '/volunteer/alerts' },
    { name: 'Missions', icon: Activity, path: '/volunteer/missions' },
    { name: 'Profile', icon: User, path: '/volunteer/profile' },
  ],
  police: [
    { name: 'Overview', icon: Home, path: '/police' },
    { name: 'Incidents', icon: FileText, path: '/police/incidents' },
    { name: 'Patrol', icon: Map, path: '/police/patrol' },
    { name: 'Map', icon: Zap, path: '/police/map' },
  ],
  hospital: [
    { name: 'ER', icon: Home, path: '/hospital' },
    { name: 'Dispatch', icon: Ambulance, path: '/hospital/dispatch' },
    { name: 'Alerts', icon: Bell, path: '/hospital/alerts' },
  ],
  fire: [
    { name: 'Command', icon: Home, path: '/fire' },
    { name: 'Dispatch', icon: Flame, path: '/fire/dispatch' },
    { name: 'Hazmat', icon: AlertTriangle, path: '/fire/hazmat' },
  ],
  admin: [
    { name: 'Command', icon: Home, path: '/admin' },
    { name: 'Analytics', icon: PieChart, path: '/admin/analytics' },
    { name: 'Logs', icon: FileText, path: '/admin/logs' },
    { name: 'AI', icon: Cpu, path: '/admin/ai' },
  ]
};

const BottomNav = ({ role = 'citizen', isVolunteer }) => {
  const location = useLocation();
  let menuItems = [...(roleMenus[role] || roleMenus.citizen)];

  // Slice to max 5 items for bottom nav to avoid crowding
  menuItems = menuItems.slice(0, 5);

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex justify-around items-center px-2 py-3 z-50 pb-safe">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
              isActive 
                ? "text-indigo-600 dark:text-indigo-400" 
                : "text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            )}
          >
            <item.icon size={20} className={cn(isActive && "fill-indigo-100 dark:fill-indigo-900/30")} />
            <span className="text-[10px] font-bold">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
