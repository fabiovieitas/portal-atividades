import React from 'react';
import { motion } from 'framer-motion';
import { Award, Printer, RotateCcw, X, ShieldCheck, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function CertificateModal({
  investigatorName = 'INVESTIGADOR',
  levelTitle = '',
  onClose = () => {},
  onRestart = () => {}
}) {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    sounds.playKeyPress();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-[#faf6ed] text-amber-950 p-6 sm:p-10 rounded-2xl border-4 border-amber-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)] my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-900 border border-amber-700/40 transition-colors print:hidden"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Border Frame */}
        <div className="border-4 border-double border-amber-800/80 p-5 sm:p-8 rounded-xl relative">
          {/* Corner Rosettes */}
          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-amber-700 border-2 border-amber-200 flex items-center justify-center text-white text-xs">✦</div>
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-amber-700 border-2 border-amber-200 flex items-center justify-center text-white text-xs">✦</div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-amber-700 border-2 border-amber-200 flex items-center justify-center text-white text-xs">✦</div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-amber-700 border-2 border-amber-200 flex items-center justify-center text-white text-xs">✦</div>

          {/* Certificate Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-700/50 text-amber-900 font-heading text-xs uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Agência Secreta de Investigadores</span>
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-3xl text-amber-950 tracking-wider uppercase">
              Certificado de Honra ao Mérito
            </h2>
            <p className="font-typewriter text-xs text-amber-800/80 mt-1 uppercase tracking-widest">
              Por Destreza e Raciocínio em Escape Room & Cartas Enigmáticas
            </p>
          </div>

          {/* Certificate Body */}
          <div className="text-center space-y-4 my-6">
            <p className="font-heading text-sm text-amber-900">
              Certificamos oficialmente que o(a) ilustre investigador(a)
            </p>

            {/* Name Banner */}
            <div className="py-2 px-6 inline-block border-b-4 border-amber-800 bg-amber-100/60 rounded-md">
              <span className="font-typewriter font-black text-2xl sm:text-3xl text-stamp-red uppercase tracking-wider">
                {investigatorName || 'AGENTE SECRETO'}
              </span>
            </div>

            <p className="font-serif text-sm sm:text-base text-amber-950 max-w-lg mx-auto leading-relaxed">
              desvendou com sucesso todos os enigmas secretos, superou os cadeados de todas as salas e desvendou a Frase Mestra do caso:
            </p>

            <div className="font-heading font-bold text-base sm:text-lg text-amber-900 bg-amber-200/50 p-2.5 rounded-lg border border-amber-700/30 inline-block">
              📜 {levelTitle}
            </div>
          </div>

          {/* Signatures and Wax Seal */}
          <div className="mt-8 pt-6 border-t-2 border-amber-800/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Date */}
            <div className="text-center sm:text-left">
              <span className="block text-xs font-mono text-amber-800/70">Data de Conclusão:</span>
              <span className="font-typewriter font-bold text-sm text-amber-950">{currentDate}</span>
            </div>

            {/* Golden Wax Seal */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 via-amber-600 to-amber-800 border-4 border-amber-200 shadow-lg flex flex-col items-center justify-center text-amber-950 rotate-[-6deg]">
              <Award className="w-7 h-7 text-yellow-100 drop-shadow" />
              <span className="text-[7px] font-black tracking-tighter uppercase text-white font-sans">OFICIAL</span>
            </div>

            {/* Inspector Signature */}
            <div className="text-center sm:text-right">
              <span className="block font-handwritten text-xl sm:text-2xl text-amber-900 rotate-[-4deg]">
                Inspetor Chefe Lab Kids
              </span>
              <span className="block text-[11px] font-typewriter text-amber-800/80 border-t border-amber-800/50 pt-0.5">
                Chancelaria de Mistérios
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-amber-100 font-heading font-bold text-sm shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Certificado</span>
          </button>

          <button
            onClick={() => {
              sounds.playStamp();
              onRestart();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stamp-green hover:bg-stamp-green-hover text-white font-heading font-bold text-sm shadow-md transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Escolher Outra Missão</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
