import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, CheckCircle2, Search, Sparkles } from 'lucide-react';
import { getEnigmaIllustration } from './illustrations/EnigmaIcons';
import VirtualKeyboard from './VirtualKeyboard';
import { sounds } from '../audio/soundEffects';

const cleanText = (t = '') => {
  return t
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toUpperCase();
};

export default function EnigmaModal({
  enigma,
  isOpen = false,
  onClose = () => {},
  onSolve = () => {},
  hintsAvailable = 1,
  onConsumeHint = () => {}
}) {
  const [typedValue, setTypedValue] = useState('');
  const [hintRevealed, setHintRevealed] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isSolvedSuccess, setIsSolvedSuccess] = useState(false);

  // Reset when opening a new enigma
  useEffect(() => {
    if (isOpen && enigma) {
      setTypedValue('');
      setHintRevealed(false);
      setIsShaking(false);
      setIsSolvedSuccess(false);
    }
  }, [isOpen, enigma?.id]);

  const targetAnswer = enigma ? cleanText(enigma.resposta) : '';

  // Sound of writing on paper whenever typing
  const handleChar = (char) => {
    if (isSolvedSuccess) return;
    sounds.playPenWrite();
    const nextVal = typedValue + char;
    setTypedValue(nextVal);

    // Auto check if matched
    if (cleanText(nextVal) === targetAnswer) {
      triggerSuccess(enigma.resposta);
    }
  };

  const handleDelete = () => {
    if (isSolvedSuccess) return;
    sounds.playPenWrite();
    setTypedValue(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    if (isSolvedSuccess) return;
    sounds.playPenWrite();
    if (typedValue.length > 0 && !typedValue.endsWith(' ')) {
      const nextVal = typedValue + ' ';
      setTypedValue(nextVal);
      if (cleanText(nextVal) === targetAnswer) {
        triggerSuccess(enigma.resposta);
      }
    }
  };

  const triggerSuccess = (word) => {
    setIsSolvedSuccess(true);
    sounds.playSuccess();
    setTimeout(() => {
      onSolve(enigma.id, word);
      onClose();
    }, 600);
  };

  const handleValidate = () => {
    const cleanInput = cleanText(typedValue);
    if (cleanInput === targetAnswer) {
      triggerSuccess(enigma.resposta);
    } else {
      setIsShaking(true);
      sounds.playError();
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Physical keyboard support with writing sound!
  useEffect(() => {
    if (!isOpen || isSolvedSuccess) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleDelete();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleValidate();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleSpace();
      } else if (/^[a-zA-ZÀ-ÿ]$/.test(e.key)) {
        e.preventDefault();
        handleChar(e.key.toUpperCase());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSolvedSuccess, typedValue, targetAnswer]);

  const handleHintClick = () => {
    if (hintRevealed) return;
    if (hintsAvailable <= 0) return;

    sounds.playHint();
    setHintRevealed(true);
    onConsumeHint();
  };

  if (!isOpen || !enigma) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 25 }}
        className="relative w-full max-w-2xl bg-[#faf6ed] text-stone-900 rounded-3xl border-4 border-amber-800 shadow-[0_25px_70px_rgba(0,0,0,0.7)] p-4 sm:p-8 my-auto overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playKeyPress();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-900 border border-amber-700/50 transition-colors z-20 cursor-pointer"
          title="Fechar e voltar ao texto"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-200/80 border border-amber-700/50 text-amber-900 font-heading text-xs font-bold uppercase tracking-widest mb-1.5 shadow-xs">
            <Search className="w-3.5 h-3.5 text-amber-700" />
            <span>Decifrando Palavra Mistério</span>
          </div>
          <h3 className="font-heading font-black text-xl sm:text-2xl text-amber-950">
            Qual é a palavra escondida neste enigma?
          </h3>
        </div>

        {/* Big Rebus Box - ONLY the visual drawing and operators (NO formula text unless hint is used!) */}
        <div className="bg-[#fff9ee] border-2 border-dashed border-amber-800/60 rounded-2xl p-5 sm:p-7 mb-4 text-center shadow-inner relative flex flex-col items-center justify-center gap-3">
          {/* Visual Rebus Equation */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            {enigma.prefixo && (
              <span className="font-heading font-black text-2xl sm:text-3xl text-amber-900 tracking-wide">
                {enigma.prefixo}
              </span>
            )}

            <motion.div
              animate={{ y: [-2, 3, -2], rotate: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
              className="p-3 bg-white rounded-2xl border-2 border-amber-700/40 shadow-lg flex items-center justify-center min-w-[96px] min-h-[96px] sm:min-w-[110px] sm:min-h-[110px]"
            >
              {getEnigmaIllustration(enigma.imagem, "w-20 h-20 sm:w-24 sm:h-24")}
            </motion.div>

            {enigma.sufixo && (
              <span className="font-heading font-black text-2xl sm:text-3xl text-stamp-red bg-rose-50 px-3 py-1 rounded-xl border border-rose-300 shadow-xs">
                {enigma.sufixo}
              </span>
            )}
          </div>

          {/* Hint Trigger Button (Strictly 1 hint per room/fase) */}
          <div className="mt-1">
            {!hintRevealed ? (
              <button
                type="button"
                onClick={handleHintClick}
                disabled={hintsAvailable <= 0}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                  hintsAvailable > 0
                    ? 'bg-amber-100 hover:bg-yellow-200 border-amber-400 text-amber-950 cursor-pointer'
                    : 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed'
                }`}
                title={hintsAvailable > 0 ? "Usar a dica desta sala (1 por fase)" : "Você já usou a dica disponível nesta fase"}
              >
                <Lightbulb className={`w-4 h-4 ${hintsAvailable > 0 ? 'text-amber-700' : 'text-stone-400'}`} />
                <span>
                  {hintsAvailable > 0 ? "Pedir Dica (1 disponível nesta fase)" : "Sem dicas restantes nesta fase"}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-300/80 border border-yellow-500 text-yellow-950 font-bold text-xs">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-800" />
                <span>Dica Ativada!</span>
              </div>
            )}
          </div>

          {/* Hint Reveal Area: Formula ONLY appears if hint is used! */}
          <AnimatePresence>
            {hintRevealed && (
              <motion.div
                initial={{ opacity: 0, height: 0, scale: 0.9 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full max-w-md mt-2 p-3 bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-100 border-2 border-yellow-500 rounded-xl text-amber-950 shadow-sm text-center"
              >
                <div className="font-heading font-black text-sm uppercase tracking-wider text-amber-900 mb-1">
                  💡 Dica do Enigma:
                </div>
                <div className="font-heading font-bold text-base sm:text-lg text-stamp-red">
                  {enigma.operacao || `${enigma.nome} ${enigma.sufixo}`}
                </div>
                {enigma.dica && (
                  <p className="font-sans text-xs text-stone-700 mt-1">
                    {enigma.dica}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Big Typewriter Input Field with Pen Writing Sound */}
        <div className="mb-4">
          <label className="block text-xs font-typewriter font-bold text-amber-900 uppercase mb-1.5 text-center">
            Digite a palavra decifrada abaixo (teclado físico ou virtual):
          </label>
          <motion.div
            animate={isShaking ? { x: [-8, 8, -8, 8, 0] } : {}}
            transition={{ duration: 0.35 }}
            className={`
              relative max-w-md mx-auto p-3 sm:p-4 rounded-2xl border-3 transition-all shadow-md flex items-center justify-center
              ${
                isSolvedSuccess
                  ? 'bg-green-100 border-green-600 shadow-[0_0_25px_rgba(22,163,74,0.5)]'
                  : isShaking
                  ? 'border-red-600 bg-red-100/70 text-red-900'
                  : 'border-amber-800 bg-white'
              }
            `}
          >
            <div className="font-heading font-black text-2xl sm:text-3xl text-amber-950 tracking-widest text-center min-h-[38px] flex items-center justify-center">
              {typedValue || (
                <span className="text-stone-400 text-base sm:text-lg font-serif italic tracking-normal">
                  (digite para decifrar...)
                </span>
              )}
              {!isSolvedSuccess && (
                <span className="inline-block w-2.5 h-7 bg-amber-900 ml-1 align-middle animate-blink" />
              )}
            </div>

            {isSolvedSuccess && (
              <div className="absolute right-4 text-green-700 flex items-center gap-1 font-heading font-black text-sm">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <span>ACERTOU!</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Thematic Virtual Keyboard with Pen Sound Sync */}
        <div className="mt-2">
          <VirtualKeyboard
            onChar={handleChar}
            onDelete={handleDelete}
            onSpace={handleSpace}
            onSubmit={handleValidate}
            submitLabel={isSolvedSuccess ? "Palavra Confirmada!" : "Confirmar Descoberta"}
            disabled={isSolvedSuccess}
          />
        </div>
      </motion.div>
    </div>
  );
}
