import React from 'react';
import { getRebusIllustration } from './RebusIllustrations';

// Vintage engraved stamp illustrations for all rebus enigmas
export const EnigmaIcons = {
  mala: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <rect x="10" y="20" width="44" height="34" rx="4" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <path d="M22 20V14C22 11.8 23.8 10 26 10H38C40.2 10 42 11.8 42 14V20" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="20" y1="20" x2="20" y2="54" stroke="#92400e" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="44" y1="20" x2="44" y2="54" stroke="#92400e" strokeWidth="2" strokeDasharray="3 2" />
      <rect x="29" y="32" width="6" height="8" rx="1.5" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="32" cy="35" r="1" fill="#78350f" />
    </svg>
  ),

  gato: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <ellipse cx="32" cy="38" rx="20" ry="18" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <polygon points="16,26 12,10 26,18" fill="#fde68a" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="48,26 52,10 38,18" fill="#fde68a" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="25" cy="34" rx="3.5" ry="5" fill="#78350f" />
      <ellipse cx="39" cy="34" rx="3.5" ry="5" fill="#78350f" />
      <polygon points="32,41 29,38 35,38" fill="#d97706" />
      <path d="M28 44C30 46 34 46 36 44" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="36" x2="22" y2="38" stroke="#78350f" strokeWidth="1.5" />
      <line x1="12" y1="42" x2="22" y2="41" stroke="#78350f" strokeWidth="1.5" />
      <line x1="52" y1="36" x2="42" y2="38" stroke="#78350f" strokeWidth="1.5" />
      <line x1="52" y1="42" x2="42" y2="41" stroke="#78350f" strokeWidth="1.5" />
    </svg>
  ),

  bola: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <circle cx="32" cy="32" r="24" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <polygon points="32,22 39,27 36,36 28,36 25,27" fill="#d97706" stroke="#78350f" strokeWidth="1.8" />
      <line x1="32" y1="22" x2="32" y2="8" stroke="#78350f" strokeWidth="2" />
      <line x1="39" y1="27" x2="52" y2="20" stroke="#78350f" strokeWidth="2" />
      <line x1="36" y1="36" x2="46" y2="48" stroke="#78350f" strokeWidth="2" />
      <line x1="28" y1="36" x2="18" y2="48" stroke="#78350f" strokeWidth="2" />
      <line x1="25" y1="27" x2="12" y2="20" stroke="#78350f" strokeWidth="2" />
    </svg>
  ),

  casa: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <polygon points="32,8 8,28 56,28" fill="#fde68a" stroke="#78350f" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="14" y="28" width="36" height="28" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <rect x="26" y="38" width="12" height="18" fill="#d97706" stroke="#78350f" strokeWidth="2" />
      <circle cx="35" cy="47" r="1.5" fill="#fef3c7" />
      <rect x="17" y="34" width="7" height="7" fill="#fde68a" stroke="#78350f" strokeWidth="1.5" />
      <rect x="40" y="34" width="7" height="7" fill="#fde68a" stroke="#78350f" strokeWidth="1.5" />
    </svg>
  ),

  pato: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <ellipse cx="26" cy="40" rx="18" ry="14" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="42" cy="22" r="10" fill="#fde68a" stroke="#78350f" strokeWidth="2.5" />
      <path d="M50 22L60 26L50 28Z" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
      <circle cx="44" cy="19" r="2" fill="#78350f" />
      <path d="M12 40C16 34 26 34 30 40" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 54C16 52 24 56 32 52C40 56 48 52 56 54" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  pena: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <path d="M52 10C52 10 32 16 20 32C12 42 10 54 10 54C10 54 22 52 32 44C48 32 54 12 52 10Z" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <line x1="10" y1="54" x2="48" y2="16" stroke="#78350f" strokeWidth="2" />
      <line x1="28" y1="36" x2="22" y2="40" stroke="#92400e" strokeWidth="1.5" />
      <line x1="36" y1="28" x2="30" y2="32" stroke="#92400e" strokeWidth="1.5" />
      <line x1="44" y1="20" x2="38" y2="24" stroke="#92400e" strokeWidth="1.5" />
    </svg>
  ),

  chave: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <circle cx="22" cy="24" r="14" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="22" cy="24" r="6" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
      <path d="M33 31L54 52" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
      <line x1="46" y1="44" x2="52" y2="38" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <line x1="51" y1="49" x2="57" y2="43" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  telha: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <path d="M12 46C12 40 22 36 32 36C42 36 52 40 52 46L46 16C46 12 39 10 32 10C25 10 18 12 18 16L12 46Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="2.5" />
      <path d="M14 46C18 42 25 40 32 40C39 40 46 42 50 46" stroke="#7c2d12" strokeWidth="2" fill="none" />
      <line x1="32" y1="10" x2="32" y2="40" stroke="#7c2d12" strokeWidth="1.5" strokeDasharray="3 2" />
    </svg>
  ),

  dado: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <rect x="12" y="12" width="40" height="40" rx="8" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="3.5" fill="#78350f" />
      <circle cx="40" cy="24" r="3.5" fill="#78350f" />
      <circle cx="32" cy="32" r="3.5" fill="#b91c1c" />
      <circle cx="24" cy="40" r="3.5" fill="#78350f" />
      <circle cx="40" cy="40" r="3.5" fill="#78350f" />
    </svg>
  ),

  prato: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <ellipse cx="32" cy="32" rx="26" ry="18" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <ellipse cx="32" cy="32" rx="17" ry="11" fill="#fde68a" stroke="#78350f" strokeWidth="1.8" strokeDasharray="4 2" />
      <ellipse cx="32" cy="32" rx="10" ry="6" fill="#fef3c7" stroke="#78350f" strokeWidth="1.5" />
    </svg>
  ),

  cama: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <line x1="8" y1="18" x2="8" y2="52" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <line x1="56" y1="28" x2="56" y2="52" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <rect x="8" y="34" width="48" height="12" rx="2" fill="#fed7aa" stroke="#78350f" strokeWidth="2.5" />
      <rect x="12" y="26" width="14" height="8" rx="2" fill="#fef3c7" stroke="#78350f" strokeWidth="2" />
      <path d="M26 34H56V42H26Z" fill="#fde68a" stroke="#78350f" strokeWidth="1.5" />
    </svg>
  ),

  cha: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <path d="M14 26H46V40C46 46 40 50 30 50C20 50 14 46 14 40V26Z" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <path d="M46 30C52 30 54 34 54 38C54 42 50 44 46 44" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="8" y1="52" x2="52" y2="52" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <path d="M24 18C26 14 24 10 26 8" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
      <path d="M34 20C36 16 34 12 36 10" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  peao: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <ellipse cx="32" cy="18" rx="7" ry="6" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
      <path d="M16 26C20 40 30 50 32 54C34 50 44 40 48 26C42 22 22 22 16 26Z" fill="#fed7aa" stroke="#78350f" strokeWidth="2.5" />
      <line x1="32" y1="54" x2="32" y2="60" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
      <line x1="18" y1="34" x2="46" y2="34" stroke="#92400e" strokeWidth="1.5" strokeDasharray="3 2" />
    </svg>
  ),

  milho: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <ellipse cx="32" cy="28" rx="10" ry="18" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
      <line x1="28" y1="12" x2="28" y2="44" stroke="#d97706" strokeWidth="1.5" />
      <line x1="36" y1="12" x2="36" y2="44" stroke="#d97706" strokeWidth="1.5" />
      <line x1="24" y1="20" x2="40" y2="20" stroke="#d97706" strokeWidth="1.5" />
      <line x1="24" y1="28" x2="40" y2="28" stroke="#d97706" strokeWidth="1.5" />
      <line x1="24" y1="36" x2="40" y2="36" stroke="#d97706" strokeWidth="1.5" />
      <path d="M22 46C18 36 12 30 10 24C14 36 22 46 28 52" fill="#bbf7d0" stroke="#15803d" strokeWidth="2" />
      <path d="M42 46C46 36 52 30 54 24C50 36 42 46 36 52" fill="#bbf7d0" stroke="#15803d" strokeWidth="2" />
      <line x1="32" y1="46" x2="32" y2="58" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  sino: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <circle cx="32" cy="12" r="5" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
      <path d="M20 38C18 26 22 18 32 18C42 18 46 26 44 38C48 42 52 44 52 48H12C12 44 16 42 20 38Z" fill="#fef08a" stroke="#78350f" strokeWidth="2.5" />
      <circle cx="32" cy="52" r="5" fill="#d97706" stroke="#78350f" strokeWidth="2" />
    </svg>
  ),

  livro: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <path d="M10 46C16 42 26 42 32 46C38 42 48 42 54 46V18C48 14 38 14 32 18C26 14 16 14 10 18V46Z" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <line x1="32" y1="18" x2="32" y2="46" stroke="#78350f" strokeWidth="2" />
      <line x1="16" y1="24" x2="28" y2="24" stroke="#92400e" strokeWidth="1.5" />
      <line x1="16" y1="30" x2="28" y2="30" stroke="#92400e" strokeWidth="1.5" />
      <line x1="36" y1="24" x2="48" y2="24" stroke="#92400e" strokeWidth="1.5" />
      <line x1="36" y1="30" x2="48" y2="30" stroke="#92400e" strokeWidth="1.5" />
    </svg>
  ),

  planeta: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <circle cx="32" cy="32" r="18" fill="#bae6fd" stroke="#0369a1" strokeWidth="2.5" />
      <path d="M10 38C16 44 48 44 54 26" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
      <path d="M8 32C14 48 50 48 56 28" stroke="#b45309" strokeWidth="1.5" strokeDasharray="3 2" />
      <ellipse cx="28" cy="26" rx="5" ry="3" fill="#7dd3fc" />
    </svg>
  ),

  sol: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <circle cx="32" cy="32" r="14" fill="#fde047" stroke="#b45309" strokeWidth="2.5" />
      <g stroke="#b45309" strokeWidth="2.5" strokeLinecap="round">
        <line x1="32" y1="6" x2="32" y2="12" />
        <line x1="32" y1="52" x2="32" y2="58" />
        <line x1="6" y1="32" x2="12" y2="32" />
        <line x1="52" y1="32" x2="58" y2="32" />
        <line x1="14" y1="14" x2="18" y2="18" />
        <line x1="46" y1="46" x2="50" y2="50" />
        <line x1="14" y1="50" x2="18" y2="46" />
        <line x1="46" y1="18" x2="50" y2="14" />
      </g>
    </svg>
  ),

  carta: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <rect x="8" y="16" width="48" height="34" rx="3" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <polygon points="8,18 32,36 56,18" fill="#fde68a" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="32" cy="34" r="5" fill="#b91c1c" stroke="#78350f" strokeWidth="1.5" />
    </svg>
  ),

  astronauta: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <rect x="18" y="14" width="28" height="26" rx="10" fill="#f1f5f9" stroke="#475569" strokeWidth="2.5" />
      <rect x="22" y="18" width="20" height="14" rx="5" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
      <path d="M24 22C26 20 30 20 32 22" stroke="#bae6fd" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="14" y="40" width="36" height="16" rx="4" fill="#e2e8f0" stroke="#475569" strokeWidth="2.5" />
      <line x1="32" y1="8" x2="32" y2="14" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  porta: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <rect x="14" y="10" width="36" height="46" rx="2" fill="#fed7aa" stroke="#78350f" strokeWidth="2.5" />
      <line x1="22" y1="18" x2="42" y2="18" stroke="#92400e" strokeWidth="1.5" />
      <line x1="22" y1="46" x2="42" y2="46" stroke="#92400e" strokeWidth="1.5" />
      <circle cx="42" cy="34" r="3" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
    </svg>
  ),

  amigo: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <circle cx="24" cy="22" r="8" fill="#fde68a" stroke="#78350f" strokeWidth="2" />
      <circle cx="40" cy="22" r="8" fill="#fed7aa" stroke="#78350f" strokeWidth="2" />
      <path d="M12 48C12 38 20 34 26 34C30 34 33 36 34 38" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="#fef3c7" />
      <path d="M52 48C52 38 44 34 38 34C34 34 31 36 30 38" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="#fed7aa" />
      <path d="M22 38C26 34 38 34 42 38" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  futuro: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" fill="none" className={className} stroke="currentColor">
      <circle cx="32" cy="32" r="22" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
      <polygon points="32,16 44,44 20,44" fill="#fde68a" stroke="#d97706" strokeWidth="2" />
      <circle cx="32" cy="32" r="4" fill="#0284c7" />
      <line x1="32" y1="12" x2="32" y2="16" stroke="#78350f" strokeWidth="2" />
      <line x1="32" y1="48" x2="32" y2="52" stroke="#78350f" strokeWidth="2" />
    </svg>
  ),
};

export const getEnigmaIllustration = (key, className) => {
  return getRebusIllustration(key, className);
};

export default EnigmaIcons;
