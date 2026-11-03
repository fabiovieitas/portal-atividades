/**
 * ============================================================================
 * PORTAL LAB KIDS - STUDIO DE AVATARES ÉPICOS (DICEBEAR ENGINE v3)
 * ============================================================================
 * Sistema completo de personalização estilo Duolingo:
 * - Acessórios e Óculos (Grau, Sol, Gamer, Pirata, Redondos)
 * - Expressões Faciais (Olhos felizes, piscadinha, corações, foco) e Bocas/Sorrisos
 * - Estilos e Cores de Cabelo (Cachos, Black Power, Dreads, Liso, Rosa Gamer, etc.)
 * - Tons de Pele Inclusivos para crianças
 * - Roupas e Cores (Moletom, Camiseta Gamer, Uniforme, Macacão)
 * - Cenários de Fundo Vibrantes
 * - Desbloqueio de Heróis Raros por XP e Conquistas
 */

const DUOLINGO_AVATAR_PRESETS = {
  // Heróis e Mascotes com mecânica de Desbloqueio por Conquista (XP)
  heroes: [
    // --- NÍVEL 1: AVATARES INICIAIS (DESBLOQUEADOS PARA TODOS) ---
    { name: 'Robô Léo', style: 'bottts', seed: 'LeoRobot', bg: '38bdf8', icon: '🤖', title: 'Mascote Oficial', requiredXP: 0, badge: 'Inicial' },
    { name: 'Astro Kid', style: 'bottts', seed: 'AstroKid', bg: '818cf8', icon: '🚀', title: 'Explorador Espacial', requiredXP: 0, badge: 'Inicial' },
    { name: 'Dra. Sofia', style: 'lorelei', seed: 'Sofia', bg: 'ffd5dc', icon: '🔬', title: 'Cientista Mirim', requiredXP: 0, badge: 'Inicial' },
    { name: 'Super Sorriso', style: 'big-smile', seed: 'SuperSmile', bg: 'fff0b3', icon: '😄', title: 'Mestre da Alegria', requiredXP: 0, badge: 'Inicial' },
    { name: 'Capitão Lucas', style: 'avataaars', seed: 'CapitaoLucas', bg: '60a5fa', icon: '⚡', title: 'Líder da Turma', requiredXP: 0, badge: 'Inicial' },

    // --- NÍVEL 2: EXPLORADORES (REQUER 50 A 100 XP) ---
    { name: 'Pixel Gamer', style: 'pixel-art', seed: 'RetroKnight', bg: 'fbbf24', icon: '👾', title: 'Campeão 8-Bit', requiredXP: 50, reqDesc: 'Alcance 50 XP' },
    { name: 'Dino Rex', style: 'fun-emoji', seed: 'DinoRex', bg: 'c1f2c7', icon: '🦖', title: 'Fera Pré-Histórica', requiredXP: 100, reqDesc: 'Alcance 100 XP' },

    // --- NÍVEL 3: MESTRES DO SABER (REQUER 150 A 300 XP) ---
    { name: 'Ninja da Tabuada', style: 'adventurer', seed: 'Ninja', bg: '0f172a', icon: '⚔️', title: 'Mestre do Cálculo', requiredXP: 150, reqDesc: 'Conquiste 150 XP' },
    { name: 'Mago dos Números', style: 'adventurer', seed: 'MagoArcano', bg: 'c0aedd', icon: '🧙‍♂️', title: 'Arcano da Lógica', requiredXP: 250, reqDesc: 'Conquiste 250 XP (Nível 3)' },
    { name: 'Princesa Sofia', style: 'lorelei', seed: 'PrincesaSofia', bg: 'ffdfbf', icon: '👑', title: 'Guardiã da Leitura', requiredXP: 300, reqDesc: 'Conquiste 300 XP' },

    // --- NÍVEL 4: GUARDIÕES SUPREMOS (REQUER 450 A 650 XP) ---
    { name: 'Detetive Neo', style: 'pixel-art', seed: 'NeoDetetive', bg: '1e293b', icon: '🕵️', title: 'Investigador Cyber', requiredXP: 450, reqDesc: 'Conquiste 450 XP' },
    { name: 'Cyber Titan', style: 'bottts', seed: 'CyberTitan', bg: '334155', icon: '🛡️', title: 'Defensor Blindado', requiredXP: 600, reqDesc: 'Conquiste 600 XP (Nível 4)' },
    { name: 'Kitsune Ninja', style: 'fun-emoji', seed: 'KitsuneFox', bg: 'fed7aa', icon: '🦊', title: 'Raposa Veloz', requiredXP: 750, reqDesc: 'Conquiste 750 XP' },

    // --- NÍVEL 5: LENDA DO LAB KIDS (REQUER 1000 XP) ---
    { name: 'Guerreira Luna', style: 'adventurer', seed: 'LunaValente', bg: 'f43f5e', icon: '🗡️', title: 'Heroína Lendária', requiredXP: 1000, reqDesc: 'Alcance Nível 5 (Lenda do Lab)' }
  ],

  // 1. ÓCULOS E ACESSÓRIOS (Estilo Duolingo)
  accessories: [
    { id: 'none', label: 'Sem Óculos', icon: '🚫' },
    { id: 'round', label: 'Redondos 🤓', icon: '👓' },
    { id: 'prescription01', label: 'Grau Moderno 👓', icon: '👓' },
    { id: 'prescription02', label: 'Grau Retrô 👓', icon: '👓' },
    { id: 'sunglasses', label: 'De Sol Estiloso 😎', icon: '🕶️' },
    { id: 'wayfarers', label: 'Gamer Wayfarer 🕶️', icon: '🕶️' },
    { id: 'eyepatch', label: 'Tapa-Olho Pirata 🏴‍☠️', icon: '🏴‍☠️' }
  ],

  // 2. OLHOS E EXPRESSÕES (Estilo Duolingo)
  eyes: [
    { id: 'default', label: 'Padrão 🙂', icon: '👀' },
    { id: 'happy', label: 'Super Feliz 😄', icon: '😄' },
    { id: 'wink', label: 'Piscadinha 😉', icon: '😉' },
    { id: 'hearts', label: 'Apaixonado 😍', icon: '😍' },
    { id: 'surprised', label: 'Surpreso 😲', icon: '😲' },
    { id: 'squint', label: 'Focado / Detetive 🧐', icon: '🧐' },
    { id: 'winkWacky', label: 'Brincalhão 😜', icon: '😜' },
    { id: 'closed', label: 'Descansando 😌', icon: '😌' }
  ],

  // 3. BOCAS E SORRISOS
  mouth: [
    { id: 'smile', label: 'Sorridente 😊', icon: '😊' },
    { id: 'twinkle', label: 'Radiante 🌟', icon: '🌟' },
    { id: 'tongue', label: 'Língua de Fora 😋', icon: '😋' },
    { id: 'default', label: 'Tranquilo 🙂', icon: '🙂' },
    { id: 'serious', label: 'Concentrado 😐', icon: '😐' },
    { id: 'eating', label: 'Lanche Gostoso 🍪', icon: '🍪' }
  ],

  // 4. CABELOS & PENTEADOS
  hairStyles: [
    { id: 'shortFlat', label: 'Curto Clássico 👦', icon: '👦' },
    { id: 'shortCurly', label: 'Cachos Curtos 🧑‍🦱', icon: '🧑‍🦱' },
    { id: 'curly', label: 'Cachos Volumosos 🌀', icon: '🌀' },
    { id: 'fro', label: 'Black Power ✊', icon: '✊' },
    { id: 'dreads', label: 'Dreads Estilosos 🧑‍🦱', icon: '🧑‍🦱' },
    { id: 'bun', label: 'Coque Estudante 👧', icon: '👧' },
    { id: 'bob', label: 'Chanel Moderno 💇', icon: '💇' },
    { id: 'straight01', label: 'Liso Longo 👩', icon: '👩' },
    { id: 'curvy', label: 'Ondulado 🌊', icon: '🌊' },
    { id: 'hat', label: 'Boné Radical 🧢', icon: '🧢' },
    { id: 'winterHat1', label: 'Gorro de Inverno ❄️', icon: '❄️' }
  ],

  // 5. CORES DE CABELO
  hairColors: [
    { id: '2c1b18', label: 'Preto Ônix', hex: '#2c1b18' },
    { id: '4a312c', label: 'Castanho Escuro', hex: '#4a312c' },
    { id: '724133', label: 'Castanho Chocolate', hex: '#724133' },
    { id: 'b58143', label: 'Castanho Dourado', hex: '#b58143' },
    { id: 'd6b370', label: 'Loiro Solar', hex: '#d6b370' },
    { id: 'f59797', label: 'Rosa Anime 🌸', hex: '#f59797' },
    { id: 'c93305', label: 'Ruivo Fogo 🔥', hex: '#c93305' },
    { id: 'e8e1e1', label: 'Platinado / Branco ⚡', hex: '#e8e1e1' }
  ],

  // 6. TONS DE PELE INCLUSIVOS
  skinColors: [
    { id: 'ffdbb4', label: 'Claro Neutro', hex: '#ffdbb4' },
    { id: 'edb98a', label: 'Claro Dourado', hex: '#edb98a' },
    { id: 'f8d25c', label: 'Dourado Quente', hex: '#f8d25c' },
    { id: 'fd9841', label: 'Canela Suave', hex: '#fd9841' },
    { id: 'd08b5b', label: 'Moreno Natural', hex: '#d08b5b' },
    { id: 'ae5d29', label: 'Moreno Médio', hex: '#ae5d29' },
    { id: '614335', label: 'Negro / Ébano', hex: '#614335' }
  ],

  // 7. ROUPAS E TRAJES
  clothing: [
    { id: 'hoodie', label: 'Moletom com Capuz 🧥', icon: '🧥' },
    { id: 'graphicShirt', label: 'Camiseta Gamer 🎮', icon: '🎮' },
    { id: 'shirtCrewNeck', label: 'Camiseta Básica 👕', icon: '👕' },
    { id: 'collarAndSweater', label: 'Uniforme Escolar 👔', icon: '👔' },
    { id: 'overall', label: 'Macacão Divertido 👖', icon: '👖' },
    { id: 'blazerAndShirt', label: 'Traje de Gala 🎓', icon: '🎓' }
  ],

  // 8. CORES DE ROUPAS
  clothesColors: [
    { id: '5199e4', label: 'Azul Lab Kids', hex: '#5199e4' },
    { id: '65c9ff', label: 'Azul Celeste', hex: '#65c9ff' },
    { id: 'ff5c5c', label: 'Vermelho Rubi', hex: '#ff5c5c' },
    { id: 'a7ffc4', label: 'Verde Menta', hex: '#a7ffc4' },
    { id: 'ffffb1', label: 'Amarelo Sol', hex: '#ffffb1' },
    { id: 'ff488e', label: 'Rosa Pink', hex: '#ff488e' },
    { id: '262e33', label: 'Preto Grafite', hex: '#262e33' },
    { id: 'ffffff', label: 'Branco Puro', hex: '#ffffff' }
  ],

  // Tribos / Estilos artísticos do DiceBear
  styles: [
    { id: 'avataaars', label: 'Colegas da Escola 🧑', icon: '🧑', desc: 'Personalização completa' },
    { id: 'bottts', label: 'Robôs 3D 🤖', icon: '🤖', desc: 'Tecnológicos e velozes' },
    { id: 'adventurer', label: 'Aventureiros RPG ⚔️', icon: '⚔️', desc: 'Heróis de capa e espada' },
    { id: 'pixel-art', label: 'Pixel Art 8-Bit 👾', icon: '👾', desc: 'Retrô estilo arcade' },
    { id: 'lorelei', label: 'Desenho Animado 🎨', icon: '🎨', desc: 'Estilo anime moderno' },
    { id: 'big-smile', label: 'Big Smile 😄', icon: '😄', desc: 'Expressões ultra felizes' },
    { id: 'fun-emoji', label: 'Mascotes Divertidos 🌟', icon: '🌟', desc: 'Criaturas engraçadas' }
  ],

  // Personagens pré-configurados por Tribo
  styleSeeds: {
    'avataaars': [
      { id: 'CapitaoLucas', label: 'Lucas 👦' },
      { id: 'MariaClara', label: 'Maria Clara 👧' },
      { id: 'GabrielPro', label: 'Gabriel 🧢' },
      { id: 'JuliaStar', label: 'Júlia 🌸' },
      { id: 'PedroGamer', label: 'Pedro 🎮' },
      { id: 'AnaLuz', label: 'Ana ✨' }
    ],
    'bottts': [
      { id: 'LeoRobot', label: 'Robô Léo 🤖' },
      { id: 'Sparky', label: 'Spark ⚡' },
      { id: 'AstroBot', label: 'AstroBot 🚀' },
      { id: 'CyberRex', label: 'CyberRex 🦖' },
      { id: 'Volt', label: 'Volt 💡' },
      { id: 'Gizmo', label: 'Gizmo ⚙️' },
      { id: 'Nexus', label: 'Nexus 🔮' },
      { id: 'TitanBot', label: 'Titan 🛡️' }
    ],
    'adventurer': [
      { id: 'Ninja', label: 'Ninja das Sombras ⚔️' },
      { id: 'MagoArcano', label: 'Mago dos Números 🧙‍♂️' },
      { id: 'LunaValente', label: 'Valente Guerreira 🗡️' },
      { id: 'Capitao', label: 'Capitão Aventura 🛡️' },
      { id: 'Arqueiro', label: 'Arqueiro Veloz 🏹' },
      { id: 'Paladina', label: 'Paladina da Luz ✨' },
      { id: 'Explorador', label: 'Explorador da Selva 🌿' },
      { id: 'Cavaleiro', label: 'Cavaleiro de Ouro 👑' }
    ],
    'pixel-art': [
      { id: 'RetroKnight', label: 'Gamer 8-Bit 👾' },
      { id: 'NeoDetetive', label: 'Detetive Neo 🕵️' },
      { id: 'Speedy', label: 'Speedster 🏃' },
      { id: 'ArcadePro', label: 'Arcade Pro 🕹️' },
      { id: 'BlockBoy', label: 'Block Hero 🧱' },
      { id: 'PixelGirl', label: 'Pixel Girl 🎀' }
    ],
    'lorelei': [
      { id: 'Sofia', label: 'Sofia Cientista 🔬' },
      { id: 'PrincesaSofia', label: 'Princesa Sofia 👑' },
      { id: 'LucasGamer', label: 'Lucas Gamer 🎧' },
      { id: 'BiaEstrela', label: 'Bia Criativa 🎨' },
      { id: 'ArthurFoco', label: 'Arthur Estudioso 📚' },
      { id: 'ManuelaArte', label: 'Manu Artista 🌈' }
    ],
    'big-smile': [
      { id: 'SuperSmile', label: 'Super Sorriso 😄' },
      { id: 'HappyKid', label: 'Alegria Pura 🌟' },
      { id: 'SmileStar', label: 'Estrela Sorridente ⭐' },
      { id: 'GiggleBoy', label: 'Risadinha 🎉' },
      { id: 'CheeryGirl', label: 'Super Animada 🎈' }
    ],
    'fun-emoji': [
      { id: 'DinoRex', label: 'Dino Rex 🦖' },
      { id: 'KitsuneFox', label: 'Kitsune Ninja 🦊' },
      { id: 'PartyMonster', label: 'Monstrinho Pop 👾' },
      { id: 'CoolCat', label: 'Gatinho Cool 😎' },
      { id: 'FireDragon', label: 'Dragão Fogo 🔥' },
      { id: 'CosmicPanda', label: 'Panda Po 🐼' }
    ]
  },

  // Cenários de fundo temáticos com cores vibrantes
  bgColors: [
    { id: '38bdf8', label: 'Céu Azul ☁️', hex: '#38bdf8' },
    { id: '818cf8', label: 'Galáxia Espacial 🚀', hex: '#818cf8' },
    { id: 'fbbf24', label: 'Ouro Campeão 🏆', hex: '#fbbf24' },
    { id: '10b981', label: 'Floresta Mágica 🌿', hex: '#10b981' },
    { id: 'f43f5e', label: 'Rubi Fogo 🔥', hex: '#f43f5e' },
    { id: 'c0aedd', label: 'Roxo Arcano 🔮', hex: '#c0aedd' },
    { id: 'ffd5dc', label: 'Doce Algodão 🌸', hex: '#ffd5dc' },
    { id: '0f172a', label: 'Dojo Ninja 🥋', hex: '#0f172a' },
    { id: 'ffdfbf', label: 'Pêssego Solar ☀️', hex: '#ffdfbf' },
    { id: '1e3a8a', label: 'Azul Cósmico 🌌', hex: '#1e3a8a' }
  ]
};

/**
 * Constrói a URL do avatar com DiceBear
 */
function buildDiceBearUrl(config = {}, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const style = config.style || 'avataaars';
  const seed = config.seed || 'CapitaoLucas';
  const bg = (config.bg || '38bdf8').replace('#', '');

  let url = `/api/avatar-proxy?style=${encodeURIComponent(style)}&seed=${encodeURIComponent(seed)}`;
  if (bg && bg !== 'transparent') {
    url += `&backgroundColor=${bg}`;
  }

  // Parâmetros de customização avançada Duolingo
  if (config.accessories) {
    url += `&accessories=${encodeURIComponent(config.accessories)}`;
  }
  if (config.eyes) {
    url += `&eyes=${encodeURIComponent(config.eyes)}`;
  }
  if (config.mouth) {
    url += `&mouth=${encodeURIComponent(config.mouth)}`;
  }
  if (config.top) {
    url += `&top=${encodeURIComponent(config.top)}`;
  }
  if (config.hairColor) {
    url += `&hairColor=${encodeURIComponent(config.hairColor.replace('#', ''))}`;
  }
  if (config.skinColor) {
    url += `&skinColor=${encodeURIComponent(config.skinColor.replace('#', ''))}`;
  }
  if (config.clothing) {
    url += `&clothing=${encodeURIComponent(config.clothing)}`;
  }
  if (config.clothesColor) {
    url += `&clothesColor=${encodeURIComponent(config.clothesColor.replace('#', ''))}`;
  }

  return url;
}

/**
 * Gera a tag <img> com o Avatar SVG
 */
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false) {
  const url = buildDiceBearUrl(config, isTilePreview);
  const borderRadius = isTilePreview ? '14px' : '24px';
  const dropShadow = isTilePreview ? 'none' : 'drop-shadow(0 15px 25px rgba(0,0,0,0.35))';

  return `<img src="${url}" width="${size}" height="${size}" style="border-radius: ${borderRadius}; display: block; margin: 0 auto; object-fit: contain; filter: ${dropShadow}; transition: transform 0.2s;" alt="Avatar do Aluno" />`;
}

// Exportações globais
if (typeof window !== 'undefined') {
  window.DUOLINGO_AVATAR_PRESETS = DUOLINGO_AVATAR_PRESETS;
  window.generateAvatarSVG = generateAvatarSVG;
  window.buildDiceBearUrl = buildDiceBearUrl;
}

if (typeof module !== 'undefined') {
  module.exports = { DUOLINGO_AVATAR_PRESETS, generateAvatarSVG, buildDiceBearUrl };
}
