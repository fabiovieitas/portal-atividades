/**
 * Official Duolingo Flat Vector Avatar Engine (1:1 Replica)
 * Key Aesthetic Principles:
 * 1. NO BLACK STROKE OUTLINES (Pure Flat Vector Art)
 * 2. Warm pastel skin tones (#f7cba4)
 * 3. Cute wedge nose (#e69678)
 * 4. High-contrast slate hair/beard (#383e45)
 * 5. Glasses with silver pin dots
 * 6. Smooth turtleneck & overalls body proportions
 */

const DUOLINGO_AVATAR_PRESETS = {
  skinColors: [
    { id: '#f7cba4', label: 'Duolingo Classic' },
    { id: '#ffdfc4', label: 'Pêssego Claro' },
    { id: '#e8b488', label: 'Bege Dourado' },
    { id: '#c48454', label: 'Bronzeado' },
    { id: '#884820', label: 'Chocolate' },
    { id: '#5c280c', label: 'Ébano' }
  ],

  hairStyles: [
    { id: 'duo_executive', label: 'Executivo Duolingo' },
    { id: 'duo_spiky', label: 'Espetado Moderno' },
    { id: 'duo_afro', label: 'Afro Volumoso' },
    { id: 'duo_long_wavy', label: 'Ondulado Longo' },
    { id: 'duo_pigtails', label: 'Maria-Chiquinha' },
    { id: 'duo_top_bun', label: 'Coque Alto' },
    { id: 'duo_bob', label: 'Franja Bob' },
    { id: 'bald', label: 'Rente / Careca' }
  ],

  hairColors: [
    { id: '#383e45', label: 'Grafite Duolingo' },
    { id: '#1a1a1a', label: 'Preto' },
    { id: '#5c3826', label: 'Castanho' },
    { id: '#d99738', label: 'Loiro' },
    { id: '#c94a2b', label: 'Ruivo' },
    { id: '#1cb0f6', label: 'Azul Cyan' },
    { id: '#ec4899', label: 'Rosa' }
  ],

  beards: [
    { id: 'none', label: 'Sem Barba' },
    { id: 'duo_beard_full', label: 'Barba Duolingo' },
    { id: 'duo_stubble', label: 'Barba Rente' }
  ],

  glasses: [
    { id: 'none', label: 'Sem Óculos' },
    { id: 'duo_nerd_black', label: 'Óculos Nerd Duolingo' },
    { id: 'duo_round_gold', label: 'Óculos Redondo' },
    { id: 'duo_sunglasses', label: 'Óculos de Sol' }
  ],

  hats: [
    { id: 'none', label: 'Sem Chapéu' },
    { id: 'duo_green_cap', label: 'Boné Verde Duolingo "d"' },
    { id: 'purple_cap', label: 'Boné Roxo' },
    { id: 'beanie', label: 'Gorro de Lã' }
  ],

  outfits: [
    { id: 'overalls', label: 'Jardineira & Cacharrel' },
    { id: 'duo_hoodie', label: 'Moletom Verde Duolingo' },
    { id: 'polo_shirt', label: 'Camisa Polo' },
    { id: 'hero_suit', label: 'Traje de Herói' }
  ],

  pets: [
    { id: 'none', label: 'Sem Mascote' },
    { id: 'duo_owl', label: 'Corujinha Duo 🦉' },
    { id: 'dog_caramelo', label: 'Cachorrinho 🐶' }
  ],

  bgColors: [
    '#e55b5b', '#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff9600', '#202f36'
  ]
};

// ==========================================
// PURE FLAT VECTOR DRAWING (NO OUTLINES)
// ==========================================

function drawHairFlat(hairId, hairCol = '#383e45') {
  if (hairId === 'bald') return '';
  if (hairId === 'duo_executive') {
    return `<path d="M 52 75 C 48 30 152 30 148 75 Q 120 48 100 48 Q 80 48 52 75 Z" fill="${hairCol}"/>`;
  }
  if (hairId === 'duo_spiky') {
    return `<path d="M 56 75 C 50 35 95 20 100 20 C 115 20 144 35 144 75 L 134 52 L 118 60 L 100 38 L 82 56 L 68 46 Z" fill="${hairCol}"/>`;
  }
  if (hairId === 'duo_afro') {
    return `
      <g fill="${hairCol}">
        <circle cx="100" cy="56" r="44"/>
        <circle cx="60" cy="70" r="20"/>
        <circle cx="140" cy="70" r="20"/>
      </g>
    `;
  }
  if (hairId === 'duo_long_wavy') {
    return `<path d="M 50 78 C 45 28 155 28 150 78 Q 162 120 148 150 Q 138 115 140 85 Q 100 50 60 85 Q 62 115 52 150 Q 38 120 50 78 Z" fill="${hairCol}"/>`;
  }
  if (hairId === 'duo_pigtails') {
    return `
      <g fill="${hairCol}">
        <path d="M 52 75 Q 100 42 148 75 Q 125 54 100 54 Q 75 54 52 75 Z"/>
        <path d="M 50 75 Q 20 100 26 140 Q 42 120 50 88 Z"/>
        <path d="M 150 75 Q 180 100 174 140 Q 158 120 150 88 Z"/>
        <circle cx="48" cy="80" r="6" fill="#ec4899"/>
        <circle cx="152" cy="80" r="6" fill="#ec4899"/>
      </g>
    `;
  }
  if (hairId === 'duo_top_bun') {
    return `
      <g fill="${hairCol}">
        <circle cx="100" cy="28" r="22"/>
        <path d="M 54 75 Q 100 46 146 75 Q 124 55 100 55 Q 76 55 54 75 Z"/>
      </g>
    `;
  }
  if (hairId === 'duo_bob') {
    return `<path d="M 50 80 C 46 32 154 32 150 80 L 152 120 Q 138 95 140 75 Q 100 56 60 75 Q 62 95 48 120 Z" fill="${hairCol}"/>`;
  }
  return '';
}

function drawBeardFlat(beardId, hairCol = '#383e45') {
  if (beardId === 'duo_beard_full') {
    return `<path d="M 44 100 Q 44 156 100 156 Q 156 156 156 100 L 142 100 Q 142 140 100 140 Q 58 140 58 100 Z" fill="${hairCol}"/>`;
  }
  if (beardId === 'duo_stubble') {
    return `<path d="M 50 110 Q 50 150 100 150 Q 150 150 150 110 L 142 110 Q 142 140 100 140 Q 58 140 58 110 Z" fill="${hairCol}" opacity="0.4"/>`;
  }
  return '';
}

function drawGlassesFlat(glassId) {
  if (glassId === 'duo_nerd_black') {
    return `
      <g>
        <!-- Glasses Frame -->
        <rect x="58" y="84" width="40" height="32" rx="9" fill="none" stroke="#2b3036" stroke-width="6"/>
        <rect x="102" y="84" width="40" height="32" rx="9" fill="none" stroke="#2b3036" stroke-width="6"/>
        <line x1="98" y1="94" x2="102" y2="94" stroke="#2b3036" stroke-width="6"/>
        <!-- Silver Pins on Outer Corners -->
        <circle cx="64" cy="92" r="2.5" fill="#d1d5db"/>
        <circle cx="136" cy="92" r="2.5" fill="#d1d5db"/>
      </g>
    `;
  }
  if (glassId === 'duo_round_gold') {
    return `
      <g>
        <circle cx="78" cy="98" r="16" fill="none" stroke="#fbbf24" stroke-width="4.5"/>
        <circle cx="122" cy="98" r="16" fill="none" stroke="#fbbf24" stroke-width="4.5"/>
        <line x1="94" y1="98" x2="106" y2="98" stroke="#fbbf24" stroke-width="4.5"/>
      </g>
    `;
  }
  if (glassId === 'duo_sunglasses') {
    return `
      <g fill="#2b3036">
        <path d="M 56 86 L 98 86 L 93 112 L 63 112 Z"/>
        <path d="M 102 86 L 144 86 L 137 112 L 107 112 Z"/>
        <line x1="98" y1="89" x2="102" y2="89" stroke="#2b3036" stroke-width="5"/>
      </g>
    `;
  }
  return '';
}

function drawHatFlat(hatId) {
  if (hatId === 'duo_green_cap') {
    return `
      <g>
        <path d="M 54 62 Q 100 24 146 62 Z" fill="#58cc02"/>
        <path d="M 125 58 Q 165 60 172 68 Q 135 68 125 58 Z" fill="#46a302"/>
        <circle cx="100" cy="42" r="8" fill="#ffffff"/>
        <text x="100" y="46" font-size="9" font-weight="900" text-anchor="middle" fill="#58cc02">d</text>
      </g>
    `;
  }
  if (hatId === 'purple_cap') {
    return `
      <g>
        <path d="M 54 62 Q 100 24 146 62 Z" fill="#ce82ff"/>
        <path d="M 125 58 Q 165 60 172 68 Q 135 68 125 58 Z" fill="#a559d8"/>
      </g>
    `;
  }
  if (hatId === 'beanie') {
    return `
      <g>
        <circle cx="100" cy="22" r="10" fill="#ffffff"/>
        <path d="M 54 64 Q 100 26 146 64 Z" fill="#ce82ff"/>
        <rect x="50" y="58" width="100" height="14" rx="6" fill="#a559d8"/>
      </g>
    `;
  }
  return '';
}

function drawOutfitFlat(outfitId) {
  if (outfitId === 'overalls') {
    return `
      <g id="outfit_group">
        <!-- Turtleneck Sweater (Pure Blue Flat Vector) -->
        <path d="M 76 145 L 76 260 L 124 260 L 124 145 Z" fill="#36a9e1"/>
        <path d="M 35 260 L 76 160 L 124 160 L 165 260 Z" fill="#36a9e1"/>
        <!-- Denim Overalls -->
        <path d="M 62 195 Q 62 185 75 185 L 125 185 Q 138 185 138 195 L 138 260 L 62 260 Z" fill="#1b72a6"/>
        <rect x="74" y="185" width="12" height="24" fill="#155b87"/>
        <rect x="114" y="185" width="12" height="24" fill="#155b87"/>
      </g>
    `;
  }
  if (outfitId === 'duo_hoodie') {
    return `
      <g id="outfit_group">
        <path d="M 35 260 L 76 150 L 124 150 L 165 260 Z" fill="#58cc02"/>
        <path d="M 88 150 L 100 166 L 112 150" fill="none" stroke="#46a302" stroke-width="4"/>
        <circle cx="100" cy="195" r="14" fill="#ffffff"/>
        <text x="100" y="200" font-size="16" font-weight="900" text-anchor="middle" fill="#58cc02">d</text>
      </g>
    `;
  }
  if (outfitId === 'polo_shirt') {
    return `
      <g id="outfit_group">
        <path d="M 35 260 L 76 150 L 124 150 L 165 260 Z" fill="#ffc800"/>
        <polygon points="85,150 100,170 115,150" fill="#ffffff"/>
      </g>
    `;
  }
  if (outfitId === 'hero_suit') {
    return `
      <g id="outfit_group">
        <path d="M 25 160 Q 100 175 175 160 L 185 260 L 15 260 Z" fill="#dc2626"/>
        <path d="M 35 260 L 76 150 L 124 150 L 165 260 Z" fill="#1cb0f6"/>
        <circle cx="100" cy="190" r="14" fill="#fbbf24"/>
        <text x="100" y="195" font-size="14" text-anchor="middle">⚡</text>
      </g>
    `;
  }
  return '';
}

function drawPetFlat(petId) {
  if (petId === 'duo_owl') {
    return `
      <g transform="translate(138, 150)">
        <ellipse cx="20" cy="24" rx="16" ry="19" fill="#58cc02"/>
        <ellipse cx="20" cy="28" rx="11" ry="12" fill="#89e219"/>
        <circle cx="13" cy="20" r="6.5" fill="#ffffff"/>
        <circle cx="27" cy="20" r="6.5" fill="#ffffff"/>
        <circle cx="13" cy="20" r="3" fill="#1cb0f6"/>
        <circle cx="27" cy="20" r="3" fill="#1cb0f6"/>
        <polygon points="20,23 16,28 24,28" fill="#ff9600"/>
      </g>
    `;
  }
  if (petId === 'dog_caramelo') {
    return `
      <g transform="translate(136, 148)">
        <ellipse cx="8" cy="16" rx="6" ry="12" fill="#78350f"/>
        <ellipse cx="32" cy="16" rx="6" ry="12" fill="#78350f"/>
        <circle cx="20" cy="22" r="14" fill="#fbbf24"/>
        <circle cx="15" cy="19" r="2.5" fill="#1e293b"/>
        <circle cx="25" cy="19" r="2.5" fill="#1e293b"/>
        <circle cx="20" cy="24" r="2.5" fill="#1e293b"/>
      </g>
    `;
  }
  return '';
}

// ==========================================
// TILE CARD PREVIEW GENERATOR (SINGLE ITEM)
// ==========================================
function generateItemTileSVG(category, itemId, hairColor = '#383e45') {
  if (category === 'skin') {
    return `
      <svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="24" fill="${itemId}"/>
        <circle cx="22" cy="26" r="3" fill="#383e45"/>
        <circle cx="38" cy="26" r="3" fill="#383e45"/>
        <path d="M 22 34 Q 30 42 38 34" fill="none" stroke="#383e45" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  if (category === 'hair') {
    const hairSvg = drawHairFlat(itemId, hairColor);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        <rect x="52" y="65" width="96" height="90" rx="28" fill="#e2e8f0"/>
        ${hairSvg}
      </svg>
    `;
  }

  if (category === 'beards') {
    const beardSvg = drawBeardFlat(itemId, hairColor);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        <rect x="52" y="65" width="96" height="90" rx="28" fill="#f7cba4"/>
        ${beardSvg}
      </svg>
    `;
  }

  if (category === 'glasses') {
    const glassSvg = drawGlassesFlat(itemId);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        ${itemId === 'none' ? '<text x="100" y="115" font-size="40" text-anchor="middle">🚫</text>' : glassSvg}
      </svg>
    `;
  }

  if (category === 'hats') {
    const hatSvg = drawHatFlat(itemId);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        ${itemId === 'none' ? '<text x="100" y="115" font-size="40" text-anchor="middle">🚫</text>' : hatSvg}
      </svg>
    `;
  }

  if (category === 'clothes') {
    const outfitSvg = drawOutfitFlat(itemId);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        ${outfitSvg}
      </svg>
    `;
  }

  if (category === 'pets') {
    const petSvg = drawPetFlat(itemId);
    return `
      <svg width="70" height="70" viewBox="0 0 200 200">
        ${itemId === 'none' ? '<text x="100" y="115" font-size="40" text-anchor="middle">🚫</text>' : petSvg.replace('translate(138, 150)', 'translate(75, 70) scale(1.4)').replace('translate(136, 148)', 'translate(75, 70) scale(1.4)')}
      </svg>
    `;
  }

  return '';
}

// ==========================================
// ASSEMBLED DUOLINGO 1:1 FLAT AVATAR CANVAS
// ==========================================
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const skin = config.skinColor || '#f7cba4';
  const hairStl = config.hairStyle || 'duo_executive';
  const hairCol = config.hairColor || '#383e45';
  const beardStl = config.beard || 'duo_beard_full';
  const glass = config.glasses || 'duo_nerd_black';
  const hat = config.hats || 'none';
  const outfit = config.outfit || 'overalls';
  const pet = config.pet || 'none';
  const bgColor = config.bg || '#e55b5b';

  const bgSVG = isTilePreview ? '' : `<rect width="200" height="260" rx="20" fill="${bgColor}" />`;

  // Duolingo 1:1 Head Base (Pure Flat Vector, No Outlines)
  const headSVG = `
    <!-- Ears (Flat Circle) -->
    <circle cx="38" cy="108" r="14" fill="${skin}"/>
    <circle cx="162" cy="108" r="14" fill="${skin}"/>

    <!-- Head Squircle (Flat Vector) -->
    <rect x="52" y="65" width="96" height="90" rx="28" fill="${skin}"/>

    <!-- Beard / Hair Fade -->
    ${drawBeardFlat(beardStl, hairCol)}

    <!-- Eyebrows -->
    <path d="M 68 84 Q 80 80 92 84" fill="none" stroke="${hairCol}" stroke-width="4" stroke-linecap="round"/>
    <path d="M 108 84 Q 120 80 132 84" fill="none" stroke="${hairCol}" stroke-width="4" stroke-linecap="round"/>

    <!-- Duolingo Eyes (White Box + Blue Pupil) -->
    <rect x="66" y="88" width="30" height="26" rx="10" fill="#ffffff"/>
    <ellipse cx="82" cy="100" rx="7" ry="9" fill="#1cb0f6"/>
    <ellipse cx="80" cy="98" rx="3.5" ry="4.5" fill="#ffffff"/>

    <rect x="104" y="88" width="30" height="26" rx="10" fill="#ffffff"/>
    <ellipse cx="120" cy="100" rx="7" ry="9" fill="#1cb0f6"/>
    <ellipse cx="118" cy="98" rx="3.5" ry="4.5" fill="#ffffff"/>

    <!-- Cute Wedge Nose (#e69678) -->
    <path d="M 97 104 L 107 106 L 98 116 Z" fill="#e69678"/>

    <!-- Crescent Mouth (#992025) -->
    <path d="M 86 122 Q 100 136 114 122 Z" fill="#992025"/>
    <path d="M 92 127 Q 100 123 108 127 Q 100 133 92 127 Z" fill="#ff758f"/>
  `;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg">
      ${bgSVG}
      <g id="duo_1to1_avatar">
        ${drawOutfitFlat(outfit)}
        ${headSVG}
        ${drawHairFlat(hairStl, hairCol)}
        ${drawGlassesFlat(glass)}
        ${drawHatFlat(hat)}
        ${drawPetFlat(pet)}
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
