/**
 * Advanced Human Avatar Generator System - Lab Kids (Duolingo Style)
 * Strictly Human Characters with rich customization layers:
 * Gender, Skin Tones, Eye Shape & Color, Hair Style & Color, Expressions/Emotions,
 * Clothes & Colors, Accessories, Companion Pets, and Backgrounds.
 */

const HUMAN_AVATAR_PRESETS = {
  genders: [
    { id: 'boy', label: 'Menino 👦' },
    { id: 'girl', label: 'Menina 👧' }
  ],
  skinColors: [
    { id: '#ffe0bd', label: 'Claríssimo' },
    { id: '#ffdbac', label: 'Claro' },
    { id: '#f1c27d', label: 'Dourado' },
    { id: '#e0ac69', label: 'Moreno' },
    { id: '#c68642', label: 'Canela' },
    { id: '#8d5524', label: 'Negro' },
    { id: '#5c3818', label: 'Escuro' }
  ],
  eyeColors: [
    { id: '#3b82f6', label: 'Azul' },
    { id: '#10b981', label: 'Verde' },
    { id: '#78350f', label: 'Castanho' },
    { id: '#0f172a', label: 'Preto' },
    { id: '#d97706', label: 'Mel' }
  ],
  eyeShapes: [
    { id: 'round', label: 'Expressivos 👀' },
    { id: 'almond', label: 'Amendoados ✨' },
    { id: 'happy', label: 'Sorridentes 😊' },
    { id: 'wink', label: 'Piscando 😜' }
  ],
  emotions: [
    { id: 'happy_smile', label: 'Super Feliz 😀' },
    { id: 'cool_grin', label: 'Espertinho 😎' },
    { id: 'excited', label: 'Empolgado 🤩' },
    { id: 'sweet_blush', label: 'Fofo 😊' }
  ],
  hairStyles: [
    { id: 'short_spiky', label: 'Curto Espetado' },
    { id: 'short_smooth', label: 'Curto Liso' },
    { id: 'curly_afro', label: 'Cacheado / Afro' },
    { id: 'wavy_medium', label: 'Ondulado Médio' },
    { id: 'pigtails', label: 'Maria Chiquinha' },
    { id: 'top_bun', label: 'Coque Alto' },
    { id: 'long_fringe', label: 'Liso com Franja' },
    { id: 'dreads', label: 'Dreadlocks' }
  ],
  hairColors: [
    { id: '#0f172a', label: 'Preto' },
    { id: '#451a03', label: 'Castanho Escuro' },
    { id: '#78350f', label: 'Castanho Claro' },
    { id: '#b45309', label: 'Ruivo' },
    { id: '#f59e0b', label: 'Loiro' },
    { id: '#ec4899', label: 'Rosa Neo' },
    { id: '#06b6d4', label: 'Azul Cyan' },
    { id: '#8b5cf6', label: 'Roxo Magic' }
  ],
  outfits: [
    { id: 'lab_coat', label: 'Jaleco Cientista 🥼', defaultColor: '#ffffff' },
    { id: 'tech_hoodie', label: 'Moletom Gamer 🥷', defaultColor: '#6366f1' },
    { id: 'school_uniform', label: 'Uniforme Escolar 👔', defaultColor: '#2563eb' },
    { id: 'sports_jersey', label: 'Camisa Robótica 🎽', defaultColor: '#ef4444' },
    { id: 'hero_suit', label: 'Traje Super-Herói 🦸', defaultColor: '#f59e0b' },
    { id: 'summer_tshirt', label: 'Camiseta Casual 👕', defaultColor: '#10b981' }
  ],
  outfitColors: ['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#ffffff', '#0f172a'],
  accessories: [
    { id: 'none', label: 'Nenhum' },
    { id: 'glasses_round', label: 'Óculos de Grau 👓' },
    { id: 'vr_headset', label: 'Óculos VR 🥽' },
    { id: 'gamer_headset', label: 'Fone Gamer 🎧' },
    { id: 'cap_backwards', label: 'Boné 🧢' },
    { id: 'gold_crown', label: 'Coroa de Ouro 👑' },
    { id: 'headband', label: 'Tiara / Faixa 🎀' }
  ],
  pets: [
    { id: 'none', label: 'Nenhum Pet' },
    { id: 'dog', label: 'Cachorrinho 🐶' },
    { id: 'cat', label: 'Gatinho 🐱' },
    { id: 'mini_bot', label: 'Robô Auxiliar 🤖' },
    { id: 'owl', label: 'Coruja Sabida 🦉' },
    { id: 'dino', label: 'Baby Dino 🦖' }
  ],
  backgrounds: [
    { id: 'space', label: 'Espaço Sideral 🌌', grad: ['#0f172a', '#1e1b4b'] },
    { id: 'soccer', label: 'Campo de Futebol ⚽', grad: ['#15803d', '#166534'] },
    { id: 'classroom', label: 'Sala de Aula 🏫', grad: ['#1e3a8a', '#3b82f6'] },
    { id: 'sunset', label: 'Pôr do Sol 🌅', grad: ['#f97316', '#db2777'] },
    { id: 'cyber', label: 'Cyberpunk Neon ⚡', grad: ['#7c3aed', '#ec4899'] }
  ]
};

function generateAvatarSVG(config = {}, size = 120) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const gender = config.gender || 'boy';
  const skin = config.skinColor || '#ffdbac';
  const eyeCol = config.eyeColor || '#78350f';
  const eyeShp = config.eyeShape || 'round';
  const emotion = config.emotion || 'happy_smile';
  const hairStl = config.hairStyle || (gender === 'girl' ? 'wavy_medium' : 'short_spiky');
  const hairCol = config.hairColor || '#451a03';
  const outfit = config.outfit || 'tech_hoodie';
  const outfitCol = config.outfitColor || '#6366f1';
  const acc = config.accessory || 'none';
  const pet = config.pet || 'none';
  const bg = config.bg || 'space';

  // Background Gradient
  const bgObj = HUMAN_AVATAR_PRESETS.backgrounds.find(b => b.id === bg) || HUMAN_AVATAR_PRESETS.backgrounds[0];
  const gradStop1 = bgObj.grad[0];
  const gradStop2 = bgObj.grad[1];

  // Head & Neck
  const headShape = `
    <!-- Neck -->
    <rect x="86" y="125" width="28" height="25" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
    <!-- Head Base -->
    <path d="M 55 90 C 55 45 145 45 145 90 C 145 130 125 140 100 140 C 75 140 55 130 55 90 Z" fill="${skin}" stroke="#0f172a" stroke-width="4"/>
    <!-- Ears -->
    <circle cx="53" cy="95" r="9" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
    <circle cx="147" cy="95" r="9" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
  `;

  // Eyes & Eyebrows
  let eyesSVG = '';
  if (eyeShp === 'wink') {
    eyesSVG = `
      <circle cx="78" cy="88" r="6" fill="${eyeCol}" stroke="#0f172a" stroke-width="2"/>
      <path d="M 114 88 Q 122 80 128 88" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
    `;
  } else if (eyeShp === 'happy') {
    eyesSVG = `
      <path d="M 70 90 Q 78 80 86 90" fill="none" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
      <path d="M 114 90 Q 122 80 130 90" fill="none" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    `;
  } else {
    // Round / Almond
    const radius = eyeShp === 'almond' ? 5 : 7;
    eyesSVG = `
      <!-- White base -->
      <ellipse cx="78" cy="88" rx="${radius + 3}" ry="${radius + 1}" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <ellipse cx="122" cy="88" rx="${radius + 3}" ry="${radius + 1}" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <!-- Iris -->
      <circle cx="78" cy="88" r="${radius}" fill="${eyeCol}"/>
      <circle cx="122" cy="88" r="${radius}" fill="${eyeCol}"/>
      <!-- Pupil glow -->
      <circle cx="80" cy="86" r="2.5" fill="#ffffff"/>
      <circle cx="124" cy="86" r="2.5" fill="#ffffff"/>
    `;
  }

  // Eyebrows
  const eyebrows = `
    <path d="M 68 76 Q 78 72 88 77" fill="none" stroke="${hairCol}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 112 77 Q 122 72 132 76" fill="none" stroke="${hairCol}" stroke-width="3.5" stroke-linecap="round"/>
  `;

  // Mouth & Blush Expressions
  let mouthSVG = `
    <path d="M 85 112 Q 100 124 115 112" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
  `;
  let cheeksSVG = `
    <circle cx="68" cy="100" r="6" fill="#f43f5e" opacity="0.35"/>
    <circle cx="132" cy="100" r="6" fill="#f43f5e" opacity="0.35"/>
  `;

  if (emotion === 'excited') {
    mouthSVG = `
      <path d="M 82 110 Q 100 132 118 110 Z" fill="#dc2626" stroke="#0f172a" stroke-width="3"/>
      <path d="M 90 122 Q 100 128 110 122" fill="#f43f5e"/>
    `;
  } else if (emotion === 'cool_grin') {
    mouthSVG = `
      <path d="M 86 114 Q 105 118 118 108" fill="none" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    `;
  }

  // Hair Styles
  let hairSVG = '';
  if (hairStl === 'curly_afro') {
    hairSVG = `
      <path d="M 45 85 C 30 40 70 20 100 20 C 130 20 170 40 155 85 C 160 105 145 115 145 115 C 135 70 65 70 55 115 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (hairStl === 'wavy_medium') {
    hairSVG = `
      <path d="M 48 90 Q 50 35 100 35 Q 150 35 152 90 Q 165 130 155 145 Q 142 120 145 90 Q 100 50 55 90 Q 58 120 45 145 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (hairStl === 'pigtails') {
    hairSVG = `
      <!-- Base Top Hair -->
      <path d="M 50 85 Q 100 40 150 85 Q 130 55 100 55 Q 70 55 50 85 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
      <!-- Left Tail -->
      <path d="M 48 85 Q 20 100 25 135 Q 40 125 45 95 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
      <!-- Right Tail -->
      <path d="M 152 85 Q 180 100 175 135 Q 160 125 155 95 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (hairStl === 'top_bun') {
    hairSVG = `
      <!-- Bun on top -->
      <circle cx="100" cy="30" r="22" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
      <!-- Hair base -->
      <path d="M 50 85 Q 100 45 150 85 Q 130 60 100 60 Q 70 60 50 85 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (hairStl === 'long_fringe') {
    hairSVG = `
      <path d="M 48 95 C 45 35 155 35 152 95 Q 150 70 120 70 Q 100 85 80 70 Q 50 70 48 95 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (hairStl === 'short_smooth') {
    hairSVG = `
      <path d="M 52 85 Q 100 40 148 85 Q 135 60 100 60 Q 65 60 52 85 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (hairStl === 'dreads') {
    hairSVG = `
      <path d="M 50 80 Q 60 30 100 30 Q 140 30 150 80" stroke="${hairCol}" stroke-width="12" stroke-linecap="round" fill="none"/>
      <line x1="50" y1="80" x2="40" y2="120" stroke="${hairCol}" stroke-width="8" stroke-linecap="round"/>
      <line x1="65" y1="70" x2="58" y2="130" stroke="${hairCol}" stroke-width="8" stroke-linecap="round"/>
      <line x1="135" y1="70" x2="142" y2="130" stroke="${hairCol}" stroke-width="8" stroke-linecap="round"/>
      <line x1="150" y1="80" x2="160" y2="120" stroke="${hairCol}" stroke-width="8" stroke-linecap="round"/>
    `;
  } else {
    // Short Spiky
    hairSVG = `
      <polygon points="50,75 60,35 78,58 95,25 112,58 130,35 148,75" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  }

  // Outfit & Clothes
  let bodySVG = `
    <!-- Torso -->
    <path d="M 45 142 C 45 125 155 125 155 142 L 170 200 L 30 200 Z" fill="${outfitCol}" stroke="#0f172a" stroke-width="4"/>
    <path d="M 85 142 L 100 165 L 115 142" fill="none" stroke="#ffffff" stroke-width="4"/>
  `;

  if (outfit === 'lab_coat') {
    bodySVG = `
      <path d="M 40 142 Q 100 120 160 142 L 175 200 L 25 200 Z" fill="#ffffff" stroke="#0f172a" stroke-width="4"/>
      <path d="M 80 142 L 100 170 L 120 142" fill="${outfitCol}"/>
      <line x1="100" y1="170" x2="100" y2="200" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (outfit === 'school_uniform') {
    bodySVG = `
      <path d="M 42 142 C 42 125 158 125 158 142 L 175 200 L 25 200 Z" fill="${outfitCol}" stroke="#0f172a" stroke-width="4"/>
      <!-- Collar -->
      <polygon points="80,142 100,165 120,142 110,142 100,150 90,142" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    `;
  } else if (outfit === 'hero_suit') {
    bodySVG = `
      <!-- Cape -->
      <path d="M 30 145 Q 100 155 170 145 L 185 200 L 15 200 Z" fill="#dc2626" stroke="#0f172a" stroke-width="3"/>
      <!-- Suit -->
      <path d="M 45 142 C 45 125 155 125 155 142 L 170 200 L 30 200 Z" fill="${outfitCol}" stroke="#0f172a" stroke-width="4"/>
      <circle cx="100" cy="168" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <text x="100" y="173" font-size="14" font-weight="900" text-anchor="middle" fill="#dc2626">⚡</text>
    `;
  }

  // Accessories
  let accSVG = '';
  if (acc === 'vr_headset') {
    accSVG = `
      <rect x="58" y="72" width="84" height="32" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
      <line x1="68" y1="88" x2="132" y2="88" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <circle cx="76" cy="88" r="4" fill="#ef4444"/>
    `;
  } else if (acc === 'glasses_round') {
    accSVG = `
      <circle cx="76" cy="88" r="16" fill="none" stroke="#0f172a" stroke-width="4"/>
      <circle cx="124" cy="88" r="16" fill="none" stroke="#0f172a" stroke-width="4"/>
      <line x1="92" y1="88" x2="108" y2="88" stroke="#0f172a" stroke-width="4"/>
    `;
  } else if (acc === 'gamer_headset') {
    accSVG = `
      <path d="M 45 90 C 45 35 155 35 155 90" fill="none" stroke="#0f172a" stroke-width="6"/>
      <rect x="35" y="75" width="16" height="32" rx="6" fill="#a855f7" stroke="#0f172a" stroke-width="3"/>
      <rect x="149" y="75" width="16" height="32" rx="6" fill="#a855f7" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (acc === 'gold_crown') {
    accSVG = `
      <polygon points="65,48 75,22 90,38 100,18 110,38 125,22 135,48" fill="#fbbf24" stroke="#0f172a" stroke-width="3"/>
      <circle cx="100" cy="28" r="4" fill="#ef4444"/>
    `;
  } else if (acc === 'cap_backwards') {
    accSVG = `
      <path d="M 48 70 Q 100 35 152 70 Z" fill="#ef4444" stroke="#0f172a" stroke-width="3"/>
      <rect x="135" y="65" width="25" height="8" rx="4" fill="#dc2626" stroke="#0f172a" stroke-width="2"/>
    `;
  } else if (acc === 'headband') {
    accSVG = `
      <path d="M 48 72 Q 100 50 152 72" stroke="#ec4899" stroke-width="7" fill="none"/>
    `;
  }

  // Companion Pet Drawing (Bottom Right corner)
  let petSVG = '';
  if (pet === 'dog') {
    petSVG = `
      <!-- Dog Pet -->
      <g transform="translate(145, 140) scale(0.65)">
        <circle cx="30" cy="30" r="22" fill="#d97706" stroke="#0f172a" stroke-width="3"/>
        <ellipse cx="12" cy="25" rx="8" ry="16" fill="#78350f" stroke="#0f172a" stroke-width="2"/>
        <ellipse cx="48" cy="25" rx="8" ry="16" fill="#78350f" stroke="#0f172a" stroke-width="2"/>
        <circle cx="22" cy="24" r="3" fill="#0f172a"/>
        <circle cx="38" cy="24" r="3" fill="#0f172a"/>
        <circle cx="30" cy="32" r="4" fill="#0f172a"/>
      </g>
    `;
  } else if (pet === 'cat') {
    petSVG = `
      <!-- Cat Pet -->
      <g transform="translate(145, 140) scale(0.65)">
        <polygon points="12,18 20,4 28,18" fill="#f97316" stroke="#0f172a" stroke-width="2"/>
        <polygon points="32,18 40,4 48,18" fill="#f97316" stroke="#0f172a" stroke-width="2"/>
        <circle cx="30" cy="30" r="20" fill="#fb923c" stroke="#0f172a" stroke-width="3"/>
        <circle cx="22" cy="26" r="3" fill="#0f172a"/>
        <circle cx="38" cy="26" r="3" fill="#0f172a"/>
        <polygon points="30,30 26,34 34,34" fill="#f43f5e"/>
      </g>
    `;
  } else if (pet === 'mini_bot') {
    petSVG = `
      <!-- Mini Robot Pet -->
      <g transform="translate(145, 135) scale(0.65)">
        <rect x="10" y="10" width="40" height="35" rx="8" fill="#38bdf8" stroke="#0f172a" stroke-width="3"/>
        <circle cx="22" cy="25" r="5" fill="#0f172a"/>
        <circle cx="38" cy="25" r="5" fill="#0f172a"/>
        <circle cx="23" cy="24" r="1.5" fill="#38bdf8"/>
        <circle cx="39" cy="24" r="1.5" fill="#38bdf8"/>
        <line x1="30" y1="10" x2="30" y2="0" stroke="#0f172a" stroke-width="3"/>
        <circle cx="30" cy="-2" r="4" fill="#ef4444"/>
      </g>
    `;
  } else if (pet === 'owl') {
    petSVG = `
      <!-- Owl Pet -->
      <g transform="translate(145, 140) scale(0.65)">
        <ellipse cx="30" cy="30" rx="20" ry="24" fill="#78350f" stroke="#0f172a" stroke-width="3"/>
        <circle cx="20" cy="24" r="8" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        <circle cx="40" cy="24" r="8" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        <circle cx="20" cy="24" r="3" fill="#0f172a"/>
        <circle cx="40" cy="24" r="3" fill="#0f172a"/>
        <polygon points="30,30 26,36 34,36" fill="#f59e0b"/>
      </g>
    `;
  } else if (pet === 'dino') {
    petSVG = `
      <!-- Dino Pet -->
      <g transform="translate(145, 138) scale(0.65)">
        <circle cx="30" cy="28" r="20" fill="#10b981" stroke="#0f172a" stroke-width="3"/>
        <circle cx="36" cy="22" r="3.5" fill="#0f172a"/>
        <polygon points="12,18 18,24 14,30" fill="#047857"/>
        <path d="M 28 34 Q 35 38 40 32" fill="none" stroke="#0f172a" stroke-width="2.5"/>
      </g>
    `;
  }

  const gradId = `bg_grad_${Math.random().toString(36).substr(2, 9)}`;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="border-radius: 50%; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3); display: inline-block; vertical-align: middle;">
      <defs>
        <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradStop1}" />
          <stop offset="100%" stop-color="${gradStop2}" />
        </linearGradient>
      </defs>
      <!-- Background Circle -->
      <rect width="200" height="200" fill="url(#${gradId})" />
      
      <!-- Avatar Layers -->
      <g>
        ${bodySVG}
        ${headShape}
        ${eyebrows}
        ${eyesSVG}
        ${cheeksSVG}
        ${mouthSVG}
        ${hairSVG}
        ${accSVG}
        ${petSVG}
      </g>
    </svg>
  `;
}

if (typeof window !== 'undefined') {
  window.HUMAN_AVATAR_PRESETS = HUMAN_AVATAR_PRESETS;
  window.AVATAR_PRESETS = HUMAN_AVATAR_PRESETS; // backwards compatibility
  window.generateAvatarSVG = generateAvatarSVG;
}

if (typeof module !== 'undefined') {
  module.exports = { HUMAN_AVATAR_PRESETS, generateAvatarSVG };
}
