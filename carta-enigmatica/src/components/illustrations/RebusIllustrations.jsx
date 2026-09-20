import React from 'react';
import { motion } from 'framer-motion';

export const RebusIllustrations = {
  // 1. Carta / Envelope rosa aberto com cartinha
  carta: ({ className = "w-10 h-10" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.1, rotate: -3 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
    >
      {/* Carta de papel dentro */}
      <rect x="20" y="8" width="24" height="28" rx="2" fill="#ffffff" stroke="#334155" strokeWidth="1.8" />
      <line x1="24" y1="14" x2="38" y2="14" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="19" x2="36" y2="19" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="24" x2="40" y2="24" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="29" x2="32" y2="29" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
      {/* Envelope rosa */}
      <polygon points="12,24 52,24 54,54 10,54" fill="#f472b6" stroke="#831843" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="12,24 32,38 52,24" fill="#fbcfe8" stroke="#831843" strokeWidth="1.8" strokeLinejoin="round" />
      <polygon points="10,54 32,36 54,54" fill="#ec4899" stroke="#831843" strokeWidth="1.8" strokeLinejoin="round" />
    </motion.svg>
  ),

  // 2. Rei com coroa e manto
  rei: ({ className = "w-11 h-11" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.12, rotate: 3 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
    >
      {/* Manto vermelho */}
      <path d="M14 56C14 44 20 40 32 40C44 40 50 44 50 56Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="2" />
      <path d="M26 42C28 46 36 46 38 42" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
      {/* Barba branca */}
      <ellipse cx="32" cy="42" rx="14" ry="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.8" />
      {/* Rosto */}
      <circle cx="32" cy="30" r="11" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.8" />
      {/* Olhos e bochechas */}
      <circle cx="28" cy="29" r="1.5" fill="#431407" />
      <circle cx="36" cy="29" r="1.5" fill="#431407" />
      <circle cx="25" cy="33" r="2" fill="#fca5a5" opacity="0.7" />
      <circle cx="39" cy="33" r="2" fill="#fca5a5" opacity="0.7" />
      <path d="M29 34C31 36 33 36 35 34" stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round" />
      {/* Bigode */}
      <path d="M25 36C28 35 32 37 32 39C32 37 36 35 39 36" stroke="#cbd5e1" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Coroa de ouro */}
      <polygon points="22,22 24,10 32,16 40,10 42,22" fill="#facc15" stroke="#854d0e" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="24" cy="10" r="1.5" fill="#ef4444" />
      <circle cx="32" cy="16" r="1.5" fill="#3b82f6" />
      <circle cx="40" cy="10" r="1.5" fill="#ef4444" />
    </motion.svg>
  ),

  // 3. Primeiro (1º 3D estilizado)
  primeiro: ({ className = "w-10 h-10" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.15, rotate: -4 }}
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
    >
      <text
        x="12"
        y="46"
        fill="#f43f5e"
        stroke="#881337"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fontFamily="'Outfit', sans-serif"
        fontWeight="900"
        fontSize="44"
      >
        1
      </text>
      <text
        x="38"
        y="26"
        fill="#f43f5e"
        stroke="#881337"
        strokeWidth="2.5"
        fontFamily="'Outfit', sans-serif"
        fontWeight="900"
        fontSize="22"
      >
        º
      </text>
      <line x1="38" y1="30" x2="52" y2="30" stroke="#881337" strokeWidth="3" strokeLinecap="round" />
    </motion.svg>
  ),

  // 4. Bruxa sorridente de chapéu roxo
  bruxa: ({ className = "w-11 h-11" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.12, rotate: 4 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.6, ease: "easeInOut" }}
    >
      {/* Cabelo loiro desgrenhado */}
      <path d="M16 38C14 46 22 52 24 50M48 38C50 46 42 52 40 50" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
      {/* Rosto verde claro */}
      <ellipse cx="32" cy="38" rx="12" ry="11" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.8" />
      {/* Nariz pontudo */}
      <path d="M30 36L36 38L30 41" stroke="#a16207" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      {/* Olhos e sorriso */}
      <circle cx="27" cy="34" r="1.5" fill="#422006" />
      <circle cx="37" cy="34" r="1.5" fill="#422006" />
      <path d="M26 42C29 45 35 45 38 42" stroke="#422006" strokeWidth="1.8" strokeLinecap="round" />
      {/* Chapéu roxo pontudo */}
      <polygon points="12,30 32,6 52,30" fill="#9333ea" stroke="#581c87" strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="32" cy="30" rx="22" ry="4" fill="#a855f7" stroke="#581c87" strokeWidth="1.8" />
      <rect x="22" y="27" width="20" height="3" fill="#facc15" />
    </motion.svg>
  ),

  // 5. Copo de suco refrescante com limão e canudo
  suco: ({ className = "w-9 h-11" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.1, rotate: -3 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.3, ease: "easeInOut" }}
    >
      {/* Canudo listrado */}
      <line x1="36" y1="6" x2="48" y2="4" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      <line x1="28" y1="28" x2="36" y2="6" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
      {/* Copo */}
      <polygon points="18,18 46,18 40,56 24,56" fill="#fef08a" opacity="0.85" stroke="#64748b" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Líquido */}
      <polygon points="20,24 44,24 39,54 25,54" fill="#facc15" />
      {/* Gelo */}
      <rect x="28" y="28" width="8" height="8" rx="2" fill="#ffffff" opacity="0.6" stroke="#e2e8f0" strokeWidth="1" />
      {/* Rodela de limão no topo */}
      <circle cx="44" cy="18" r="8" fill="#84cc16" stroke="#4d7c0f" strokeWidth="1.5" />
      <circle cx="44" cy="18" r="6" fill="#bef264" />
      <line x1="44" y1="12" x2="44" y2="24" stroke="#4d7c0f" strokeWidth="1" />
      <line x1="38" y1="18" x2="50" y2="18" stroke="#4d7c0f" strokeWidth="1" />
    </motion.svg>
  ),

  // 6. Mosca com asinhas vibrando
  mosca: ({ className = "w-11 h-10" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.15 }}
      animate={{ y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
    >
      {/* Asas com animação de vibração */}
      <motion.ellipse
        cx="24"
        cy="22"
        rx="10"
        ry="6"
        fill="#e0e7ff"
        opacity="0.8"
        stroke="#6366f1"
        strokeWidth="1.5"
        animate={{ rotate: [-8, 8, -8] }}
        transition={{ repeat: Infinity, duration: 0.15 }}
      />
      <motion.ellipse
        cx="40"
        cy="22"
        rx="10"
        ry="6"
        fill="#e0e7ff"
        opacity="0.8"
        stroke="#6366f1"
        strokeWidth="1.5"
        animate={{ rotate: [8, -8, 8] }}
        transition={{ repeat: Infinity, duration: 0.15 }}
      />
      {/* Perninhas */}
      <line x1="20" y1="40" x2="12" y2="48" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="42" x2="18" y2="52" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <line x1="44" y1="40" x2="52" y2="48" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <line x1="40" y1="42" x2="46" y2="52" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      {/* Corpo roxo / verde escuro */}
      <ellipse cx="32" cy="38" rx="8" ry="12" fill="#334155" stroke="#0f172a" strokeWidth="1.8" />
      {/* Cabeça e olhos vermelhos */}
      <circle cx="32" cy="26" r="6" fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
      <circle cx="28" cy="24" r="3" fill="#dc2626" />
      <circle cx="36" cy="24" r="3" fill="#dc2626" />
    </motion.svg>
  ),

  // 7. Pote de mel com mel escorrendo
  mel: ({ className = "w-11 h-11" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.1, rotate: 2 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.7, ease: "easeInOut" }}
    >
      {/* Colher de pau inclinada */}
      <line x1="40" y1="36" x2="56" y2="12" stroke="#b45309" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="54" cy="14" r="4" fill="#f59e0b" />
      {/* Pote de barro */}
      <path d="M16 28C14 46 18 56 32 56C46 56 50 46 48 28Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      <ellipse cx="32" cy="26" rx="16" ry="5" fill="#d97706" stroke="#78350f" strokeWidth="2" />
      {/* Mel dourado escorrendo */}
      <path d="M22 28C24 38 28 42 30 34C32 28 36 40 42 30" fill="none" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
      {/* Rótulo / Favo */}
      <circle cx="32" cy="44" r="5" fill="#fde68a" stroke="#b45309" strokeWidth="1.2" />
      <text x="32" y="47" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#78350f">MEL</text>
    </motion.svg>
  ),

  // 8. Fatia de pizza apetitosa
  pizza: ({ className = "w-11 h-10" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.12, rotate: -4 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
    >
      {/* Borda da pizza */}
      <path d="M12 28C26 22 46 22 56 34" stroke="#d97706" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Fatia de queijo */}
      <polygon points="14,28 54,34 32,58" fill="#fde047" stroke="#ca8a04" strokeWidth="2" strokeLinejoin="round" />
      {/* Molho e queijo derretido */}
      <circle cx="28" cy="36" r="3.5" fill="#dc2626" />
      <circle cx="42" cy="40" r="3" fill="#dc2626" />
      <circle cx="34" cy="48" r="2.5" fill="#15803d" />
      <circle cx="36" cy="38" r="1.5" fill="#1e293b" />
    </motion.svg>
  ),

  // 9. Bebê engatinhando
  bebe: ({ className = "w-12 h-10" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.1, rotate: 3 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.1, ease: "easeInOut" }}
    >
      {/* Macacão azul bebê engatinhando */}
      <ellipse cx="36" cy="42" rx="14" ry="9" fill="#93c5fd" stroke="#2563eb" strokeWidth="1.8" />
      {/* Perninhas e pezinhos */}
      <ellipse cx="48" cy="45" rx="5" ry="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
      {/* Bracinho */}
      <path d="M26 40L24 50" stroke="#93c5fd" strokeWidth="5" strokeLinecap="round" />
      <circle cx="24" cy="51" r="2.5" fill="#fed7aa" />
      {/* Cabeça redonda com cachinho */}
      <circle cx="22" cy="30" r="9" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.8" />
      <path d="M22 21C20 18 24 18 23 20" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Olhinho feliz e bochecha */}
      <circle cx="18" cy="29" r="1.5" fill="#431407" />
      <circle cx="16" cy="33" r="2" fill="#fca5a5" opacity="0.8" />
      <path d="M19 33C21 35 23 35 24 34" stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round" />
    </motion.svg>
  ),

  // 10. Chulé (Pezinho com fumacinha verde ondulante)
  chule: ({ className = "w-11 h-11" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.12 }}
    >
      {/* Fumacinha verde ondulante de cheiro com animação */}
      <motion.path
        d="M20 22C18 16 26 12 22 6M30 20C28 14 36 10 32 4M40 24C38 18 46 14 42 8"
        fill="none"
        stroke="#84cc16"
        strokeWidth="2.5"
        strokeLinecap="round"
        animate={{
          d: [
            "M20 22C18 16 26 12 22 6M30 20C28 14 36 10 32 4M40 24C38 18 46 14 42 8",
            "M22 22C24 16 18 12 20 6M32 20C34 14 28 10 30 4M42 24C44 18 38 14 40 8",
            "M20 22C18 16 26 12 22 6M30 20C28 14 36 10 32 4M40 24C38 18 46 14 42 8"
          ]
        }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
      />
      {/* Pé descalço */}
      <path
        d="M16 44C16 34 26 34 32 38L42 42C48 44 50 50 46 54C42 58 20 58 16 52Z"
        fill="#fed7aa"
        stroke="#ea580c"
        strokeWidth="2"
      />
      {/* Dedos do pé */}
      <circle cx="46" cy="46" r="3.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2" />
      <circle cx="49" cy="50" r="2.8" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2" />
    </motion.svg>
  ),

  // 11. Grão de feijão
  feijao: ({ className = "w-8 h-8" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.15, rotate: -8 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
    >
      <path
        d="M20 18C12 24 12 42 22 50C32 58 48 56 52 44C56 32 50 20 40 16C30 12 24 14 20 18Z"
        fill="#854d0e"
        stroke="#451a03"
        strokeWidth="2.5"
      />
      {/* Olho do feijão (hilo branco) */}
      <ellipse cx="28" cy="34" rx="3.5" ry="7" fill="#fef3c7" stroke="#78350f" strokeWidth="1.2" />
    </motion.svg>
  ),

  // 12. Sandália roxa de tiras
  sandalia: ({ className = "w-11 h-10" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.1, rotate: 3 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
    >
      {/* Sola */}
      <ellipse cx="32" cy="48" rx="22" ry="7" fill="#701a75" stroke="#4a044e" strokeWidth="2" />
      {/* Tiras cruzadas da sandália */}
      <path d="M18 44C20 32 30 32 34 44" stroke="#c026d3" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M28 44C32 30 42 30 46 44" stroke="#c026d3" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M14 46C14 36 22 36 26 46" stroke="#d946ef" strokeWidth="3" strokeLinecap="round" fill="none" />
    </motion.svg>
  ),

  // 13. Armário de madeira
  armario: ({ className = "w-10 h-11" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.1, rotate: -2 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
    >
      {/* Corpo do armário */}
      <rect x="14" y="10" width="36" height="46" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      {/* Divisória do meio */}
      <line x1="32" y1="10" x2="32" y2="56" stroke="#78350f" strokeWidth="2" />
      {/* Molduras das portas */}
      <rect x="18" y="16" width="10" height="34" fill="#d97706" stroke="#78350f" strokeWidth="1.2" />
      <rect x="36" y="16" width="10" height="34" fill="#d97706" stroke="#78350f" strokeWidth="1.2" />
      {/* Puxadores dourados */}
      <circle cx="28" cy="33" r="1.8" fill="#fde047" stroke="#78350f" strokeWidth="1" />
      <circle cx="36" cy="33" r="1.8" fill="#fde047" stroke="#78350f" strokeWidth="1" />
      {/* Pés do armário */}
      <rect x="16" y="56" width="6" height="4" fill="#78350f" />
      <rect x="42" y="56" width="6" height="4" fill="#78350f" />
    </motion.svg>
  ),

  // 14. Livro aberto
  livro: ({ className = "w-11 h-9" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.12, rotate: 2 }}
      animate={{ y: [0, -2, 0] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
    >
      {/* Capa roxa */}
      <path d="M8 44C20 40 32 44 32 44C32 44 44 40 56 44L56 20C44 16 32 20 32 20C32 20 20 16 8 20Z" fill="#7c3aed" stroke="#4c1d95" strokeWidth="2" />
      {/* Páginas brancas abertas */}
      <path d="M10 42C20 38 31 41 31 41L31 18C20 15 10 18 10 18Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      <path d="M54 42C44 38 33 41 33 41L33 18C44 15 54 18 54 18Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
      {/* Linhas simulando texto */}
      <line x1="14" y1="24" x2="27" y2="23" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="14" y1="28" x2="27" y2="27" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="14" y1="32" x2="25" y2="31" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="37" y1="23" x2="50" y2="24" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="37" y1="27" x2="50" y2="28" stroke="#94a3b8" strokeWidth="1.2" />
      <line x1="37" y1="31" x2="48" y2="32" stroke="#94a3b8" strokeWidth="1.2" />
    </motion.svg>
  ),

  // 15. Surfista na onda
  surfista: ({ className = "w-14 h-11" }) => (
    <motion.svg
      viewBox="0 0 64 64"
      className={className}
      whileHover={{ scale: 1.15 }}
      animate={{ y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
    >
      {/* Onda azul com crista */}
      <path
        d="M4 54C14 44 26 40 40 46C48 50 56 46 60 54Z"
        fill="#38bdf8"
        stroke="#0284c7"
        strokeWidth="2"
      />
      <path
        d="M20 46C24 42 32 40 38 44"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Prancha rosa inclinada */}
      <motion.ellipse
        cx="34"
        cy="44"
        rx="18"
        ry="4"
        fill="#f43f5e"
        stroke="#9f1239"
        strokeWidth="1.8"
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />
      {/* Surfista (menino em cima da prancha) */}
      <circle cx="34" cy="22" r="4.5" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.2" />
      {/* Tronco */}
      <line x1="34" y1="27" x2="34" y2="36" stroke="#fed7aa" strokeWidth="4" strokeLinecap="round" />
      {/* Shorts amarelo */}
      <line x1="32" y1="36" x2="36" y2="36" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
      {/* Pernas dobradas em equilíbrio */}
      <path d="M31 38L28 43M36 38L40 43" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" />
      {/* Braços abertos para equilíbrio */}
      <path d="M26 28L34 30L42 27" stroke="#fed7aa" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </motion.svg>
  ),

  // Extras para cartas adicionais
  leao: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="18" fill="#f59e0b" />
      <circle cx="32" cy="32" r="13" fill="#fde68a" />
      <circle cx="28" cy="30" r="1.5" fill="#451a03" />
      <circle cx="36" cy="30" r="1.5" fill="#451a03" />
      <polygon points="32,34 30,32 34,32" fill="#78350f" />
    </svg>
  ),

  macaco: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="16" fill="#78350f" />
      <ellipse cx="32" cy="34" rx="11" ry="8" fill="#fed7aa" />
      <circle cx="28" cy="32" r="1.5" fill="#000" />
      <circle cx="36" cy="32" r="1.5" fill="#000" />
      <circle cx="16" cy="28" r="5" fill="#78350f" />
      <circle cx="48" cy="28" r="5" fill="#78350f" />
    </svg>
  ),

  banana: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <path d="M14 44C20 48 44 48 50 20C42 34 26 36 14 44Z" fill="#facc15" stroke="#a16207" strokeWidth="2" />
    </svg>
  ),

  elefante: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="34" r="16" fill="#94a3b8" />
      <circle cx="20" cy="30" r="10" fill="#64748b" />
      <circle cx="44" cy="30" r="10" fill="#64748b" />
      <path d="M32 36L32 50C32 54 36 54 36 50" stroke="#64748b" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="29" cy="32" r="1.5" fill="#000" />
      <circle cx="35" cy="32" r="1.5" fill="#000" />
    </svg>
  ),

  pipoca: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <polygon points="20,28 44,28 40,54 24,54" fill="#ef4444" stroke="#991b1b" strokeWidth="1.8" />
      <line x1="28" y1="28" x2="26" y2="54" stroke="#fff" strokeWidth="2" />
      <line x1="36" y1="28" x2="38" y2="54" stroke="#fff" strokeWidth="2" />
      <circle cx="24" cy="24" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
      <circle cx="32" cy="20" r="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
      <circle cx="40" cy="24" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
    </svg>
  ),

  sol: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="32" r="14" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="32"
          y1="12"
          x2="32"
          y2="6"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeLinecap="round"
          transform={`rotate(${angle} 32 32)`}
        />
      ))}
      <circle cx="28" cy="30" r="1.5" fill="#78350f" />
      <circle cx="36" cy="30" r="1.5" fill="#78350f" />
      <path d="M28 35C30 38 34 38 36 35" stroke="#78350f" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),

  mala: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <rect x="12" y="22" width="40" height="32" rx="4" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
      <path d="M24 22V14C24 12 26 10 28 10H36C38 10 40 12 40 14V22" stroke="#78350f" strokeWidth="2.5" fill="none" />
      <line x1="22" y1="22" x2="22" y2="54" stroke="#b45309" strokeWidth="2" strokeDasharray="3 2" />
      <line x1="42" y1="22" x2="42" y2="54" stroke="#b45309" strokeWidth="2" strokeDasharray="3 2" />
      <rect x="29" y="34" width="6" height="6" rx="1" fill="#78350f" />
    </svg>
  ),

  gato: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <circle cx="32" cy="36" r="16" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
      <polygon points="18,26 16,12 28,22" fill="#fde047" stroke="#ca8a04" strokeWidth="1.8" />
      <polygon points="46,26 48,12 36,22" fill="#fde047" stroke="#ca8a04" strokeWidth="1.8" />
      <circle cx="26" cy="34" r="2" fill="#78350f" />
      <circle cx="38" cy="34" r="2" fill="#78350f" />
      <polygon points="32,38 30,36 34,36" fill="#ef4444" />
      <path d="M28 42C30 44 34 44 36 42" stroke="#78350f" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <line x1="16" y1="36" x2="24" y2="37" stroke="#78350f" strokeWidth="1.2" />
      <line x1="48" y1="36" x2="40" y2="37" stroke="#78350f" strokeWidth="1.2" />
    </svg>
  ),

  bola: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </radialGradient>
      </defs>
      {/* Esfera com gradiente 3D */}
      <circle cx="32" cy="32" r="22" fill="url(#ballGrad)" stroke="#1e293b" strokeWidth="2.5" />
      {/* Painel central pentagonal */}
      <polygon points="32,22 41,28 38,38 26,38 23,28" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
      {/* Costuras e painéis periféricos */}
      <line x1="32" y1="22" x2="32" y2="10" stroke="#1e293b" strokeWidth="2" />
      <line x1="41" y1="28" x2="52" y2="22" stroke="#1e293b" strokeWidth="2" />
      <line x1="38" y1="38" x2="48" y2="48" stroke="#1e293b" strokeWidth="2" />
      <line x1="26" y1="38" x2="16" y2="48" stroke="#1e293b" strokeWidth="2" />
      <line x1="23" y1="28" x2="12" y2="22" stroke="#1e293b" strokeWidth="2" />
      <polygon points="32,10 24,10 18,15 23,20 32,10" fill="#3b82f6" opacity="0.8" />
      <polygon points="41,28 52,22 54,32 46,34" fill="#ef4444" opacity="0.8" />
      {/* Brilho esférico */}
      <ellipse cx="24" cy="20" rx="5" ry="3" fill="#ffffff" opacity="0.6" transform="rotate(-30 24 20)" />
    </svg>
  ),

  casa: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <polygon points="32,10 12,28 52,28" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
      <rect x="18" y="28" width="28" height="24" fill="#fef3c7" stroke="#78350f" strokeWidth="2" />
      <rect x="28" y="38" width="8" height="14" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
      <rect x="22" y="32" width="6" height="6" fill="#60a5fa" stroke="#1e40af" strokeWidth="1" />
      <rect x="36" y="32" width="6" height="6" fill="#60a5fa" stroke="#1e40af" strokeWidth="1" />
    </svg>
  ),

  bota: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <path d="M22 14H36V36L48 44C52 47 50 54 44 54H22V14Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      <rect x="20" y="50" width="30" height="4" fill="#451a03" />
      <circle cx="30" cy="24" r="2" fill="#fde047" />
      <circle cx="30" cy="32" r="2" fill="#fde047" />
    </svg>
  ),

  sorvete: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <polygon points="22,30 42,30 32,56" fill="#d97706" stroke="#92400e" strokeWidth="1.8" />
      <line x1="27" y1="36" x2="37" y2="46" stroke="#b45309" strokeWidth="1.2" />
      <line x1="37" y1="36" x2="27" y2="46" stroke="#b45309" strokeWidth="1.2" />
      <circle cx="32" cy="24" r="12" fill="#ec4899" stroke="#be185d" strokeWidth="1.8" />
      <circle cx="28" cy="18" r="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
      <circle cx="32" cy="12" r="3.5" fill="#ef4444" />
    </svg>
  ),

  pato: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <ellipse cx="28" cy="40" rx="16" ry="12" fill="#facc15" stroke="#a16207" strokeWidth="2" />
      <circle cx="40" cy="26" r="9" fill="#facc15" stroke="#a16207" strokeWidth="2" />
      <polygon points="48,26 58,28 48,32" fill="#f97316" stroke="#c2410c" strokeWidth="1.2" />
      <circle cx="42" cy="24" r="1.5" fill="#000" />
    </svg>
  ),

  // Novos ícones clássicos da carta das férias
  boi: ({ className = "w-11 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <ellipse cx="36" cy="38" rx="18" ry="14" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      <circle cx="20" cy="28" r="10" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      {/* Chifres */}
      <path d="M16 20C14 14 18 10 20 12M24 20C26 14 22 10 20 12" stroke="#fef3c7" strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="14" cy="32" rx="5" ry="3.5" fill="#fed7aa" />
      <circle cx="18" cy="26" r="1.5" fill="#000" />
      {/* Patinhas */}
      <rect x="24" y="48" width="4" height="10" fill="#78350f" rx="1" />
      <rect x="32" y="48" width="4" height="10" fill="#78350f" rx="1" />
      <rect x="42" y="48" width="4" height="10" fill="#78350f" rx="1" />
      <rect x="48" y="48" width="4" height="10" fill="#78350f" rx="1" />
    </svg>
  ),

  maca: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Maçã vermelha */}
      <path d="M22 18C14 18 10 28 10 38C10 50 22 56 32 56C42 56 54 50 54 38C54 28 50 18 42 18C36 18 32 22 32 22C32 22 28 18 22 18Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
      {/* Cabinho e folhinha */}
      <path d="M32 20C32 14 36 10 40 8" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Minhoca fofa saindo da maçã */}
      <path d="M22 18C20 12 26 8 26 14" stroke="#84cc16" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <circle cx="26" cy="11" r="2.5" fill="#a3e635" />
      <circle cx="25" cy="10" r="0.8" fill="#000" />
    </svg>
  ),

  mao: ({ className = "w-10 h-11" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Mão ilustrada detalhada com 5 dedos e palma */}
      <path
        d="M20 56 C18 48 18 38 18 32 C18 29 21.5 29 22 32 L22 22 C22 19 25.5 19 25.5 22 L25.5 14 C25.5 11 29 11 29 14 L29 17 C29 14 32.5 14 32.5 17 L32.5 24 C32.5 21 36 21 36 24 L36 38 C37 42 45 44 43 52 C42 56 36 57 20 56 Z"
        fill="#fed7aa"
        stroke="#ea580c"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Unhas e linhas suaves */}
      <ellipse cx="22" cy="23" rx="1.5" ry="1" fill="#fdba74" />
      <ellipse cx="25.5" cy="15" rx="1.5" ry="1" fill="#fdba74" />
      <ellipse cx="29" cy="18" rx="1.5" ry="1" fill="#fdba74" />
      <ellipse cx="34.5" cy="25" rx="1.5" ry="1" fill="#fdba74" />
      <path d="M23 40 C27 43 33 43 37 39" stroke="#c2410c" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M26 44 C29 46 33 46 36 44" stroke="#c2410c" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  ),

  nariz: ({ className = "w-9 h-11" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <path d="M26 12C28 22 30 32 36 42C38 45 36 50 30 50C24 50 20 45 20 42" stroke="#ea580c" strokeWidth="3" strokeLinecap="round" fill="#fed7aa" />
      <circle cx="26" cy="44" r="2.5" fill="#9a3412" />
    </svg>
  ),

  alho: ({ className = "w-11 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Cabeça de alho e dente de alho ilustrados */}
      <path
        d="M32 12 C29 18 18 24 14 36 C10 48 22 54 32 54 C42 54 54 48 50 36 C46 24 35 18 32 12 Z"
        fill="#fdf4ff"
        stroke="#9333ea"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M24 24 C20 32 20 46 24 53" stroke="#c084fc" strokeWidth="1.5" fill="none" />
      <path d="M40 24 C44 32 44 46 40 53" stroke="#c084fc" strokeWidth="1.5" fill="none" />
      <path d="M32 14 L32 54" stroke="#d8b4fe" strokeWidth="1.5" fill="none" />
      {/* Raízes e caule */}
      <path d="M28 54 L26 59 M32 54 L32 60 M36 54 L38 59" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 12 C33 9 36 8 36 6" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  ),

  passaro: ({ className = "w-11 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <ellipse cx="32" cy="36" rx="16" ry="10" fill="#c084fc" stroke="#7e22ce" strokeWidth="2" />
      <circle cx="46" cy="26" r="7" fill="#c084fc" stroke="#7e22ce" strokeWidth="2" />
      <polygon points="52,26 60,28 52,30" fill="#f97316" />
      <circle cx="48" cy="24" r="1.5" fill="#000" />
      {/* Asa */}
      <path d="M24 36C26 24 38 24 40 36Z" fill="#a855f7" stroke="#6b21a8" strokeWidth="1.8" />
      {/* Rabinho */}
      <polygon points="16,36 6,32 10,40" fill="#a855f7" stroke="#6b21a8" strokeWidth="1.5" />
    </svg>
  ),

  nozes: ({ className = "w-11 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <ellipse cx="26" cy="34" rx="12" ry="10" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      <ellipse cx="40" cy="36" rx="11" ry="9" fill="#d97706" stroke="#78350f" strokeWidth="2" />
      <path d="M20 30C26 34 26 38 22 42M36 32C42 36 42 40 38 44" stroke="#78350f" strokeWidth="1.8" fill="none" />
    </svg>
  ),

  dado: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Dado 3D branco com pontinhos */}
      <polygon points="20,12 44,12 54,24 30,24" fill="#f1f5f9" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="10,24 30,24 30,52 10,52" fill="#ffffff" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="30,24 54,24 54,52 30,52" fill="#e2e8f0" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
      {/* Pontinhos */}
      <circle cx="20" cy="32" r="2" fill="#000" />
      <circle cx="20" cy="44" r="2" fill="#000" />
      <circle cx="42" cy="38" r="2" fill="#000" />
    </svg>
  ),

  asa: ({ className = "w-12 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Asa de anjo azul clara com penas */}
      <path
        d="M10 44C16 38 24 36 36 34C48 32 56 22 56 12C44 14 34 22 26 28C18 34 10 40 10 44Z"
        fill="#bae6fd"
        stroke="#0284c7"
        strokeWidth="2"
      />
      <path d="M22 36C28 32 36 30 46 24M16 42C24 38 32 36 42 30" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),

  planta: ({ className = "w-10 h-11" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Vasinho marrom */}
      <polygon points="20,38 44,38 40,56 24,56" fill="#b45309" stroke="#78350f" strokeWidth="2" />
      <rect x="18" y="34" width="28" height="5" rx="1" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
      {/* Folhas verdes */}
      <path d="M32 34V18" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="24" cy="22" rx="7" ry="4" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" transform="rotate(-30 24 22)" />
      <ellipse cx="40" cy="22" rx="7" ry="4" fill="#22c55e" stroke="#15803d" strokeWidth="1.5" transform="rotate(30 40 22)" />
      <ellipse cx="32" cy="14" rx="4" ry="7" fill="#4ade80" stroke="#15803d" strokeWidth="1.5" />
    </svg>
  ),

  trilho: ({ className = "w-12 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Trilhos de trem inclinados */}
      <line x1="8" y1="46" x2="52" y2="18" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      <line x1="16" y1="54" x2="60" y2="26" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
      {/* Dormentes de madeira */}
      <line x1="10" y1="42" x2="20" y2="54" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
      <line x1="22" y1="34" x2="32" y2="46" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
      <line x1="34" y1="26" x2="44" y2="38" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
      <line x1="46" y1="18" x2="56" y2="30" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
    </svg>
  ),

  bico: ({ className = "w-11 h-9" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Pássaro simpático com bico amarelo bem destacado */}
      <circle cx="22" cy="32" r="14" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
      <circle cx="20" cy="28" r="3" fill="#0f172a" />
      <circle cx="19" cy="27" r="1" fill="#ffffff" />
      <circle cx="16" cy="34" r="2.5" fill="#f472b6" opacity="0.6" />
      {/* Grande bico amarelo brilhante */}
      <path
        d="M26 24 L56 34 L26 42 Z"
        fill="#facc15"
        stroke="#ca8a04"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <line x1="26" y1="33" x2="54" y2="34" stroke="#eab308" strokeWidth="1.8" />
    </svg>
  ),

  pipa: ({ className = "w-11 h-11" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Pipa colorida */}
      <polygon points="32,8 48,26 32,46 16,26" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
      <polygon points="32,8 48,26 32,26" fill="#f43f5e" />
      <polygon points="16,26 32,26 32,46" fill="#facc15" />
      <line x1="32" y1="8" x2="32" y2="46" stroke="#0f172a" strokeWidth="1.2" />
      <line x1="16" y1="26" x2="48" y2="26" stroke="#0f172a" strokeWidth="1.2" />
      {/* Rabiola com laços */}
      <path d="M32 46C28 52 36 56 32 62" stroke="#475569" strokeWidth="1.5" fill="none" />
      <circle cx="30" cy="50" r="1.5" fill="#f43f5e" />
      <circle cx="34" cy="56" r="1.5" fill="#facc15" />
    </svg>
  ),

  chave: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>
      {/* Cabeça ornamental da chave */}
      <circle cx="22" cy="22" r="14" fill="url(#goldGrad)" stroke="#854d0e" strokeWidth="2.5" />
      <circle cx="22" cy="22" r="6" fill="#ffffff" stroke="#854d0e" strokeWidth="2" />
      {/* Haste metálica com dentes */}
      <rect x="29" y="27" width="26" height="5" rx="2" fill="url(#goldGrad)" stroke="#854d0e" strokeWidth="2" transform="rotate(45 29 27)" />
      {/* Dentes do segredo */}
      <rect x="44" y="42" width="5" height="7" rx="1" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" transform="rotate(45 44 42)" />
      <rect x="50" y="48" width="5" height="5" rx="1" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" transform="rotate(45 50 48)" />
      {/* Brilho da chave */}
      <circle cx="16" cy="16" r="2" fill="#ffffff" />
    </svg>
  ),

  cha: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Pires */}
      <ellipse cx="32" cy="50" rx="22" ry="5" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
      {/* Xícara */}
      <path d="M16 30C16 46 22 50 32 50C42 50 48 46 48 30H16Z" fill="#38bdf8" stroke="#0284c7" strokeWidth="2.5" />
      {/* Asa da xícara */}
      <path d="M48 32C55 32 55 42 46 44" stroke="#0284c7" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Fumaça quente saindo do chá */}
      <path d="M26 24C24 18 28 14 26 8" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M34 22C32 16 36 12 34 6" stroke="#94a3b8" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),

  vela: ({ className = "w-9 h-11" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Corpo da vela */}
      <rect x="22" y="28" width="20" height="28" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
      <ellipse cx="32" cy="28" rx="10" ry="3" fill="#fef9c3" stroke="#ca8a04" strokeWidth="1.5" />
      {/* Pavio */}
      <line x1="32" y1="28" x2="32" y2="20" stroke="#451a03" strokeWidth="2" strokeLinecap="round" />
      {/* Chama viva */}
      <path d="M32 8C36 14 38 18 36 22C34 25 30 25 28 22C26 18 28 14 32 8Z" fill="#f97316" stroke="#c2410c" strokeWidth="1.5" />
      <circle cx="32" cy="18" r="3" fill="#fef08a" />
    </svg>
  ),

  meia: ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Meia listrada aconchegante */}
      <path d="M22 10H38V34L46 42C50 46 48 54 42 54H24C20 54 18 48 22 42L22 10Z" fill="#f43f5e" stroke="#be123c" strokeWidth="2" strokeLinejoin="round" />
      {/* Calcanhar e ponta */}
      <path d="M20 42C24 42 26 48 24 54C20 54 18 48 20 42Z" fill="#38bdf8" />
      <path d="M42 54C46 54 48 50 46 46L42 54Z" fill="#38bdf8" />
      {/* Listras */}
      <line x1="22" y1="18" x2="38" y2="18" stroke="#ffffff" strokeWidth="3" />
      <line x1="22" y1="26" x2="38" y2="26" stroke="#ffffff" strokeWidth="3" />
    </svg>
  ),

  copo: ({ className = "w-9 h-11" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Copo com suco e gelo */}
      <polygon points="18,16 46,16 42,56 22,56" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
      <polygon points="20,24 44,24 41,54 23,54" fill="#fb923c" />
      {/* Cubos de gelo */}
      <rect x="26" y="28" width="6" height="6" rx="1" fill="#ffffff" opacity="0.8" />
      <rect x="33" y="34" width="6" height="6" rx="1" fill="#ffffff" opacity="0.8" />
      {/* Canudo */}
      <line x1="36" y1="10" x2="28" y2="46" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),

  mesa: ({ className = "w-11 h-9" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Mesa de madeira aconchegante com toalha xadrez */}
      <polygon points="8,26 56,26 50,34 14,34" fill="#d97706" stroke="#78350f" strokeWidth="2" strokeLinejoin="round" />
      <polygon points="18,26 46,26 42,34 22,34" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" opacity="0.9" />
      {/* Pernas da mesa arredondadas */}
      <rect x="14" y="34" width="5" height="20" rx="1.5" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
      <rect x="45" y="34" width="5" height="20" rx="1.5" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
      <rect x="22" y="34" width="4" height="17" rx="1" fill="#92400e" opacity="0.8" />
      <rect x="38" y="34" width="4" height="17" rx="1" fill="#92400e" opacity="0.8" />
    </svg>
  ),

  pao: ({ className = "w-11 h-9" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <ellipse cx="32" cy="34" rx="20" ry="12" fill="#f59e0b" stroke="#92400e" strokeWidth="2" />
      {/* Cortinhos do pão francês */}
      <path d="M22 28C26 34 26 36 24 40M32 26C36 34 36 36 34 42M42 28C46 34 46 36 44 40" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  ),

  rato: ({ className = "w-11 h-9" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <ellipse cx="36" cy="38" rx="16" ry="10" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
      <circle cx="24" cy="34" r="8" fill="#94a3b8" stroke="#475569" strokeWidth="1.8" />
      {/* Orelhas grandes redondas */}
      <circle cx="28" cy="24" r="6" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
      <circle cx="28" cy="24" r="3.5" fill="#f472b6" />
      <circle cx="20" cy="33" r="1.5" fill="#000" />
      {/* Bigodes e focinho */}
      <circle cx="16" cy="36" r="1.5" fill="#f43f5e" />
      <line x1="16" y1="34" x2="8" y2="32" stroke="#475569" strokeWidth="1.2" />
      <line x1="16" y1="38" x2="8" y2="40" stroke="#475569" strokeWidth="1.2" />
      {/* Rabinho fino */}
      <path d="M52 38C58 36 60 42 58 46" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  ),

  numero20: ({ className = "w-12 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      {/* Número 20 em 3D amarelo com contorno laranja */}
      <text
        x="6"
        y="46"
        fill="#fde047"
        stroke="#ca8a04"
        strokeWidth="3"
        fontFamily="'Outfit', sans-serif"
        fontWeight="900"
        fontSize="38"
        strokeLinejoin="round"
      >
        20
      </text>
    </svg>
  ),

  numero1: ({ className = "w-9 h-10" }) => (
    <svg viewBox="0 0 64 64" className={className}>
      <text
        x="18"
        y="46"
        fill="#84cc16"
        stroke="#3f6212"
        strokeWidth="3"
        fontFamily="'Outfit', sans-serif"
        fontWeight="900"
        fontSize="44"
        strokeLinejoin="round"
      >
        1
      </text>
    </svg>
  )
};

// AI Generated illustrations with high resolution sticker style
export const AI_AVAILABLE_IMAGES = new Set([
  'alho',
  'asa',
  'bico',
  'boi',
  'bola',
  'casa',
  'chave',
  'copo',
  'dado',
  'gato',
  'maca',
  'mao',
  'mesa',
  'nariz',
  'nozes',
  'pao',
  'passaro',
  'pato',
  'pipa',
  'planta',
  'rato',
  'sorvete',
  'trilho'
]);

export const RebusImageOrSvg = ({ name, className = "w-10 h-10" }) => {
  const [pathIdx, setPathIdx] = React.useState(0);
  const [hasError, setHasError] = React.useState(false);

  const cleanKey = React.useMemo(() => {
    if (!name) return '';
    return name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }, [name]);

  const candidatePaths = React.useMemo(() => [
    `./assets/enigmas/${cleanKey}.jpg`,
    `/games/carta-enigmatica/assets/enigmas/${cleanKey}.jpg`,
    `/assets/enigmas/${cleanKey}.jpg`,
    `assets/enigmas/${cleanKey}.jpg`
  ], [cleanKey]);

  if (AI_AVAILABLE_IMAGES.has(cleanKey) && !hasError && pathIdx < candidatePaths.length) {
    return (
      <img
        src={candidatePaths[pathIdx]}
        alt={name}
        className={`${className} object-contain rounded-md drop-shadow-sm select-none pointer-events-none`}
        onError={() => {
          if (pathIdx + 1 < candidatePaths.length) {
            setPathIdx(prev => prev + 1);
          } else {
            setHasError(true);
          }
        }}
        loading="eager"
      />
    );
  }

  const Component = RebusIllustrations[cleanKey] || RebusIllustrations[name];
  if (!Component) {
    return (
      <div className={`inline-flex items-center justify-center p-1 bg-amber-100 rounded border border-amber-600 text-xs font-bold ${className}`}>
        {name?.toUpperCase()}
      </div>
    );
  }

  return <Component className={className} />;
};

export const getRebusIllustration = (name, className) => {
  return <RebusImageOrSvg name={name} className={className} />;
};

export default RebusIllustrations;


