import React from 'react';
import { motion } from 'framer-motion';

export default function VintagePaperContainer({ children, className = '', title, badge }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`relative parchment-texture border-2 border-amber-800/40 rounded-xl p-4 sm:p-6 md:p-8 max-w-4xl mx-auto ${className}`}
    >
      {/* Brass Corner Brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-800/60 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-800/60 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-800/60 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-800/60 pointer-events-none" />

      {/* Decorative Header Badge if provided */}
      {(title || badge) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-900/20 pb-3 mb-5">
          {title && (
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-700/60" />
              <h2 className="font-heading text-lg sm:text-xl font-bold text-amber-950 tracking-wide">
                {title}
              </h2>
            </div>
          )}
          {badge && (
            <span className="font-typewriter text-xs uppercase px-2.5 py-1 bg-amber-200/70 border border-amber-800/30 text-amber-900 rounded shadow-sm tracking-wider">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Watermark seal in bottom corner */}
      <div className="absolute bottom-3 right-4 opacity-10 pointer-events-none select-none font-heading font-black text-3xl sm:text-4xl text-amber-950 rotate-[-12deg] tracking-widest">
        CONFIDENCIAL
      </div>
    </motion.div>
  );
}
