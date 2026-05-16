import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200 dark:shadow-none group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <div>
                <span className="text-2xl font-bold font-outfit text-slate-900 dark:text-white">SafeLink</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Smart City Safety</p>
              </div>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs">
              Empowering Pune with real-time risk mapping and AI-driven emergency response prioritization for a safer urban future.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
              <SocialIcon icon={<Github size={18} />} href="#" />
              <SocialIcon icon={<Instagram size={18} />} href="#" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-8">Platform</h4>
            <ul className="space-y-4">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/features">Features</FooterLink>
              <FooterLink to="/about">About Us</FooterLink>
              <FooterLink to="/login">Dashboard</FooterLink>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-8">Contact</h4>
            <ul className="space-y-4">
              <ContactItem icon={<Mail size={16} />} text="support@safelink.in" />
              <ContactItem icon={<Phone size={16} />} text="+91 20 2550 1100" />
              <ContactItem icon={<MapPin size={16} />} text="Pune Municipal Corp, Main HQ, Pune" />
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-black uppercase tracking-widest text-xs mb-8">Newsletter</h4>
            <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 font-medium">Get live safety updates and city reports directly in your inbox.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-4 px-5 pr-12 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all dark:text-white"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                <Shield size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            © {currentYear} SafeLink / Smart Urban Risk Mapping Platform. All Rights Reserved.
          </div>
          <div className="flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ icon, href }) => (
  <a href={href} className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm">
    {icon}
  </a>
);

const ContactItem = ({ icon, text }) => (
  <li className="flex items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400">
    <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>
    {text}
  </li>
);

export default Footer;
