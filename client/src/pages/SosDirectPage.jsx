import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Flame, Shield, Heart, Car, CheckCircle, Loader2, Phone } from 'lucide-react';
import { useLocationContext } from '../contexts/LocationContext';
import { createSosAlert } from '../firebase/sosService';

const EMERGENCY_TYPES = [
  { type: 'Fire',     emoji: '🔥', Icon: Flame,   color: 'bg-orange-500', border: 'border-orange-400', hover: 'hover:bg-orange-500' },
  { type: 'Crime',    emoji: '🛡️', Icon: Shield,  color: 'bg-blue-600',   border: 'border-blue-400',   hover: 'hover:bg-blue-600'   },
  { type: 'Medical',  emoji: '🏥', Icon: Heart,   color: 'bg-rose-500',   border: 'border-rose-400',   hover: 'hover:bg-rose-500'   },
  { type: 'Accident', emoji: '🚗', Icon: Car,     color: 'bg-purple-600', border: 'border-purple-400', hover: 'hover:bg-purple-600' },
];

export default function SosDirectPage() {
  const { location: contextLocation } = useLocationContext();
  const [step, setStep] = useState('select'); // 'select' | 'sending' | 'sent' | 'error'
  const [selectedType, setSelectedType] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Vibrate phone on load to signal it's ready
  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  }, []);

  const handleSelect = async (type) => {
    setSelectedType(type);
    setStep('sending');
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

    const location = contextLocation
      ? { latitude: contextLocation.latitude, longitude: contextLocation.longitude }
      : { latitude: 18.5204, longitude: 73.8567 };

    try {
      await createSosAlert({
        emergencyType: type,
        location,
        userId: null,
        userName: 'Anonymous (App Shortcut)',
      });
      setStep('sent');
      if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 100]);
    } catch (err) {
      console.error('[SOS Direct]', err);
      setErrorMsg(err.message || 'Failed to send alert. Please call 112.');
      setStep('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">

      {/* ── SENT ─────────────────────────────────────────────────────────────── */}
      {step === 'sent' && (
        <div className="text-center space-y-6 max-w-sm w-full animate-fade-in">
          <div className="w-28 h-28 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500">
            <CheckCircle className="text-emerald-400 w-14 h-14" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Alert Sent!</h1>
            <p className="text-slate-400 leading-relaxed">
              Your <span className="text-emerald-400 font-bold">{selectedType}</span> emergency has been broadcast with your live GPS location. Nearby volunteers are being notified.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-4 text-left space-y-2 border border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Also call official services</p>
            <a href="tel:112" className="flex items-center gap-3 text-red-400 font-bold text-lg hover:text-red-300 transition-colors">
              <Phone size={20} /> 112 — Emergency Helpline
            </a>
          </div>
          <button
            onClick={() => { setStep('select'); setSelectedType(null); }}
            className="w-full py-3 bg-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-700 transition-all text-sm uppercase tracking-widest"
          >
            Send Another Alert
          </button>
        </div>
      )}

      {/* ── SENDING ──────────────────────────────────────────────────────────── */}
      {step === 'sending' && (
        <div className="text-center space-y-6">
          <div className="w-28 h-28 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-red-500 animate-pulse">
            <Loader2 className="text-red-400 w-14 h-14 animate-spin" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Sending SOS...</h1>
            <p className="text-slate-400 text-sm mt-1">Acquiring GPS & notifying volunteers</p>
          </div>
        </div>
      )}

      {/* ── ERROR ────────────────────────────────────────────────────────────── */}
      {step === 'error' && (
        <div className="text-center space-y-6 max-w-sm w-full">
          <div className="w-28 h-28 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-red-500">
            <AlertTriangle className="text-red-400 w-14 h-14" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white mb-2">Alert Failed</h1>
            <p className="text-red-400 text-sm">{errorMsg}</p>
          </div>
          <a href="tel:112" className="flex items-center justify-center gap-2 w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-lg transition-all">
            <Phone size={20} /> Call 112 Now
          </a>
          <button
            onClick={() => setStep('select')}
            className="w-full py-3 bg-slate-800 text-slate-400 font-bold rounded-2xl hover:bg-slate-700 transition-all text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* ── SELECT ───────────────────────────────────────────────────────────── */}
      {step === 'select' && (
        <div className="w-full max-w-sm space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-red-500">
              <div className="absolute w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
              <AlertTriangle className="text-red-400 w-10 h-10 relative z-10" />
            </div>
            <h1 className="text-3xl font-black text-white">EMERGENCY SOS</h1>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Select emergency type. Your live GPS location will be sent instantly to nearby volunteers.
            </p>
          </div>

          {/* Emergency buttons - large, touch-friendly */}
          <div className="grid sm:grid-cols-2 gap-4">
            {EMERGENCY_TYPES.map(({ type, emoji, Icon, color, border, hover }) => (
              <button
                key={type}
                onClick={() => handleSelect(type)}
                className={`flex flex-col items-center justify-center gap-3 p-6 rounded-3xl border-2 ${border} bg-slate-900 ${hover} hover:text-white text-slate-300 transition-all active:scale-95 shadow-lg`}
              >
                <span className="text-4xl">{emoji}</span>
                <span className="font-black text-sm uppercase tracking-wider">{type}</span>
              </button>
            ))}
          </div>

          {/* Always show 112 */}
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 w-full py-4 border-2 border-red-800 text-red-400 font-bold rounded-2xl hover:bg-red-900/20 transition-all text-sm"
          >
            <Phone size={16} /> Also call 112 for official services
          </a>
        </div>
      )}
    </div>
  );
}
