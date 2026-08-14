/**
 * Featured Voxel Art 3D & DiceBear 10.x Studio Engine
 * Default Style: Voxel Art (3D Blocky Characters)
 */

const DUOLINGO_AVATAR_PRESETS = {
  styles: [
    { id: 'voxel-art', label: 'Voxel Art 3D 🧊 (Favorito)' },
    { id: 'avataaars', label: 'Humano Ilustrado 🧑' },
    { id: 'lorelei', label: 'Artístico Fofo 🎨' },
    { id: 'adventurer', label: 'Aventureiro 🎒' },
    { id: 'open-peeps', label: 'Desenho Moderno ✏️' },
    { id: 'bottts', label: 'Robô Gamer 🤖' },
    { id: 'pixel-art', label: 'Pixel Art Retro 👾' }
  ],

  voxelSeeds: [
    { id: 'VoxelAlex', label: 'Estilo 1', seed: 'Alex' },
    { id: 'VoxelSteve', label: 'Estilo 2', seed: 'Steve' },
    { id: 'VoxelLucas', label: 'Estilo 3', seed: 'Lucas' },
    { id: 'VoxelSofia', label: 'Estilo 4', seed: 'Sofia' },
    { id: 'VoxelMaria', label: 'Estilo 5', seed: 'Maria' },
    { id: 'VoxelGabriel', label: 'Estilo 6', seed: 'Gabriel' },
    { id: 'VoxelPedro', label: 'Estilo 7', seed: 'Pedro' },
    { id: 'VoxelJulia', label: 'Estilo 8', seed: 'Julia' },
    { id: 'VoxelBeatriz', label: 'Estilo 9', seed: 'Beatriz' },
    { id: 'VoxelArthur', label: 'Estilo 10', seed: 'Arthur' },
    { id: 'VoxelBernardo', label: 'Estilo 11', seed: 'Bernardo' },
    { id: 'VoxelRafael', label: 'Estilo 12', seed: 'Rafael' },
    { id: 'VoxelManuela', label: 'Estilo 13', seed: 'Manuela' },
    { id: 'VoxelLaura', label: 'Estilo 14', seed: 'Laura' },
    { id: 'VoxelGuilherme', label: 'Estilo 15', seed: 'Guilherme' },
    { id: 'VoxelFelipe', label: 'Estilo 16', seed: 'Felipe' },
    { id: 'VoxelMatheus', label: 'Estilo 17', seed: 'Matheus' },
    { id: 'VoxelValentina', label: 'Estilo 18', seed: 'Valentina' }
  ],

  skinColors: [
    { id: 'ffdbb4', label: 'Pêssego Claro', color: '#ffdbb4' },
    { id: 'edb98a', label: 'Caramelo Soft', color: '#edb98a' },
    { id: 'fd9841', label: 'Moreno Dourado', color: '#fd9841' },
    { id: 'd08b5b', label: 'Bronze', color: '#d08b5b' },
    { id: 'ae5d29', label: 'Canela', color: '#ae5d29' },
    { id: '614335', label: 'Ébano Intenso', color: '#614335' }
  ],

  hairStyles: [
    { id: 'shortFlat', label: 'Penteado Executivo' },
    { id: 'theCaesar', label: 'César / Fade' },
    { id: 'frizzle', label: 'Afro Volumoso' },
    { id: 'dreads01', label: 'Dreads Curto' },
    { id: 'dreads', label: 'Dreadlocks Longos' },
    { id: 'curly', label: 'Cachos Longos' },
    { id: 'curvy', label: 'Ondulado Elegante' },
    { id: 'bob', label: 'Franja Bob' },
    { id: 'bigHair', label: 'Cabelo Volumoso' },
    { id: 'shortCurly', label: 'Cachos Curto' },
    { id: 'shaggyMullet', label: 'Mullet Moderno' },
    { id: 'winterHat1', label: 'Gorro de Lã' },
    { id: 'turban', label: 'Turbante' },
    { id: 'hijab', label: 'Hijab' }
  ],

  hairColors: [
    { id: '2c1b18', label: 'Preto Ônix', hex: '#2c1b18' },
    { id: '4a312c', label: 'Castanho Escuro', hex: '#4a312c' },
    { id: '724133', label: 'Castanho Mel', hex: '#724133' },
    { id: 'b58143', label: 'Loiro Dourado', hex: '#b58143' },
    { id: 'c93305', label: 'Ruivo Vivo', hex: '#c93305' },
    { id: 'e5a0a0', label: 'Rosa Soft', hex: '#e5a0a0' }
  ],

  beards: [
    { id: 'blank', label: 'Sem Barba' },
    { id: 'beardLight', label: 'Barba Rente' },
    { id: 'beardMedium', label: 'Barba Média' },
    { id: 'beardMajestic', label: 'Barba Majestosa' },
    { id: 'moustacheFancy', label: 'Bigode Elegante' }
  ],

  glasses: [
    { id: 'blank', label: 'Sem Óculos' },
    { id: 'prescription01', label: 'Óculos Nerd Quadro' },
    { id: 'prescription02', label: 'Óculos Arredondado' },
    { id: 'round', label: 'Óculos Redondo Retrô' },
    { id: 'sunglasses', label: 'Óculos Escuros' },
    { id: 'wayfarers', label: 'Óculos Wayfarer' }
  ],

  outfits: [
    { id: 'overall', label: 'Jardineira Jeans' },
    { id: 'hoodie', label: 'Moletom com Capuz' },
    { id: 'blazerAndShirt', label: 'Blazer com Camisa' },
    { id: 'collarAndSweater', label: 'Cacharrel com Suéter' },
    { id: 'graphicShirt', label: 'Camiseta Estampada' },
    { id: 'shirtVNeck', label: 'Camiseta Gola V' }
  ],

  eyes: [
    { id: 'default', label: 'Olhos Normais' },
    { id: 'happy', label: 'Sorridente' },
    { id: 'hearts', label: 'Apaixonado 😍' },
    { id: 'side', label: 'Olhando pro Lado' },
    { id: 'surprised', label: 'Surpreso 😲' },
    { id: 'wink', label: 'Piscada' }
  ],

  bgColors: [
    'e55b5b', '58cc02', '1cb0f6', 'ffc800', 'ce82ff', 'ff9600', '202f36'
  ]
};

/**
 * Builds the DiceBear API Vector SVG URL based on user configuration
 */
function buildDiceBearUrl(config = {}, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const style = config.style || 'voxel-art';
  const seed = config.seed || 'StudentVoxel';
  const skin = (config.skinColor || 'ffdbb4').replace('#', '');
  const hairStl = config.hairStyle || 'shortFlat';
  const hairCol = config.hairColor || '2c1b18';
  const beard = config.beard || 'blank';
  const glass = config.glasses || 'blank';
  const outfit = config.outfit || 'overall';
  const outfitCol = (config.outfitColor || '65c9ff').replace('#', '');
  const eye = config.eyes || 'default';
  const bg = (config.bg || 'e55b5b').replace('#', '');

  let url = `/api/avatar-proxy?style=${encodeURIComponent(style)}&seed=${encodeURIComponent(seed)}`;

  if (style === 'avataaars') {
    url += `&skinColor=${skin}`;
    url += `&top=${hairStl}`;
    url += `&hairColor=${hairCol}`;
    if (beard !== 'blank') {
      url += `&facialHair=${beard}&facialHairProbability=100`;
    } else {
      url += `&facialHairProbability=0`;
    }
    if (glass !== 'blank') {
      url += `&accessories=${glass}&accessoriesProbability=100`;
    } else {
      url += `&accessoriesProbability=0`;
    }
    url += `&clothing=${outfit}`;
    url += `&clothingColor=${outfitCol}`;
    url += `&eyes=${eye}`;
    url += `&mouth=smile`;
    url += `&eyebrows=defaultNatural`;
  }

  if (!isTilePreview) {
    url += `&backgroundColor=${bg}`;
  } else {
    url += `&backgroundColor=transparent`;
  }

  return url;
}

/**
 * Renders an <img> tag pointing to the studio-quality Voxel Art Vector SVG
 */
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false) {
  const url = buildDiceBearUrl(config, isTilePreview);
  const borderRadius = isTilePreview ? '12px' : '20px';

  return `<img src="${url}" width="${size}" height="${size}" style="border-radius: ${borderRadius}; display: block; margin: 0 auto; object-fit: contain;" alt="Avatar Voxel Art" />`;
}

/**
 * Renders individual item previews for the 3-column option cards
 */
function generateItemTileSVG(category, itemId, extraParam = '') {
  if (category === 'voxelSeeds') {
    const tileUrl = `/api/avatar-proxy?style=voxel-art&seed=${encodeURIComponent(itemId)}&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Voxel" />`;
  }

  if (category === 'styles') {
    const tileUrl = `/api/avatar-proxy?style=${itemId}&seed=PreviewTile&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Style" />`;
  }

  if (category === 'skin') {
    return `<div style="width: 48px; height: 48px; border-radius: 50%; background: #${itemId.replace('#','')}; margin: 0 auto; border: 2px solid rgba(0,0,0,0.1);"></div>`;
  }

  if (category === 'hair') {
    const tileUrl = `/api/avatar-proxy?style=avataaars&top=${itemId}&hairColor=${extraParam || '2c1b18'}&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Hair" />`;
  }

  if (category === 'beards') {
    const tileUrl = `/api/avatar-proxy?style=avataaars&facialHair=${itemId}&facialHairProbability=100&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Beard" />`;
  }

  if (category === 'glasses') {
    const tileUrl = `/api/avatar-proxy?style=avataaars&accessories=${itemId}&accessoriesProbability=100&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Glasses" />`;
  }

  if (category === 'clothes') {
    const tileUrl = `/api/avatar-proxy?style=avataaars&clothing=${itemId}&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Clothing" />`;
  }

  if (category === 'eyes') {
    const tileUrl = `/api/avatar-proxy?style=avataaars&eyes=${itemId}&backgroundColor=transparent`;
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
