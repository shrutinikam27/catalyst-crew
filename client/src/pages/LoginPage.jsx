import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../firebase/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Shield, Mail, Lock, Eye, EyeOff, 
  ArrowRight, Phone, AlertTriangle,
  ChevronRight, Activity, Zap, ShieldCheck
} from 'lucide-react';
import { cn } from '../utils/cn';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // email, phone
  const { login, loginWithGoogle, logout, setupRecaptcha, loginWithPhone } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone) return setError('Please enter a phone number.');
    setError('');
    setLoading(true);
    try {
      const verifier = setupRecaptcha('recaptcha-container');
      const result = await loginWithPhone(phone, verifier);
      setConfirmationResult(result);
      setShowOtpInput(true);
      
      if (result.isMock) {
        alert('DEVELOPMENT MODE: Please use the test code "123456" to verify your number.');
      } else {
        alert('OTP sent to ' + phone);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to send OTP. Ensure the number is correct (e.g. +91...)');
    } finally {
      setLoading(false);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (loginMethod === 'phone') {
        if (!confirmationResult) return setError('Please send OTP first.');
        const result = await confirmationResult.confirm(otp);
        user = result.user;
      } else {
        const result = await login(email, password);
        user = result.user;
      }

      // Check volunteer status before redirecting
      const q = query(collection(db, 'volunteerRequests'), where('uid', '==', user.uid));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const vol = snap.docs[0].data();
        if (vol.status === 'pending') {
          await logout();
          return setError('Your volunteer application is pending admin approval. Please wait for verification.');
        }
        if (vol.status === 'rejected') {
          await logout();
          return setError('Your application was rejected. Please contact the admin.');
        }
        navigate('/volunteer');
        return;
      }
      redirectUser(user.email || 'user');
    } catch (err) {
      setError(loginMethod === 'phone' ? 'Invalid OTP code.' : 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError('');
    setLoading(true);
    try {
      const { user } = await loginWithGoogle();
      redirectUser(user.email);
    } catch (err) {
      setError('Google login failed.');
    } finally {
      setLoading(false);
    }
  }

  const redirectUser = (email) => {
    if (email.includes('admin')) navigate('/admin');
    else if (email.includes('police')) navigate('/police');
    else if (email.includes('volunteer')) navigate('/volunteer');
    else if (email.includes('hospital')) navigate('/hospital');
    else if (email.includes('fire')) navigate('/fire');
    else navigate('/user');
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 transition-colors">
      {/* Left Side: Illustration & Graphics */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-600 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/50 to-purple-600/50"></div>
          {/* Futuristic grid background */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-lg text-white"
        >
          <div className="flex items-center gap-3 mb-12">
            <div className="p-3 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
              <Shield size={40} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-outfit font-black tracking-tight leading-none uppercase">SafeLink</h1>
              <p className="text-[10px] font-bold text-indigo-200 tracking-widest uppercase">Smart Urban Protection</p>
            </div>
          </div>

          <h2 className="text-5xl font-outfit font-black mb-6 leading-[1.1]">
            Secure Access to <br />
            <span className="text-indigo-200 underline decoration-indigo-400 underline-offset-8">SafeLink</span>
          </h2>
          <p className="text-lg text-indigo-100/80 mb-12 font-medium max-w-md leading-relaxed">
            Stay Connected. Stay Protected. Access real-time safety mapping and community emergency response tools.
          </p>

          {/* Floating UI Elements */}
          <div className="relative h-64">
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-0 left-0 p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Safety Index</p>
                <p className="text-xl font-black">Stable (8.4)</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute bottom-0 right-0 p-6 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-rose-500 rounded-xl flex items-center justify-center text-white animate-pulse">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Active Alerts</p>
                <p className="text-xl font-black">03 Nearby</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Glowing Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-12">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-outfit font-black text-slate-800 dark:text-white">SafeLink</h2>
          </div>

          <div className="mb-10">
            <h2 className="text-4xl font-outfit font-black text-slate-800 dark:text-white mb-3">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Log in to your account to access the dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold ring-1 ring-rose-100 dark:ring-rose-800 flex items-center gap-3">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  required 
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all dark:text-white outline-none"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"}
                  required 
                  className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-800 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-all dark:text-white outline-none"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 px-1">
              <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500" />
              <label htmlFor="remember" className="text-sm font-bold text-slate-500 dark:text-slate-400 cursor-pointer">Remember me</label>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-10 text-center">
            <span className="bg-slate-50 dark:bg-slate-950 px-4 text-xs font-bold text-slate-400 relative z-10 uppercase tracking-widest">Or social access</span>
            <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 dark:bg-slate-800"></div>
          </div>

          <div className="flex justify-center">
            <button 
              onClick={handleGoogleLogin}
              className="w-full max-w-sm flex items-center justify-center gap-3 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-white font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-sm">Continue with Google</span>
            </button>
          </div>

          <div className="mt-12 space-y-6 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Don't have an account? <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Create Account</Link>
            </p>
            
            <div className="pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col gap-3">
              <button onClick={() => navigate('/user')} className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">Continue as Guest</button>
              <button onClick={() => navigate('/report')} className="text-xs font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest flex items-center justify-center gap-1">
                <Zap size={14} className="fill-rose-500" />
                Emergency? Report Without Login
              </button>
            </div>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

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
  );
}

export default LoginPage;
