import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Key, Award, Bookmark, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import VintagePaperContainer from '../components/VintagePaperContainer';
import VirtualKeyboard from '../components/VirtualKeyboard';
import { normalizeText } from '../components/EnigmaInlineBlock';
import { sounds } from '../audio/soundEffects';

export default function FinalChallengeScreen({
  levelData,
  investigatorName = 'INVESTIGADOR',
  inventoryClues = [],
  onVictory = () => {},
  onRestart = () => {}
}) {
  const [inputPhrase, setInputPhrase] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const targetAnswer = normalizeText(levelData.respostaFinalMestra);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      const end = Date.now() + 3000;
      const colors = ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {}
  };

  const handleValidate = () => {
    const cleanInput = normalizeText(inputPhrase);
    if (cleanInput === targetAnswer) {
      setIsSolved(true);
      sounds.playVictoryFanfare();
      triggerConfetti();
      setTimeout(() => {
        onVictory();
      }, 1200);
    } else {
      setIsShaking(true);
      sounds.playError();
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleChar = (char) => {
    if (isSolved) return;
    sounds.playPenWrite();
    const nextVal = inputPhrase + char;
    setInputPhrase(nextVal);

    // Automatic validation check
    if (normalizeText(nextVal) === targetAnswer) {
      setIsSolved(true);
      sounds.playVictoryFanfare();
      triggerConfetti();
      setTimeout(() => {
        onVictory();
      }, 1200);
    }
  };

  const handleDelete = () => {
    if (isSolved) return;
    sounds.playPenWrite();
    setInputPhrase(prev => prev.slice(0, -1));
  };

  const handleSpace = () => {
    if (isSolved) return;
    sounds.playPenWrite();
    if (inputPhrase.length > 0 && !inputPhrase.endsWith(' ')) {
      const nextVal = inputPhrase + ' ';
      setInputPhrase(nextVal);
      if (normalizeText(nextVal) === targetAnswer) {
        setIsSolved(true);
        sounds.playVictoryFanfare();
        triggerConfetti();
        setTimeout(() => {
          onVictory();
        }, 1200);
      }
    }
  };

  // Quick insertion of a clue by clicking it
  const handleInsertClue = (clue) => {
    if (isSolved) return;
    sounds.playPenWrite();
    const formatted = inputPhrase.length === 0 || inputPhrase.endsWith(' ')
      ? inputPhrase + clue.toUpperCase() + ' '
      : inputPhrase + ' ' + clue.toUpperCase() + ' ';
    setInputPhrase(formatted);

    if (normalizeText(formatted) === targetAnswer) {
      setIsSolved(true);
      sounds.playVictoryFanfare();
      triggerConfetti();
      setTimeout(() => {
        onVictory();
      }, 1200);
    }
  };

  const formattedPrompt = levelData.perguntaFinal.replace(/\[NOME\]/g, investigatorName);

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-5">
      <VintagePaperContainer
        title="O Cofre Final — A Frase Mestra"
        badge="Grande Encerramento"
        className="mb-4"
      >
        {/* Instruction Message */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-yellow-100 border-2 border-yellow-500/50 text-amber-900 mb-3 shadow-sm">
            <Award className="w-8 h-8 text-amber-700" />
          </div>

          <h2 className="font-heading font-black text-2xl sm:text-3xl text-amber-950 mb-2">
            Desafio Final do Mestre Investigador
          </h2>

          <p className="font-serif text-base sm:text-lg text-amber-900 max-w-2xl mx-auto leading-relaxed">
            {formattedPrompt}
          </p>
        </div>

        {/* Pinboard of Collected Clues */}
        <div className="bg-[#f5ecdd] p-4 sm:p-5 rounded-xl border-2 border-dashed border-amber-800/40 mb-6 shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="font-typewriter font-bold text-xs sm:text-sm text-amber-900 uppercase flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-stamp-red" />
              <span>Quadro de Pistas Encontradas:</span>
            </span>
            <span className="text-[11px] font-mono text-amber-800/80">
              (Clique em uma pista para inseri-la no campo!)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {inventoryClues.map((clue, idx) => (
              <motion.button
                key={idx}
                type="button"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleInsertClue(clue)}
                className="px-3 py-1.5 rounded-lg bg-[#fffdfa] border-2 border-amber-800 text-amber-950 font-typewriter text-xs sm:text-sm font-black shadow-sm flex items-center gap-2 hover:bg-amber-100 transition-colors"
                title="Clique para adicionar à frase"
              >
                <span className="w-4 h-4 rounded-full bg-stamp-red text-white text-[10px] flex items-center justify-center font-sans font-bold">
                  {idx + 1}
                </span>
                <span>"{clue}"</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Master Phrase Input Display */}
        <div className="mb-6">
          <label className="block font-typewriter text-xs sm:text-sm font-bold text-amber-900 uppercase mb-2">
            Frase Mestra do Cofre:
          </label>
          <motion.div
            animate={isShaking ? { x: [-6, 6, -6, 6, 0] } : {}}
            transition={{ duration: 0.35 }}
            className={`
              relative p-4 rounded-xl border-2 transition-all shadow-md min-h-[70px] flex items-center justify-between
              ${
                isSolved
                  ? 'bg-green-100 border-green-600 shadow-[0_0_25px_rgba(22,163,74,0.4)]'
                  : isShaking
                  ? 'bg-red-50 border-red-600'
                  : 'bg-[#fffdfa] border-amber-800'
              }
            `}
          >
            <div className="font-typewriter font-black text-base sm:text-xl text-amber-950 tracking-wider break-words flex-1 pr-2">
              {inputPhrase || (
                <span className="text-amber-900/40 font-normal italic">
                  Clique nas pistas acima ou use o teclado abaixo...
                </span>
              )}
              {!isSolved && (
                <span className="inline-block w-2.5 h-6 bg-amber-900 ml-1 align-middle animate-blink" />
              )}
            </div>

            {isSolved && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-700 text-white rounded-lg font-heading text-xs font-bold shrink-0">
                <CheckCircle2 className="w-4 h-4" />
                <span>DESTRAVADO!</span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Virtual Keyboard */}
        <div className="mt-4">
          <VirtualKeyboard
            onChar={handleChar}
            onDelete={handleDelete}
            onSpace={handleSpace}
            onSubmit={handleValidate}
            submitLabel={isSolved ? "Cofre Aberto com Sucesso!" : "Destravar Cofre Final"}
            disabled={isSolved}
          />
        </div>
      </VintagePaperContainer>
    </div>
  );
}
