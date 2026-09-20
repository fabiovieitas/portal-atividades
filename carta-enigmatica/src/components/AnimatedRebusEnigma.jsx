import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lightbulb, Sparkles, HelpCircle } from 'lucide-react';
import { getRebusIllustration } from './illustrations/RebusIllustrations';
import { sounds } from '../audio/soundEffects';

// Helper to normalize strings for comparison
const cleanString = (str = '') => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
};

export default function AnimatedRebusEnigma({
  enigma,
  isSolved = false,
  onSolve = () => {},
  isActive = false,
  onActivate = () => {}
}) {
  const [inputVal, setInputVal] = useState('');
  const [hintStep, setHintStep] = useState(0); // 0 = none, 1 = image name, 2 = first char
  const [isShaking, setIsShaking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const inputRef = useRef(null);

  const targetAnswer = cleanString(enigma.resposta);

  // Auto focus input when activated
  useEffect(() => {
    if (isActive && inputRef.current && !isSolved) {
      inputRef.current.focus();
    }
  }, [isActive, isSolved]);

  const handleInputChange = (e) => {
    if (isSolved) return;
    const val = e.target.value.toUpperCase();
    setInputVal(val);

    sounds.playKeyPress();

    const currentClean = cleanString(val);

    if (currentClean === targetAnswer) {
      setShowCelebration(true);
      sounds.playPenWrite();
      sounds.playStarChime();
      setTimeout(() => {
        onSolve(enigma.id, enigma.resposta);
      }, 400);
    } else if (currentClean.length >= targetAnswer.length && currentClean.length > 0) {
      setIsShaking(true);
      sounds.playError();
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleHintClick = (e) => {
    e.stopPropagation();
    sounds.playHint();
    if (hintStep === 0) {
      setHintStep(1);
    } else if (hintStep === 1) {
      setHintStep(2);
      if (inputVal.length === 0) {
        setInputVal(enigma.resposta[0].toUpperCase());
      }
    }
  };

  // If solved, display the word written in ballpoint pen ink on the notebook line
  if (isSolved) {
    return (
      <motion.span
        initial={{ scale: 1.15, y: -2 }}
        animate={{ scale: 1, y: 0 }}
        className="inline-flex items-center gap-1 mx-1 px-2.5 py-0.5 rounded-lg bg-blue-50/80 border border-blue-300/80 text-blue-800 font-handwritten font-black text-lg sm:text-2xl tracking-wide shadow-xs align-baseline group cursor-pointer"
        title={`Decifrado: ${enigma.resposta}! Clique para rever o enigma.`}
        onClick={() => onActivate(enigma.id)}
      >
        <span>{enigma.resposta}</span>
        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
      </motion.span>
    );
  }

  return (
    <motion.span
      className={`inline-flex items-center gap-1 mx-1.5 my-1.5 p-1 sm:p-1.5 rounded-xl border-2 transition-all align-middle select-none relative ${
        isActive
          ? 'border-amber-600 bg-[#fffcee] shadow-[0_4px_12px_rgba(217,119,6,0.35)] scale-105'
          : isShaking
          ? 'border-red-500 bg-red-50'
          : 'border-stone-300 bg-[#fffaef] hover:border-amber-500/80 shadow-xs'
      }`}
      animate={isShaking ? { x: [-4, 4, -4, 4, 0] } : {}}
      onClick={() => onActivate(enigma.id)}
    >
      {/* Optional Prefix (e.g. "Pico + ") */}
      {enigma.prefixo && (
        <span className="font-heading font-black text-sm sm:text-base text-stone-800">
          {enigma.prefixo}
        </span>
      )}

      {/* Illustration & Micro-Floating Animation */}
      <div className="relative flex flex-col items-center">
        <div className="cursor-pointer">
          {getRebusIllustration(enigma.imagem, "w-8 h-8 sm:w-10 sm:h-10 drop-shadow-sm")}
        </div>

        {/* Hint 1: Object Name shown under illustration */}
        <AnimatePresence>
          {hintStep >= 1 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-[9px] font-sans font-bold bg-yellow-200 text-amber-950 px-1 py-0.2 rounded mt-0.5 border border-amber-400"
            >
              {enigma.nome || enigma.imagem.toUpperCase()}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Operation Tag: Subtraction in Red, Addition in Coral/Orange */}
      <div className="flex items-center font-heading font-black text-xs sm:text-sm tracking-tight">
        {enigma.opSub && (
          <span className="text-red-600 font-extrabold mr-0.5">
            {enigma.opSub}
          </span>
        )}
        {enigma.opAdd && (
          <span className="text-orange-600 font-extrabold">
            {enigma.opAdd}
          </span>
        )}
      </div>

      {/* Input Slot directly on the Notebook Line */}
      <div className="flex items-center gap-1 ml-1">
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          placeholder="?"
          maxLength={Math.max(4, enigma.resposta.length + 1)}
          className={`
            w-14 sm:w-18 h-7 sm:h-8 text-center uppercase font-sans font-black text-xs sm:text-sm
            rounded-md border-2 bg-white text-stone-900 focus:outline-none transition-all
            ${
              isShaking
                ? 'border-red-500 bg-red-100'
                : isActive
                ? 'border-amber-600 ring-2 ring-amber-400/50'
                : 'border-stone-400'
            }
          `}
          aria-label={`Resposta para enigma da imagem ${enigma.imagem}`}
        />

        {/* Quick Hint Button */}
        <button
          type="button"
          onClick={handleHintClick}
          className={`p-1 rounded-md border transition-all ${
            hintStep === 0
              ? 'bg-amber-100/80 border-amber-300 text-amber-800 hover:bg-amber-200'
              : 'bg-yellow-300 border-yellow-500 text-yellow-950 animate-pulse'
          }`}
          title={hintStep === 0 ? "Pedir Dica" : "1ª Letra preenchida"}
        >
          <Lightbulb className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Celebration Star Burst Particles on Solve */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none flex items-center justify-center text-yellow-500 font-black text-xl"
          >
            ✦ ✨ ✦
          </motion.div>
        )}
      </AnimatePresence>
    </motion.span>
  );
}
