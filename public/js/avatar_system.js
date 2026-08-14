/**
 * World-Class Avatar Engine powered by Open-Source DiceBear Library
 * (Avataaars, Lorelei, Adventurer, Open-Peeps, Bottts)
 * High-definition, professional studio vector illustrations.
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
    { id: 'ffdbb4', label: 'Pêssego Claro' },
    { id: 'edb98a', label: 'Caramelo Soft' },
    { id: 'fd9841', label: 'Moreno Dourado' },
    { id: 'd08b5b', label: 'Bronze' },
    { id: 'ae5d29', label: 'Canela' },
    { id: '614335', label: 'Ébano Intenso' }
  ],

  hairStyles: [
    { id: 'shortHairShortFlat', label: 'Penteado Executivo' },
    { id: 'shortHairTheCaesar', label: 'César / Fade' },
    { id: 'shortHairFrizzle', label: 'Afro Volumoso' },
    { id: 'shortHairDreads01', label: 'Dreads Curto' },
    { id: 'longHairDreads', label: 'Dreadlocks Longos' },
    { id: 'longHairCurly', label: 'Cachos Longos' },
    { id: 'longHairCurvy', label: 'Ondulado Elegante' },
    { id: 'longHairBob', label: 'Franja Bob' },
    { id: 'longHairBigHair', label: 'Cabelo Volumoso' },
    { id: 'shortHairShortCurly', label: 'Cachos Curto' },
    { id: 'shortHairShaggyMullet', label: 'Mullet Moderno' },
    { id: 'winterHat1', label: 'Gorro de Lã' },
    { id: 'turban', label: 'Turbante' },
    { id: 'hijab', label: 'Hijab' },
    { id: 'noHair', label: 'Careca / Rente' }
  ],

  hairColors: [
    { id: 'black', label: 'Preto Ônix' },
    { id: 'brown', label: 'Castanho' },
    { id: 'auburn', label: 'Ruivo' },
    { id: 'blonde', label: 'Loiro' },
    { id: 'pastelPink', label: 'Rosa Pastel' },
    { id: 'platinum', label: 'Platina' }
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
    { id: 'kurt', label: 'Óculos de Sol Kurt' }
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
    { id: '1cb0f6', label: 'Azul Duolingo' },
    { id: '58cc02', label: 'Verde Duolingo' },
    { id: 'ff4b4b', label: 'Vermelho' },
    { id: 'ffc800', label: 'Amarelo' },
    { id: 'ce82ff', label: 'Roxo' },
    { id: '202f36', label: 'Grafite Escuro' }
  ],

  eyes: [
    { id: 'default', label: 'Olhos Normais' },
    { id: 'happy', label: 'Sorridente' },
    { id: 'wink', label: 'Piscada' },
    { id: 'hearts', label: 'Apaixonado 😍' },
    { id: 'side', label: 'Olhando pro Lado' },
    { id: 'surprised', label: 'Surpreso 😲' }
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
  const hairStl = config.hairStyle || 'shortHairShortFlat';
  const hairCol = config.hairColor || 'black';
  const beard = config.beard || 'blank';
  const glass = config.glasses || 'blank';
  const outfit = config.outfit || 'overall';
  const outfitCol = (config.outfitColor || '1cb0f6').replace('#', '');
  const eye = config.eyes || 'default';
  const bg = (config.bg || 'e55b5b').replace('#', '');

  let url = `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;

  if (style === 'avataaars') {
    url += `&skinColor=${skin}`;
    url += `&top=${hairStl}`;
    url += `&hairColor=${hairCol}`;
    url += `&facialHair=${beard}`;
    url += `&accessories=${glass}`;
    url += `&clothing=${outfit}`;
    url += `&clothingColor=${outfitCol}`;
    url += `&eyes=${eye}`;
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
    const tileUrl = `https://api.dicebear.com/9.x/avataaars/svg?top=${itemId}&hairColor=${extraParam || 'black'}&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Hair" />`;
  }

  if (category === 'beards') {
    const tileUrl = `https://api.dicebear.com/9.x/avataaars/svg?top=noHair&facialHair=${itemId}&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Beard" />`;
  }

  if (category === 'glasses') {
    const tileUrl = `https://api.dicebear.com/9.x/avataaars/svg?top=noHair&accessories=${itemId}&accessoriesProbability=100&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Glasses" />`;
  }

  if (category === 'clothes') {
    const tileUrl = `https://api.dicebear.com/9.x/avataaars/svg?top=noHair&clothing=${itemId}&backgroundColor=transparent`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Clothing" />`;
  }

  if (category === 'eyes') {
    const tileUrl = `https://api.dicebear.com/9.x/avataaars/svg?top=noHair&eyes=${itemId}&backgroundColor=transparent`;
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
