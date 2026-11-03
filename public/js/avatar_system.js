/**
 * ============================================================================
 * PORTAL LAB KIDS - STUDIO DE AVATARES ÉPICOS (DICEBEAR ENGINE v3)
 * ============================================================================
 * Sistema interativo de personalização de avatares infantis (1º ao 5º Ano)
 * Inspirado nas melhores experiências gamificadas (Duolingo / Roblox Kids).
 */

const DUOLINGO_AVATAR_PRESETS = {
  // 16 Heróis e Mascotes pré-calibrados para crianças
  heroes: [
    { name: 'Robô Léo', style: 'bottts', seed: 'LeoRobot', bg: '38bdf8', icon: '🤖', title: 'Mascote do Lab' },
    { name: 'Ninja da Tabuada', style: 'adventurer', seed: 'Ninja', bg: '0f172a', icon: '⚔️', title: 'Mestre do Cálculo' },
    { name: 'Astro Kid', style: 'bottts', seed: 'AstroKid', bg: '818cf8', icon: '🚀', title: 'Explorador Cósmico' },
    { name: 'Dra. Sofia', style: 'lorelei', seed: 'Sofia', bg: 'ffd5dc', icon: '🔬', title: 'Cientista Mirim' },
    { name: 'Dino Rex', style: 'fun-emoji', seed: 'DinoRex', bg: 'c1f2c7', icon: '🦖', title: 'Fera Pré-Histórica' },
    { name: 'Mago dos Números', style: 'adventurer', seed: 'MagoArcano', bg: 'c0aedd', icon: '🧙‍♂️', title: 'Arcano da Lógica' },
    { name: 'Pixel Gamer', style: 'pixel-art', seed: 'RetroKnight', bg: 'fbbf24', icon: '👾', title: 'Campeão 8-Bit' },
    { name: 'Princesa Sofia', style: 'lorelei', seed: 'PrincesaSofia', bg: 'ffdfbf', icon: '👑', title: 'Guardiã dos Livros' },
    { name: 'Cyber Titan', style: 'bottts', seed: 'CyberTitan', bg: '334155', icon: '🛡️', title: 'Defensor Blindado' },
    { name: 'Guerreira Luna', style: 'adventurer', seed: 'LunaValente', bg: 'f43f5e', icon: '🗡️', title: 'Aventureira Real' },
    { name: 'Super Sorriso', style: 'big-smile', seed: 'SuperSmile', bg: 'fff0b3', icon: '😄', title: 'Mestre da Alegria' },
    { name: 'Detetive Neo', style: 'pixel-art', seed: 'NeoDetetive', bg: '1e293b', icon: '🕵️', title: 'Mestre do Mistério' },
    { name: 'Kitsune Ninja', style: 'fun-emoji', seed: 'KitsuneFox', bg: 'fed7aa', icon: '🦊', title: 'Velocidade Pura' },
    { name: 'Capitão Lucas', style: 'avataaars', seed: 'CapitaoLucas', bg: '60a5fa', icon: '⚡', title: 'Líder da Turma' },
    { name: 'Estrela Beatriz', style: 'lorelei', seed: 'BiaEstrela', bg: 'e879f9', icon: '🎨', title: 'Criatividade Máxima' },
    { name: 'Monstrinho Pop', style: 'fun-emoji', seed: 'PartyMonster', bg: '4ade80', icon: '🎉', title: 'Folião do Lab' }
  ],

  // Tribos / Estilos artísticos do DiceBear
  styles: [
    { id: 'bottts', label: 'Robôs 3D 🤖', icon: '🤖', desc: 'Tecnológicos e velozes' },
    { id: 'adventurer', label: 'Aventureiros RPG ⚔️', icon: '⚔️', desc: 'Heróis de capa e espada' },
    { id: 'pixel-art', label: 'Pixel Art 8-Bit 👾', icon: '👾', desc: 'Retrô estilo arcade' },
    { id: 'lorelei', label: 'Desenho Animado 🎨', icon: '🎨', desc: 'Estilo anime moderno' },
    { id: 'big-smile', label: 'Big Smile 😄', icon: '😄', desc: 'Expressões ultra felizes' },
    { id: 'fun-emoji', label: 'Mascotes Divertidos 🌟', icon: '🌟', desc: 'Criaturas engraçadas' },
    { id: 'avataaars', label: 'Colegas da Escola 🧑', icon: '🧑', desc: 'Estudantes reais' }
  ],

  // Personagens pré-configurados por Tribo
  styleSeeds: {
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
    ],
    'avataaars': [
      { id: 'CapitaoLucas', label: 'Lucas 👦' },
      { id: 'MariaClara', label: 'Maria Clara 👧' },
      { id: 'GabrielPro', label: 'Gabriel 🧢' },
      { id: 'JuliaStar', label: 'Júlia 🌸' },
      { id: 'PedroGamer', label: 'Pedro 🎮' },
      { id: 'AnaLuz', label: 'Ana ✨' }
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

  const style = config.style || 'bottts';
  const seed = config.seed || 'LeoRobot';
  const bg = (config.bg || '38bdf8').replace('#', '');

  let url = `/api/avatar-proxy?style=${encodeURIComponent(style)}&seed=${encodeURIComponent(seed)}`;
  if (bg && bg !== 'transparent') {
    url += `&backgroundColor=${bg}`;
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
