import React from 'react';
import { motion } from 'framer-motion';

export default function NotebookPage({ children, className = '' }) {
  // 14 spiral rings along the left border
  const spiralRings = Array.from({ length: 16 });

  return (
    <div className="relative max-w-4xl mx-auto my-3 sm:my-6 px-2 sm:px-4 select-none">
      {/* Outer Paper Shadow & Notebook Backing */}
      <motion.div
        initial={{ opacity: 0, y: 15, rotate: -0.5 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-[#fbf7ee] rounded-r-2xl rounded-l-md shadow-[0_12px_40px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.2)] border-r-2 border-b-2 border-stone-300 overflow-hidden"
      >
        {/* Left Spiral Binding Zone */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-12 bg-[#efe7d5] border-r-2 border-[#dfd4be] flex flex-col justify-between py-4 z-20 shadow-inner">
          {spiralRings.map((_, i) => (
            <div key={i} className="relative flex items-center justify-center h-6 my-1">
              {/* Hole punch in the paper */}
              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#35251a] shadow-inner border border-stone-400" />
              {/* Bronze/Metallic Wire Spiral Ring */}
              <div
                className="absolute left-[-4px] sm:left-[-6px] w-6 sm:w-8 h-4 rounded-full border-4 border-[#b45309] shadow-md -rotate-12 pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Ruled School Paper Background (Pautas Horizontais + Margem Vertical) */}
        <div className="relative pl-10 sm:pl-16 pr-4 sm:pr-8 py-6 sm:py-8 min-h-[600px] z-10">
          {/* Vertical Red Margin Line */}
          <div className="absolute top-0 bottom-0 left-12 sm:left-20 w-[1.5px] bg-rose-400/40 pointer-events-none" />

          {/* Horizontal Blue Notebook Ruled Lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'repeating-linear-gradient(transparent, transparent 47px, rgba(147, 197, 253, 0.45) 47px, rgba(147, 197, 253, 0.45) 49px)',
              backgroundPosition: '0 28px'
            }}
          />

          {/* Content of the Letter */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
