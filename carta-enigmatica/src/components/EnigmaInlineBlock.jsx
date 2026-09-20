import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Check } from 'lucide-react';
import { getEnigmaIllustration } from './illustrations/EnigmaIcons';
import { sounds } from '../audio/soundEffects';

// Helper to normalize strings (remove accents, trim, uppercase)
export const normalizeText = (text = '') => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
};

export default function EnigmaInlineBlock({
  enigma,
  isSolved = false,
  onSolve = () => {},
  disabled = false
}) {
  const [inputValue, setInputValue] = useState('');
  const [hintLevel, setHintLevel] = useState(0); // 0 = none, 1 = object name, 2 = first letter
  const [isShaking, setIsShaking] = useState(false);
  const [isGlow, setIsGlow] = useState(false);
  const inputRef = useRef(null);

  const cleanAnswer = normalizeText(enigma.resposta);

  // Apply Hint Level 2 (auto-fills first letter)
  useEffect(() => {
    if (hintLevel >= 2 && !isSolved && inputValue.length === 0) {
      const firstChar = enigma.resposta[0].toUpperCase();
      setInputValue(firstChar);
    }
  }, [hintLevel, isSolved, enigma.resposta, inputValue]);

  // Check user input
  const handleInputChange = (e) => {
    if (disabled || isSolved) return;
    sounds.playKeyPress();

    const val = e.target.value.toUpperCase();
    setInputValue(val);

    const cleanInput = normalizeText(val);

    // Check if match
    if (cleanInput === cleanAnswer) {
      setIsGlow(true);
      sounds.playSuccess();
      setTimeout(() => {
        onSolve(enigma.id, enigma.resposta);
      }, 400);
    } else if (cleanInput.length >= cleanAnswer.length && cleanInput.length > 0) {
      // Wrong answer reached maximum length -> shake
      setIsShaking(true);
      sounds.playError();
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleHintClick = (e) => {
    e.stopPropagation();
    if (isSolved || disabled) return;

    sounds.playHint();
    if (hintLevel === 0) {
      setHintLevel(1);
    } else if (hintLevel === 1) {
      setHintLevel(2);
      if (inputValue.length === 0) {
        setInputValue(enigma.resposta[0].toUpperCase());
      }
    }
  };

  // If already solved, display the solved word seamlessly in the text flow
  if (isSolved) {
    return (
      <motion.span
        initial={{ scale: 1.15, backgroundColor: '#bbf7d0' }}
        animate={{ scale: 1, backgroundColor: '#fef3c7' }}
        className="inline-flex items-center gap-1 mx-1 px-2.5 py-0.5 rounded-md border-2 border-amber-800 bg-amber-100/90 text-amber-950 font-typewriter font-black text-sm sm:text-base tracking-wider shadow-sm align-baseline underline decoration-amber-600 decoration-2 underline-offset-4"
        title={`Decifrado: ${enigma.resposta}`}
      >
        <span>{enigma.resposta}</span>
        <Check className="w-3.5 h-3.5 text-green-700 stroke-[3]" />
      </motion.span>
    );
  }

  return (
    <motion.span
      className={`inline-flex flex-col sm:flex-row items-center gap-1.5 mx-1.5 my-1 p-1.5 sm:p-2 rounded-xl border-2 transition-all align-middle select-none shadow-md ${
        isGlow
          ? 'border-green-600 bg-green-50 shadow-[0_0_15px_rgba(22,163,74,0.5)]'
          : isShaking
          ? 'border-red-600 bg-red-50 animate-shake shadow-[0_0_12px_rgba(220,38,38,0.4)]'
          : 'border-amber-800/60 bg-[#fffdfa] hover:border-amber-700'
      }`}
      animate={
        isShaking
          ? { x: [-4, 4, -4, 4, 0] }
          : isGlow
          ? { scale: [1, 1.06, 1] }
          : {}
      }
      transition={{ duration: 0.3 }}
    >
      {/* Visual Rebus: Illustration + Floating Animation + Operation */}
      <span className="flex items-center gap-1.5">
        {/* Floating Illustration */}
        <motion.span
          animate={{ y: [-1, 2, -1] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="relative inline-flex flex-col items-center p-1 rounded-lg bg-amber-50 border border-amber-800/30 shadow-inner"
        >
          {getEnigmaIllustration(enigma.imagem, "w-8 h-8 sm:w-10 sm:h-10")}

          {/* Hint Level 1: Object Name under the image */}
          <AnimatePresence>
            {hintLevel >= 1 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[9px] sm:text-[10px] font-typewriter font-bold text-amber-900 bg-amber-200/90 px-1 py-0.2 rounded mt-0.5"
              >
                {enigma.imagem.toUpperCase()}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>

        {/* Operation Tag (e.g., "- LA" or "- O + A") */}
        {enigma.operacao && (
          <span className="font-typewriter font-extrabold text-xs sm:text-sm text-stamp-red bg-rose-50 px-1.5 py-0.5 rounded border border-rose-300 shadow-xs whitespace-nowrap">
            {enigma.operacao}
          </span>
        )}
      </span>

      {/* Input Slot & Hint Trigger */}
      <span className="flex items-center gap-1 mt-1 sm:mt-0">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          maxLength={Math.max(4, enigma.resposta.length + 1)}
          placeholder="?"
          disabled={disabled || isSolved}
          className={`
            w-12 sm:w-16 h-7 sm:h-8 text-center uppercase font-typewriter font-black text-sm sm:text-base
            rounded-md border-2 bg-amber-50/80 text-amber-950 focus:outline-none transition-all
            ${
              isShaking
                ? 'border-red-600 bg-red-100/50'
                : 'border-amber-700/80 focus:border-amber-950 focus:bg-white focus:ring-2 focus:ring-amber-500/40'
            }
          `}
          aria-label={`Resposta para enigma da imagem ${enigma.imagem}`}
        />

        {/* Hint Trigger Button (Lâmpada de Dica) */}
        <button
          type="button"
          onClick={handleHintClick}
          className={`p-1 rounded-md border transition-all ${
            hintLevel === 0
              ? 'bg-amber-100/70 border-amber-400 text-amber-700 hover:bg-amber-200 hover:text-amber-900'
              : hintLevel === 1
              ? 'bg-yellow-200 border-yellow-500 text-yellow-900 animate-pulse'
              : 'bg-yellow-400 border-yellow-600 text-yellow-950'
          }`}
          title={
            hintLevel === 0
              ? "Dica 1: Ver nome do desenho"
              : hintLevel === 1
              ? "Dica 2: Preencher 1ª letra"
              : "Dicas liberadas!"
          }
          aria-label="Pedir dica para este enigma"
        >
          <Lightbulb className={`w-3.5 h-3.5 ${hintLevel > 0 ? 'fill-current' : ''}`} />
        </button>
      </span>
    </motion.span>
  );
}
