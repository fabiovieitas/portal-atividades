import React from 'react';

/**
 * RebusFormulaBadge
 * Renders algebraic syllable operations with high-contrast, delightful comic-book style tags:
 * Subtractions in coral-rose (e.g. - SA, - TO, - LA, - PO)
 * Additions in emerald-green (e.g. + CHORRO, + RQUE, + CHA)
 * Prefixes in warm amber-gold (e.g. SU +, DI +)
 */
export default function RebusFormulaBadge({ text = '', size = 'normal', className = '' }) {
  if (!text) return null;

  // Split string into separate math tokens like "- SA", "+ CHORRO", "SU +", etc.
  const regex = /([+-]\s*[A-ZÁ-ÚÇ0-9]+|[A-ZÁ-ÚÇ0-9]+\s*[+-]?)/gi;
  const matches = text.match(regex);

  if (!matches || matches.length === 0) {
    return (
      <span className={`font-heading font-black rounded-md border shadow-xs whitespace-nowrap ${
        size === 'large'
          ? 'text-2xl sm:text-3xl px-3.5 py-1.5 rounded-xl border-2 bg-rose-50 border-rose-300 text-rose-700'
          : 'text-xs sm:text-sm px-2 py-0.5 bg-rose-50 border-rose-300 text-rose-700'
      } ${className}`}>
        {text}
      </span>
    );
  }

  const isLarge = size === 'large';

  return (
    <span className={`inline-flex items-center gap-1.5 flex-wrap ${className}`}>
      {matches.map((rawToken, idx) => {
        const token = rawToken.trim();
        if (!token) return null;

        const isSubtraction = token.startsWith('-');
        const isAddition = token.startsWith('+') || token.endsWith('+');

        let badgeStyle = '';
        if (isSubtraction) {
          // Coral / Rose badge for subtraction (- SA)
          badgeStyle = 'bg-rose-50 border-rose-300/90 text-rose-700 shadow-[0_1px_3px_rgba(244,63,94,0.15)]';
        } else if (isAddition) {
          // Emerald / Green badge for addition (+ CHORRO)
          badgeStyle = 'bg-emerald-50 border-emerald-300/90 text-emerald-700 shadow-[0_1px_3px_rgba(16,185,129,0.15)]';
        } else {
          // Neutral Amber badge
          badgeStyle = 'bg-amber-100/90 border-amber-300 text-amber-950 shadow-[0_1px_3px_rgba(217,119,6,0.15)]';
        }

        const sizeStyle = isLarge
          ? 'text-2xl sm:text-3xl px-3.5 py-1 rounded-xl border-2 font-black tracking-wide'
          : 'text-xs sm:text-sm px-2 py-0.5 rounded-md border font-black tracking-normal';

        return (
          <span
            key={`badge-token-${idx}`}
            className={`font-heading select-none whitespace-nowrap inline-flex items-center justify-center ${sizeStyle} ${badgeStyle}`}
          >
            {token}
          </span>
        );
      })}
    </span>
  );
}
