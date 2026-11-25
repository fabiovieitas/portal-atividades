import React from 'react';
import { motion } from 'framer-motion';
import { Award, Printer, RotateCcw, X, ShieldCheck, Sparkles, Fingerprint, Lock, KeyRound, ScrollText } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function CertificateModal({
  investigatorName = 'INVESTIGADOR',
  levelTitle = '',
  onClose = () => {},
  onRestart = () => {}
}) {
  // Data atual formatada em pt-BR (dia, mês por extenso e ano)
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  // Número de protocolo gerado de forma determinística para dar autenticidade ao documento
  const protocol = `AGI-${new Date().getFullYear()}-${String(
    Math.abs(investigatorName.length * 7919 + levelTitle.length * 104729) % 900000 + 100000
  )}`;

  // Dispara o diálogo de impressão do navegador (permite salvar como PDF)
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
        {/* Botão de fechar (oculto na impressão) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-amber-200/80 hover:bg-amber-300 text-amber-900 border border-amber-700/40 transition-colors print:hidden"
          title="Fechar"
          aria-label="Fechar certificado"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Área imprimível do certificado */}
        <div id="printable-certificate" className="print:shadow-none print:border-0">
          {/* Moldura dupla do certificado */}
          <div className="border-4 border-double border-amber-800/80 p-5 sm:p-8 rounded-xl relative">
            {/* Rosetas nos cantos para um toque clássico */}
            <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-amber-700 border-2 border-amber-200 flex items-center justify-center text-white text-xs font-bold">✦</div>
            <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-amber-700 border-2 border-amber-200 flex items-center justify-center text-white text-xs font-bold">✦</div>
            <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-amber-700 border-2 border-amber-200 flex items-center justify-center text-white text-xs font-bold">✦</div>
            <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-amber-700 border-2 border-amber-200 flex items-center justify-center text-white text-xs font-bold">✦</div>

            {/* Cabeçalho do certificado */}
            <div className="text-center mb-6">
              {/* Selo oficial da Agência de Investigadores */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-700/50 text-amber-900 font-heading text-xs uppercase tracking-widest mb-3">
                <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 via-amber-600 to-amber-800 border border-amber-200 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-50" />
                </span>
                <span>Agência de Investigadores</span>
                <span className="text-amber-700/60">•</span>
                <span className="flex items-center gap-1 text-amber-800/90">
                  <Sparkles className="w-3 h-3" />
                  Selo Oficial
                </span>
              </div>

              <h2 className="font-heading font-black text-2xl sm:text-3xl text-amber-950 tracking-wider uppercase">
                Certificado de Honra ao Mérito
              </h2>
              <p className="font-typewriter text-xs text-amber-800/80 mt-1 uppercase tracking-widest">
                Por Destreza e Raciocínio em Escape Room &amp; Cartas Enigmáticas
              </p>

              {/* Faixa de emblemas temáticos */}
              <div className="mt-3 flex items-center justify-center gap-3 text-amber-700/70">
                <Fingerprint className="w-4 h-4" />
                <Lock className="w-4 h-4" />
                <KeyRound className="w-4 h-4" />
                <ScrollText className="w-4 h-4" />
              </div>
            </div>

            {/* Corpo do certificado */}
            <div className="text-center space-y-4 my-6">
              <p className="font-heading text-sm text-amber-900">
                Certificamos oficialmente que o(a) ilustre investigador(a)
              </p>

              {/* Faixa com o nome do agente */}
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

            {/* Assinaturas, data e selo de cera */}
            <div className="mt-8 pt-6 border-t-2 border-amber-800/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Data de conclusão */}
              <div className="text-center sm:text-left">
                <span className="block text-xs font-mono text-amber-800/70">Data de Conclusão:</span>
                <span className="font-typewriter font-bold text-sm text-amber-950">{currentDate}</span>
                <span className="block text-[10px] font-mono text-amber-700/60 mt-0.5">Protocolo {protocol}</span>
              </div>

              {/* Selo de cera dourado */}
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-yellow-500 via-amber-600 to-amber-800 border-4 border-amber-200 shadow-lg flex flex-col items-center justify-center text-amber-950 rotate-[-6deg]">
                <Award className="w-7 h-7 text-yellow-100 drop-shadow" />
                <span className="text-[7px] font-black tracking-tighter uppercase text-white font-sans">OFICIAL</span>
              </div>

              {/* Assinatura do inspetor */}
              <div className="text-center sm:text-right">
                <span className="block text-xs font-mono text-amber-800/70">Inspetor Chefe:</span>
                <span className="font-signature text-xl text-amber-950 block leading-none">A. Sherlock</span>
                <span className="block text-[10px] font-mono text-amber-700/60 mt-0.5">Agência de Investigadores</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de ação (ocultos na impressão) */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 print:hidden">
          {/* Botão de Imprimir / Salvar PDF */}
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-lg shadow-blue-500/30"
            title="Imprimir ou Salvar como PDF"
            aria-label="Imprimir ou Salvar certificado como PDF"
          >
            <Printer className="w-5 h-5" />
            Imprimir / Salvar PDF
          </button>

          {/* Botão de Reiniciar */}
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors shadow-lg shadow-amber-500/30"
            title="Reiniciar jogo"
            aria-label="Reiniciar jogo"
          >
            <RotateCcw className="w-5 h-5" />
            Reiniciar Jogo
          </button>
        </div>
      </motion.div>
    </div>
  );
}
