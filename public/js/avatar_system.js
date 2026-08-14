/**
 * Duolingo Official Avatar Renderer & Asset Engine
 * High-precision vector graphics matching Duolingo's aesthetic:
 * Slim proportions, clean curves, adorable facial expressions, and dedicated item previews.
 */

const DUOLINGO_AVATAR_PRESETS = {
  skinColors: [
    { id: '#ffdfc4', label: 'Pêssego Claro' },
    { id: '#f4c49c', label: 'Pêssego Warm' },
    { id: '#e8b488', label: 'Bege Dourado' },
    { id: '#d89c6c', label: 'Caramelo Claro' },
    { id: '#c48454', label: 'Bronzeado' },
    { id: '#b07040', label: 'Moreno Médio' },
    { id: '#9c5c30', label: 'Canela' },
    { id: '#884820', label: 'Chocolate' },
    { id: '#743614', label: 'Café' },
    { id: '#5c280c', label: 'Ébano' }
  ],

  hairStyles: [
    { id: 'short_spiky', label: 'Espetado' },
    { id: 'side_part', label: 'Penteado Executivo' },
    { id: 'short_curly', label: 'Cachos Afro' },
    { id: 'wavy_long', label: 'Ondulado Longo' },
    { id: 'pigtails', label: 'Maria-Chiquinha' },
    { id: 'top_bun', label: 'Coque Alto' },
    { id: 'bob_bangs', label: 'Franja Bob' },
    { id: 'dreads', label: 'Dreads' },
    { id: 'curtain', label: 'Franja Coreana' },
    { id: 'bald', label: 'Careca / Rente' }
  ],

  hairColors: [
    { id: '#1a1a1a', label: 'Preto' },
    { id: '#4a2c1d', label: 'Castanho Escuro' },
    { id: '#784824', label: 'Castanho Mel' },
    { id: '#d99738', label: 'Loiro' },
    { id: '#c94a2b', label: 'Ruivo' },
    { id: '#ec4899', label: 'Rosa' },
    { id: '#1cb0f6', label: 'Azul' },
    { id: '#ce82ff', label: 'Roxo' }
  ],

  glasses: [
    { id: 'none', label: 'Sem Óculos' },
    { id: 'nerd_black', label: 'Óculos Nerd Duolingo' },
    { id: 'round_gold', label: 'Óculos Redondo' },
    { id: 'sun_wayfarer', label: 'Óculos de Sol' },
    { id: 'cat_eye', label: 'Óculos Gatinho' }
  ],

  hats: [
    { id: 'none', label: 'Sem Chapéu' },
    { id: 'duo_green_cap', label: 'Boné Verde Duolingo "d"' },
    { id: 'purple_cap', label: 'Boné Roxo Gamer' },
    { id: 'beanie', label: 'Gorro com Pompom' },
    { id: 'crown', label: 'Coroa de Ouro' },
    { id: 'headband', label: 'Tiara com Laço' }
  ],

  outfits: [
    { id: 'overalls', label: 'Jardineira & Cacharrel' },
    { id: 'duo_hoodie', label: 'Moletom Verde Duolingo' },
    { id: 'polo_shirt', label: 'Camisa Polo' },
    { id: 'hero_cape', label: 'Traje de Herói' },
    { id: 'lab_coat', label: 'Jaleco' },
    { id: 'sports_jersey', label: 'Camiseta #10' }
  ],

  pets: [
    { id: 'none', label: 'Sem Mascote' },
    { id: 'duo_owl', label: 'Corujinha Duo 🦉' },
    { id: 'dog_caramelo', label: 'Cachorrinho 🐶' },
    { id: 'cat_miau', label: 'Gatinho 🐱' },
    { id: 'baby_dino', label: 'Baby Dino 🦖' }
  ],

  bgColors: [
    '#e55b5b', '#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff9600', '#202f36', '#89e219', '#14d4f4'
  ]
};

// ==========================================
// VECTOR DRAWING HELPERS FOR INDIVIDUAL ITEMS
// ==========================================

function drawHairSVG(hairId, hairCol = '#1a1a1a') {
  if (hairId === 'bald') return '';
  if (hairId === 'short_spiky') {
    return `<path d="M 68 62 C 60 30 95 18 100 18 C 115 18 132 30 132 62 L 126 44 L 112 52 L 100 32 L 86 48 L 74 38 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3" stroke-linejoin="round"/>`;
  }
  if (hairId === 'side_part') {
    return `<path d="M 64 65 C 60 35 140 35 136 65 Q 120 45 100 45 Q 80 45 64 65 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3"/>`;
  }
  if (hairId === 'short_curly') {
    return `
      <g>
        <circle cx="100" cy="52" r="32" fill="${hairCol}" stroke="#1e293b" stroke-width="3"/>
        <circle cx="74" cy="60" r="14" fill="${hairCol}"/>
        <circle cx="126" cy="60" r="14" fill="${hairCol}"/>
      </g>
    `;
  }
  if (hairId === 'wavy_long') {
    return `<path d="M 64 68 C 60 28 140 28 136 68 Q 146 100 136 125 Q 128 100 130 75 Q 100 48 70 75 Q 72 100 64 125 Q 54 100 64 68 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3" stroke-linejoin="round"/>`;
  }
  if (hairId === 'pigtails') {
    return `
      <path d="M 65 65 Q 100 35 135 65 Q 120 48 100 48 Q 80 48 65 65 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3"/>
      <path d="M 64 65 Q 38 85 44 118 Q 58 105 64 76 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3"/>
      <path d="M 136 65 Q 162 85 156 118 Q 142 105 136 76 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3"/>
      <circle cx="62" cy="70" r="5" fill="#ec4899"/>
      <circle cx="138" cy="70" r="5" fill="#ec4899"/>
    `;
  }
  if (hairId === 'top_bun') {
    return `
      <circle cx="100" cy="28" r="18" fill="${hairCol}" stroke="#1e293b" stroke-width="3"/>
      <path d="M 66 65 Q 100 42 134 65 Q 118 50 100 50 Q 82 50 66 65 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3"/>
    `;
  }
  if (hairId === 'bob_bangs') {
    return `
      <path d="M 64 70 C 60 30 140 30 136 70 L 138 100 Q 126 80 128 65 Q 100 52 72 65 Q 74 80 62 100 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3"/>
    `;
  }
  if (hairId === 'dreads') {
    return `
      <g stroke="${hairCol}" stroke-linecap="round">
        <line x1="68" y1="65" x2="58" y2="108" stroke-width="8"/>
        <line x1="80" y1="56" x2="70" y2="118" stroke-width="8"/>
        <line x1="120" y1="56" x2="130" y2="118" stroke-width="8"/>
        <line x1="132" y1="65" x2="142" y2="108" stroke-width="8"/>
      </g>
    `;
  }
  if (hairId === 'curtain') {
    return `<path d="M 65 65 C 64 35 136 35 135 65 Q 115 50 102 68 Q 98 68 85 50 Q 66 50 65 65 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3"/>`;
  }
  return '';
}

function drawGlassesSVG(glassId) {
  if (glassId === 'none') return '';
  if (glassId === 'nerd_black') {
    return `
      <g>
        <rect x="66" y="74" width="30" height="22" rx="6" fill="rgba(255,255,255,0.2)" stroke="#1e293b" stroke-width="4"/>
        <rect x="104" y="74" width="30" height="22" rx="6" fill="rgba(255,255,255,0.2)" stroke="#1e293b" stroke-width="4"/>
        <line x1="96" y1="81" x2="104" y2="81" stroke="#1e293b" stroke-width="4"/>
        <line x1="54" y1="81" x2="66" y2="81" stroke="#1e293b" stroke-width="3"/>
        <line x1="134" y1="81" x2="146" y2="81" stroke="#1e293b" stroke-width="3"/>
        <line x1="70" y1="78" x2="78" y2="78" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        <line x1="108" y1="78" x2="116" y2="78" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      </g>
    `;
  }
  if (glassId === 'round_gold') {
    return `
      <g>
        <circle cx="81" cy="85" r="13" fill="rgba(255,255,255,0.2)" stroke="#fbbf24" stroke-width="3.5"/>
        <circle cx="119" cy="85" r="13" fill="rgba(255,255,255,0.2)" stroke="#fbbf24" stroke-width="3.5"/>
        <line x1="94" y1="85" x2="106" y2="85" stroke="#fbbf24" stroke-width="3.5"/>
      </g>
    `;
  }
  if (glassId === 'sun_wayfarer') {
    return `
      <g>
        <path d="M 64 74 L 97 74 L 92 95 L 68 95 Z" fill="#1e293b" stroke="#1e293b" stroke-width="2"/>
        <path d="M 103 74 L 136 74 L 132 95 L 108 95 Z" fill="#1e293b" stroke="#1e293b" stroke-width="2"/>
        <line x1="97" y1="76" x2="103" y2="76" stroke="#1e293b" stroke-width="3"/>
      </g>
    `;
  }
  if (glassId === 'cat_eye') {
    return `
      <g>
        <path d="M 62 72 Q 80 72 96 78 Q 80 96 66 90 Z" fill="#ec4899" stroke="#1e293b" stroke-width="2"/>
        <path d="M 138 72 Q 120 72 104 78 Q 120 96 134 90 Z" fill="#ec4899" stroke="#1e293b" stroke-width="2"/>
        <line x1="96" y1="78" x2="104" y2="78" stroke="#1e293b" stroke-width="3"/>
      </g>
    `;
  }
  return '';
}

function drawHatSVG(hatId) {
  if (hatId === 'none') return '';
  if (hatId === 'duo_green_cap') {
    return `
      <g>
        <path d="M 62 56 Q 100 24 138 56 Z" fill="#58cc02" stroke="#1e293b" stroke-width="3"/>
        <path d="M 120 52 Q 155 55 160 62 Q 130 62 120 52 Z" fill="#46a302" stroke="#1e293b" stroke-width="2.5"/>
        <circle cx="100" cy="40" r="7" fill="#ffffff" stroke="#1e293b" stroke-width="1.5"/>
        <text x="100" y="43.5" font-size="8" font-weight="900" text-anchor="middle" fill="#58cc02">d</text>
      </g>
    `;
  }
  if (hatId === 'purple_cap') {
    return `
      <g>
        <path d="M 62 56 Q 100 24 138 56 Z" fill="#ce82ff" stroke="#1e293b" stroke-width="3"/>
        <path d="M 120 52 Q 155 55 160 62 Q 130 62 120 52 Z" fill="#a559d8" stroke="#1e293b" stroke-width="2.5"/>
      </g>
    `;
  }
  if (hatId === 'beanie') {
    return `
      <g>
        <circle cx="100" cy="22" r="9" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
        <path d="M 62 60 Q 100 26 138 60 Z" fill="#ce82ff" stroke="#1e293b" stroke-width="3"/>
        <rect x="58" y="54" width="84" height="12" rx="5" fill="#a559d8" stroke="#1e293b" stroke-width="2.5"/>
      </g>
    `;
  }
  if (hatId === 'crown') {
    return `
      <g>
        <polygon points="70,48 78,25 90,38 100,20 110,38 122,25 130,48" fill="#fbbf24" stroke="#1e293b" stroke-width="3"/>
        <circle cx="100" cy="28" r="3.5" fill="#ef4444"/>
      </g>
    `;
  }
  if (hatId === 'headband') {
    return `
      <g>
        <path d="M 64 60 Q 100 44 136 60" stroke="#ec4899" stroke-width="6" fill="none"/>
        <circle cx="122" cy="48" r="8" fill="#ec4899" stroke="#1e293b" stroke-width="2"/>
      </g>
    `;
  }
  return '';
}

function drawOutfitSVG(outfitId) {
  if (outfitId === 'overalls') {
    return `
      <g id="outfit_group">
        <!-- Turtleneck Sweater -->
        <path d="M 65 125 C 65 115 135 115 135 125 L 145 220 L 55 220 Z" fill="#1cb0f6" stroke="#1e293b" stroke-width="3"/>
        <rect x="85" y="115" width="30" height="15" rx="5" fill="#1cb0f6" stroke="#1e293b" stroke-width="2.5"/>
        <!-- Denim Overalls -->
        <path d="M 72 142 L 72 220 L 128 220 L 128 142 Z" fill="#1b4965" stroke="#1e293b" stroke-width="3"/>
        <rect x="78" y="142" width="12" height="50" fill="#143642"/>
        <rect x="110" y="142" width="12" height="50" fill="#143642"/>
        <circle cx="84" cy="154" r="2.5" fill="#fbbf24"/>
        <circle cx="116" cy="154" r="2.5" fill="#fbbf24"/>
      </g>
    `;
  }
  if (outfitId === 'duo_hoodie') {
    return `
      <g id="outfit_group">
        <path d="M 65 125 C 65 115 135 115 135 125 L 145 220 L 55 220 Z" fill="#58cc02" stroke="#1e293b" stroke-width="3"/>
        <path d="M 88 125 L 100 144 L 112 125" fill="none" stroke="#1e293b" stroke-width="2.5"/>
        <circle cx="100" cy="162" r="11" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
        <text x="100" y="166" font-size="13" font-weight="900" text-anchor="middle" fill="#58cc02">d</text>
      </g>
    `;
  }
  if (outfitId === 'polo_shirt') {
    return `
      <g id="outfit_group">
        <path d="M 65 125 C 65 115 135 115 135 125 L 145 220 L 55 220 Z" fill="#ffc800" stroke="#1e293b" stroke-width="3"/>
        <polygon points="85,125 100,140 115,125" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
      </g>
    `;
  }
  if (outfitId === 'hero_cape') {
    return `
      <g id="outfit_group">
        <path d="M 48 130 Q 100 145 152 130 L 162 220 L 38 220 Z" fill="#dc2626" stroke="#1e293b" stroke-width="3"/>
        <path d="M 65 125 C 65 115 135 115 135 125 L 145 220 L 55 220 Z" fill="#1cb0f6" stroke="#1e293b" stroke-width="3"/>
        <circle cx="100" cy="155" r="12" fill="#fbbf24" stroke="#1e293b" stroke-width="2"/>
        <text x="100" y="160" font-size="12" text-anchor="middle">⚡</text>
      </g>
    `;
  }
  if (outfitId === 'lab_coat') {
    return `
      <g id="outfit_group">
        <path d="M 65 125 C 65 115 135 115 135 125 L 145 220 L 55 220 Z" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <path d="M 88 125 L 100 148 L 112 125" fill="#1cb0f6"/>
        <line x1="100" y1="148" x2="100" y2="220" stroke="#1e293b" stroke-width="2.5"/>
      </g>
    `;
  }
  if (outfitId === 'sports_jersey') {
    return `
      <g id="outfit_group">
        <path d="M 65 125 C 65 115 135 115 135 125 L 145 220 L 55 220 Z" fill="#ef4444" stroke="#1e293b" stroke-width="3"/>
        <text x="100" y="168" font-size="22" font-weight="900" text-anchor="middle" fill="#ffffff">10</text>
      </g>
    `;
  }
  return '';
}

function drawPetSVG(petId) {
  if (petId === 'none') return '';
  if (petId === 'duo_owl') {
    return `
      <g transform="translate(138, 142)">
        <ellipse cx="20" cy="24" rx="16" ry="19" fill="#58cc02" stroke="#1e293b" stroke-width="2.5"/>
        <ellipse cx="20" cy="28" rx="11" ry="12" fill="#89e219"/>
        <circle cx="13" cy="20" r="6.5" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>
        <circle cx="27" cy="20" r="6.5" fill="#ffffff" stroke="#1e293b" stroke-width="1.8"/>
        <circle cx="13" cy="20" r="3" fill="#1cb0f6"/>
        <circle cx="27" cy="20" r="3" fill="#1cb0f6"/>
        <polygon points="20,23 16,28 24,28" fill="#ff9600"/>
      </g>
    `;
  }
  if (petId === 'dog_caramelo') {
    return `
      <g transform="translate(136, 140)">
        <ellipse cx="8" cy="16" rx="6" ry="12" fill="#78350f" stroke="#1e293b" stroke-width="2"/>
        <ellipse cx="32" cy="16" rx="6" ry="12" fill="#78350f" stroke="#1e293b" stroke-width="2"/>
        <circle cx="20" cy="22" r="14" fill="#fbbf24" stroke="#1e293b" stroke-width="2.5"/>
        <circle cx="15" cy="19" r="2.5" fill="#1e293b"/>
        <circle cx="25" cy="19" r="2.5" fill="#1e293b"/>
        <circle cx="20" cy="24" r="2.5" fill="#1e293b"/>
      </g>
    `;
  }
  if (petId === 'cat_miau') {
    return `
      <g transform="translate(136, 140)">
        <polygon points="6,12 12,2 16,14" fill="#ef4444" stroke="#1e293b" stroke-width="2"/>
        <polygon points="34,12 28,2 24,14" fill="#ef4444" stroke="#1e293b" stroke-width="2"/>
        <circle cx="20" cy="22" r="13" fill="#ff758f" stroke="#1e293b" stroke-width="2.5"/>
        <circle cx="15" cy="20" r="2" fill="#1e293b"/>
        <circle cx="25" cy="20" r="2" fill="#1e293b"/>
      </g>
    `;
  }
  if (petId === 'baby_dino') {
    return `
      <g transform="translate(136, 140)">
        <circle cx="20" cy="22" r="14" fill="#58cc02" stroke="#1e293b" stroke-width="2.5"/>
        <circle cx="15" cy="18" r="2.5" fill="#ffffff"/>
        <circle cx="15" cy="18" r="1" fill="#1e293b"/>
      </g>
    `;
  }
  return '';
}

// ==========================================
// TILE CARD PREVIEW GENERATOR (SINGLE ITEM)
// ==========================================
function generateItemTileSVG(category, itemId, hairColor = '#1a1a1a') {
  if (category === 'skin') {
    return `
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="24" fill="${itemId}" stroke="#1e293b" stroke-width="3"/>
        <circle cx="22" cy="26" r="3" fill="#1e293b"/>
        <circle cx="38" cy="26" r="3" fill="#1e293b"/>
        <path d="M 22 34 Q 30 42 38 34" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  if (category === 'hair') {
    const hairSvg = drawHairSVG(itemId, hairColor);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        <!-- Neutral Head Silhouette -->
        <rect x="65" y="55" width="70" height="75" rx="25" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="3"/>
        ${hairSvg}
      </svg>
    `;
  }

  if (category === 'glasses') {
    const glassSvg = drawGlassesSVG(itemId);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        ${itemId === 'none' ? '<text x="100" y="115" font-size="40" text-anchor="middle">🚫</text>' : glassSvg}
      </svg>
    `;
  }

  if (category === 'hats') {
    const hatSvg = drawHatSVG(itemId);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        ${itemId === 'none' ? '<text x="100" y="115" font-size="40" text-anchor="middle">🚫</text>' : hatSvg}
      </svg>
    `;
  }

  if (category === 'clothes') {
    const outfitSvg = drawOutfitSVG(itemId);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        ${outfitSvg}
      </svg>
    `;
  }

  if (category === 'pets') {
    const petSvg = drawPetSVG(itemId);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        ${itemId === 'none' ? '<text x="100" y="115" font-size="40" text-anchor="middle">🚫</text>' : petSvg.replace('translate(138, 142)', 'translate(75, 70) scale(1.4)').replace('translate(136, 140)', 'translate(75, 70) scale(1.4)')}
      </svg>
    `;
  }

  return '';
}

// ==========================================
// ASSEMBLED FULL AVATAR CANVAS PREVIEW
// ==========================================
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const skin = config.skinColor || '#f4c49c';
  const hairStl = config.hairStyle || 'short_spiky';
  const hairCol = config.hairColor || '#1a1a1a';
  const glass = config.glasses || 'nerd_black';
  const hat = config.hats || 'none';
  const outfit = config.outfit || 'overalls';
  const pet = config.pet || 'none';
  const bgColor = config.bg || '#e55b5b';

  const bgSVG = isTilePreview ? '' : `<rect width="200" height="240" rx="20" fill="${bgColor}" />`;

  const headSVG = `
    <!-- Neck -->
    <rect x="92" y="112" width="16" height="20" fill="${skin}" stroke="#1e293b" stroke-width="3"/>
    
    <!-- Ears -->
    <circle cx="62" cy="85" r="8" fill="${skin}" stroke="#1e293b" stroke-width="3"/>
    <circle cx="138" cy="85" r="8" fill="${skin}" stroke="#1e293b" stroke-width="3"/>

    <!-- Cute Head Squircle -->
    <rect x="65" y="52" width="70" height="72" rx="24" fill="${skin}" stroke="#1e293b" stroke-width="3.5"/>

    <!-- Bochechas Coradas -->
    <ellipse cx="76" cy="94" rx="6" ry="3.5" fill="#ff4b4b" opacity="0.25"/>
    <ellipse cx="124" cy="94" rx="6" ry="3.5" fill="#ff4b4b" opacity="0.25"/>

    <!-- Olhos Fofos Duolingo -->
    <circle cx="81" cy="82" r="6" fill="#1e293b"/>
    <circle cx="119" cy="82" r="6" fill="#1e293b"/>
    <circle cx="83" cy="80" r="2" fill="#ffffff"/>
    <circle cx="121" cy="80" r="2" fill="#ffffff"/>

    <!-- Sobrancelhas -->
    <path d="M 74 72 Q 81 67 88 72" fill="none" stroke="${hairCol}" stroke-width="3" stroke-linecap="round"/>
    <path d="M 112 72 Q 119 67 126 72" fill="none" stroke="${hairCol}" stroke-width="3" stroke-linecap="round"/>

    <!-- Narizinho -->
    <path d="M 98 86 Q 100 89 102 86" fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round"/>

    <!-- Sorriso Duolingo com Língua -->
    <path d="M 88 95 Q 100 110 112 95 Z" fill="#9e2a2b" stroke="#1e293b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 92 102 Q 100 98 108 102 Q 100 108 92 102 Z" fill="#ff758f"/>
  `;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
      ${bgSVG}
      <g id="avatar_assembled">
        ${drawOutfitSVG(outfit)}
        ${headSVG}
        ${drawHairSVG(hairStl, hairCol)}
        ${drawGlassesSVG(glass)}
        ${drawHatSVG(hat)}
        ${drawPetSVG(pet)}
      </g>
    </svg>
  `;
}

if (typeof window !== 'undefined') {
  window.DUOLINGO_AVATAR_PRESETS = DUOLINGO_AVATAR_PRESETS;
  window.generateAvatarSVG = generateAvatarSVG;
  window.generateItemTileSVG = generateItemTileSVG;
}

if (typeof module !== 'undefined') {
  module.exports = { DUOLINGO_AVATAR_PRESETS, generateAvatarSVG, generateItemTileSVG };
}
