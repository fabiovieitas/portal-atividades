import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ArrowLeft, ArrowRight, Check, Sparkles, Keyboard } from 'lucide-react';
import { getRebusIllustration } from './illustrations/RebusIllustrations';
import { sounds } from '../audio/soundEffects';

const cleanString = (str = '') => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
};

export default function InvestigatorToolbar({
  activeEnigma,
  allEnigmas = [],
  solvedMap = {},
  onSolve = () => {},
  onSelectEnigma = () => {},
  onToggleKeyboard = () => {},
  showKeyboard = false
}) {
  const [inputVal, setInputVal] = useState('');
  const [hintStep, setHintStep] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef(null);

  // Reset input and focus when active enigma changes
  useEffect(() => {
    setInputVal('');
    setHintStep(0);
    setIsShaking(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeEnigma?.id]);

  if (!activeEnigma) return null;

  const isCurrentSolved = Boolean(solvedMap[activeEnigma.id]);
  const currentIndex = allEnigmas.findIndex(e => e.id === activeEnigma.id);
  const targetAnswer = cleanString(activeEnigma.resposta);

  const handleInputChange = (e) => {
    if (isCurrentSolved) return;
    const val = e.target.value.toUpperCase();
    setInputVal(val);
    sounds.playKeyPress();

    const cleanInput = cleanString(val);
    if (cleanInput === targetAnswer) {
      sounds.playPenWrite();
      sounds.playStarChime();
      onSolve(activeEnigma.id, activeEnigma.resposta);

      // Automatically jump to next unsolved enigma
      setTimeout(() => {
        const nextUnsolved = allEnigmas.find((e, idx) => idx > currentIndex && !solvedMap[e.id])
          || allEnigmas.find(e => !solvedMap[e.id] && e.id !== activeEnigma.id);
        if (nextUnsolved) {
          onSelectEnigma(nextUnsolved);
        }
      }, 450);
    } else if (cleanInput.length >= targetAnswer.length && cleanInput.length > 0) {
      setIsShaking(true);
      sounds.playError();
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleHint = () => {
    sounds.playHint();
    if (hintStep === 0) {
      setHintStep(1);
    } else if (hintStep === 1) {
      setHintStep(2);
      if (inputVal.length === 0) {
        setInputVal(activeEnigma.resposta[0].toUpperCase());
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      sounds.playKeyPress();
      onSelectEnigma(allEnigmas[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < allEnigmas.length) {
      sounds.playKeyPress();
      onSelectEnigma(allEnigmas[currentIndex + 1]);
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-0 left-0 right-0 z-40 bg-stone-900/95 backdrop-blur-md border-t-2 border-amber-600 shadow-[0_-10px_25px_rgba(0,0,0,0.5)] py-2.5 px-3 sm:px-6 text-stone-100"
    >
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-4">
        {/* Left: Navigation and Enigma Counter */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-amber-300 border border-stone-700 transition-all"
            title="Enigma Anterior"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="text-left">
            <span className="text-[10px] font-mono text-amber-400/80 uppercase block leading-none">
              Palavra #{activeEnigma.numero} de {allEnigmas.length}
            </span>
            <span className="font-heading font-black text-xs sm:text-sm text-stone-200">
              {isCurrentSolved ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Decifrada: {activeEnigma.resposta}
                </span>
              ) : (
                "Decifre o Enigma"
              )}
            </span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === allEnigmas.length - 1}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed text-amber-300 border border-stone-700 transition-all"
            title="Próximo Enigma"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Rebus Illustration + Operation Tag */}
        <div className="flex items-center gap-2 bg-stone-800/80 px-3 py-1.5 rounded-2xl border border-stone-700">
          {activeEnigma.prefixo && (
            <span className="font-heading font-black text-sm text-amber-300">
              {activeEnigma.prefixo}
            </span>
          )}

          {/* Animated Illustration */}
          <div className="relative flex flex-col items-center">
            {getRebusIllustration(activeEnigma.imagem, "w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md")}
            {hintStep >= 1 && (
              <span className="absolute -top-2 bg-yellow-300 text-stone-950 font-black text-[9px] px-1 rounded shadow-sm border border-yellow-500 whitespace-nowrap">
                {activeEnigma.nome || activeEnigma.imagem.toUpperCase()}
              </span>
            )}
          </div>

          {/* Operations */}
          <div className="flex items-center font-heading font-black text-sm sm:text-base">
            {activeEnigma.opSub && (
              <span className="text-red-400 font-extrabold mr-0.5">
                {activeEnigma.opSub}
              </span>
            )}
            {activeEnigma.opAdd && (
              <span className="text-orange-400 font-extrabold">
                {activeEnigma.opAdd}
              </span>
            )}
          </div>
        </div>

        {/* Right: Input Slot, Hint Button & Virtual Keyboard Toggle */}
        <div className="flex items-center gap-2">
          {!isCurrentSolved ? (
            <motion.div
              animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
              className="flex items-center gap-1.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={handleInputChange}
                placeholder="DIGITE AQUI..."
                maxLength={Math.max(4, activeEnigma.resposta.length + 1)}
                className={`
                  w-32 sm:w-44 h-9 sm:h-10 text-center uppercase font-heading font-black text-sm sm:text-base tracking-wider
                  rounded-xl border-2 bg-stone-100 text-stone-950 focus:outline-none transition-all shadow-inner
                  ${
                    isShaking
                      ? 'border-red-500 bg-red-100 text-red-900'
                      : 'border-amber-500 focus:border-yellow-400 focus:ring-2 focus:ring-amber-400'
                  }
                `}
                aria-label={`Resposta para enigma da imagem ${activeEnigma.imagem}`}
              />

              <button
                type="button"
                onClick={handleHint}
                className={`p-2 rounded-xl border transition-all ${
                  hintStep === 0
                    ? 'bg-amber-800 hover:bg-amber-700 text-amber-200 border-amber-600'
                    : 'bg-yellow-400 text-yellow-950 border-yellow-600 animate-pulse font-bold'
                }`}
                title={hintStep === 0 ? "Dica 1: Ver nome do desenho" : "Dica 2: Preencher 1ª letra"}
              >
                <Lightbulb className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <div className="px-4 py-2 rounded-xl bg-emerald-900/80 border border-emerald-500 text-emerald-200 font-heading font-bold text-xs sm:text-sm flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
              <span>Palavra Concluída!</span>
            </div>
          )}

          {/* Virtual Keyboard Toggle */}
          <button
            type="button"
            onClick={onToggleKeyboard}
            className={`p-2 rounded-xl border transition-all ${
              showKeyboard
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
            }`}
            title="Teclado Virtual de Carimbos"
          >
            <Keyboard className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
