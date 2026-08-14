/**
 * 100% Animated & Fully Editable Voxel Art 3D Engine
 * Fully customizable: hair, skin, outfit, glasses, beard, eyes, animation speed, flag & upload backgrounds.
 */

const DUOLINGO_AVATAR_PRESETS = {
  styles: [
    { id: 'voxel-art', label: 'Voxel Art 3D 🧊' }
  ],

  animationSpeeds: [
    { id: 'fastest', label: '💥 Turbo (Mais Rápida)' },
    { id: 'fast', label: '🚀 Rápida' },
    { id: 'medium', label: '⚡ Média' },
    { id: 'slow', label: '🐢 Lenta' },
    { id: 'none', label: '🛑 Estático' }
  ],

  hairStyles: [
    { id: 'spiky', label: 'Espetado Gamer' },
    { id: 'cap', label: 'Boné Voxel' },
    { id: 'beanie', label: 'Gorro de Lã' },
    { id: 'afro', label: 'Afro Volumoso' },
    { id: 'curly', label: 'Cachos Voxel' },
    { id: 'mohawk', label: 'Mohawk / Moicano' },
    { id: 'bunnyEars', label: 'Orelhas de Coelho 🐰' },
    { id: 'animalEars', label: 'Orelhas de Gatinho 🐱' },
    { id: 'buns', label: 'Coques Duplos' },
    { id: 'braids', label: 'Tranças' },
    { id: 'longStraight', label: 'Longo Liso' },
    { id: 'longWavy', label: 'Longo Ondulado' },
    { id: 'bob', label: 'Corte Bob' },
    { id: 'ponytail', label: 'Rabo de Cavalo' },
    { id: 'short', label: 'Curto Clássico' }
  ],

  hairColors: [
    { id: '2c1b18', label: 'Preto Ônix', hex: '#2c1b18' },
    { id: '4a312c', label: 'Castanho Escuro', hex: '#4a312c' },
    { id: '724133', label: 'Castanho Mel', hex: '#724133' },
    { id: 'b58143', label: 'Loiro Dourado', hex: '#b58143' },
    { id: 'c93305', label: 'Ruivo Vivo', hex: '#c93305' },
    { id: 'e5a0a0', label: 'Rosa Soft', hex: '#e5a0a0' },
    { id: '25557c', label: 'Azul Neon', hex: '#25557c' },
    { id: '514796', label: 'Roxo Gamer', hex: '#514796' }
  ],

  skinColors: [
    { id: 'ffdbb4', label: 'Pêssego Claro', hex: '#ffdbb4' },
    { id: 'edb98a', label: 'Caramelo Soft', hex: '#edb98a' },
    { id: 'fd9841', label: 'Moreno Dourado', hex: '#fd9841' },
    { id: 'd08b5b', label: 'Bronze', hex: '#d08b5b' },
    { id: 'ae5d29', label: 'Canela', hex: '#ae5d29' },
    { id: '614335', label: 'Ébano Intenso', hex: '#614335' }
  ],

  outfits: [
    { id: 'hoodie', label: 'Moletom com Capuz' },
    { id: 'overalls', label: 'Jardineira Voxel' },
    { id: 'jacket', label: 'Jaqueta Gamer' },
    { id: 'suit', label: 'Blazer Executivo' },
    { id: 'tie', label: 'Camisa com Gravata' },
    { id: 'stripes', label: 'Camiseta Listrada' },
    { id: 'checker', label: 'Estampa Xadrez' },
    { id: 'dress', label: 'Vestido' },
    { id: 'plain', label: 'Camiseta Básica' }
  ],

  glasses: [
    { id: 'none', label: 'Sem Óculos' },
    { id: 'shades', label: 'Óculos de Sol 🕶️' },
    { id: 'visor', label: 'Visor Cyberpunk 🥽' },
    { id: 'round', label: 'Óculos Redondo 👓' },
    { id: 'square', label: 'Óculos Quadrado' },
    { id: 'cat', label: 'Óculos Gatinho' }
  ],

  beards: [
    { id: 'none', label: 'Sem Barba' },
    { id: 'stubble', label: 'Barba Rente' },
    { id: 'full', label: 'Barba Cheia' },
    { id: 'goatee', label: 'Cavanhaque' },
    { id: 'mustache', label: 'Bigode' }
  ],

  eyes: [
    { id: 'open', label: 'Olhos Abertos' },
    { id: 'happy', label: 'Feliz Sorridente' },
    { id: 'star', label: 'Olhos de Estrela 🌟' },
    { id: 'side', label: 'Olhando pro Lado' },
    { id: 'closed', label: 'Piscando' },
    { id: 'sleepy', label: 'Sonolento' }
  ],

  voxelSeeds: [
    { id: 'VoxelAlex', label: 'Alex 🧊', seed: 'Alex' },
    { id: 'VoxelSteve', label: 'Steve 🧊', seed: 'Steve' },
    { id: 'VoxelLucas', label: 'Lucas 🧊', seed: 'Lucas' },
    { id: 'VoxelSofia', label: 'Sofia 🌸', seed: 'Sofia' },
    { id: 'VoxelMaria', label: 'Maria 🌺', seed: 'Maria' },
    { id: 'VoxelGabriel', label: 'Gabriel ⚡', seed: 'Gabriel' },
    { id: 'VoxelPedro', label: 'Pedro 🎮', seed: 'Pedro' },
    { id: 'VoxelJulia', label: 'Julia 🌟', seed: 'Julia' },
    { id: 'VoxelBeatriz', label: 'Beatriz 🎨', seed: 'Beatriz' },
    { id: 'VoxelArthur', label: 'Arthur 👑', seed: 'Arthur' },
    { id: 'VoxelBernardo', label: 'Bernardo 🚀', seed: 'Bernardo' },
    { id: 'VoxelRafael', label: 'Rafael 🎯', seed: 'Rafael' },
    { id: 'VoxelManuela', label: 'Manuela 💖', seed: 'Manuela' },
    { id: 'VoxelLaura', label: 'Laura 🎀', seed: 'Laura' },
    { id: 'VoxelGuilherme', label: 'Guilherme 🏆', seed: 'Guilherme' },
    { id: 'VoxelFelipe', label: 'Felipe 🕶️', seed: 'Felipe' },
    { id: 'VoxelMatheus', label: 'Matheus 🎧', seed: 'Matheus' },
    { id: 'VoxelValentina', label: 'Valentina ✨', seed: 'Valentina' }
  ],

  bgThemes: [
    { id: 'e55b5b', label: 'Vermelho Coral', type: 'color', val: '#e55b5b' },
    { id: '58cc02', label: 'Verde Duolingo', type: 'color', val: '#58cc02' },
    { id: '1cb0f6', label: 'Azul Céu', type: 'color', val: '#1cb0f6' },
    { id: 'ffc800', label: 'Amarelo Ouro', type: 'color', val: '#ffc800' },
    { id: 'ce82ff', label: 'Roxo Neon', type: 'color', val: '#ce82ff' },
    { id: '202f36', label: 'Dark Mode', type: 'color', val: '#202f36' },
    { id: 'brasil', label: '🇧🇷 Brasil', type: 'pattern', val: 'linear-gradient(135deg, #009c3b 33%, #ffdf00 33% 66%, #002776 66%)' },
    { id: 'eua', label: '🇺🇸 EUA', type: 'pattern', val: 'linear-gradient(135deg, #b22234 40%, #ffffff 40% 60%, #3c3b6e 60%)' },
    { id: 'japao', label: '🇯🇵 Japão', type: 'pattern', val: 'radial-gradient(circle, #bc002d 35%, #ffffff 36%)' },
    { id: 'franca', label: '🇫🇷 França', type: 'pattern', val: 'linear-gradient(90deg, #002395 33%, #ffffff 33% 66%, #ed2939 66%)' },
    { id: 'italia', label: '🇮🇹 Itália', type: 'pattern', val: 'linear-gradient(90deg, #009246 33%, #ffffff 33% 66%, #ce2b37 66%)' },
    { id: 'espanha', label: '🇪🇸 Espanha', type: 'pattern', val: 'linear-gradient(180deg, #aa1523 25%, #f1bf00 25% 75%, #aa1523 75%)' },
    { id: 'espaco', label: '🌌 Espaço Sideral', type: 'pattern', val: 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)' },
    { id: 'arcoiris', label: '🌈 Arco-Íris Neon', type: 'pattern', val: 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)' },
    { id: 'minecraft', label: '🧱 Bloco de Terra', type: 'pattern', val: 'linear-gradient(180deg, #5c8e32 30%, #866043 30%)' }
  ]
};

/**
 * Builds the Animated Voxel Art SVG URL with piece-by-piece customizations
 */
function buildDiceBearUrl(config = {}, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const seed = config.seed || 'StudentVoxel';
  const anim = config.animationSpeed || 'fastest'; // Default to fastest per user request!
  const hairStl = config.hairStyle || 'spiky';
  const hairCol = (config.hairColor || '2c1b18').replace('#', '');
  const skinCol = (config.skinColor || 'ffdbb4').replace('#', '');
  const outfitStl = config.outfit || 'hoodie';
  const glassStl = config.glasses || 'none';
  const beardStl = config.beard || 'none';
  const eyeStl = config.eyes || 'open';

  let url = `/api/avatar-proxy?style=voxel-art&seed=${encodeURIComponent(seed)}`;

  if (anim && anim !== 'none') {
    url += `&animationVariant=${anim}`;
  }

  if (hairStl) {
    url += `&topVariant=${hairStl}`;
  }
  if (hairCol) {
    url += `&hairColor=${hairCol}`;
  }
  if (skinCol) {
    url += `&skinColor=${skinCol}`;
  }
  if (outfitStl) {
    url += `&outfitVariant=${outfitStl}`;
  }
  if (glassStl && glassStl !== 'none') {
    url += `&glassesVariant=${glassStl}&glassesProbability=100`;
  } else if (glassStl === 'none') {
    url += `&glassesProbability=0`;
  }
  if (beardStl && beardStl !== 'none') {
    url += `&beardVariant=${beardStl}&beardProbability=100`;
  } else if (beardStl === 'none') {
    url += `&beardProbability=0`;
  }
  if (eyeStl) {
    url += `&eyesVariant=${eyeStl}`;
  }

  return url;
}

/**
 * Renders an <img> tag with looping Animated Voxel Art SVG
 */
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false) {
  const url = buildDiceBearUrl(config, isTilePreview);
  const borderRadius = isTilePreview ? '12px' : '20px';

  return `<img src="${url}" width="${size}" height="${size}" style="border-radius: ${borderRadius}; display: block; margin: 0 auto; object-fit: contain;" alt="Animated Voxel Art Avatar" />`;
}

/**
 * Renders individual item previews for option tiles
 */
function generateItemTileSVG(category, itemId, extraParam = '') {
  if (category === 'voxelSeeds') {
    const tileUrl = `/api/avatar-proxy?style=voxel-art&seed=${encodeURIComponent(itemId)}&animationVariant=fastest`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Voxel" />`;
  }

  if (category === 'hair') {
    const tileUrl = `/api/avatar-proxy?style=voxel-art&topVariant=${itemId}&hairColor=${extraParam || '2c1b18'}&animationVariant=fastest`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Hair" />`;
  }

  if (category === 'outfit') {
    const tileUrl = `/api/avatar-proxy?style=voxel-art&outfitVariant=${itemId}&animationVariant=fastest`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Outfit" />`;
  }

  if (category === 'glasses') {
    const tileUrl = `/api/avatar-proxy?style=voxel-art&glassesVariant=${itemId}&glassesProbability=100&animationVariant=fastest`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Glasses" />`;
  }

  if (category === 'beards') {
    const tileUrl = `/api/avatar-proxy?style=voxel-art&beardVariant=${itemId}&beardProbability=100&animationVariant=fastest`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Beard" />`;
  }

  if (category === 'eyes') {
    const tileUrl = `/api/avatar-proxy?style=voxel-art&eyesVariant=${itemId}&animationVariant=fastest`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Eyes" />`;
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
