import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, ArrowRight, CheckCircle2, Search, Check, Sparkles, HelpCircle } from 'lucide-react';
import NotebookPage from '../components/NotebookPage';
import EnigmaModal from '../components/EnigmaModal';
import { getEnigmaIllustration } from '../components/illustrations/EnigmaIcons';
import { sounds } from '../audio/soundEffects';

export default function RoomGameplayScreen({
  levelData,
  roomIndex = 0,
  investigatorName = 'INVESTIGADOR',
  onSolveRoom = () => {},
  onNextRoom = () => {},
  isLastRoom = false
}) {
  const room = levelData.salas[roomIndex] || levelData.salas[0];

  // Map of solved enigmas: { [enigmaId]: 'RESPOSTA' }
  const [solvedEnigmas, setSolvedEnigmas] = useState({});
  const [selectedEnigmaForModal, setSelectedEnigmaForModal] = useState(null);
  const [roomUnlocked, setRoomUnlocked] = useState(false);
  const [hintsAvailable, setHintsAvailable] = useState(1); // Estritamente 1 dica por fase!

  // Reset when roomIndex changes
  useEffect(() => {
    setSolvedEnigmas({});
    setSelectedEnigmaForModal(null);
    setRoomUnlocked(false);
    setHintsAvailable(1); // 1 nova dica concedida para a nova fase
  }, [roomIndex]);

  // When an enigma is solved inside the big popup
  const handleSolveEnigma = (enigmaId, word) => {
    setSolvedEnigmas(prev => {
      const next = { ...prev, [enigmaId]: word };

      // Check if all enigmas of this room are now solved
      const allSolved = room.enigmas.every(e => next[e.id]);
      if (allSolved && !roomUnlocked) {
        setRoomUnlocked(true);
        sounds.playUnlockRoom();
        onSolveRoom(room.pistaInvetario);
      }

      return next;
    });
  };

  // Helper to parse narrative text into React nodes
  const renderNarrativeText = () => {
    const rawText = room.texto;
    const regex = /\[([^\]]+)\]/g;
    const elements = [];
    let lastIdx = 0;
    let enigmaSequentialIndex = 0;
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      const matchStart = match.index;
      const matchEnd = regex.lastIndex;
      const tokenContent = match[1].trim();

      // Add preceding plain text
      if (matchStart > lastIdx) {
        elements.push(
          <span key={`text-${lastIdx}`} className="align-baseline">
            {rawText.substring(lastIdx, matchStart)}
          </span>
        );
      }

      // Check if token is [NOME]
      if (tokenContent.toUpperCase() === 'NOME') {
        elements.push(
          <span
            key={`nome-${matchStart}`}
            className="font-heading font-black text-amber-950 px-2.5 py-0.5 bg-amber-200/90 rounded-md border border-amber-500 shadow-xs inline-block align-baseline"
          >
            {investigatorName}
          </span>
        );
      } else {
        // Find enigma by [E1], [E2] or sequential index
        let currentEnigma = null;
        if (tokenContent.toUpperCase().startsWith('E')) {
          const numId = parseInt(tokenContent.slice(1), 10);
          currentEnigma = room.enigmas.find(e => e.id === numId || String(e.id) === tokenContent.slice(1));
        }
        if (!currentEnigma) {
          currentEnigma = room.enigmas[enigmaSequentialIndex];
        }

        if (currentEnigma) {
          const isSolved = Boolean(solvedEnigmas[currentEnigma.id]);

          if (isSolved) {
            // Replaced by solved word written in blue ballpoint pen ink on the notebook line
            elements.push(
              <span
                key={`solved-${currentEnigma.id}-${roomIndex}`}
                className="inline-flex items-center gap-1 mx-1.5 px-2.5 py-0.5 rounded-lg bg-blue-50/90 border border-blue-300 text-blue-800 font-handwritten font-black text-xl sm:text-2xl underline decoration-blue-500 decoration-2 align-baseline shadow-xs"
                title={`Palavra Decifrada: ${solvedEnigmas[currentEnigma.id]}!`}
              >
                <span>{solvedEnigmas[currentEnigma.id]}</span>
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
              </span>
            );
          } else {
            // Clickable Mystery Word Badge styled just like the user's reference image!
            elements.push(
              <button
                key={`enigma-btn-${currentEnigma.id}-${roomIndex}`}
                type="button"
                onClick={() => {
                  sounds.playKeyPress();
                  setSelectedEnigmaForModal(currentEnigma);
                }}
                className="inline-flex items-center gap-1.5 mx-1.5 my-1 px-2.5 py-1 rounded-xl bg-[#fff8eb] hover:bg-amber-100 border-2 border-amber-800/80 hover:border-amber-950 text-amber-950 shadow-sm hover:scale-105 transition-all cursor-pointer align-middle select-none group"
                title={`Enigma: ${currentEnigma.operacao || currentEnigma.nome} — Clique para decifrar no popup!`}
              >
                {/* Prefix if any (e.g. 'pri +', 'v +', 'F +', 'c +', 'Di +') */}
                {currentEnigma.prefixo && (
                  <span className="font-heading font-black text-sm sm:text-base text-amber-900 tracking-wide">
                    {currentEnigma.prefixo}
                  </span>
                )}

                {/* SVG Illustration Stamp */}
                <span className="p-0.5 bg-white rounded-lg border border-amber-500/60 shadow-xs group-hover:scale-110 transition-transform">
                  {getEnigmaIllustration(currentEnigma.imagem, "w-7 h-7 sm:w-8 sm:h-8")}
                </span>

                {/* Suffix if any (e.g. '- çã', '- nar', '+ ria', '- do', '- to') */}
                {currentEnigma.sufixo && (
                  <span className="font-heading font-black text-xs sm:text-sm text-stamp-red bg-rose-50 px-1.5 py-0.5 rounded border border-rose-300 shadow-xs">
                    {currentEnigma.sufixo}
                  </span>
                )}

                {/* Dotted click prompt */}
                <span className="font-sans font-black text-[11px] text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md border border-amber-400/80 group-hover:bg-amber-300 flex items-center gap-1">
                  <Search className="w-3 h-3 text-amber-700" />
                  <span>Decifrar</span>
                </span>
              </button>
            );
          }
          enigmaSequentialIndex++;
        } else {
          elements.push(
            <span key={`unknown-${matchStart}`} className="font-bold">
              [{tokenContent}]
            </span>
          );
        }
      }

      lastIdx = matchEnd;
    }

    // Trailing text
    if (lastIdx < rawText.length) {
      elements.push(
        <span key={`text-${lastIdx}`} className="align-baseline">
          {rawText.substring(lastIdx)}
        </span>
      );
    }

    return elements;
  };

  const solvedCount = Object.keys(solvedEnigmas).length;

  return (
    <div className="w-full max-w-4xl mx-auto p-2 sm:p-4">
      {/* Top Level & Room Header Bar */}
      <div className="bg-[#241a12] border-2 border-amber-800/80 rounded-2xl p-3 sm:p-4 shadow-lg mb-4 text-stone-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-900/60 border border-amber-700 text-amber-300">
            {roomUnlocked ? (
              <Unlock className="w-5 h-5 text-emerald-400" />
            ) : (
              <Lock className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase text-amber-400 font-bold block">
              {levelData.titulo}
            </span>
            <h3 className="font-heading font-black text-base sm:text-lg text-white">
              Sala {room.sala}: {room.nomeSala}
            </h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Indicador de 1 dica por fase */}
          <span className={`text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-xs ${
            hintsAvailable > 0
              ? 'bg-amber-950/80 border-amber-600 text-amber-300'
              : 'bg-stone-900/80 border-stone-700 text-stone-400'
          }`}>
            <HelpCircle className={`w-4 h-4 ${hintsAvailable > 0 ? 'text-yellow-400' : 'text-stone-500'}`} />
            <span>Dica da fase: {hintsAvailable > 0 ? '1 disponível' : 'usada'}</span>
          </span>

          <span className="text-xs sm:text-sm font-bold bg-amber-950/80 px-3 py-1.5 rounded-xl border border-amber-700/60 text-amber-300 flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>
              {solvedCount} de {room.enigmas.length} enigma(s) decifrado(s)
            </span>
          </span>
        </div>
      </div>

      {/* Notebook Ruled Page Containing the Letter (Just like the User's Image!) */}
      <NotebookPage>
        <div className="py-2">
          {/* Handwritten Letter Salutation Header */}
          <div className="mb-4 pb-2 border-b border-amber-900/20 flex items-center justify-between">
            <span className="font-handwritten text-xl sm:text-2xl text-stone-800 font-bold">
              Caderno de Registro — Sala {room.sala}
            </span>
            <span className="text-xs font-mono uppercase text-amber-900/70 font-bold bg-amber-100/60 px-2 py-0.5 rounded">
              Página {room.sala} de {levelData.salas.length}
            </span>
          </div>

          {/* Letter Body on Ruled Lines with Rebus Enigmas */}
          <div className="font-serif text-base sm:text-lg md:text-xl text-stone-900 leading-[3.2rem] sm:leading-[3.8rem] tracking-normal">
            {renderNarrativeText()}
          </div>

          {/* Helper Instruction */}
          <div className="mt-6 pt-3 border-t border-dashed border-amber-900/20 text-center text-xs font-sans text-amber-900/80 flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>
              Clique sobre qualquer palavra enigmática para abrir o popup e digitar sua descoberta!
            </span>
          </div>
        </div>
      </NotebookPage>

      {/* Room Unlocked Banner / Reward Notification */}
      <AnimatePresence>
        {roomUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-3 border-amber-600 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-14 h-14 rounded-full bg-stamp-green text-white flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-heading font-black text-lg sm:text-xl text-amber-950">
                  Porta da Sala {room.sala} Destrancada!
                </h4>
                <p className="font-sans text-xs sm:text-sm text-stone-700">
                  Pista Secreta Coletada para o Inventário:{' '}
                  <strong className="text-stamp-red text-sm sm:text-base underline decoration-amber-600 font-heading font-black">
                    "{room.pistaInvetario}"
                  </strong>
                </p>
              </div>
            </div>

            {/* Next Room or Final Challenge Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playStamp();
                onNextRoom();
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-b from-green-700 to-green-900 hover:from-green-600 hover:to-green-800 text-white font-heading font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <span>{isLastRoom ? 'Ir ao Desafio Final!' : 'Avançar para Próxima Sala'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP GRANDE (MODAL) AO CLICAR NA PALAVRA MISTÉRIO */}
      <EnigmaModal
        enigma={selectedEnigmaForModal}
        isOpen={Boolean(selectedEnigmaForModal)}
        onClose={() => setSelectedEnigmaForModal(null)}
        onSolve={handleSolveEnigma}
        hintsAvailable={hintsAvailable}
        onConsumeHint={() => setHintsAvailable(0)}
      />
    </div>
  );
}
