import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ShieldAlert, ArrowRight } from 'lucide-react';
import VintagePaperContainer from '../components/VintagePaperContainer';
import { sounds } from '../audio/soundEffects';

const LEVELS_CONFIG = [
  {
    key: 'terceiroAno',
    grade: '3º Ano',
    levelLabel: 'Modo Fácil — 3 Salas',
    badgeColor: 'bg-emerald-600 text-white',
    title: 'O Resgate do Mascote Fujão',
    description: 'Pouco texto e frases diretas. Encontre as pistas do mascote fujão pelo parque, sala e quintal (12 enigmas em 3 salas).',
    roomsCount: 3,
    icon: Sparkles,
    theme: 'Parque, Animais & Esconderijos'
  },
  {
    key: 'quartoAno',
    grade: '4º Ano',
    levelLabel: 'Modo Médio — 4 Salas',
    badgeColor: 'bg-amber-600 text-white',
    title: 'A Carta Secreta das Férias',
    description: 'Carta clássica da revista com alta densidade de enigmas distribuídos em 4 etapas das férias (22 enigmas em 4 salas).',
    roomsCount: 4,
    icon: BookOpen,
    theme: 'Passeios, Sorveteria & Bicicleta'
  },
  {
    key: 'quintoAno',
    grade: '5º Ano',
    levelLabel: 'Modo Avançado — 5 Salas',
    badgeColor: 'bg-rose-700 text-white',
    title: 'O Banquete Secreto do Restaurante',
    description: 'Mistério culinário com vocabulário desafiador e 5 salas temáticas até o grande cofre (20 enigmas em 5 salas).',
    roomsCount: 5,
    icon: ShieldAlert,
    theme: 'Culinária Secreta, Receitas & Mistério'
  }
];

export default function LevelSelectScreen({
  investigatorName = 'INVESTIGADOR',
  onSelectLevel = () => {},
  onChangeName = () => {}
}) {
  return (
    <div className="w-full min-h-[calc(100vh-40px)] flex flex-col justify-center items-center p-3 sm:p-6">
      <VintagePaperContainer className="w-full max-w-4xl">
        {/* Detective Greeting Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-900/20 pb-4 mb-6">
          <div>
            <span className="text-xs font-mono text-amber-800 uppercase tracking-widest block">
              Investigador(a) em Missão:
            </span>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl sm:text-2xl text-amber-950 uppercase tracking-wider">
                {investigatorName || 'AGENTE'}
              </span>
              <button
                onClick={() => {
                  sounds.playKeyPress();
                  onChangeName();
                }}
                className="text-xs font-sans text-amber-700 underline hover:text-amber-950 cursor-pointer"
                title="Trocar nome"
              >
                (Trocar Nome)
              </button>
            </div>
          </div>

          <div className="text-right">
            <span className="font-heading text-xs uppercase px-3 py-1 bg-amber-200/80 border border-amber-800/40 text-amber-900 rounded-md font-bold tracking-wider">
              3 Missões Disponíveis
            </span>
          </div>
        </div>

        {/* Level Select Title */}
        <div className="text-center mb-6">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-amber-950 tracking-wide">
            Excelente, investigador(a) {investigatorName}!
          </h2>
          <p className="font-typewriter text-xs sm:text-sm text-amber-800 tracking-wider mt-1 uppercase">
            Escolha a sua turma e o nível da missão de Escape Room:
          </p>
        </div>

        {/* 3 Level Dossier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {LEVELS_CONFIG.map((lvl, index) => {
            const Icon = lvl.icon;
            return (
              <motion.div
                key={lvl.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="relative bg-[#faf5ec] border-2 border-amber-800/50 rounded-2xl p-5 shadow-md flex flex-col justify-between overflow-hidden group hover:border-amber-900 hover:shadow-xl transition-all"
              >
                {/* Level Badge Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase shadow-xs ${lvl.badgeColor}`}>
                    {lvl.grade}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-900">
                    {lvl.roomsCount} Salas
                  </span>
                </div>

                <div>
                  <div className="text-xs font-typewriter text-amber-900 font-bold mb-1">
                    {lvl.levelLabel}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-black text-lg sm:text-xl text-amber-950 mb-2 leading-tight group-hover:text-amber-800 transition-colors">
                    {lvl.title}
                  </h3>

                  {/* Description */}
                  <p className="font-serif text-xs sm:text-sm text-amber-900/90 leading-relaxed mb-4">
                    {lvl.description}
                  </p>

                  {/* Theme Info */}
                  <div className="bg-amber-100/70 p-2 rounded-lg border border-amber-800/20 text-[11px] font-typewriter text-amber-900 mb-5">
                    <strong>Foco:</strong> {lvl.theme}
                  </div>
                </div>

                {/* Open Dossier Button */}
                <button
                  type="button"
                  onClick={() => {
                    sounds.playStamp();
                    onSelectLevel(lvl.key);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-amber-100 font-heading font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-all group-hover:shadow-md cursor-pointer"
                >
                  <span>Iniciar Missão</span>
                  <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </VintagePaperContainer>
    </div>
  );
}
