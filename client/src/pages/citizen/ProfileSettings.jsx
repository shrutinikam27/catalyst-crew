import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Camera, 
  Shield, Bell, Lock, Globe, Save,
  ChevronRight, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../firebase/AuthContext';
import { cn } from '../../utils/cn';

const ProfileSettings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('personal');

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-outfit font-black text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Tabs */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                activeTab === tab.id 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none" 
                  : "bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <tab.icon size={18} />
              {tab.name}
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {activeTab === 'personal' && (
            <div className="p-8 md:p-10 space-y-8">
              {/* Profile Picture */}
              <div className="flex items-center gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg">
                    {currentUser?.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User size={40} />
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Camera size={14} />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Photo</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">Upload a new photo to change your avatar.</p>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors">Upload</button>
                    <button className="px-4 py-2 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">Remove</button>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                      type="text" 
                      defaultValue={currentUser?.displayName || ''}
                      className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                      placeholder="Your Name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      disabled
                      defaultValue={currentUser?.email || ''}
                      className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed border border-transparent outline-none font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                      type="tel" 
                      className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                      placeholder="+91 00000 00000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Location / Ward</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                    <input 
                      type="text" 
                      className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                      placeholder="e.g. Pune Sector 4"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                  <Shield size={14} />
                  Your profile is public for emergency responders
                </div>
                <button className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-8 md:p-10 space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                  <AlertCircle className="text-amber-600 mt-1" size={20} />
                  <div>
                    <h4 className="font-bold text-amber-900 dark:text-amber-200">Security Recommendation</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Enable Two-Factor Authentication to add an extra layer of security to your account.</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 transition-all">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <Lock size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Change Password</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Update your account password regularly.</p>
                      </div>
                    </div>
                    <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Update</button>
                  </div>

                  <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 transition-all">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Secure your account with 2FA.</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="p-8 md:p-10 space-y-6">
              {[
                { title: 'Emergency Alerts', desc: 'Receive real-time notifications for nearby incidents.', active: true },
                { title: 'Community Updates', desc: 'Stay updated with local ward news and events.', active: true },
                { title: 'Safety Tips', desc: 'Get weekly tips to improve your urban safety knowledge.', active: false },
                { title: 'Marketing', desc: 'Receive newsletters and platform updates.', active: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                  </div>
                  <div className={cn(
                    "w-12 h-6 rounded-full relative cursor-pointer transition-all",
                    item.active ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                      item.active ? "right-1" : "left-1"
                    )}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
