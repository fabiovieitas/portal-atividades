import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, RotateCcw, ArrowRight, Volume2, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function LetterCompletedModal({
  carta,
  onNext = () => {},
  onRestart = () => {},
  hasNext = true
}) {
  useEffect(() => {
    sounds.playVictoryFanfare();
    try {
      const end = Date.now() + 2500;
      const colors = ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#ec4899'];
      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();
    } catch (e) {}
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="relative w-full max-w-xl bg-[#fcf8ee] border-4 border-amber-800 rounded-3xl p-6 sm:p-8 text-center shadow-2xl my-auto"
      >
        {/* Animated Big Stamp */}
        <motion.div
          initial={{ scale: 2, rotate: -25, opacity: 0 }}
          animate={{ scale: 1, rotate: -6, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="inline-block px-5 py-2 rounded-2xl border-4 border-dashed border-red-600 bg-red-100 text-red-700 font-heading font-black text-2xl sm:text-3xl tracking-wider shadow-lg mb-4"
        >
          ★ NOTA 10! CARTA DECIFRADA! ★
        </motion.div>

        <h3 className="font-heading font-black text-2xl text-stone-900 mb-1">
          Parabéns, Grande Detetive!
        </h3>
        <p className="font-sans text-stone-700 text-sm sm:text-base mb-6">
          Você decifrou todas as <strong>{carta.totalEnigmas} palavras secretas</strong> de{' '}
          <em>"{carta.titulo}"</em>!
        </p>

        {/* Full Solved Letter Preview */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-stone-300 text-left mb-6 shadow-inner font-serif text-sm sm:text-base text-stone-800 leading-relaxed max-h-48 overflow-y-auto scrollbar-thin">
          <p className="font-bold text-amber-900 mb-2">{carta.saudacao}</p>
          <p className="mb-2">
            Resolvi começar o <strong className="text-blue-700">CARDÁPIO</strong> do nosso incrível{' '}
            <strong className="text-blue-700">RESTAURANTE</strong> estranho! Estas são as{' '}
            <strong className="text-blue-700">PRIMEIRAS</strong> sugestões: empada de{' '}
            <strong className="text-blue-700">BRIGADEIRO</strong>,{' '}
            <strong className="text-blue-700">SUCO</strong> de{' '}
            <strong className="text-blue-700">MOSTARDA</strong> e{' '}
            <strong className="text-blue-700">MEL</strong>,{' '}
            <strong className="text-blue-700">PIZZA</strong> de{' '}
            <strong className="text-blue-700">BETERRABA</strong>, Pico +{' '}
            <strong className="text-blue-700">PICOLÉ</strong> de{' '}
            <strong className="text-blue-700">FEIJÃO</strong>,{' '}
            <strong className="text-blue-700">SANDUÍCHE</strong> de{' '}
            <strong className="text-blue-700">ARROZ</strong>! O que achou? Mande-me sua{' '}
            <strong className="text-blue-700">RESPOSTA</strong>! Meu irmão não gostou tanto das idéias, mas um dia elas serão um{' '}
            <strong className="text-blue-700">SUCESSO</strong>!
          </p>
          <p className="font-bold text-stone-700 text-right">{carta.despedida}</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              sounds.playStamp();
              onRestart();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-heading font-bold text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Jogar Novamente</span>
          </button>

          {hasNext && (
            <button
              onClick={() => {
                sounds.playStamp();
                onNext();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-heading font-black text-sm shadow-md transition-all"
            >
              <span>Próxima Carta Enigmática</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
