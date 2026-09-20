import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, AlertCircle, FileSearch, ArrowRight } from 'lucide-react';
import VintagePaperContainer from '../components/VintagePaperContainer';
import VirtualKeyboard from '../components/VirtualKeyboard';
import { sounds } from '../audio/soundEffects';

export default function WelcomeScreen({
  initialName = '',
  onConfirmName = () => {}
}) {
  const [name, setName] = useState(initialName);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChar = (char) => {
    if (name.length < 18) {
      sounds.playPenWrite();
      setName(prev => prev + char);
      setErrorMsg('');
    }
  };

  const handleDelete = () => {
    sounds.playPenWrite();
    setName(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleSpace = () => {
    if (name.length > 0 && !name.endsWith(' ') && name.length < 18) {
      sounds.playPenWrite();
      setName(prev => prev + ' ');
      setErrorMsg('');
    }
  };

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      sounds.playError();
      setErrorMsg('Por favor, digite seu nome ou codinome de detetive!');
      return;
    }
    sounds.playStamp();
    onConfirmName(trimmed);
  };

  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center p-3 sm:p-6">
      <VintagePaperContainer className="w-full max-w-3xl text-center">
        {/* Detective Badge Header */}
        <div className="flex justify-center mb-3">
          <motion.div
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 220 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-1 shadow-lg border-2 border-amber-300 flex items-center justify-center text-amber-100"
          >
            <div className="w-full h-full rounded-full border border-dashed border-amber-300/60 flex flex-col items-center justify-center">
              <Shield className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-300" />
              <span className="text-[8px] font-mono tracking-tighter uppercase font-bold text-amber-200">SECRETO</span>
            </div>
          </motion.div>
        </div>

        {/* Agency Title */}
        <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-amber-950 tracking-wider mb-1">
          Agência de Investigadores
        </h1>
        <p className="font-typewriter text-xs sm:text-sm text-amber-800 tracking-widest uppercase mb-4">
          Divisão Especial de Cartas Enigmáticas & Escape Room
        </p>

        {/* Engaging Introductory Story Box (Ponto 1: História antes que envolva!) */}
        <div className="bg-[#fffcf5] border-2 border-amber-800/40 rounded-2xl p-4 sm:p-6 mb-5 shadow-sm text-left relative">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-800/20">
            <FileSearch className="w-5 h-5 text-amber-800" />
            <span className="font-heading font-black text-xs sm:text-sm text-amber-950 uppercase tracking-wider">
              Dossiê de Missão Confidencial: Caso das Salas Secretas
            </span>
          </div>

          <p className="font-serif text-sm sm:text-base text-stone-800 leading-relaxed mb-3">
            🚨 <strong>Atenção, futuro(a) detetive!</strong> Um mistério fascinante acabou de abalar a nossa Agência. As portas das salas secretas de conhecimento foram trancadas por misteriosas cartas enigmáticas deixadas por um guardião dos segredos.
          </p>

          <p className="font-serif text-sm sm:text-base text-stone-800 leading-relaxed mb-3">
            Cada porta só destranca quando você decifrar as palavras enigmáticas ocultas no meio da narrativa, somando e subtraindo letras. A cada sala resolvida, você ganha uma <strong>Pista Secreta no Inventário</strong> para abrir o Grande Cofre Final!
          </p>

          <p className="font-serif text-sm sm:text-base text-amber-950 font-bold">
            Você aceita este desafio? Cadastre seu nome oficial no crachá abaixo e prepare sua lupa:
          </p>
        </div>

        {/* Detective ID Nameplate */}
        <div className="max-w-md mx-auto bg-white border-2 border-amber-800 rounded-xl py-3 px-5 shadow-sm flex items-center justify-center gap-3 mb-4">
          <span className="font-typewriter text-xs sm:text-sm text-amber-900 font-bold uppercase">
            Identidade:
          </span>
          <div className="font-heading font-black text-xl sm:text-2xl text-stamp-red tracking-widest min-w-[140px] text-left">
            {name || ''}
            <span className="inline-block w-2.5 h-6 bg-amber-900 ml-1 align-middle animate-blink" />
          </div>
        </div>

        {errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs text-red-600 font-bold mb-3"
          >
            ⚠️ {errorMsg}
          </motion.p>
        )}

        {/* Thematic Virtual Keyboard */}
        <div className="mt-1">
          <p className="font-typewriter text-xs text-amber-900/80 mb-2 uppercase tracking-wider">
            Digite seu nome usando o teclado virtual ou físico do computador:
          </p>
          <VirtualKeyboard
            onChar={handleChar}
            onDelete={handleDelete}
            onSpace={handleSpace}
            onSubmit={handleSubmit}
            submitLabel="Confirmar Identidade & Iniciar"
          />
        </div>
      </VintagePaperContainer>
    </div>
  );
}
