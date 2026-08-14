/**
 * 100% Animated Voxel Art 3D Studio Engine
 * Exclusively Voxel Art 3D with looping CSS animation!
 */

const DUOLINGO_AVATAR_PRESETS = {
  styles: [
    { id: 'voxel-art', label: 'Voxel Art 3D 🧊' }
  ],

  animationSpeeds: [
    { id: 'medium', label: '⚡ Média (Padrão)' },
    { id: 'slow', label: '🐢 Lenta' },
    { id: 'fast', label: '🚀 Rápida' },
    { id: 'fastest', label: '💥 Turbo' },
    { id: 'none', label: '🛑 Estático' }
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
    { id: 'VoxelValentina', label: 'Valentina ✨', seed: 'Valentina' },
    { id: 'VoxelEnzo', label: 'Enzo 🔥', seed: 'Enzo' },
    { id: 'VoxelIsabella', label: 'Isabella 👑', seed: 'Isabella' },
    { id: 'VoxelDavi', label: 'Davi ⚽', seed: 'Davi' },
    { id: 'VoxelAlice', label: 'Alice 🦄', seed: 'Alice' },
    { id: 'VoxelThales', label: 'Thales 🛹', seed: 'Thales' },
    { id: 'VoxelLorena', label: 'Lorena 🌈', seed: 'Lorena' }
  ],

  bgColors: [
    'e55b5b', '58cc02', '1cb0f6', 'ffc800', 'ce82ff', 'ff9600', '202f36', '2b2b2b'
  ]
};

/**
 * Builds the Animated Voxel Art SVG URL
 */
function buildDiceBearUrl(config = {}, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const seed = config.seed || 'StudentVoxel';
  const bg = (config.bg || 'e55b5b').replace('#', '');
  const anim = config.animationSpeed || 'medium';

  let url = `/api/avatar-proxy?style=voxel-art&seed=${encodeURIComponent(seed)}`;

  if (anim && anim !== 'none') {
    url += `&animationVariant=${anim}`;
  }

  if (!isTilePreview) {
    url += `&bg=${bg}`;
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
function generateItemTileSVG(category, itemId) {
  if (category === 'voxelSeeds') {
    const tileUrl = `/api/avatar-proxy?style=voxel-art&seed=${encodeURIComponent(itemId)}&animationVariant=medium`;
    return `<img src="${tileUrl}" width="65" height="65" style="display:block; margin:0 auto;" alt="Voxel" />`;
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
