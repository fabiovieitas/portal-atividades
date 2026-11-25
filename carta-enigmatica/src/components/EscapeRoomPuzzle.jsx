import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Lock, Unlock, Key, FileText, Eye, RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function EscapeRoomPuzzle({ puzzle, onUnlock }) {
  const [seq, setSeq] = useState([]);
  const [code, setCode] = useState('');
  const [foundClue, setFoundClue] = useState(false);
  const [foundKeys, setFoundKeys] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [error, setError] = useState(false);

  const triggerError = (resetFn) => {
    sounds.playError?.();
    setError(true);
    setTimeout(() => {
      setError(false);
      resetFn();
    }, 650);
  };

  // Sala 1: Ligar disjuntores na ordem para destrancar a gaveta
  const handleSwitch = (num) => {
    if (drawerOpen) return;
    sounds.playKeyPress();
    const target = (puzzle.codigo || '1-3-2').split('-').map(Number);
    const next = [...seq, num];
    if (next[next.length - 1] !== target[next.length - 1]) {
      triggerError(() => setSeq([]));
      return;
    }
    setSeq(next);
    if (next.length === target.length) {
      sounds.playUnlockRoom?.();
      setDrawerOpen(true);
    }
  };

  // Sala 2: Descobrir código no bilhete + digitar no cofre
  const handleDigit = (d) => {
    sounds.playKeyPress();
    if (code.length < 6) setCode((c) => c + d);
  };

  const handleConfirmCode = () => {
    if (code === (puzzle.codigo || '3025')) {
      sounds.playUnlockRoom?.();
      setDrawerOpen(true);
    } else {
      triggerError(() => setCode(''));
    }
  };

  // Sala 3: Procurar 3 chaves/cristais escondidos no cenário
  const handleFindKey = (id) => {
    if (foundKeys.includes(id)) return;
    sounds.playKeyPress();
    const next = [...foundKeys, id];
    setFoundKeys(next);
    if (next.length >= 3) {
      sounds.playUnlockRoom?.();
      setDrawerOpen(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900 border-2 ${error ? 'border-rose-500' : 'border-cyan-500/60'} rounded-2xl p-5 sm:p-8 text-slate-100 shadow-2xl max-w-2xl mx-auto my-6`}
    >
      {/* Cabeçalho da Sala */}
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
          {puzzle.tipo === 'switches' && <Zap className="w-6 h-6" />}
          {puzzle.tipo === 'keypad' && <Lock className="w-6 h-6" />}
          {puzzle.tipo === 'scanner' && <Key className="w-6 h-6" />}
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            Escape Room • Ano 3025
          </span>
          <h2 className="font-heading text-xl font-bold text-white">{puzzle.titulo}</h2>
        </div>
      </div>

      <p className="text-slate-300 text-sm sm:text-base mb-5 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
        {puzzle.instrucao}
      </p>

      {/* SALA 1: Disjuntores + Gaveta com a Carta */}
      {puzzle.tipo === 'switches' && !drawerOpen && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => {
              const active = seq.includes(n);
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleSwitch(n)}
                  disabled={active}
                  className={`py-6 rounded-xl font-heading font-bold text-2xl border-2 transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-300'
                      : 'bg-slate-800 hover:bg-slate-700 border-cyan-500/40 text-cyan-200'
                  }`}
                >
                  {active ? <CheckCircle2 className="w-7 h-7 mx-auto" /> : `Botão #${n}`}
                </button>
              );
            })}
          </div>
          <div className="text-center text-xs font-mono text-slate-400">
            Dica do Painel: Ordem {puzzle.codigo || '1-3-2'} para destrancar a gaveta secreta.
          </div>
        </div>
      )}

      {/* SALA 2: Bilhete escondido + Cofre */}
      {puzzle.tipo === 'keypad' && !drawerOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
          <div className="bg-slate-800/70 border border-amber-500/40 rounded-xl p-4 text-center">
            <p className="text-xs font-mono uppercase text-amber-300 mb-2">Mesa do Laboratório</p>
            {!foundClue ? (
              <button
                type="button"
                onClick={() => {
                  sounds.playKeyPress();
                  setFoundClue(true);
                }}
                className="w-full py-4 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border-2 border-dashed border-amber-400 text-amber-200 font-bold flex flex-col items-center gap-2 cursor-pointer"
              >
                <Eye className="w-6 h-6" />
                <span>Inspecionar Bilhete Dobrado</span>
              </button>
            ) : (
              <div className="py-4 px-3 rounded-xl bg-amber-950/60 border border-amber-400 text-amber-200">
                <div className="text-xs uppercase font-mono">Código descoberto:</div>
                <div className="text-3xl font-mono font-black tracking-widest text-amber-300 mt-1">
                  {puzzle.codigo || '3025'}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-black/60 border border-cyan-500/40 rounded-xl py-2.5 px-4 text-center font-mono text-2xl tracking-[0.4em] text-cyan-300 mb-3 min-h-[48px]">
              {code || '----'}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['1','2','3','4','5','6','7','8','9'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDigit(d)}
                  className="py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono font-bold text-lg border border-slate-700 cursor-pointer"
                >
                  {d}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCode('')}
                className="py-2.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-300 flex items-center justify-center border border-slate-700 cursor-pointer"
                aria-label="Limpar"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className="py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 font-mono font-bold text-lg border border-slate-700 cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleConfirmCode}
                className="py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold border border-cyan-400 cursor-pointer"
              >
                ABRIR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SALA 3: Procurar 3 Chaves no Cenário */}
      {puzzle.tipo === 'scanner' && !drawerOpen && (
        <div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { id: 1, label: 'Atrás do Monitor' },
              { id: 2, label: 'Dentro da Cápsula' },
              { id: 3, label: 'Sob o Tapete' },
            ].map((spot) => {
              const found = foundKeys.includes(spot.id);
              return (
                <button
                  key={spot.id}
                  type="button"
                  onClick={() => handleFindKey(spot.id)}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                    found
                      ? 'bg-emerald-600/25 border-emerald-400 text-emerald-200'
                      : 'bg-slate-800/80 hover:bg-slate-700 border-cyan-500/40 text-cyan-200'
                  }`}
                >
                  {found ? <Key className="w-7 h-7 text-amber-300" /> : <Eye className="w-7 h-7 animate-pulse" />}
                  <span className="text-xs font-bold">{found ? 'Chave Encontrada!' : spot.label}</span>
                </button>
              );
            })}
          </div>
          <div className="text-center text-xs font-mono text-cyan-300">
            Chaves encontradas: {foundKeys.length} / 3
          </div>
        </div>
      )}

      {/* GAVETA / COFRE DESTRANCADO -> TIRAR A CARTA */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-2 bg-emerald-950/60 border-2 border-emerald-400 rounded-2xl p-6 text-center"
          >
            <Unlock className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <h3 className="font-heading text-xl font-bold text-emerald-200 mb-1">
              Compartimento Destrancado!
            </h3>
            <p className="text-sm text-emerald-100/80 mb-5">
              Você encontrou uma <strong>Carta Enigmática</strong> secreta lá dentro.
            </p>
            <button
              type="button"
              onClick={() => {
                sounds.playKeyPress();
                onUnlock();
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-heading font-bold text-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
            >
              <FileText className="w-5 h-5" />
              <span>Tirar a Carta e Decifrar</span>
              <Sparkles className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
