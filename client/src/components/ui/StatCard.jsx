import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const StatCard = ({ title, value, icon: Icon, trend, trendType = 'up', description, isLive, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className={cn(
        "p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors relative overflow-hidden",
        "hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20",
        className
      )}
    >
      {isLive && (
        <div className="absolute top-0 right-0 p-3">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-tighter">Live</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <motion.h3
            key={value}
            initial={{ scale: 1.1, color: isLive ? '#f43f5e' : '#6366f1' }}
            animate={{ scale: 1, color: 'inherit' }}
            className="text-3xl font-bold font-outfit text-slate-900 dark:text-white leading-none"
          >
            {value}
          </motion.h3>
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-bold mt-1",
              trendType === 'up' ? "text-emerald-500" : "text-rose-500"
            )}>
              <span>{trendType === 'up' ? '↑' : '↓'} {trend}</span>
              <span className="text-slate-400 dark:text-slate-500 ml-1 font-normal">vs last month</span>
            </div>
          )}
        </div>
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Icon size={24} />
        </div>
      </div>
      {description && (
        <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800 pt-3 italic">
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default StatCard;
