import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, Mail, Phone, MapPin } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const TopContactDrawer = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'support_requests'), {
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setFormData({ name: '', email: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error('Error saving message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 z-[101] shadow-2xl rounded-b-[3rem] border-b border-slate-100 dark:border-slate-800 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto p-8 md:p-12">
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-outfit font-black text-slate-900 dark:text-white uppercase tracking-tight">Contact Admin</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Priority Support Channel</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mx-auto">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase">Message Sent</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
                    Your request has been prioritized. An admin will contact you shortly.
                  </p>
                </motion.div>
              ) : (
                <div className="grid lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                            required 
                            type="text" 
                            placeholder="Your name" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white font-medium" 
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                          <input 
                            required 
                            type="email" 
                            placeholder="email@example.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white font-medium" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
                        <textarea 
                          required 
                          rows="4" 
                          placeholder="How can we assist you?" 
                          value={formData.message}
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                          className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-indigo-600 dark:focus:border-indigo-500 rounded-2xl outline-none transition-all text-slate-900 dark:text-white font-medium resize-none"
                        ></textarea>
                      </div>
                      <button 
                        type="submit"
                        className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-200 dark:shadow-none uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 group"
                      >
                        Send Priority Message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                    </form>
                  </div>

                  <div className="space-y-6">
                     <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Direct Lines</h4>
                        <div className="space-y-4">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                 <Phone size={18} />
                              </div>
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">+91 20 2550 0000</span>
                           </div>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                                 <MapPin size={18} />
                              </div>
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Pune Command Center</span>
                           </div>
                        </div>
                     </div>
                     <div className="p-6 bg-indigo-600 rounded-[2rem] text-white">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-2 opacity-60">Avg. Response Time</h4>
                        <div className="text-3xl font-black mb-2">15 Mins</div>
                        <p className="text-[10px] font-medium opacity-80 leading-relaxed uppercase tracking-widest">Available 24/7 for emergency support</p>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TopContactDrawer;
