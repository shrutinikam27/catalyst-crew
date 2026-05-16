import React, { useState } from 'react';
import { useAuth } from '../firebase/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { user } = await login(email, password);
      // Role-based redirection logic
      if (email.includes('admin')) navigate('/admin');
      else if (email.includes('police')) navigate('/police');
      else if (email.includes('volunteer')) navigate('/volunteer');
      else if (email.includes('hospital')) navigate('/hospital');
      else if (email.includes('fire')) navigate('/fire');
      else navigate('/user');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
    setLoading(false);
  }

  async function handleGoogleLogin() {
    try {
      const { user } = await loginWithGoogle();
      // Role-based redirection logic
      if (user.email.includes('admin')) navigate('/admin');
      else if (user.email.includes('police')) navigate('/police');
      else if (user.email.includes('volunteer')) navigate('/volunteer');
      else if (user.email.includes('hospital')) navigate('/hospital');
      else if (user.email.includes('fire')) navigate('/fire');
      else navigate('/user');
    } catch (err) {
      console.error(err);
      setError('Failed to log in with Google.');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main dark:bg-dark-bg-main p-6 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-dark-bg-card p-10 rounded-[2.5rem] shadow-premium dark:shadow-none border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-200 dark:shadow-none">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h2 className="text-3xl font-outfit font-extrabold text-slate-800 dark:text-white">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Log in to your SafeLinks account</p>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-bold mb-6 text-center ring-1 ring-red-100 dark:ring-red-800">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required 
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 outline-none transition-all dark:text-white"
              placeholder="name@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 outline-none transition-all dark:text-white"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            type="submit" 
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-100 dark:shadow-none disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <span className="bg-white dark:bg-dark-bg-card px-4 text-xs font-bold text-slate-400 relative z-10 uppercase tracking-widest">Or continue with</span>
          <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100 dark:bg-slate-800"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-white font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Google
        </button>

        <p className="text-center mt-10 text-slate-500 dark:text-slate-400 text-sm font-medium">
          Don't have an account? <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Sign up for free</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
