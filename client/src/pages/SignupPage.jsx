import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../firebase/AuthContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Mail, Lock, User, 
  ChevronRight, ArrowLeft, ArrowRight,
  Zap, Heart, ShieldAlert, Building2,
  Phone, CheckCircle2, Upload, BadgeCheck,
  AlertTriangle, Clock
} from 'lucide-react';
import { cn } from '../utils/cn';

function SignupPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [submitted, setSubmitted] = useState(false); // pending approval screen
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
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const { signup, loginWithGoogle, setupRecaptcha, loginWithPhone } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.phone) return setError('Please enter a phone number first.');
    
    setLoading(true);
    setError('');
    try {
      const verifier = setupRecaptcha('recaptcha-container');
      const result = await loginWithPhone(formData.phone, verifier);
      setConfirmationResult(result);
      setShowOtpInput(true);
      
      if (result.isMock) {
        alert('DEVELOPMENT MODE: Please use the test code "123456" to verify your number.');
      } else {
        alert('OTP sent to ' + formData.phone);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP. Ensure the number is in E.164 format (e.g. +91...)');
    } finally {
      setLoading(false);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (showOtpInput && !confirmationResult) return setError('Please send OTP first.');
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    setError('');
    setLoading(true);
    try {
      // 1. Verify OTP first if input is shown
      if (showOtpInput) {
        await confirmationResult.confirm(otp);
      }

      // 2. Continue with Email Signup and Profile creation
      const { user } = await signup(formData.email, formData.password);

      if (role === 'volunteer') {
        await addDoc(collection(db, 'volunteerRequests'), {
          uid: user.uid,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          expertise: formData.skills,
          idFileName: fileName || 'Not provided',
          status: 'pending',
          createdAt: serverTimestamp(),
        });
        setSubmitted(true);
      } else if (role === 'authority') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError(err.message || 'Failed to complete signup.');
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
    'firebrigade', 'medical', 'crime'
  ];

  async function handleGoogleLogin() {
    try {
      const { user } = await loginWithGoogle();
      if (user.email.includes('admin')) navigate('/admin');
      else if (user.email.includes('police')) navigate('/police');
      else if (user.email.includes('volunteer')) navigate('/volunteer');
      else if (user.email.includes('hospital')) navigate('/hospital');
      else if (user.email.includes('fire')) navigate('/fire');
      else navigate('/user');
    } catch (err) {
      console.error(err);
      setError('Failed to sign up with Google.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 transition-colors py-12 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Pending Approval Screen */}
        {submitted && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
              <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <div className="absolute inset-0 bg-amber-400/20 rounded-full animate-ping"></div>
                <Clock size={48} className="text-amber-600 dark:text-amber-500 relative z-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-3 font-outfit">Request Submitted!</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Your volunteer application has been submitted and is <span className="text-amber-600 font-bold">pending review</span> by the relevant admin. 
              </p>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed">
                You will be able to log in only after your request has been <span className="font-bold text-emerald-600">verified and approved</span>. Please check back after you receive confirmation.
              </p>
              <button onClick={() => navigate('/login')} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-100 dark:shadow-none">
                Back to Login
              </button>
            </div>
          </div>
        )}

        {!submitted && (
        <div>
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
                      <div className="flex gap-3">
                        <div className="relative group flex-1">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                          <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" required className="w-full pl-12 pr-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-100 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all dark:text-white outline-none placeholder:text-slate-400" placeholder="+91 00000 00000" />
                        </div>
                        {!showOtpInput && (
                          <button 
                            type="button"
                            onClick={handleSendOtp}
                            className="px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest"
                          >
                            Send OTP
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {showOtpInput && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <label className="text-xs font-bold text-indigo-600 uppercase tracking-widest ml-1">Enter 6-Digit OTP</label>
                      <div className="relative group">
                        <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={20} />
                        <input 
                          value={otp} 
                          onChange={(e) => setOtp(e.target.value)} 
                          type="text" 
                          maxLength="6"
                          className="w-full pl-12 pr-5 py-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-600 transition-all dark:text-white outline-none font-black tracking-[0.5em] text-center text-lg" 
                          placeholder="000000" 
                        />
                      </div>
                      {confirmationResult?.isMock ? (
                        <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                          <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest flex items-center gap-2">
                            <Zap size={14} className="fill-amber-500" />
                            Development Mode: Use code 123456
                          </p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">Check your mobile for the verification code</p>
                      )}
                    </motion.div>
                  )}

                  <div id="recaptcha-container"></div>

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
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                          {fileName ? fileName : 'Upload Government ID'}
                        </span>
                        <label className="ml-auto cursor-pointer px-4 py-1.5 bg-white dark:bg-slate-800 text-xs font-bold text-indigo-600 rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          {fileName ? 'Change' : 'Browse'}
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*,.pdf" 
                            onChange={(e) => setFileName(e.target.files[0]?.name || '')}
                          />
                        </label>
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

                    <div className="relative my-8 text-center">
                      <span className="bg-white dark:bg-slate-900 px-4 text-xs font-bold text-slate-400 relative z-10 uppercase tracking-widest">Or sign up with</span>
                      <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 dark:bg-slate-800"></div>
                    </div>

                    <button 
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                      <span className="text-sm">Continue with Google</span>
                    </button>

                    <p className="mt-8 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest">
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
      )}
    </div>
  </div>
);
}

export default SignupPage;
