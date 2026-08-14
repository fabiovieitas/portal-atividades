/**
 * Exact Duolingo Avatar Generator System - Lab Kids
 * Faithfully reproduces the official Duolingo Avatar vector design:
 * Squircle Head shape, Duolingo blue glossy eyes, curved mouth with tongue,
 * exact skin tone swatches, Duolingo hats, glasses, hair styles, outfits, and background colors.
 */

const DUOLINGO_AVATAR_PRESETS = {
  genders: [
    { id: 'boy', label: 'Menino' },
    { id: 'girl', label: 'Menina' }
  ],
  skinColors: [
    '#3c2317', '#4a2c1d', '#5c3826', '#6e4530', '#80523b', '#925f46',
    '#a46c51', '#b6795c', '#c88667', '#da9372', '#ec9f7c', '#f5b08d',
    '#f8c1a4', '#fbc5ab', '#fde0d2'
  ],
  eyeColors: [
    '#1cb0f6', '#58cc02', '#ce82ff', '#78350f', '#0f172a', '#ff9600'
  ],
  eyeShapes: [
    { id: 'duolingo_classic', label: 'Clássico Duolingo' },
    { id: 'happy_smile', label: 'Sorridente' },
    { id: 'wink', label: 'Piscadinha' },
    { id: 'cool_stars', label: 'Estrelas' }
  ],
  hairStyles: [
    { id: 'none', label: 'Careca / Curto' },
    { id: 'duolingo_spiky', label: 'Espetado Duolingo' },
    { id: 'buzz', label: 'Curto Rente' },
    { id: 'side_part', label: 'Penteado Lado' },
    { id: 'afro_round', label: 'Afro Volumoso' },
    { id: 'wavy_bob', label: 'Ondulado' },
    { id: 'long_straight', label: 'Liso Longo' },
    { id: 'fringe_cut', label: 'Franja Reto' },
    { id: 'pigtails', label: 'Maria Chiquinha' },
    { id: 'high_bun', label: 'Coque Alto' },
    { id: 'curly_top', label: 'Cacheado Topo' }
  ],
  hairColors: [
    '#2b2b2b', '#4a3728', '#7c5234', '#a16538', '#d69956', '#e06d53',
    '#58cc02', '#1cb0f6', '#ce82ff', '#ff8400'
  ],
  glasses: [
    { id: 'none', label: 'Sem Óculos' },
    { id: 'duolingo_nerd', label: 'Óculos Preto Duolingo' },
    { id: 'round_gold', label: 'Óculos Redondo' },
    { id: 'sunglasses_cool', label: 'Óculos Escuros' }
  ],
  hats: [
    { id: 'none', label: 'Sem Chapéu' },
    { id: 'duolingo_green_cap', label: 'Boné Verde Duolingo' },
    { id: 'purple_cap', label: 'Boné Roxo' },
    { id: 'beanie_winter', label: 'Gorro de Lã' },
    { id: 'headscarf_purple', label: 'Turbante Roxo' }
  ],
  outfits: [
    { id: 'overalls_turtleneck', label: 'Jardineira & Cacharrel' },
    { id: 'duolingo_hoodie', label: 'Moletom Verde Duolingo' },
    { id: 'school_polo', label: 'Camisa Polo' },
    { id: 'sports_jersey', label: 'Camiseta Esportiva' },
    { id: 'hero_cape_suit', label: 'Traje de Herói' }
  ],
  outfitColors: [
    '#1cb0f6', '#58cc02', '#ff4b4b', '#ffc800', '#ce82ff', '#ff9600', '#202f36', '#ffffff'
  ],
  pets: [
    { id: 'none', label: 'Sem Mascote' },
    { id: 'duo_owl', label: 'Corujinha Duo' },
    { id: 'dog_caramelo', label: 'Cachorrinho' },
    { id: 'cat_fofo', label: 'Gatinho' },
    { id: 'dino_rex', label: 'Dino Green' }
  ],
  bgColors: [
    '#e55b5b', '#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff9600', '#202f36', '#89e219', '#14d4f4'
  ]
};

/**
 * Generates exact Duolingo Vector Avatar SVG
 */
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const gender = config.gender || 'boy';
  const skin = config.skinColor || '#f8c1a4';
  const eyeCol = config.eyeColor || '#1cb0f6';
  const eyeShp = config.eyeShape || 'duolingo_classic';
  const hairStl = config.hairStyle || 'duolingo_spiky';
  const hairCol = config.hairColor || '#2b2b2b';
  const glass = config.glasses || 'duolingo_nerd';
  const hat = config.hats || 'none';
  const outfit = config.outfit || 'overalls_turtleneck';
  const outfitCol = config.outfitColor || '#1cb0f6';
  const pet = config.pet || 'none';
  const bgColor = config.bg || '#e55b5b';

  const isGirl = (gender === 'girl');

  // Background rect
  const bgSVG = isTilePreview ? '' : `<rect width="200" height="240" rx="16" fill="${bgColor}" />`;

  // Duolingo Squircle Head
  const headSVG = `
    <!-- Neck -->
    <rect x="88" y="115" width="24" height="25" fill="${skin}" />
    <!-- Squircle Head -->
    <rect x="48" y="48" width="104" height="84" rx="28" ry="24" fill="${skin}" stroke="#202f36" stroke-width="4"/>
    <!-- Ears -->
    <circle cx="44" cy="88" r="11" fill="${skin}" stroke="#202f36" stroke-width="3.5"/>
    <circle cx="156" cy="88" r="11" fill="${skin}" stroke="#202f36" stroke-width="3.5"/>
  `;

  // Duolingo Eyes & Eyebrows
  let eyesSVG = '';
  if (eyeShp === 'happy_smile') {
    eyesSVG = `
      <path d="M 68 88 Q 78 76 88 88" fill="none" stroke="#202f36" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M 112 88 Q 122 76 132 88" fill="none" stroke="#202f36" stroke-width="4.5" stroke-linecap="round"/>
    `;
  } else if (eyeShp === 'wink') {
    eyesSVG = `
      <!-- Left Eye Open -->
      <rect x="66" y="74" width="24" height="26" rx="10" fill="#ffffff" stroke="#202f36" stroke-width="3.5"/>
      <circle cx="78" cy="87" r="7" fill="${eyeCol}"/>
      <circle cx="81" cy="84" r="2.5" fill="#ffffff"/>
      <!-- Right Eye Wink -->
      <path d="M 112 88 Q 122 78 132 88" fill="none" stroke="#202f36" stroke-width="4.5" stroke-linecap="round"/>
    `;
  } else {
    // Duolingo Classic Big Blue Eyes
    eyesSVG = `
      <!-- Left Eye -->
      <rect x="65" y="72" width="26" height="28" rx="11" fill="#ffffff" stroke="#202f36" stroke-width="3.5"/>
      <ellipse cx="78" cy="86" rx="7.5" ry="9" fill="${eyeCol}"/>
      <ellipse cx="78" cy="88" rx="4.5" ry="5.5" fill="#0f172a"/>
      <circle cx="81" cy="82" r="3" fill="#ffffff"/>
      
      <!-- Right Eye -->
      <rect x="109" y="72" width="26" height="28" rx="11" fill="#ffffff" stroke="#202f36" stroke-width="3.5"/>
      <ellipse cx="122" cy="86" rx="7.5" ry="9" fill="${eyeCol}"/>
      <ellipse cx="122" cy="88" rx="4.5" ry="5.5" fill="#0f172a"/>
      <circle cx="125" cy="82" r="3" fill="#ffffff"/>
    `;
  }

  // Eyebrows
  const eyebrowsSVG = `
    <path d="M 66 65 Q 78 60 88 66" fill="none" stroke="${hairCol}" stroke-width="${isGirl ? 3.5 : 4.5}" stroke-linecap="round"/>
    <path d="M 112 66 Q 122 60 134 65" fill="none" stroke="${hairCol}" stroke-width="${isGirl ? 3.5 : 4.5}" stroke-linecap="round"/>
  `;

  // Nose & Cute Tongue Mouth
  const noseMouthSVG = `
    <!-- Cute Pointy Nose -->
    <polygon points="100,88 95,96 102,96" fill="#e07a5f"/>
    <!-- Duolingo Open Smile Mouth with Tongue -->
    <path d="M 82 104 Q 100 122 118 104 Z" fill="#9e2a2b" stroke="#202f36" stroke-width="3.5"/>
    <path d="M 90 114 Q 100 108 110 114 Q 100 122 90 114 Z" fill="#ff758f"/>
  `;

  // Hair Styles Vector
  let hairSVG = '';
  if (hairStl === 'duolingo_spiky') {
    hairSVG = `
      <path d="M 52 64 C 48 38 85 24 100 24 C 120 24 148 38 148 64 L 140 45 L 122 55 L 100 35 L 78 52 L 58 42 Z" fill="${hairCol}" stroke="#202f36" stroke-width="3.5"/>
    `;
  } else if (hairStl === 'buzz') {
    hairSVG = `
      <path d="M 48 68 Q 100 34 152 68 Q 135 52 100 52 Q 65 52 48 68 Z" fill="${hairCol}" stroke="#202f36" stroke-width="3"/>
    `;
  } else if (hairStl === 'side_part') {
    hairSVG = `
      <path d="M 46 72 Q 100 32 154 72 Q 130 52 100 52 Q 68 52 46 72 Z" fill="${hairCol}" stroke="#202f36" stroke-width="3.5"/>
    `;
  } else if (hairStl === 'afro_round') {
    hairSVG = `
      <circle cx="100" cy="56" r="42" fill="${hairCol}" stroke="#202f36" stroke-width="4"/>
    `;
  } else if (hairStl === 'wavy_bob') {
    hairSVG = `
      <path d="M 44 75 Q 46 28 100 28 Q 154 28 156 75 Q 164 110 152 125 Q 140 100 144 75 Q 100 42 56 75 Q 60 100 48 125 Z" fill="${hairCol}" stroke="#202f36" stroke-width="3.5"/>
    `;
  } else if (hairStl === 'long_straight') {
    hairSVG = `
      <path d="M 44 80 C 40 30 160 30 156 80 L 160 150 C 160 150 142 135 146 80 Q 100 45 54 80 C 58 135 40 150 40 150 Z" fill="${hairCol}" stroke="#202f36" stroke-width="3.5"/>
    `;
  } else if (hairStl === 'pigtails') {
    hairSVG = `
      <path d="M 48 70 Q 100 36 152 70 Q 130 48 100 48 Q 70 48 48 70 Z" fill="${hairCol}" stroke="#202f36" stroke-width="3"/>
      <path d="M 46 70 Q 18 90 24 125 Q 38 110 44 80 Z" fill="${hairCol}" stroke="#202f36" stroke-width="3"/>
      <path d="M 154 70 Q 182 90 176 125 Q 162 110 156 80 Z" fill="${hairCol}" stroke="#202f36" stroke-width="3"/>
    `;
  } else if (hairStl === 'high_bun') {
    hairSVG = `
      <circle cx="100" cy="24" r="20" fill="${hairCol}" stroke="#202f36" stroke-width="3.5"/>
      <path d="M 48 72 Q 100 42 152 72 Q 130 52 100 52 Q 70 52 48 72 Z" fill="${hairCol}" stroke="#202f36" stroke-width="3"/>
    `;
  }

  // Glasses (Nerd Glasses as in screenshot)
  let glassesSVG = '';
  if (glass === 'duolingo_nerd') {
    glassesSVG = `
      <rect x="58" y="70" width="38" height="28" rx="8" fill="none" stroke="#202f36" stroke-width="5"/>
      <rect x="104" y="70" width="38" height="28" rx="8" fill="none" stroke="#202f36" stroke-width="5"/>
      <line x1="96" y1="78" x2="104" y2="78" stroke="#202f36" stroke-width="5"/>
      <line x1="44" y1="78" x2="58" y2="78" stroke="#202f36" stroke-width="4"/>
      <line x1="142" y1="78" x2="156" y2="78" stroke="#202f36" stroke-width="4"/>
    `;
  } else if (glass === 'round_gold') {
    glassesSVG = `
      <circle cx="76" cy="84" r="16" fill="none" stroke="#fbbf24" stroke-width="4"/>
      <circle cx="124" cy="84" r="16" fill="none" stroke="#fbbf24" stroke-width="4"/>
      <line x1="92" y1="84" x2="108" y2="84" stroke="#fbbf24" stroke-width="4"/>
    `;
  }

  // Hats & Caps
  let hatSVG = '';
  if (hat === 'duolingo_green_cap') {
    hatSVG = `
      <path d="M 46 62 Q 100 24 154 62 Z" fill="#58cc02" stroke="#202f36" stroke-width="3.5"/>
      <path d="M 125 58 Q 168 62 175 70 Q 140 70 125 58 Z" fill="#46a302" stroke="#202f36" stroke-width="2.5"/>
      <circle cx="100" cy="45" r="7" fill="#ffffff"/>
      <text x="100" y="49" font-size="8" font-weight="900" text-anchor="middle" fill="#58cc02">d</text>
    `;
  } else if (hat === 'purple_cap') {
    hatSVG = `
      <path d="M 46 62 Q 100 24 154 62 Z" fill="#ce82ff" stroke="#202f36" stroke-width="3.5"/>
      <path d="M 125 58 Q 168 62 175 70 Q 140 70 125 58 Z" fill="#a559d8" stroke="#202f36" stroke-width="2.5"/>
    `;
  } else if (hat === 'beanie_winter') {
    hatSVG = `
      <path d="M 44 65 Q 100 20 156 65 Z" fill="#ce82ff" stroke="#202f36" stroke-width="3.5"/>
      <rect x="42" y="60" width="116" height="14" rx="6" fill="#a559d8" stroke="#202f36" stroke-width="3"/>
    `;
  }

  // Outfits (Overalls & Turtleneck as in screenshot)
  let outfitSVG = '';
  if (outfit === 'overalls_turtleneck') {
    outfitSVG = `
      <!-- High Turtleneck Sweater -->
      <path d="M 42 135 C 42 120 158 120 158 135 L 175 240 L 25 240 Z" fill="${outfitCol}" stroke="#202f36" stroke-width="4"/>
      <rect x="80" y="125" width="40" height="20" rx="6" fill="${outfitCol}" stroke="#202f36" stroke-width="3"/>
      <!-- Overalls Straps & Pants -->
      <path d="M 60 160 L 60 240 L 140 240 L 140 160 Z" fill="#1b4965" stroke="#202f36" stroke-width="3.5"/>
      <rect x="72" y="160" width="14" height="60" fill="#143642"/>
      <rect x="114" y="160" width="14" height="60" fill="#143642"/>
    `;
  } else if (outfit === 'duolingo_hoodie') {
    outfitSVG = `
      <path d="M 42 135 C 42 120 158 120 158 135 L 175 240 L 25 240 Z" fill="#58cc02" stroke="#202f36" stroke-width="4"/>
      <path d="M 85 135 L 100 160 L 115 135" fill="none" stroke="#202f36" stroke-width="3"/>
      <circle cx="100" cy="175" r="12" fill="#ffffff" stroke="#202f36" stroke-width="2"/>
      <text x="100" y="180" font-size="14" font-weight="900" text-anchor="middle" fill="#58cc02">d</text>
    `;
  } else {
    // School Polo
    outfitSVG = `
      <path d="M 42 135 C 42 120 158 120 158 135 L 175 240 L 25 240 Z" fill="${outfitCol}" stroke="#202f36" stroke-width="4"/>
      <polygon points="80,135 100,160 120,135 110,135 100,145 90,135" fill="#ffffff" stroke="#202f36" stroke-width="2.5"/>
    `;
  }

  // Pet
  let petSVG = '';
  if (pet === 'duo_owl') {
    petSVG = `
      <!-- Duo Owl Pet -->
      <g transform="translate(138, 140) scale(0.95)">
        <ellipse cx="25" cy="30" rx="20" ry="24" fill="#58cc02" stroke="#202f36" stroke-width="3"/>
        <ellipse cx="25" cy="35" rx="14" ry="15" fill="#89e219"/>
        <circle cx="16" cy="24" r="8" fill="#ffffff" stroke="#202f36" stroke-width="2"/>
        <circle cx="34" cy="24" r="8" fill="#ffffff" stroke="#202f36" stroke-width="2"/>
        <circle cx="16" cy="24" r="4" fill="#1cb0f6"/>
        <circle cx="34" cy="24" r="4" fill="#1cb0f6"/>
        <polygon points="25,28 21,34 29,34" fill="#ff9600"/>
      </g>
    `;
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" style="border-radius: 16px; overflow: hidden; display: inline-block; vertical-align: middle;">
      ${bgSVG}
      <g id="duo_avatar_character">
        ${outfitSVG}
        ${headSVG}
        ${eyebrowsSVG}
        ${eyesSVG}
        ${noseMouthSVG}
        ${hairSVG}
        ${glassesSVG}
        ${hatSVG}
        ${petSVG}
      </g>
    </svg>
  `;
}

if (typeof window !== 'undefined') {
  window.DUOLINGO_AVATAR_PRESETS = DUOLINGO_AVATAR_PRESETS;
  window.AVATAR_PRESETS = DUOLINGO_AVATAR_PRESETS;
  window.generateAvatarSVG = generateAvatarSVG;
}

if (typeof module !== 'undefined') {
  module.exports = { DUOLINGO_AVATAR_PRESETS, generateAvatarSVG };
}
