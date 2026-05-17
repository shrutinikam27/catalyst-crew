import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

const AlertCard = ({ title, type, location, time, severity = 'moderate', onClick }) => {
  const severityColors = {
    high: "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400",
    moderate: "bg-amber-50 dark:bg-orange-900/20 border-amber-100 dark:border-orange-900/30 text-amber-600 dark:text-orange-400",
    low: "bg-sky-50 dark:bg-sky-900/20 border-sky-100 dark:border-sky-900/30 text-sky-600 dark:text-sky-400"
  };

  const iconColors = {
    high: "bg-rose-600 text-white",
    moderate: "bg-amber-500 text-white",
    low: "bg-sky-500 text-white"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "p-4 rounded-xl border flex gap-4 transition-all group cursor-pointer hover:translate-x-1",
        severityColors[severity]
      )}
      onClick={onClick}
    >
      <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm", iconColors[severity])}>
        <AlertTriangle size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-sm truncate uppercase tracking-wider">{title}</h4>
          <span className="text-[10px] font-extrabold uppercase bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded shadow-sm">
            {severity}
          </span>
        </div>
        <p className="text-xs font-medium opacity-80 mb-2 truncate">{type}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 opacity-70">
          <div className="flex items-center gap-1 text-[10px] font-bold">
            <MapPin size={10} className="shrink-0" />
            <span className="truncate">{location}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold shrink-0">
            <Clock size={10} className="shrink-0" />
            {time}
          </div>
        </div>
      </div>
      <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight size={18} />
      </div>
    </motion.div>
  );
};

export default AlertCard;
