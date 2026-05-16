import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const ChartCard = ({ title, children, subtitle, className }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm",
        className
      )}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold font-outfit text-slate-900 dark:text-white leading-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="h-[300px] w-full">
        {children}
      </div>
    </motion.div>
  );
};

export default ChartCard;
