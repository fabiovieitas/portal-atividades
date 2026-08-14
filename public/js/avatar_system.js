/**
 * World-Class Avatar Engine powered by DiceBear 9.x Schema
 * (Avataaars, Lorelei, Adventurer, Open-Peeps, Bottts)
 * High-definition studio vector illustrations with 100% valid schema parameters.
 */

const DUOLINGO_AVATAR_PRESETS = {
  styles: [
    { id: 'avataaars', label: 'Humano Ilustrado 🧑' },
    { id: 'lorelei', label: 'Artístico Fofo 🎨' },
    { id: 'adventurer', label: 'Aventureiro 🎒' },
    { id: 'open-peeps', label: 'Desenho Moderno ✏️' },
    { id: 'bottts', label: 'Robô Gamer 🤖' }
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

  outfitColors: [
    { id: '65c9ff', label: 'Azul Duolingo' },
    { id: 'a7d49e', label: 'Verde Soft' },
    { id: 'ff5c5c', label: 'Vermelho' },
    { id: 'ffffb1', label: 'Amarelo' },
    { id: '514796', label: 'Roxo' },
    { id: '262e33', label: 'Grafite' }
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

  const style = config.style || 'avataaars';
  const seed = config.seed || 'StudentProfile';
  const skin = (config.skinColor || 'ffdbb4').replace('#', '');
  const hairStl = config.hairStyle || 'shortFlat';
  const hairCol = config.hairColor || '2c1b18';
  const beard = config.beard || 'blank';
  const glass = config.glasses || 'blank';
  const outfit = config.outfit || 'overall';
  const outfitCol = (config.outfitColor || '65c9ff').replace('#', '');
  const eye = config.eyes || 'default';
  const bg = (config.bg || 'e55b5b').replace('#', '');

  let url = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;

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
 * Renders an <img> tag pointing to the studio-quality DiceBear Vector SVG
 */
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false) {
  const url = buildDiceBearUrl(config, isTilePreview);
  const borderRadius = isTilePreview ? '12px' : '20px';

  return `<img src="${url}" width="${size}" height="${size}" style="border-radius: ${borderRadius}; display: block; margin: 0 auto; object-fit: contain;" alt="Avatar" />`;
}

/**
 * Renders individual item previews for the 3-column option cards
 */
function generateItemTileSVG(category, itemId, extraParam = '') {
  if (category === 'skin') {
    return `<div style="width: 48px; height: 48px; border-radius: 50%; background: #${itemId.replace('#','')}; margin: 0 auto; border: 2px solid rgba(0,0,0,0.1);"></div>`;
  }

  if (category === 'styles') {
    const tileUrl = `https://api.dicebear.com/9.x/${itemId}/svg?seed=PreviewTile&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Style" />`;
  }

  if (category === 'hair') {
    const tileUrl = `https://api.dicebear.com/9.x/avataaars/svg?top=${itemId}&hairColor=${extraParam || '2c1b18'}&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Hair" />`;
  }

  if (category === 'beards') {
    const tileUrl = `https://api.dicebear.com/9.x/avataaars/svg?facialHair=${itemId}&facialHairProbability=100&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Beard" />`;
  }

  if (category === 'glasses') {
    const tileUrl = `https://api.dicebear.com/9.x/avataaars/svg?accessories=${itemId}&accessoriesProbability=100&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Glasses" />`;
  }

  if (category === 'clothes') {
    const tileUrl = `https://api.dicebear.com/9.x/avataaars/svg?clothing=${itemId}&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Clothing" />`;
  }

  if (category === 'eyes') {
    const tileUrl = `https://api.dicebear.com/9.x/avataaars/svg?eyes=${itemId}&backgroundColor=transparent`;
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
