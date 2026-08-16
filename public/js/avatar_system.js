/**
 * Multi-Style DiceBear & Animated Avatar Engine
 * Supports:
 * - 🤖 Robôs & Androids (bottts)
 * - 🧙‍♂️ Aventureiros RPG (adventurer)
 * - 👾 Pixel Art Arcade (pixel-art)
 * - 🎨 Desenho Animado Persona (lorelei)
 * - 😀 Expressões Big Smile (big-smile)
 * - 🤪 Mascotes Fun Emoji (fun-emoji)
 * - 🧊 Voxel Art 3D (voxel-art)
 */

const DUOLINGO_AVATAR_PRESETS = {
  styles: [
    { id: 'bottts', label: 'Robôs 3D 🤖', icon: '🤖' },
    { id: 'adventurer', label: 'Aventureiros RPG 🧙‍♂️', icon: '🧙‍♂️' },
    { id: 'pixel-art', label: 'Pixel Art 8-Bit 👾', icon: '👾' },
    { id: 'lorelei', label: 'Desenho Animado 🎨', icon: '🎨' },
    { id: 'big-smile', label: 'Big Smile 😀', icon: '😀' },
    { id: 'fun-emoji', label: 'Mascotes Fun 🤪', icon: '🤪' },
    { id: 'voxel-art', label: 'Voxel 3D 🧊', icon: '🧊' }
  ],

  // Random seed presets per style to inspire students
  styleSeeds: {
    'bottts': [
      { id: 'Spark', label: 'Spark ⚡' },
      { id: 'RoboTron', label: 'RoboTron 🤖' },
      { id: 'Byte', label: 'Byte 💻' },
      { id: 'Cyber', label: 'Cyber 👓' },
      { id: 'Alpha', label: 'Alpha 🚀' },
      { id: 'Volt', label: 'Volt ⚡' },
      { id: 'Gizmo', label: 'Gizmo ⚙️' },
      { id: 'NEXUS', label: 'Nexus 🔮' },
      { id: 'Titan', label: 'Titan 🛡️' },
      { id: 'PixelBot', label: 'PixelBot 🎮' }
    ],
    'adventurer': [
      { id: 'Felix', label: 'Felix 🗡️' },
      { id: 'Luna', label: 'Luna 🌙' },
      { id: 'MagoSupremo', label: 'Mago Supremo 🔮' },
      { id: 'Ninjago', label: 'Ninja 🥷' },
      { id: 'Valente', label: 'Guardião 🛡️' },
      { id: 'Aura', label: 'Aura ✨' },
      { id: 'Kael', label: 'Kael 🏹' },
      { id: 'Zelda', label: 'Zelda 👑' },
      { id: 'Thor', label: 'Thor 🔨' },
      { id: 'Aventureira', label: 'Aventureira 🏕️' }
    ],
    'pixel-art': [
      { id: 'ArcadeMaster', label: 'Arcade 🕹️' },
      { id: 'Gamer8Bit', label: '8-Bit 👾' },
      { id: 'MarioFan', label: 'Encanador 🍄' },
      { id: 'SonicSpeed', label: 'Speedster 🦔' },
      { id: 'RetroKing', label: 'Retro 👑' },
      { id: 'PixelGirl', label: 'Pixel Girl 🎨' },
      { id: 'BlockBoy', label: 'BlockBoy 🧱' },
      { id: 'Neo', label: 'Neo 🕶️' }
    ],
    'lorelei': [
      { id: 'Sofia', label: 'Sofia 🌸' },
      { id: 'Lucas', label: 'Lucas 🎧' },
      { id: 'Maria', label: 'Maria 🌺' },
      { id: 'Gabriel', label: 'Gabriel ⚡' },
      { id: 'Julia', label: 'Julia 🌟' },
      { id: 'Pedro', label: 'Pedro 🎮' },
      { id: 'Beatriz', label: 'Beatriz 🎨' },
      { id: 'Arthur', label: 'Arthur 👑' },
      { id: 'Manuela', label: 'Manuela 💖' },
      { id: 'Bernardo', label: 'Bernardo 🚀' }
    ],
    'big-smile': [
      { id: 'HappyKid', label: 'Happy 😃' },
      { id: 'SmileStar', label: 'Sorridente ⭐' },
      { id: 'Joy', label: 'Joy 💖' },
      { id: 'Sun', label: 'Sunshine ☀️' },
      { id: 'Cheery', label: 'Cheery 🎈' },
      { id: 'SuperSmile', label: 'Super Riso 😁' }
    ],
    'fun-emoji': [
      { id: 'CoolCat', label: 'Cool 🕶️' },
      { id: 'PartyMonster', label: 'Festa 🎉' },
      { id: 'StarBrain', label: 'Gênio 🧠' },
      { id: 'FireBall', label: 'Fogo 🔥' },
      { id: 'RocketIcon', label: 'Foguete 🚀' },
      { id: 'MagicWand', label: 'Magia 🪄' }
    ],
    'voxel-art': [
      { id: 'Alex', label: 'Alex 🧊' },
      { id: 'Steve', label: 'Steve 🧊' },
      { id: 'VoxelLucas', label: 'Lucas Voxel 🎮' },
      { id: 'VoxelSofia', label: 'Sofia Voxel 🌸' }
    ]
  },

  bgColors: [
    { id: 'b6e3f4', label: 'Azul Céu', hex: '#b6e3f4' },
    { id: 'c0aedd', label: 'Roxo Lavanda', hex: '#c0aedd' },
    { id: 'd1d4f9', label: 'Azul Pastel', hex: '#d1d4f9' },
    { id: 'ffd5dc', label: 'Rosa Bebê', hex: '#ffd5dc' },
    { id: 'ffdfbf', label: 'Pêssego Warm', hex: '#ffdfbf' },
    { id: 'c1f2c7', label: 'Verde Menta', hex: '#c1f2c7' },
    { id: 'fff0b3', label: 'Amarelo Sol', hex: '#fff0b3' },
    { id: '364156', label: 'Dark Slate', hex: '#364156' },
    { id: '111827', label: 'Preto Cyber', hex: '#111827' }
  ],

  animationSpeeds: [
    { id: 'fastest', label: '💥 Turbo' },
    { id: 'medium', label: '⚡ Média' },
    { id: 'none', label: '🛑 Estático' }
  ],

  hairStyles: [
    { id: 'spiky', label: 'Espetado' },
    { id: 'cap', label: 'Boné' },
    { id: 'beanie', label: 'Gorro' },
    { id: 'afro', label: 'Afro' },
    { id: 'curly', label: 'Cachos' },
    { id: 'mohawk', label: 'Moicano' },
    { id: 'bunnyEars', label: 'Orelhas Coelho 🐰' },
    { id: 'short', label: 'Curto' }
  ],

  hairColors: [
    { id: '2c1b18', label: 'Preto', hex: '#2c1b18' },
    { id: '724133', label: 'Castanho', hex: '#724133' },
    { id: 'b58143', label: 'Loiro', hex: '#b58143' },
    { id: 'c93305', label: 'Ruivo', hex: '#c93305' },
    { id: '25557c', label: 'Azul', hex: '#25557c' }
  ],

  skinColors: [
    { id: 'ffdbb4', label: 'Claro', hex: '#ffdbb4' },
    { id: 'fd9841', label: 'Moreno', hex: '#fd9841' },
    { id: 'ae5d29', label: 'Canela', hex: '#ae5d29' },
    { id: '614335', label: 'Escuro', hex: '#614335' }
  ]
};

/**
 * Builds the DiceBear Avatar Proxy URL with parameters
 */
function buildDiceBearUrl(config = {}, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const style = config.style || 'bottts';
  const seed = config.seed || 'Student';
  const bg = (config.bg || 'b6e3f4').replace('#', '');

  let url = `/api/avatar-proxy?style=${encodeURIComponent(style)}&seed=${encodeURIComponent(seed)}`;

  if (bg && bg !== 'transparent' && !bg.includes('gradient')) {
    url += `&backgroundColor=${bg}`;
  }

  if (style === 'voxel-art') {
    const anim = config.animationSpeed || 'fastest';
    if (anim && anim !== 'none') url += `&animationVariant=${anim}`;
    if (config.hairStyle) url += `&topVariant=${config.hairStyle}`;
    if (config.hairColor) url += `&hairColor=${(config.hairColor).replace('#', '')}`;
    if (config.skinColor) url += `&skinColor=${(config.skinColor).replace('#', '')}`;
    if (config.outfit) url += `&outfitVariant=${config.outfit}`;
    if (config.glasses && config.glasses !== 'none') url += `&glassesVariant=${config.glasses}&glassesProbability=100`;
    if (config.beard && config.beard !== 'none') url += `&beardVariant=${config.beard}&beardProbability=100`;
    if (config.eyes) url += `&eyesVariant=${config.eyes}`;
  }

  return url;
}

/**
 * Renders an <img> tag with the Avatar SVG
 */
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false) {
  const url = buildDiceBearUrl(config, isTilePreview);
  const borderRadius = isTilePreview ? '12px' : '20px';

  return `<img src="${url}" width="${size}" height="${size}" style="border-radius: ${borderRadius}; display: block; margin: 0 auto; object-fit: contain;" alt="Student Avatar" />`;
}

/**
 * Renders individual item previews for option tiles
 */
function generateItemTileSVG(category, itemId, extraParam = '') {
  if (category === 'style') {
    const tileUrl = `/api/avatar-proxy?style=${encodeURIComponent(itemId)}&seed=Sample&backgroundColor=b6e3f4`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto; border-radius:10px;" alt="${itemId}" />`;
  }
  return '';
}

if (typeof window !== 'undefined') {
  window.DUOLINGO_AVATAR_PRESETS = DUOLINGO_AVATAR_PRESETS;
  window.generateAvatarSVG = generateAvatarSVG;
  window.generateItemTileSVG = generateItemTileSVG;
  window.buildDiceBearUrl = buildDiceBearUrl;
}

if (typeof module !== 'undefined') {
  module.exports = { DUOLINGO_AVATAR_PRESETS, generateAvatarSVG, generateItemTileSVG, buildDiceBearUrl };
}
