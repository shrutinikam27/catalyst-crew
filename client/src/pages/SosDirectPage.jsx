import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, Flame, Shield, Heart, Car, CheckCircle, Loader2, Phone } from 'lucide-react';
import { useLocationContext } from '../contexts/LocationContext';
import { createSosAlert } from '../firebase/sosService';
import { cn } from '../utils/cn';

const EMERGENCY_TYPES = [
  { type: 'Medical',  emoji: '🏥', Icon: Heart,   color: 'bg-rose-500',   border: 'border-rose-400',   hover: 'hover:bg-rose-500'   },
  { type: 'Crime',    emoji: '🛡️', Icon: Shield,  color: 'bg-blue-600',   border: 'border-blue-400',   hover: 'hover:bg-blue-600'   },
  { type: 'Fire',     emoji: '🔥', Icon: Flame,   color: 'bg-orange-500', border: 'border-orange-400', hover: 'hover:bg-orange-500' },
  { type: 'Accident', emoji: '🚗', Icon: Car,     color: 'bg-purple-600', border: 'border-purple-400', hover: 'hover:bg-purple-600' },
];

export default function SosDirectPage() {
  const { location: contextLocation } = useLocationContext();
  const [step, setStep] = useState('select'); // 'select' | 'sending' | 'sent' | 'error'
  const [selectedType, setSelectedType] = useState('Medical');
  const [tapCount, setTapCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  
  const resetTimeoutRef = useRef(null);

  // Vibrate phone on load to signal it's ready
  useEffect(() => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const handleButtonClick = () => {
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    // Haptic vibration feedback
    if (navigator.vibrate) {
      if (nextCount === 1) navigator.vibrate(80);
      else if (nextCount === 2) navigator.vibrate(120);
      else if (nextCount === 3) navigator.vibrate([200, 100, 200]);
    }

    if (nextCount >= 3) {
      // Trigger the SOS alert on 3rd click
      handleSelect(selectedType);
      setTapCount(0);
    } else {
      // Set a 2.0 second timeout to reset the tap count if inactive
      resetTimeoutRef.current = setTimeout(() => {
        setTapCount(0);
        if (navigator.vibrate) navigator.vibrate([40, 40]); // soft double vibration
      }, 2000);
    }
  };

  const handleSelect = async (type) => {
    setSelectedType(type);
    setStep('sending');

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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 select-none overflow-hidden">

      {/* ── SENT ─────────────────────────────────────────────────────────────── */}
      {step === 'sent' && (
        <div className="text-center space-y-6 max-w-sm w-full animate-fade-in">
          <div className="w-28 h-28 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500">
            <CheckCircle className="text-emerald-400 w-14 h-14" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Alert Sent!</h1>
            <p className="text-slate-400 leading-relaxed">
              Your <span className="text-rose-500 font-bold">{selectedType}</span> emergency has been broadcast with your live GPS location. Nearby volunteers are being notified.
            </p>
          </div>
          <div className="bg-slate-900 rounded-2xl p-4 text-left space-y-2 border border-slate-800">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Also call official services</p>
            <a href="tel:112" className="flex items-center gap-3 text-red-400 font-bold text-lg hover:text-red-300 transition-colors">
              <Phone size={20} /> 112 — Emergency Helpline
            </a>
          </div>
          <button
            onClick={() => { setStep('select'); setTapCount(0); }}
            className="w-full py-3.5 bg-slate-800 text-slate-300 font-bold rounded-2xl hover:bg-slate-700 transition-all text-sm uppercase tracking-widest"
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

      {/* ── SELECT / PANIC TRIGGER ───────────────────────────────────────────── */}
      {step === 'select' && (
        <div className="w-full max-w-sm space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 rounded-full border border-red-500/20 mb-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-widest">SafeLink Panic Portal</span>
            </div>
            <h1 className="text-3xl font-black text-white font-outfit uppercase tracking-tighter">Emergency SOS</h1>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Select category below, then tap the massive red button 3 times in quick succession to broadcast emergency.
            </p>
          </div>

          {/* Emergency Segment Control */}
          <div className="bg-slate-900/80 backdrop-blur-md p-1.5 rounded-2.5xl border border-slate-800/80 flex gap-1 shadow-2xl">
            {EMERGENCY_TYPES.map(({ type, emoji }) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  if (navigator.vibrate) navigator.vibrate(40);
                }}
                className={cn(
                  "flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex flex-col items-center gap-1.5",
                  selectedType === type
                    ? "bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-lg shadow-rose-950/50"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                )}
              >
                <span className="text-lg">{emoji}</span>
                <span>{type}</span>
              </button>
            ))}
          </div>

          {/* Pulsing LEDs Container */}
          <div>
            <div className="flex gap-3.5 justify-center mb-1">
              {[1, 2, 3].map((num) => (
                <div 
                  key={num} 
                  className={cn(
                    "w-12 h-3 rounded-full transition-all duration-300 border border-slate-900",
                    tapCount >= num 
                      ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.9)] border-rose-300" 
                      : "bg-slate-900"
                  )}
                />
              ))}
            </div>
            <p className="text-center text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2 h-4">
              {tapCount > 0 ? `${3 - tapCount} clicks remaining` : "Click safety indicator"}
            </p>
          </div>

          {/* Massive SOS Button */}
          <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
            {/* Pulsing visual halo */}
            <div className={cn(
              "absolute inset-0 rounded-full bg-rose-600/10 blur-2xl transition-all duration-500",
              tapCount > 0 ? "scale-115 bg-rose-500/20" : "animate-pulse"
            )} />
            
            <div className={cn(
              "absolute -inset-4 rounded-full border-2 border-dashed border-rose-500/20 transition-all duration-1000",
              tapCount > 0 ? "rotate-90 border-rose-500/40" : "animate-[spin_20s_linear_infinite]"
            )} />

            <button
              onClick={handleButtonClick}
              className={cn(
                "relative w-60 h-60 rounded-full flex flex-col items-center justify-center text-white transition-all select-none border-4",
                tapCount === 0 && "bg-gradient-to-tr from-rose-950 via-rose-800 to-red-600 shadow-[0_0_40px_rgba(220,38,38,0.3)] border-red-500/20 active:scale-95",
                tapCount === 1 && "bg-gradient-to-tr from-rose-900 via-rose-600 to-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.5)] scale-105 border-rose-500/45 active:scale-95 animate-pulse",
                tapCount === 2 && "bg-gradient-to-tr from-rose-800 via-red-500 to-rose-400 shadow-[0_0_60px_rgba(244,63,94,0.7)] scale-110 border-rose-400/80 active:scale-95 animate-pulse duration-300"
              )}
            >
              <AlertTriangle className={cn(
                "w-12 h-12 mb-2 transition-all duration-300",
                tapCount > 0 ? "scale-125 text-white animate-bounce" : "text-rose-200"
              )} />
              
              <span className="text-4xl font-black tracking-tighter uppercase font-outfit">
                {tapCount === 0 && "SOS"}
                {tapCount === 1 && "TAP AGAIN"}
                {tapCount === 2 && "TAP NOW!"}
              </span>
              
              <span className="text-[10px] font-bold text-rose-200/70 tracking-widest mt-1.5 uppercase">
                {tapCount === 0 && "3 quick taps"}
                {tapCount === 1 && "2 clicks left"}
                {tapCount === 2 && "1 click left"}
              </span>
            </button>
          </div>

          {/* Always show official emergency number */}
          <a
            href="tel:112"
            className="flex items-center justify-center gap-2 w-full py-4 border border-red-950 bg-red-950/10 text-red-400 font-bold rounded-2.5xl hover:bg-red-900/25 transition-all text-xs"
          >
            <Phone size={14} /> Emergency Helpline — Call 112
          </a>
        </div>
      )}
    </div>
  );
}
