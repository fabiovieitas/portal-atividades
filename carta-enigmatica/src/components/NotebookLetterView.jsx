import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Sparkles, Volume2, VolumeX, RotateCcw, Check } from 'lucide-react';
import NotebookPage from './NotebookPage';
import InvestigatorToolbar from './InvestigatorToolbar';
import LetterCompletedModal from './LetterCompletedModal';
import VirtualKeyboard from './VirtualKeyboard';
import { getRebusIllustration } from './illustrations/RebusIllustrations';
import { sounds } from '../audio/soundEffects';

export default function NotebookLetterView({
  carta,
  levelKey = 'dificil',
  investigatorName = 'INVESTIGADOR',
  onBackToLevels = () => {},
  onCompleteLevel = () => {},
  isMuted = false,
  onToggleMute = () => {}
}) {
  const [solvedMap, setSolvedMap] = useState({});
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Flatten all enigmas from the lines to easily navigate between them
  const allEnigmas = useMemo(() => {
    const list = [];
    carta.linhas.forEach(linha => {
      linha.elementos.forEach(elem => {
        if (elem.tipo === 'enigma') {
          list.push(elem);
        }
      });
    });
    return list;
  }, [carta]);

  // Selected enigma for the bottom toolbar
  const [activeEnigmaId, setActiveEnigmaId] = useState(allEnigmas[0]?.id || null);

  const activeEnigma = allEnigmas.find(e => e.id === activeEnigmaId) || allEnigmas[0];
  const solvedCount = Object.keys(solvedMap).length;
  const isAllSolved = solvedCount >= carta.totalEnigmas;

  // Handle solving an enigma
  const handleSolve = (enigmaId, answer) => {
    setSolvedMap(prev => {
      const next = { ...prev, [enigmaId]: answer };
      if (Object.keys(next).length >= carta.totalEnigmas) {
        setTimeout(() => {
          setShowSuccessModal(true);
          onCompleteLevel(levelKey);
        }, 600);
      }
      return next;
    });
  };

  const handleRestart = () => {
    sounds.playStamp();
    setSolvedMap({});
    setActiveEnigmaId(allEnigmas[0]?.id || null);
    setShowSuccessModal(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 pb-24">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-stone-900/90 backdrop-blur-md p-3 rounded-2xl border-2 border-amber-800/60 shadow-lg text-amber-100 mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playKeyPress();
              onBackToLevels();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-heading font-bold text-xs border border-stone-700 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Trocar Nível</span>
          </button>

          <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${carta.corBadge || 'bg-amber-600 text-white'}`}>
            Nível {carta.nivel} ({carta.turma})
          </span>
        </div>

        {/* Progress Badge & Sound Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/90 border border-amber-600 text-amber-200 font-heading font-bold text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>
              Palavras: <strong className="text-yellow-400 text-sm sm:text-base">{solvedCount}</strong> / {carta.totalEnigmas}
            </span>
          </div>

          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-all"
            title={isMuted ? "Ativar Sons" : "Silenciar"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition-all"
            title="Reiniciar esta carta"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Notebook Page (Caderno Escolar Limpo) */}
      <NotebookPage>
        {/* Title of the Letter */}
        <div className="flex items-center justify-between mb-4 border-b border-stone-300/80 pb-2">
          <h2 className="font-heading font-black text-xl sm:text-2xl text-amber-950 tracking-wide">
            {carta.titulo}
          </h2>
          <span className="text-xs font-sans font-bold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300">
            {carta.totalEnigmas} Palavras para Decifrar
          </span>
        </div>

        {/* Salutation */}
        <div className="font-handwritten text-2xl sm:text-3xl font-black text-stone-800 mb-2">
          {carta.saudacao}
        </div>

        {/* Letter Lines with Rebus Enigmas and Natural Line Flow */}
        <div className="font-sans text-base sm:text-lg text-stone-800 leading-[3rem] sm:leading-[3.4rem]">
          {carta.linhas.map((linha, lineIdx) => (
            <div key={lineIdx} className="inline">
              {linha.elementos.map((elem, elemIdx) => {
                if (elem.tipo === 'texto') {
                  return (
                    <span key={elemIdx} className="font-sans text-stone-900 font-medium align-baseline">
                      {elem.conteudo}
                    </span>
                  );
                } else if (elem.tipo === 'enigma') {
                  const isSolved = Boolean(solvedMap[elem.id]);
                  const isActive = activeEnigma?.id === elem.id;

                  if (isSolved) {
                    return (
                      <span
                        key={elem.id}
                        className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded bg-blue-50/90 text-blue-800 font-handwritten font-black text-xl sm:text-2xl underline decoration-blue-500 decoration-2 underline-offset-4 cursor-pointer"
                        title="Decifrado! Clique para rever."
                        onClick={() => {
                          sounds.playKeyPress();
                          setActiveEnigmaId(elem.id);
                        }}
                      >
                        <span>{solvedMap[elem.id]}</span>
                        <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                      </span>
                    );
                  }

                  return (
                    <button
                      type="button"
                      key={elem.id}
                      onClick={() => {
                        sounds.playKeyPress();
                        setActiveEnigmaId(elem.id);
                      }}
                      className={`
                        inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-xl border transition-all align-middle select-none
                        ${
                          isActive
                            ? 'border-amber-600 bg-amber-100/90 shadow-md ring-2 ring-amber-400'
                            : 'border-stone-300 bg-white/90 hover:border-amber-500 hover:bg-amber-50/80 shadow-xs'
                        }
                      `}
                    >
                      {elem.prefixo && (
                        <span className="font-heading font-black text-xs sm:text-sm text-stone-800">
                          {elem.prefixo}
                        </span>
                      )}

                      {/* Cute Inline Illustration */}
                      <span className="inline-block">
                        {getRebusIllustration(elem.imagem, "w-6 h-6 sm:w-8 sm:h-8")}
                      </span>

                      {/* Operations */}
                      <span className="font-heading font-black text-xs sm:text-sm">
                        {elem.opSub && <span className="text-red-600">{elem.opSub}</span>}
                        {elem.opAdd && <span className="text-orange-600">{elem.opAdd}</span>}
                      </span>

                      {/* Clickable slot indicator */}
                      <span className="font-mono font-bold text-xs text-amber-800 bg-amber-200/70 px-1 py-0.2 rounded border border-amber-300">
                        #{elem.numero}
                      </span>
                    </button>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>

        {/* Sign-off */}
        <div className="mt-8 text-right font-handwritten text-2xl sm:text-3xl font-black text-stone-800 pr-4">
          {carta.despedida}
        </div>
      </NotebookPage>

      {/* Floating Interactive Investigator Toolbar for the Active Enigma */}
      <InvestigatorToolbar
        activeEnigma={activeEnigma}
        allEnigmas={allEnigmas}
        solvedMap={solvedMap}
        onSolve={handleSolve}
        onSelectEnigma={(enigma) => setActiveEnigmaId(enigma.id)}
        onToggleKeyboard={() => setShowKeyboard(prev => !prev)}
        showKeyboard={showKeyboard}
      />

      {/* Floating Virtual Keyboard if opened */}
      <AnimatePresence>
        {showKeyboard && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-20 left-2 right-2 max-w-2xl mx-auto z-50"
          >
            <div className="bg-stone-950/95 p-3 rounded-2xl border-2 border-amber-600 shadow-2xl">
              <div className="flex items-center justify-between text-xs text-amber-200 font-bold mb-1 px-2">
                <span>⌨️ Teclado Virtual de Carimbos</span>
                <button
                  onClick={() => setShowKeyboard(false)}
                  className="text-stone-400 hover:text-white"
                >
                  ✕ Fechar
                </button>
              </div>
              <VirtualKeyboard showSubmit={false} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebratory Modal on Completion */}
      {showSuccessModal && (
        <LetterCompletedModal
          carta={carta}
          onRestart={handleRestart}
          hasNext={false}
          onNext={onBackToLevels}
        />
      )}
    </div>
  );
}
