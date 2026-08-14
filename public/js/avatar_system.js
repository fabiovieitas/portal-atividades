/**
 * Avatar Generator System (Duolingo Style) - Lab Kids
 * Generates responsive SVG vector avatars with interactive customizer.
 */

const AVATAR_PRESETS = {
  types: [
    { id: 'robot', label: 'Robozinho Tech', icon: '🤖' },
    { id: 'boy', label: 'Estudante (Menino)', icon: '👦' },
    { id: 'girl', label: 'Estudante (Menina)', icon: '👧' },
    { id: 'astronaut', label: 'Astronauta', icon: '👨‍🚀' },
    { id: 'gamer_cat', label: 'Gatinho Gamer', icon: '🐱' },
    { id: 'hero_bear', label: 'Ursinho Herói', icon: '🐻' }
  ],
  skinColors: [
    { id: '#ffdbac', label: 'Pele Clara' },
    { id: '#f1c27d', label: 'Pele Morena' },
    { id: '#e0ac69', label: 'Pele Dourada' },
    { id: '#8d5524', label: 'Pele Negra' },
    { id: '#3b82f6', label: 'Azul Cyber' },
    { id: '#10b981', label: 'Verde Alien' }
  ],
  hairs: [
    { id: 'curly', label: 'Cacheado / Afro' },
    { id: 'smooth', label: 'Liso Penteado' },
    { id: 'spiky', label: 'Espetado' },
    { id: 'ponytail', label: 'Rabo de Cavalo' },
    { id: 'antenna', label: 'Antena Robótica' },
    { id: 'cap', label: 'Boné Gamer' }
  ],
  hairColors: ['#1e293b', '#78350f', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'],
  outfits: [
    { id: 'lab_coat', label: 'Jaleco de Cientista 🥼', color: '#ffffff' },
    { id: 'hoodie', label: 'Moletom Gamer 🥷', color: '#6366f1' },
    { id: 'jersey', label: 'Camisa de Robótica 🎽', color: '#ef4444' },
    { id: 'space_suit', label: 'Traje Espacial 🚀', color: '#38bdf8' },
    { id: 'hero_cape', label: 'Capa Super-Herói 🦸', color: '#f59e0b' }
  ],
  accessories: [
    { id: 'none', label: 'Nenhum' },
    { id: 'vr_goggles', label: 'Óculos VR 🥽' },
    { id: 'glasses', label: 'Óculos de Grau 👓' },
    { id: 'headphones', label: 'Fone Gamer 🎧' },
    { id: 'crown', label: 'Coroa de Ouro 👑' },
    { id: 'star_badge', label: 'Medalha de Campeão ⭐' }
  ],
  backgrounds: [
    { id: 'space', label: 'Espaço Sideral 🌌', grad: ['#0f172a', '#1e1b4b'] },
    { id: 'soccer', label: 'Campo de Futebol ⚽', grad: ['#15803d', '#166534'] },
    { id: 'lab', label: 'Laboratório Tech 🧪', grad: ['#1e3a8a', '#3b82f6'] },
    { id: 'sunset', label: 'Pôr do Sol 🌅', grad: ['#f97316', '#db2777'] },
    { id: 'cyber', label: 'Cyberpunk Neon ⚡', grad: ['#7c3aed', '#ec4899'] }
  ]
};

function generateAvatarSVG(config = {}, size = 120) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }
  
  const type = config.type || 'robot';
  const skin = config.skinColor || '#3b82f6';
  const hair = config.hairStyle || 'antenna';
  const hairCol = config.hairColor || '#1e293b';
  const outfit = config.outfit || 'hoodie';
  const acc = config.accessory || 'vr_goggles';
  const bg = config.bg || 'space';

  // Get background gradient
  const bgObj = AVATAR_PRESETS.backgrounds.find(b => b.id === bg) || AVATAR_PRESETS.backgrounds[0];
  const gradStop1 = bgObj.grad[0];
  const gradStop2 = bgObj.grad[1];

  let headShape = `<circle cx="100" cy="95" r="45" fill="${skin}" stroke="#0f172a" stroke-width="4" />`;
  let ears = `<circle cx="50" cy="95" r="10" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
              <circle cx="150" cy="95" r="10" fill="${skin}" stroke="#0f172a" stroke-width="3"/>`;

  // Ears & Head specific to mascot type
  if (type === 'robot') {
    headShape = `
      <rect x="55" y="55" width="90" height="80" rx="20" fill="${skin}" stroke="#0f172a" stroke-width="4"/>
      <rect x="70" y="70" width="60" height="35" rx="10" fill="#0f172a"/>
      <circle cx="85" cy="87" r="8" fill="#38bdf8"/>
      <circle cx="115" cy="87" r="8" fill="#38bdf8"/>
      <path d="M 85 115 Q 100 125 115 115" fill="none" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    `;
    ears = `
      <rect x="42" y="80" width="14" height="30" rx="5" fill="#64748b" stroke="#0f172a" stroke-width="3"/>
      <rect x="144" y="80" width="14" height="30" rx="5" fill="#64748b" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (type === 'gamer_cat') {
    ears = `
      <polygon points="55,60 35,25 75,45" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
      <polygon points="145,60 165,25 125,45" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (type === 'hero_bear') {
    ears = `
      <circle cx="58" cy="55" r="16" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
      <circle cx="142" cy="55" r="16" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
    `;
  }

  // Face features (Human / Animal)
  let faceDetails = '';
  if (type !== 'robot') {
    faceDetails = `
      <!-- Eyes -->
      <circle cx="82" cy="90" r="7" fill="#0f172a"/>
      <circle cx="118" cy="90" r="7" fill="#0f172a"/>
      <circle cx="84" cy="88" r="2.5" fill="#ffffff"/>
      <circle cx="120" cy="88" r="2.5" fill="#ffffff"/>
      <!-- Cheeks -->
      <circle cx="72" cy="98" r="6" fill="#f43f5e" opacity="0.4"/>
      <circle cx="128" cy="98" r="6" fill="#f43f5e" opacity="0.4"/>
      <!-- Smile -->
      <path d="M 88 106 Q 100 118 112 106" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
    `;
  }

  // Hair / Top Feature
  let hairSVG = '';
  if (type === 'robot' || hair === 'antenna') {
    hairSVG = `
      <line x1="100" y1="55" x2="100" y2="25" stroke="#0f172a" stroke-width="5"/>
      <circle cx="100" cy="20" r="10" fill="#ef4444" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (hair === 'curly') {
    hairSVG = `
      <path d="M 50 80 Q 40 40 80 40 Q 100 30 120 40 Q 160 40 150 80 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (hair === 'spiky') {
    hairSVG = `
      <polygon points="50,65 65,30 85,55 100,20 115,55 135,30 150,65" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (hair === 'ponytail') {
    hairSVG = `
      <path d="M 55 70 C 50 35 150 35 145 70 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
      <path d="M 145 60 Q 175 65 170 95 Q 155 90 145 75 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="2"/>
    `;
  } else if (hair === 'cap') {
    hairSVG = `
      <path d="M 50 75 Q 100 35 150 75 Z" fill="#ef4444" stroke="#0f172a" stroke-width="3"/>
      <rect x="40" y="70" width="70" height="10" rx="5" fill="#dc2626" stroke="#0f172a" stroke-width="2"/>
    `;
  } else {
    // Smooth hair
    hairSVG = `
      <path d="M 52 75 Q 100 40 148 75 Q 130 50 100 50 Q 70 50 52 75 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  }

  // Outfit / Body Base
  let outfitColor = '#6366f1';
  const outObj = AVATAR_PRESETS.outfits.find(o => o.id === outfit);
  if (outObj) outfitColor = outObj.color;

  let bodySVG = `
    <!-- Torso -->
    <path d="M 45 140 C 45 125 155 125 155 140 L 170 200 L 30 200 Z" fill="${outfitColor}" stroke="#0f172a" stroke-width="4"/>
    <path d="M 85 140 L 100 165 L 115 140" fill="none" stroke="#ffffff" stroke-width="4"/>
  `;

  if (outfit === 'lab_coat') {
    bodySVG = `
      <path d="M 40 140 Q 100 120 160 140 L 175 200 L 25 200 Z" fill="#ffffff" stroke="#0f172a" stroke-width="4"/>
      <path d="M 80 140 L 100 170 L 120 140" fill="#2563eb"/>
      <line x1="100" y1="170" x2="100" y2="200" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (outfit === 'hero_cape') {
    bodySVG = `
      <!-- Cape Behind -->
      <path d="M 30 145 Q 100 155 170 145 L 185 200 L 15 200 Z" fill="#dc2626" stroke="#0f172a" stroke-width="3"/>
      <!-- Suit -->
      <path d="M 45 140 C 45 125 155 125 155 140 L 170 200 L 30 200 Z" fill="#f59e0b" stroke="#0f172a" stroke-width="4"/>
      <circle cx="100" cy="165" r="14" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <text x="100" y="171" font-size="14" font-weight="900" text-anchor="middle" fill="#dc2626">⚡</text>
    `;
  }

  // Accessories
  let accSVG = '';
  if (acc === 'vr_goggles') {
    accSVG = `
      <rect x="58" y="72" width="84" height="32" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="3"/>
      <line x1="68" y1="88" x2="132" y2="88" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <circle cx="76" cy="88" r="4" fill="#ef4444"/>
    `;
  } else if (acc === 'glasses') {
    accSVG = `
      <circle cx="76" cy="88" r="16" fill="none" stroke="#0f172a" stroke-width="4"/>
      <circle cx="124" cy="88" r="16" fill="none" stroke="#0f172a" stroke-width="4"/>
      <line x1="92" y1="88" x2="108" y2="88" stroke="#0f172a" stroke-width="4"/>
    `;
  } else if (acc === 'headphones') {
    accSVG = `
      <path d="M 45 90 C 45 35 155 35 155 90" fill="none" stroke="#0f172a" stroke-width="6"/>
      <rect x="35" y="75" width="16" height="32" rx="6" fill="#a855f7" stroke="#0f172a" stroke-width="3"/>
      <rect x="149" y="75" width="16" height="32" rx="6" fill="#a855f7" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (acc === 'crown') {
    accSVG = `
      <polygon points="65,50 75,25 90,40 100,20 110,40 125,25 135,50" fill="#fbbf24" stroke="#0f172a" stroke-width="3"/>
      <circle cx="100" cy="30" r="4" fill="#ef4444"/>
    `;
  } else if (acc === 'star_badge') {
    accSVG = `
      <circle cx="130" cy="165" r="15" fill="#eab308" stroke="#0f172a" stroke-width="2"/>
      <text x="130" y="170" font-size="14" text-anchor="middle">⭐</text>
    `;
  }

  const gradId = `bg_grad_${Math.random().toString(36).substr(2, 9)}`;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="border-radius: 50%; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,0.25); display: inline-block; vertical-align: middle;">
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
        ${ears}
        ${bodySVG}
        ${headShape}
        ${faceDetails}
        ${hairSVG}
        ${accSVG}
      </g>
    </svg>
  `;
}

if (typeof window !== 'undefined') {
  window.AVATAR_PRESETS = AVATAR_PRESETS;
  window.generateAvatarSVG = generateAvatarSVG;
}

if (typeof module !== 'undefined') {
  module.exports = { AVATAR_PRESETS, generateAvatarSVG };
}
