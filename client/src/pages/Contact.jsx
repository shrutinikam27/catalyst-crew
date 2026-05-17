import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, MessageSquare, Phone, MapPin, 
  Send, Shield, CheckCircle2, Clock, Globe 
} from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <PublicNavbar />
      
      <div className="pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 px-4 sm:px-6 max-w-[1400px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest mb-8 ring-1 ring-indigo-100 dark:ring-indigo-800">
            <Mail size={14} /> Get in Touch
          </div>
          <h1 className="text-5xl md:text-6xl font-outfit font-black text-slate-900 dark:text-white leading-tight mb-6">
            We're here to <br />
            <span className="text-indigo-600">Protect & Support</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Have questions about SafeLink's urban safety integration or need technical assistance? 
            Our dedicated team is ready to help 24/7.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Contact Info */}
          <div className="space-y-8 lg:col-span-1">
            <ContactInfoCard 
              icon={<Mail />}
              title="Email Us"
              value="support@safelink.in"
              desc="For general inquiries and technical support."
            />
            <ContactInfoCard 
              icon={<Phone />}
              title="Call Support"
              value="+91 20 2550 0000"
              desc="Mon-Fri, 9am - 6pm IST"
            />
            <ContactInfoCard 
              icon={<MapPin />}
              title="Visit Pune HQ"
              value="Shivajinagar, Pune 411005"
              desc="Safe City Command Centre"
            />
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-100 dark:border-slate-800 shadow-premium dark:shadow-none relative overflow-hidden">
               {submitted ? (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="text-center py-20 space-y-6"
                 >
                   <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                     <CheckCircle2 size={40} />
                   </div>
                   <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase">Message Received!</h2>
                   <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                     Thank you for reaching out. A support officer will review your request and get back to you within 4 hours.
                   </p>
                   <button 
                     onClick={() => setSubmitted(false)}
                     className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-sm"
                   >
                     Send Another Message
                   </button>
                 </motion.div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input required type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white font-medium" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input required type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white font-medium" />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Inquiry Type</label>
                      <select className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white font-medium appearance-none">
                        <option>Technical Support</option>
                        <option>Incident Reporting Help</option>
                        <option>Partnership Inquiry</option>
                        <option>Civic Infrastructure Feedback</option>
                        <option>Other</option>
                      </select>
                   </div>

                   <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Your Message</label>
                      <textarea required rows="5" placeholder="How can we help you today?" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white font-medium resize-none"></textarea>
                   </div>

                   <button 
                     type="submit"
                     className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-3xl transition-all shadow-xl shadow-indigo-200 dark:shadow-none uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 group"
                   >
                     Send Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                   </button>
                 </form>
               )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const ContactInfoCard = ({ icon, title, value, desc }) => (
  <div className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-premium dark:shadow-none group hover:border-indigo-500/50 transition-all">
    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{title}</h3>
    <div className="text-xl font-black text-slate-900 dark:text-white mb-2">{value}</div>
    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{desc}</p>
  </div>
);

export default Contact;
