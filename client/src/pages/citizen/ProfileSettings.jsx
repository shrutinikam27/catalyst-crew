import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Camera,
  Shield, Bell, Lock, Globe, Save,
  ChevronRight, AlertCircle, CheckCircle,
  X
} from 'lucide-react';
import { useAuth } from '../../firebase/AuthContext';
import { cn } from '../../utils/cn';

const ProfileSettings = () => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState(currentUser?.photoURL || null);

  // Determine role
  const role = currentUser?.email?.includes('admin') ? 'admin' : 
               currentUser?.email?.includes('police') ? 'police' :
               currentUser?.email?.includes('volunteer') ? 'volunteer' :
               currentUser?.email?.includes('hospital') ? 'hospital' :
               currentUser?.email?.includes('fire') ? 'fire' : 'citizen';

  // Form State
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || (role === 'police' ? 'Officer Pune' : 'Citizen Pune'),
    phone: '+91 98765 43210',
    location: role === 'police' ? 'Shivaji Nagar Precinct' : 'Kothrud, Sector 4',
    badgeNumber: role === 'police' ? 'PN-2045' : undefined,
    department: role === 'police' ? 'Pune City Police' : undefined
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
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
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
        <h1 className="text-3xl font-outfit font-black text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-none"
                  : "text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm"
              )}
            >
              <tab.icon size={18} />
              {tab.name}
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
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
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Photo</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-3">Upload a new photo to change your avatar.</p>
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
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Display Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input
                        type="text"
                        name="displayName"
                        value={formData.displayName}
                        onChange={handleInputChange}
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
                        defaultValue={currentUser?.email || (role === 'police' ? 'pune.officer@safelink.in' : 'pune.citizen@safelink.in')}
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
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                        placeholder="+91 00000 00000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{role === 'police' ? 'Assigned Precinct / Ward' : 'Location / Ward'}</label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                        placeholder="e.g. Pune Sector 4"
                      />
                    </div>
                  </div>
                  {role === 'police' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Officer Badge Number</label>
                        <div className="relative group">
                          <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input
                            type="text"
                            name="badgeNumber"
                            value={formData.badgeNumber}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                            placeholder="e.g. PN-1234"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Department / Division</label>
                        <div className="relative group">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full pl-12 pr-5 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-transparent focus:border-indigo-600 outline-none transition-all dark:text-white font-medium"
                            placeholder="e.g. Traffic Division"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
 
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {role === 'police' ? (
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-full">
                      <Shield size={14} />
                      Your police credentials are verified and active
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
                      <Shield size={14} />
                      Your profile is public for emergency responders
                    </div>
                  )}
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
                      <h4 className="font-bold text-amber-900 dark:text-amber-200">Security Recommendation</h4>
                      <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Enable Two-Factor Authentication to add an extra layer of security to your account.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
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
                          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium text-left">Secure your account with 2FA codes.</p>
                        </div>
                      </div>
                      <div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
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
                    <div className="text-left">
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

export default ProfileSettings;
