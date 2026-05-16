import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AlertTriangle, Shield, MapPin, Camera, Clock,
  CheckCircle2, ArrowRight, MessageSquare, Plus, Info
} from 'lucide-react';

const ReportIssue = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    location: 'Pune Metropolitan Area',
    priority: 'Medium',
    isEmergency: false
  });

  useEffect(() => {
    // Set category from state if navigation passed it
    if (location.state && location.state.category) {
      setFormData(prev => ({ ...prev, category: location.state.category }));
      setStep(2);
    }

    // Real-time location detection
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Attempt reverse geocoding via nominatim (free)
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const area = data.address.suburb || data.address.neighbourhood || data.address.city || 'Pune';
            setFormData(prev => ({ ...prev, location: `${area}, Pune Metropolitan Area` }));
          } catch (err) {
            setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
          }
        },
        () => {
          setFormData(prev => ({ ...prev, location: 'Pune Metropolitan Area' }));
        }
      );
    }
  }, [location.state]);

  const categories = [
    { id: 'crime', title: 'Crime Reporting', icon: <Shield size={24} />, color: 'bg-red-500', desc: 'Theft, harassment, suspicious activity' },
    { id: 'civic', title: 'Civic Grievance', icon: <AlertTriangle size={24} />, color: 'bg-amber-500', desc: 'Potholes, streetlights, garbage' },
    { id: 'health', title: 'Health & Safety', icon: <Plus size={24} />, color: 'bg-green-500', desc: 'Accidents, medical emergencies' },
    { id: 'other', title: 'Other Issue', icon: <Info size={24} />, color: 'bg-blue-500', desc: 'General complaints or suggestions' },
  ];

  const handleCategorySelect = (id) => {
    setFormData({ ...formData, category: id });
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3); // Success state
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0f172a] pt-32 pb-16 px-6 font-inter transition-colors duration-300">
      <div className="max-w-[800px] mx-auto">

        {/* Progress Header */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
          <div className={`w-12 h-[2px] ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
          <div className={`w-12 h-[2px] ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-outfit font-black text-slate-800 dark:text-white mb-4">Report an Issue</h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-[500px] mx-auto">
                Select a category that best describes the problem you're facing. Your report helps make Pune safer.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
                >
                  <div className={`w-16 h-16 ${cat.color} rounded-3xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100 dark:shadow-none group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{cat.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{cat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <button
              onClick={() => setStep(1)}
              className="mb-8 text-indigo-600 font-bold text-sm flex items-center gap-2 hover:gap-3 transition-all"
            >
              <ArrowRight size={16} className="rotate-180" /> Back to Categories
            </button>

            <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 dark:shadow-none border border-slate-100 dark:border-slate-700">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8">Provide Issue Details</h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Issue Title</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Streetlight out on Baner Road"
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all dark:text-white"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Priority Level</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all dark:text-white"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Emergency</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    required
                    placeholder="Describe the issue in detail..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-4 rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all min-h-[120px] dark:text-white"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-100 dark:ring-slate-700 p-4 rounded-2xl pr-12 dark:text-white"
                        value={formData.location}
                      />
                      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-600" size={20} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium ml-1">📍 Auto-detected via GPS</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Upload Photo</label>
                    <div className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 p-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                      <Camera className="text-slate-400" size={20} />
                      <span className="text-xs font-bold text-slate-500">Capture or Upload Image</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-3 transition-all"
                  >
                    Submit Official Report <ArrowRight size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in zoom-in-95 fade-in duration-500 text-center">
            <div className="bg-white dark:bg-slate-800 p-16 rounded-[4rem] shadow-2xl shadow-indigo-100 dark:shadow-none border border-slate-100 dark:border-slate-700">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <CheckCircle2 size={48} />
              </div>
              <h1 className="text-4xl font-outfit font-black text-slate-800 dark:text-white mb-4">Report Submitted</h1>
              <p className="text-slate-500 dark:text-slate-400 max-w-[400px] mx-auto mb-10 text-lg">
                Your report <span className="font-bold text-indigo-600">#SL-9842</span> has been recorded. Authorities have been notified.
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/user')}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
                >
                  Track My Report
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 px-8 py-4 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  File Another Report
                </button>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase">Estimated Response: 2-4 Hours</span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <MessageSquare size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase">Status: Notified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ReportIssue;
