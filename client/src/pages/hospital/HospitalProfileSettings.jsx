import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Camera,
  Shield, Bell, Lock, Save,
  ChevronRight, AlertCircle, CheckCircle,
  FileText, Activity
} from 'lucide-react';

import { useAuth } from '../../firebase/AuthContext';
import { cn } from '../../utils/cn';

const HospitalProfileSettings = () => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState(currentUser?.photoURL || null);

  // Form State
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || 'Dr. Priya Deshmukh',
    phone: '+91 97654 32109',
    hospitalName: 'Ruby Hall Clinic, Pune',
    dispatchCode: 'ER-RUBY-99',
    address: '40, Sassoon Road, near Pune Station, Sangamvadi, Pune'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setShowSuccess(true);

    // Auto hide success message
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const tabs = [
    { id: 'personal', name: 'Clinical Profile', icon: Activity },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'ER Dispatch Alerts', icon: Bell },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-fade-in">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-emerald-600 text-white rounded-2xl shadow-2xl flex items-center gap-3 font-bold"
          >
            <CheckCircle size={20} />
            Changes saved successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-outfit font-black text-slate-900 dark:text-white">Hospital Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage clinical dispatcher identity, facility coordinates, emergency dispatch codes, and real-time bed metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Navigation Tabs - horizontal scroll on mobile, vertical on desktop */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-1 lg:overflow-x-visible lg:pb-0 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 lg:px-6 py-3 lg:py-4 rounded-2xl text-sm font-bold transition-all whitespace-nowrap shrink-0 lg:w-full",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none"
                  : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
              )}
            >
              <tab.icon size={18} />
              {tab.name}
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto hidden lg:block" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
            {activeTab === 'personal' && (
              <div className="p-8 md:p-10 space-y-8">
                {/* Profile Picture */}
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                  <div className="relative group">
                    <div
                      className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 overflow-hidden border-4 border-white dark:border-slate-800 shadow-lg cursor-pointer"
                      onClick={triggerFileInput}
                    >
                      {profileImage ? (
                        <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User size={40} />
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera size={20} className="text-white" />
                      </div>
                    </div>
                    <button
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                    >
                      <Camera size={14} />
                    </button>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                      Clinical Dispatcher
                      <span className="text-[10px] font-black uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-100 dark:border-emerald-900">
                        <Activity size={10} className="fill-emerald-600 dark:fill-emerald-400" /> Active Facility
                      </span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">Upload your official medical avatar or corporate credentials badge.</p>
                    <div className="flex gap-3 justify-center sm:justify-start">
                      <button
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        Upload New
                      </button>
                      <button
                        onClick={handleRemoveImage}
                        className="px-4 py-2 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center gap-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">ER Coordinator Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                        placeholder="Coordinator Name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Official Facility Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        disabled
                        defaultValue={currentUser?.email || 'er.hq@safelink.in'}
                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed border border-transparent outline-none font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Direct ER Helpline / Phone</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Emergency Dispatch Code</label>
                    <div className="relative group">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input
                        type="text"
                        name="dispatchCode"
                        value={formData.dispatchCode}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                        placeholder="e.g. ER-HOSPITAL-CODE"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Hospital / Facility Name</label>
                    <div className="relative group">
                      <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input
                        type="text"
                        name="hospitalName"
                        value={formData.hospitalName}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                        placeholder="Hospital Name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Physical Facility Address</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                        placeholder="Facility Address"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                    <Shield size={14} />
                    GPS Dispatch tracking and ambulance telemetry keys verified
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={cn(
                      "w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none",
                      loading && "opacity-70 cursor-wait"
                    )}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
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
                      <h4 className="font-bold text-amber-900 dark:text-amber-200">HIPAA & Responder Security Policy</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">To protect patient confidentiality and emergency logs, all external data sync requires SafeLink Secure Key verification.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-100 transition-all">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                          <Lock size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white">Change Security Passcode</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Update emergency dispatcher passcode regular intervals.</p>
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
                          <h4 className="font-bold text-slate-900 dark:text-white">Two-Factor Ambulance Verification</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium text-left">Secure authentication for ER telemetry streams.</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="p-8 md:p-10 space-y-6">
                {[
                  { title: 'Critical Accident Dispatch Alerts', desc: 'Receive high-priority alert tones for live medical and traffic accident events in nearby wards.', active: true },
                  { title: 'ER Trauma Unit Telemetry Sync', desc: 'Allow automated patient vitals sync from onboard ambulance telemetry systems.', active: true },
                  { title: 'Dynamic Bed Availability Updates', desc: 'Auto-broadcast available ER and ICU bed capacity metrics to city ambulance hubs.', active: true },
                  { title: 'Volunteer Medical Team Dispatch', desc: 'Trigger volunteer expert coordinator routing protocols during major incidents.', active: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="text-left pr-4">
                      <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{item.desc}</p>
                    </div>
                    <div className={cn(
                      "w-12 h-6 rounded-full relative cursor-pointer transition-all shrink-0",
                      item.active ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                    )}>
                      <div className={cn(
                        "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all",
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
    </div>
  );
};

export default HospitalProfileSettings;
