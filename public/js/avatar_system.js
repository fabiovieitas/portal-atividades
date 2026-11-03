/**
 * ============================================================================
 * PORTAL LAB KIDS - STUDIO DE AVATARES ÉPICOS (ENGINE 4.0)
 * ============================================================================
 * Redesenhado especialmente para crianças do 1º ao 5º Ano:
 * - Modo 1: Heróis & Mascotes Épicos (Robô Léo, Ninja, Dino Rex, Magos, etc.)
 * - Modo 2: Criador de Aluno(a) (Cabelos infantis, bonés, óculos, sorrisos e moletons)
 * - Efeito Figurinha Gamer 3D (Sticker com contorno suave e iluminação)
 * - Coroa Flutuante de Grande Campeão (TOP 1 da Turma/Escola)
 * - Zero conflito de estilos (O herói nunca é substituído sem autorização)
 * ============================================================================
 */

const DUOLINGO_AVATAR_PRESETS = {
  // 1. HERÓIS E MASCOTES COLECIONÁVEIS (Desbloqueio por XP da Temporada)
  heroes: [
    // --- NÍVEL 1: INICIAIS (Disponíveis para todos os alunos) ---
    { id: 'leo_robot', name: 'Robô Léo', style: 'bottts', seed: 'LeoRobot', bg: '38bdf8', icon: '🤖', title: 'Mascote Oficial do Lab', requiredXP: 0, badge: 'Inicial' },
    { id: 'astro_kid', name: 'Astro Kid', style: 'bottts', seed: 'AstroKid', bg: '818cf8', icon: '🚀', title: 'Explorador Espacial', requiredXP: 0, badge: 'Inicial' },
    { id: 'dra_sofia', name: 'Dra. Sofia', style: 'lorelei', seed: 'Sofia', bg: 'ffd5dc', icon: '🔬', title: 'Cientista Mirim', requiredXP: 0, badge: 'Inicial' },
    { id: 'super_sorriso', name: 'Super Sorriso', style: 'big-smile', seed: 'SuperSmile', bg: 'fbbf24', icon: '😄', title: 'Mestre da Alegria', requiredXP: 0, badge: 'Inicial' },
    { id: 'lucas_lider', name: 'Capitão Lucas', style: 'avataaars', seed: 'CapitaoLucas', bg: '60a5fa', icon: '⚡', title: 'Líder da Turma', requiredXP: 0, badge: 'Inicial' },

    // --- NÍVEL 2: EXPLORADORES (50 a 100 XP) ---
    { id: 'pixel_gamer', name: 'Pixel Gamer', style: 'pixel-art', seed: 'RetroKnight', bg: 'fbbf24', icon: '👾', title: 'Campeão 8-Bit', requiredXP: 50, reqDesc: 'Alcance 50 XP' },
    { id: 'dino_rex', name: 'Dino Rex', style: 'fun-emoji', seed: 'DinoRex', bg: '10b981', icon: '🦖', title: 'Fera Pré-Histórica', requiredXP: 100, reqDesc: 'Alcance 100 XP' },

    // --- NÍVEL 3: MESTRES DO SABER (150 a 300 XP) ---
    { id: 'ninja_tabuada', name: 'Ninja da Tabuada', style: 'adventurer', seed: 'Ninja', bg: '0f172a', icon: '⚔️', title: 'Mestre do Cálculo', requiredXP: 150, reqDesc: 'Conquiste 150 XP' },
    { id: 'mago_numeros', name: 'Mago dos Números', style: 'adventurer', seed: 'MagoArcano', bg: 'c0aedd', icon: '🧙‍♂️', title: 'Arcano da Lógica', requiredXP: 250, reqDesc: 'Conquiste 250 XP' },
    { id: 'princesa_sofia', name: 'Princesa Sofia', style: 'lorelei', seed: 'PrincesaSofia', bg: 'ffdfbf', icon: '👑', title: 'Guardiã da Leitura', requiredXP: 300, reqDesc: 'Conquiste 300 XP' },

    // --- NÍVEL 4: GUARDIÕES SUPREMOS (450 a 750 XP) ---
    { id: 'detetive_neo', name: 'Detetive Neo', style: 'pixel-art', seed: 'NeoDetetive', bg: '1e293b', icon: '🕵️', title: 'Investigador Cyber', requiredXP: 450, reqDesc: 'Conquiste 450 XP' },
    { id: 'cyber_titan', name: 'Cyber Titan', style: 'bottts', seed: 'CyberTitan', bg: '334155', icon: '🛡️', title: 'Defensor Blindado', requiredXP: 600, reqDesc: 'Conquiste 600 XP' },
    { id: 'kitsune_ninja', name: 'Raposa Kitsune', style: 'fun-emoji', seed: 'KitsuneFox', bg: 'f97316', icon: '🦊', title: 'Raposa Veloz', requiredXP: 750, reqDesc: 'Conquiste 750 XP' },

    // --- NÍVEL 5: LENDA DO LAB KIDS (1000+ XP) ---
    { id: 'guerreira_luna', name: 'Guerreira Luna', style: 'adventurer', seed: 'LunaValente', bg: 'f43f5e', icon: '🗡️', title: 'Heroína Lendária', requiredXP: 1000, reqDesc: 'Lenda do Lab (1000 XP)' }
  ],

  // 2. MODELOS BASE DE ALUNOS (Modo Criador Aluno(a))
  studentPresets: [
    { name: 'Lucas Gamer', seed: 'CapitaoLucas', top: 'hat', clothing: 'hoodie', hairColor: '2c1b18', skinColor: 'edb98a', icon: '👦' },
    { name: 'Maria Clara', seed: 'MariaClara', top: 'bun', clothing: 'graphicShirt', hairColor: '4a312c', skinColor: 'ffdbb4', icon: '👧' },
    { name: 'Gabriel Afro', seed: 'GabrielAfro', top: 'fro', clothing: 'hoodie', hairColor: '2c1b18', skinColor: '614335', icon: '🧑‍🦱' },
    { name: 'Bia Estrela', seed: 'BiaEstrela', top: 'curly', clothing: 'collarAndSweater', hairColor: 'c93305', skinColor: 'ffdbb4', icon: '✨' },
    { name: 'Pedro Radical', seed: 'PedroGamer', top: 'shortCurly', clothing: 'graphicShirt', hairColor: 'b58143', skinColor: 'd08b5b', icon: '🧢' },
    { name: 'Ana Luz', seed: 'AnaLuz', top: 'straight01', clothing: 'hoodie', hairColor: 'f59797', skinColor: 'edb98a', icon: '🌸' }
  ],

  // 3. CABELOS E PENTEADOS INFANTIS
  hairStyles: [
    { id: 'shortFlat', label: 'Curto Clássico 👦', icon: '👦' },
    { id: 'shortCurly', label: 'Cachos Curtinhos 🧑‍🦱', icon: '🧑‍🦱' },
    { id: 'curly', label: 'Cachos com Volume 🌀', icon: '🌀' },
    { id: 'fro', label: 'Black Power Poderoso ✊', icon: '✊' },
    { id: 'dreads', label: 'Dreads Estilosos 🧑‍🦱', icon: '🧑‍🦱' },
    { id: 'bun', label: 'Coque Estudante 👧', icon: '👧' },
    { id: 'bob', label: 'Chanel Moderno 💇', icon: '💇' },
    { id: 'straight01', label: 'Liso Longo 👩', icon: '👩' },
    { id: 'curvy', label: 'Ondulado Divertido 🌊', icon: '🌊' },
    { id: 'hat', label: 'Boné Gamer Virado 🧢', icon: '🧢' },
    { id: 'winterHat1', label: 'Gorro Quentinho ❄️', icon: '❄️' }
  ],

  // 4. CORES DE CABELO
  hairColors: [
    { id: '2c1b18', label: 'Preto Ônix', hex: '#2c1b18' },
    { id: '4a312c', label: 'Castanho Escuro', hex: '#4a312c' },
    { id: '724133', label: 'Castanho Chocolate', hex: '#724133' },
    { id: 'b58143', label: 'Castanho Dourado', hex: '#b58143' },
    { id: 'd6b370', label: 'Loiro Solar', hex: '#d6b370' },
    { id: 'f59797', label: 'Rosa Anime 🌸', hex: '#f59797' },
    { id: 'c93305', label: 'Ruivo Fogo 🔥', hex: '#c93305' },
    { id: 'e8e1e1', label: 'Platinado / Prata ⚡', hex: '#e8e1e1' }
  ],

  // 5. OLHOS E EXPRESSÕES INFANTIS
  eyes: [
    { id: 'happy', label: 'Super Feliz 😄', icon: '😄' },
    { id: 'wink', label: 'Piscadinha Gamer 😉', icon: '😉' },
    { id: 'hearts', label: 'Olhos de Coração 😍', icon: '😍' },
    { id: 'squint', label: 'Focado / Detetive 🧐', icon: '🧐' },
    { id: 'winkWacky', label: 'Careta Brincalhona 😜', icon: '😜' },
    { id: 'default', label: 'Curioso / Tranquilo 🙂', icon: '👀' },
    { id: 'surprised', label: 'Surpreso / Uau! 😲', icon: '😲' },
    { id: 'closed', label: 'Zen / Descansando 😌', icon: '😌' }
  ],

  // 6. BOCAS E SORRISOS
  mouth: [
    { id: 'smile', label: 'Sorrisão Amigo 😊', icon: '😊' },
    { id: 'twinkle', label: 'Radiante / Estrela 🌟', icon: '🌟' },
    { id: 'tongue', label: 'Língua de Fora 😋', icon: '😋' },
    { id: 'eating', label: 'Comendo Cookies 🍪', icon: '🍪' },
    { id: 'default', label: 'Sorriso Suave 🙂', icon: '🙂' },
    { id: 'serious', label: 'Concentrado 😐', icon: '😐' }
  ],

  // 7. ÓCULOS E ACESSÓRIOS
  accessories: [
    { id: 'none', label: 'Sem Óculos 🚫', icon: '🚫' },
    { id: 'round', label: 'Redondos / Harry Potter 🤓', icon: '👓' },
    { id: 'wayfarers', label: 'Óculos Gamer Estiloso 😎', icon: '🕶️' },
    { id: 'prescription01', label: 'Óculos de Grau Moderno 👓', icon: '👓' },
    { id: 'prescription02', label: 'Óculos Retrô 👓', icon: '👓' },
    { id: 'sunglasses', label: 'Óculos de Sol Praia 🏖️', icon: '🕶️' },
    { id: 'eyepatch', label: 'Tapa-Olho Pirata 🏴‍☠️', icon: '🏴‍☠️' }
  ],

  // 8. ROUPAS E TRAJES INFANTIS
  clothing: [
    { id: 'hoodie', label: 'Moletom Gamer com Capuz 🧥', icon: '🧥' },
    { id: 'graphicShirt', label: 'Camiseta Estampada 🎮', icon: '🎮' },
    { id: 'shirtCrewNeck', label: 'Camiseta Básica 👕', icon: '👕' },
    { id: 'overall', label: 'Macacão de Aventura 👖', icon: '👖' },
    { id: 'collarAndSweater', label: 'Uniforme Escolar 👔', icon: '👔' },
    { id: 'blazerAndShirt', label: 'Formatura / Gala 🎓', icon: '🎓' }
  ],

  // 9. CORES DE ROUPAS
  clothesColors: [
    { id: '0284c7', label: 'Azul Lab Kids', hex: '#0284c7' },
    { id: '7c3aed', label: 'Roxo Gamer', hex: '#7c3aed' },
    { id: 'ef4444', label: 'Vermelho Rubi', hex: '#ef4444' },
    { id: '10b981', label: 'Verde Esmeralda', hex: '#10b981' },
    { id: 'f59e0b', label: 'Amarelo Ouro', hex: '#f59e0b' },
    { id: 'ec4899', label: 'Rosa Pink', hex: '#ec4899' },
    { id: '1e293b', label: 'Preto Grafite', hex: '#1e293b' },
    { id: 'ffffff', label: 'Branco Puro', hex: '#ffffff' }
  ],

  // 10. TONS DE PELE INCLUSIVOS
  skinColors: [
    { id: 'ffdbb4', label: 'Claro Neutro', hex: '#ffdbb4' },
    { id: 'edb98a', label: 'Claro Dourado', hex: '#edb98a' },
    { id: 'f8d25c', label: 'Dourado Quente', hex: '#f8d25c' },
    { id: 'fd9841', label: 'Canela Suave', hex: '#fd9841' },
    { id: 'd08b5b', label: 'Moreno Natural', hex: '#d08b5b' },
    { id: 'ae5d29', label: 'Moreno Médio', hex: '#ae5d29' },
    { id: '614335', label: 'Negro / Ébano', hex: '#614335' }
  ],

  // 11. CENÁRIOS DE PODER / FUNDO VIBRANTE
  bgColors: [
    { id: '38bdf8', label: 'Céu Azul ☁️', hex: '#38bdf8' },
    { id: '818cf8', label: 'Galáxia Espacial 🚀', hex: '#818cf8' },
    { id: 'fbbf24', label: 'Ouro Campeão 🏆', hex: '#fbbf24' },
    { id: '10b981', label: 'Floresta Mágica 🌿', hex: '#10b981' },
    { id: 'f43f5e', label: 'Rubi de Fogo 🔥', hex: '#f43f5e' },
    { id: 'c0aedd', label: 'Roxo Arcano 🔮', hex: '#c0aedd' },
    { id: 'ffd5dc', label: 'Doce Algodão 🌸', hex: '#ffd5dc' },
    { id: '0f172a', label: 'Dojo Ninja 🥋', hex: '#0f172a' },
    { id: 'ffdfbf', label: 'Pêssego Solar ☀️', hex: '#ffdfbf' },
    { id: '1e3a8a', label: 'Azul Cósmico 🌌', hex: '#1e3a8a' }
  ]
};

/**
 * Constrói a URL do avatar de forma inteligente e sem quebrar estilos
 */
function buildDiceBearUrl(config = {}, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const style = config.style || 'bottts';
  const seed = config.seed || 'LeoRobot';
  const bg = (config.bg || '38bdf8').replace('#', '');

  let url = `/api/avatar-proxy?style=${encodeURIComponent(style)}&seed=${encodeURIComponent(seed)}`;
  if (bg && bg !== 'transparent') {
    url += `&backgroundColor=${bg}`;
  }

  // Se for o estilo humano (avataaars), anexa os parâmetros de vestuário e rosto
  if (style === 'avataaars') {
    if (config.top) url += `&top=${encodeURIComponent(config.top)}`;
    if (config.hairColor) url += `&hairColor=${encodeURIComponent(config.hairColor.replace('#', ''))}`;
    if (config.skinColor) url += `&skinColor=${encodeURIComponent(config.skinColor.replace('#', ''))}`;
    if (config.clothing) url += `&clothing=${encodeURIComponent(config.clothing)}`;
    if (config.clothesColor) url += `&clothesColor=${encodeURIComponent(config.clothesColor.replace('#', ''))}`;
    if (config.eyes) url += `&eyes=${encodeURIComponent(config.eyes)}`;
    if (config.mouth) url += `&mouth=${encodeURIComponent(config.mouth)}`;
    if (config.accessories) url += `&accessories=${encodeURIComponent(config.accessories)}`;
  }

  return url;
}

/**
 * Gera a tag HTML com o Avatar no Estilo Figurinha 3D Gamer
 */
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false, isChampion = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch(e){ config = {}; }
  }
  const url = buildDiceBearUrl(config, isTilePreview);
  const borderRadius = isTilePreview ? '16px' : '26px';
  const stickerFilter = isTilePreview 
    ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' 
    : 'drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 5px #ffffff) drop-shadow(0 14px 28px rgba(0,0,0,0.32))';

  const hasCrown = Boolean(isChampion || config.isChampion);
  const crownHtml = hasCrown ? `
    <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); font-size: ${Math.max(22, Math.round(size * 0.28))}px; filter: drop-shadow(0 4px 10px rgba(245,158,11,0.6)); z-index: 10; animation: crownFloat 2.5s infinite ease-in-out;">
      👑
    </div>
  ` : '';

  return `
    <div style="position: relative; display: inline-block; width: ${size}px; height: ${size}px; vertical-align: middle;">
      ${crownHtml}
      <img src="${url}" width="${size}" height="${size}" 
           style="border-radius: ${borderRadius}; display: block; object-fit: contain; filter: ${stickerFilter}; transition: transform 0.25s ease;" 
           alt="Avatar Lab Kids" />
    </div>
  `;
}

// Injeção de Animação de Flutuação da Coroa
if (typeof document !== 'undefined') {
  const crownStyleId = 'lab-avatar-crown-style';
  if (!document.getElementById(crownStyleId)) {
    const st = document.createElement('style');
    st.id = crownStyleId;
    st.textContent = `
      @keyframes crownFloat {
        0%, 100% { transform: translateX(-50%) translateY(0) rotate(-3deg); }
        50% { transform: translateX(-50%) translateY(-6px) rotate(3deg); }
      }
    `;
    document.head.appendChild(st);
  }
}

// Exportações Globais
if (typeof window !== 'undefined') {
  window.DUOLINGO_AVATAR_PRESETS = DUOLINGO_AVATAR_PRESETS;
  window.generateAvatarSVG = generateAvatarSVG;
  window.buildDiceBearUrl = buildDiceBearUrl;
}

if (typeof module !== 'undefined') {
  module.exports = { DUOLINGO_AVATAR_PRESETS, generateAvatarSVG, buildDiceBearUrl };
}
