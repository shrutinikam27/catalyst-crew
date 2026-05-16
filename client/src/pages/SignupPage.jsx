import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../firebase/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Mail, Lock, User, 
  ChevronRight, ArrowLeft, ArrowRight,
  Zap, Heart, ShieldAlert, Building2,
  Phone, CheckCircle2, Upload, BadgeCheck,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../utils/cn';

function SignupPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null); // citizen, volunteer, authority
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    skills: [],
    volunteerType: 'medical',
    department: '',
    designation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setError('');
    setLoading(true);
    try {
      await signup(formData.email, formData.password);
      // Success - redirect based on role
      if (role === 'authority') navigate('/admin');
      else if (role === 'volunteer') navigate('/volunteer');
      else navigate('/user');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  }

  const roles = [
    { 
      id: 'citizen', 
      title: 'Citizen', 
      desc: 'Access safety maps and report local issues.', 
      icon: User, 
      color: 'bg-indigo-500' 
    },
    { 
      id: 'volunteer', 
      title: 'Volunteer', 
      desc: 'Become a verified community responder.', 
      icon: Heart, 
      color: 'bg-rose-500' 
    },
    { 
      id: 'authority', 
      title: 'Authority', 
      desc: 'Official municipal or police response account.', 
      icon: ShieldAlert, 
      color: 'bg-slate-800' 
    },
  ];

  const volunteerCategories = [
    'Medical Volunteer', 'Women Safety', 'Disaster Response', 
    'Blood Donor', 'Traffic Support', 'Community Safety'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Progress */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/login')}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm uppercase tracking-widest">{step === 1 ? 'Back to Login' : 'Previous Step'}</span>
          </button>
          
          <div className="flex items-center gap-2">
            {[1, 2].map(i => (
              <div 
                key={i} 
                className={cn(
                  "w-8 h-1.5 rounded-full transition-all duration-500",
                  step >= i ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
                )}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="text-center">
                <h1 className="text-4xl font-outfit font-black text-slate-800 dark:text-white mb-4">Join SafeLink</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md mx-auto">
                  First, select the account type that best describes your role in the community.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setRole(r.id); setStep(2); }}
                    className={cn(
                      "p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border-2 text-left transition-all group hover:shadow-2xl hover:-translate-y-2",
                      role === r.id ? "border-indigo-600 ring-4 ring-indigo-500/10" : "border-slate-100 dark:border-slate-800 hover:border-indigo-200"
                    )}
                  >
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform", r.color)}>
                      <r.icon size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{r.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{r.desc}</p>
                    <div className="mt-8 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Select Role <ChevronRight size={14} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-xl mx-auto"
            >
              <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 lg:p-14 shadow-2xl border border-slate-100 dark:border-slate-800">
                <div className="mb-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 ring-1 ring-indigo-100 dark:ring-indigo-800">
                    <BadgeCheck size={14} /> {role} Account Signup
                  </div>
                  <h2 className="text-3xl font-outfit font-black text-slate-800 dark:text-white">Account Details</h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Please provide the following information to get started.</p>
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold ring-1 ring-rose-100 dark:ring-rose-800 flex items-center gap-3">
                    <AlertTriangle size={16} />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Common Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input name="name" value={formData.name} onChange={handleInputChange} type="text" required className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all dark:text-white outline-none placeholder:text-slate-400" placeholder="John Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                      <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" required className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all dark:text-white outline-none placeholder:text-slate-400" placeholder="+91 00000 00000" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                      <input name="email" value={formData.email} onChange={handleInputChange} type="email" required className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all dark:text-white outline-none placeholder:text-slate-400" placeholder="name@example.com" />
                    </div>
                  </div>

                  {/* Role Specific Fields */}
                  {role === 'volunteer' && (
                    <div className="space-y-4 pt-2">
                      <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30">
                        <h4 className="text-xs font-black text-rose-600 uppercase tracking-widest mb-3">Volunteer Expertise</h4>
                        <div className="flex flex-wrap gap-2">
                          {volunteerCategories.map(cat => (
                            <button 
                              key={cat}
                              type="button"
                              onClick={() => {
                                const newSkills = formData.skills.includes(cat) 
                                  ? formData.skills.filter(s => s !== cat)
                                  : [...formData.skills, cat];
                                setFormData(prev => ({ ...prev, skills: newSkills }));
                              }}
                              className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-bold transition-all",
                                formData.skills.includes(cat)
                                  ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
                                  : "bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        <Upload size={20} className="text-indigo-600" />
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Upload Government ID</span>
                        <button type="button" className="ml-auto px-4 py-1.5 bg-white dark:bg-slate-800 text-xs font-bold text-indigo-600 rounded-lg shadow-sm">Browse</button>
                      </div>
                    </div>
                  )}

                  {role === 'authority' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Department</label>
                        <div className="relative group">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                          <input name="department" value={formData.department} onChange={handleInputChange} type="text" required className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all dark:text-white outline-none" placeholder="e.g. Pune Police" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Designation</label>
                        <div className="relative group">
                          <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                          <input name="designation" value={formData.designation} onChange={handleInputChange} type="text" required className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all dark:text-white outline-none" placeholder="e.g. Inspector" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input name="password" value={formData.password} onChange={handleInputChange} type="password" required className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all dark:text-white outline-none" placeholder="••••••••" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                        <input name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} type="password" required className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all dark:text-white outline-none" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={loading}
                      type="submit" 
                      className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl transition-all shadow-2xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-50 uppercase tracking-widest text-sm"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          Complete Signup
                          <CheckCircle2 size={20} />
                        </>
                      )}
                    </button>
                    <p className="mt-6 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
                      By signing up, you agree to our <a href="#" className="text-indigo-600 underline">Terms of Service</a> & <a href="#" className="text-indigo-600 underline">Privacy Policy</a>
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Floating SOS Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/report')}
          className="fixed bottom-8 right-8 w-20 h-20 bg-red-600 rounded-full flex flex-col items-center justify-center text-white font-black text-xs shadow-2xl z-50 animate-pulse-sos border-4 border-white dark:border-slate-900"
        >
          <AlertTriangle size={24} className="mb-1" />
          SOS
        </motion.button>
      </div>
    </div>
  );
}

export default SignupPage;
