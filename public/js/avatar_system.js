/**
 * HD Human Avatar Generator System - Lab Kids (Duolingo / Anime Style)
 * High-definition vector rendering for customizable human avatars:
 * Distinct Boy/Girl anatomy, Anime Sparkle Eyes, Layered Hair Vectors, Detailed Clothes,
 * Prominent Cute Companion Pets, and Real Country Flags / Detailed Background Scenes.
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
    { id: '#2563eb', label: 'Azul Cristalo' },
    { id: '#10b981', label: 'Verde Esmeralda' },
    { id: '#78350f', label: 'Castanho Nobre' },
    { id: '#0f172a', label: 'Preto Intenso' },
    { id: '#d97706', label: 'Mel Dourado' },
    { id: '#a855f7', label: 'Roxo Anime' }
  ],
  eyeShapes: [
    { id: 'anime_sparkle', label: 'Estilo Anime ✨' },
    { id: 'expressive_round', label: 'Expressivos 👀' },
    { id: 'almond_glam', label: 'Amendoados 👁️' },
    { id: 'wink_star', label: 'Piscando 😜' }
  ],
  emotions: [
    { id: 'happy_smile', label: 'Super Feliz 😀' },
    { id: 'cool_grin', label: 'Espertinho 😎' },
    { id: 'excited', label: 'Empolgado 🤩' },
    { id: 'sweet_blush', label: 'Fofo 😊' }
  ],
  hairStyles: [
    { id: 'spiky_anime', label: 'Anime Espetado' },
    { id: 'smooth_side_part', label: 'Liso Penteado' },
    { id: 'afro_curls', label: 'Cacheado / Afro' },
    { id: 'wavy_long', label: 'Ondulado Longo' },
    { id: 'pigtails_bows', label: 'Maria-Chiquinha com Lacos' },
    { id: 'top_bun_chic', label: 'Coque Alto' },
    { id: 'side_fringe', label: 'Liso com Franja' },
    { id: 'dreads_cool', label: 'Dreadlocks' }
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
    { id: 'school_blazer', label: 'Uniforme com Gravata 👔', defaultColor: '#2563eb' },
    { id: 'tech_hoodie', label: 'Moletom Gamer 🥷', defaultColor: '#6366f1' },
    { id: 'lab_coat', label: 'Jaleco de Cientista 🥼', defaultColor: '#ffffff' },
    { id: 'hero_cape', label: 'Traje de Super-Herói 🦸', defaultColor: '#f59e0b' },
    { id: 'sports_jersey', label: 'Camisa Robótica #10 🎽', defaultColor: '#ef4444' },
    { id: 'chic_dress', label: 'Vestido / Polo Casual 👗', defaultColor: '#ec4899' }
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
    { id: 'dog', label: 'Cachorrinho Caramelo 🐶' },
    { id: 'cat', label: 'Gatinho Fofo 🐱' },
    { id: 'mini_bot', label: 'Robô Auxiliar 🤖' },
    { id: 'owl', label: 'Coruja Sabida 🦉' },
    { id: 'dino', label: 'Baby Dino T-Rex 🦖' }
  ],
  backgrounds: [
    { id: 'brasil_flag', label: 'Bandeira do Brasil 🇧🇷' },
    { id: 'soccer_stadium', label: 'Estádio de Futebol ⚽' },
    { id: 'galaxy_space', label: 'Espaço & Galáxia 🌌' },
    { id: 'tech_lab', label: 'Laboratório Tech 🧪' },
    { id: 'classroom', label: 'Sala de Aula 🏫' },
    { id: 'sunset_city', label: 'Pôr do Sol 🌅' }
  ]
};

function generateAvatarSVG(config = {}, size = 120) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const gender = config.gender || 'boy';
  const skin = config.skinColor || '#ffdbac';
  const eyeCol = config.eyeColor || '#2563eb';
  const eyeShp = config.eyeShape || 'anime_sparkle';
  const emotion = config.emotion || 'happy_smile';
  const hairStl = config.hairStyle || (gender === 'girl' ? 'wavy_long' : 'spiky_anime');
  const hairCol = config.hairColor || '#451a03';
  const outfit = config.outfit || 'tech_hoodie';
  const outfitCol = config.outfitColor || '#6366f1';
  const acc = config.accessory || 'none';
  const pet = config.pet || 'none';
  const bg = config.bg || 'brasil_flag';

  // Render Detailed Background Scene
  let backgroundSVG = '';
  if (bg === 'brasil_flag') {
    backgroundSVG = `
      <!-- Bandeira do Brasil 🇧🇷 -->
      <rect width="200" height="200" fill="#009c3b" />
      <polygon points="100,18 185,100 100,182 15,100" fill="#ffdf00" stroke="#000000" stroke-width="1.5"/>
      <circle cx="100" cy="100" r="42" fill="#002776" />
      <path d="M 60 105 Q 100 85 140 108" fill="none" stroke="#ffffff" stroke-width="5" />
      <!-- Stars in Flag -->
      <circle cx="95" cy="85" r="1.5" fill="#ffffff" />
      <circle cx="105" cy="115" r="1.5" fill="#ffffff" />
      <circle cx="85" cy="120" r="1.5" fill="#ffffff" />
      <circle cx="115" cy="122" r="1.5" fill="#ffffff" />
      <circle cx="100" cy="130" r="1.2" fill="#ffffff" />
    `;
  } else if (bg === 'soccer_stadium') {
    backgroundSVG = `
      <!-- Estádio de Futebol ⚽ -->
      <rect width="200" height="200" fill="#0f172a" />
      <!-- Grass Pitch -->
      <rect y="110" width="200" height="90" fill="#15803d" />
      <rect y="110" width="200" height="12" fill="#16a34a" opacity="0.6"/>
      <rect y="134" width="200" height="12" fill="#16a34a" opacity="0.6"/>
      <rect y="158" width="200" height="12" fill="#16a34a" opacity="0.6"/>
      <!-- Field Line -->
      <ellipse cx="100" cy="150" rx="60" ry="25" fill="none" stroke="#ffffff" stroke-width="2.5" opacity="0.8"/>
      <!-- Stadium Floodlights -->
      <circle cx="30" cy="40" r="15" fill="#fef08a" opacity="0.8"/>
      <circle cx="170" cy="40" r="15" fill="#fef08a" opacity="0.8"/>
    `;
  } else if (bg === 'galaxy_space') {
    backgroundSVG = `
      <!-- Espaço & Galáxia 🌌 -->
      <rect width="200" height="200" fill="#090d16" />
      <!-- Stars -->
      <circle cx="30" cy="30" r="2" fill="#ffffff"/>
      <circle cx="170" cy="25" r="1.5" fill="#ffffff"/>
      <circle cx="160" cy="140" r="2" fill="#ffffff"/>
      <circle cx="25" cy="150" r="1.5" fill="#ffffff"/>
      <circle cx="100" cy="20" r="2.5" fill="#fef08a"/>
      <!-- Saturn Planet -->
      <g transform="translate(150, 45)">
        <ellipse cx="0" cy="0" rx="18" ry="5" fill="none" stroke="#fbbf24" stroke-width="3" transform="rotate(-20)"/>
        <circle cx="0" cy="0" r="10" fill="#f97316"/>
      </g>
    `;
  } else if (bg === 'tech_lab') {
    backgroundSVG = `
      <!-- Laboratório Tech 🧪 -->
      <rect width="200" height="200" fill="#0f172a" />
      <!-- Circuit Lines -->
      <path d="M 0 50 L 60 50 L 80 80 M 200 40 L 140 40 L 120 70" fill="none" stroke="#38bdf8" stroke-width="2.5" opacity="0.6"/>
      <circle cx="60" cy="50" r="4" fill="#38bdf8"/>
      <circle cx="140" cy="40" r="4" fill="#38bdf8"/>
      <!-- Flask -->
      <g transform="translate(25, 120)">
        <polygon points="10,30 0,60 40,60 30,30" fill="#06b6d4" opacity="0.8" stroke="#ffffff" stroke-width="2"/>
        <circle cx="20" cy="45" r="3" fill="#ffffff"/>
      </g>
    `;
  } else if (bg === 'classroom') {
    backgroundSVG = `
      <!-- Sala de Aula 🏫 -->
      <rect width="200" height="200" fill="#78350f" />
      <!-- Blackboard -->
      <rect x="15" y="15" width="170" height="110" fill="#064e3b" stroke="#451a03" stroke-width="6"/>
      <text x="30" y="45" font-size="14" fill="#ffffff" opacity="0.8" font-family="monospace">E = mc²</text>
      <text x="30" y="70" font-size="14" fill="#ffffff" opacity="0.8" font-family="monospace">1 + 1 = 🤖</text>
      <text x="30" y="95" font-size="14" fill="#fbbf24" opacity="0.9">Lab Kids ⭐</text>
    `;
  } else {
    // Sunset City
    backgroundSVG = `
      <rect width="200" height="200" fill="#f97316" />
      <circle cx="100" cy="90" r="45" fill="#fef08a"/>
      <rect y="120" width="200" height="80" fill="#db2777" />
    `;
  }

  // Anatomy by Gender (Girl: Eyelashes, Blush, Delicate Chin. Boy: Defined Jaw)
  const isGirl = (gender === 'girl');

  const headShape = `
    <!-- Neck -->
    <rect x="${isGirl ? 88 : 86}" y="122" width="${isGirl ? 24 : 28}" height="25" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
    <!-- Head Base -->
    <path d="${isGirl 
      ? 'M 58 90 C 58 45 142 45 142 90 C 142 128 120 138 100 138 C 80 138 58 128 58 90 Z' 
      : 'M 54 90 C 54 44 146 44 146 90 C 146 132 126 142 100 142 C 74 142 54 132 54 90 Z'}" 
      fill="${skin}" stroke="#0f172a" stroke-width="4"/>
    <!-- Ears -->
    <circle cx="52" cy="94" r="${isGirl ? 8 : 9}" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
    <circle cx="148" cy="94" r="${isGirl ? 8 : 9}" fill="${skin}" stroke="#0f172a" stroke-width="3"/>
  `;

  // Eyes & Eyelashes SVG
  let eyesSVG = '';
  if (eyeShp === 'wink_star') {
    eyesSVG = `
      <!-- Left Eye Open -->
      <circle cx="76" cy="88" r="9" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
      <circle cx="76" cy="88" r="6" fill="${eyeCol}"/>
      <circle cx="78" cy="86" r="2.5" fill="#ffffff"/>
      <!-- Right Eye Wink -->
      <path d="M 114 88 Q 124 78 132 88" fill="none" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
      <text x="123" y="78" font-size="12" fill="#fbbf24">✨</text>
    `;
  } else if (eyeShp === 'expressive_round') {
    eyesSVG = `
      <ellipse cx="76" cy="88" rx="10" ry="11" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
      <ellipse cx="124" cy="88" rx="10" ry="11" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
      <circle cx="76" cy="88" r="7" fill="${eyeCol}"/>
      <circle cx="124" cy="88" r="7" fill="${eyeCol}"/>
      <circle cx="73" cy="85" r="3" fill="#ffffff"/>
      <circle cx="121" cy="85" r="3" fill="#ffffff"/>
    `;
  } else if (eyeShp === 'almond_glam') {
    eyesSVG = `
      <path d="M 64 88 Q 76 76 88 88 Q 76 96 64 88 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
      <path d="M 112 88 Q 124 76 136 88 Q 124 96 112 88 Z" fill="#ffffff" stroke="#0f172a" stroke-width="2.5"/>
      <circle cx="76" cy="87" r="6" fill="${eyeCol}"/>
      <circle cx="124" cy="87" r="6" fill="${eyeCol}"/>
      <circle cx="78" cy="85" r="2" fill="#ffffff"/>
      <circle cx="126" cy="85" r="2" fill="#ffffff"/>
    `;
  } else {
    // Anime Sparkle Eyes (Default HD Anime)
    eyesSVG = `
      <!-- Anime Sparkle Left -->
      <ellipse cx="76" cy="88" rx="11" ry="14" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
      <ellipse cx="76" cy="89" r="8" fill="${eyeCol}"/>
      <ellipse cx="76" cy="92" r="5" fill="#0f172a"/>
      <circle cx="72" cy="83" r="3.5" fill="#ffffff"/>
      <circle cx="80" cy="93" r="2" fill="#ffffff"/>
      
      <!-- Anime Sparkle Right -->
      <ellipse cx="124" cy="88" rx="11" ry="14" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
      <ellipse cx="124" cy="89" r="8" fill="${eyeCol}"/>
      <ellipse cx="124" cy="92" r="5" fill="#0f172a"/>
      <circle cx="120" cy="83" r="3.5" fill="#ffffff"/>
      <circle cx="128" cy="93" r="2" fill="#ffffff"/>
    `;
  }

  // Eyelashes for Girl Characters
  let eyelashesSVG = '';
  if (isGirl) {
    eyelashesSVG = `
      <path d="M 64 82 Q 74 74 86 82" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 62 80 L 58 75 M 65 77 L 62 72" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M 114 82 Q 126 74 136 82" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M 138 80 L 142 75 M 135 77 L 138 72" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>
    `;
  }

  // Eyebrows
  const eyebrows = `
    <path d="M 66 73 Q 76 68 86 73" fill="none" stroke="${hairCol}" stroke-width="${isGirl ? 3 : 4.5}" stroke-linecap="round"/>
    <path d="M 114 73 Q 124 68 134 73" fill="none" stroke="${hairCol}" stroke-width="${isGirl ? 3 : 4.5}" stroke-linecap="round"/>
  `;

  // Mouth & Cheeks
  let mouthSVG = `
    <path d="M 85 112 Q 100 124 115 112" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round"/>
  `;
  let cheeksSVG = `
    <ellipse cx="66" cy="102" rx="7" ry="4" fill="#f43f5e" opacity="${isGirl ? '0.5' : '0.3'}"/>
    <ellipse cx="134" cy="102" rx="7" ry="4" fill="#f43f5e" opacity="${isGirl ? '0.5' : '0.3'}"/>
  `;

  if (emotion === 'excited') {
    mouthSVG = `
      <path d="M 82 110 Q 100 134 118 110 Z" fill="#dc2626" stroke="#0f172a" stroke-width="3"/>
      <path d="M 88 122 Q 100 128 112 122" fill="#f43f5e"/>
    `;
  } else if (emotion === 'cool_grin') {
    mouthSVG = `
      <path d="M 86 114 Q 106 118 118 106" fill="none" stroke="#0f172a" stroke-width="4" stroke-linecap="round"/>
    `;
  } else if (emotion === 'sweet_blush') {
    mouthSVG = `
      <path d="M 90 112 Q 100 118 110 112" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
    `;
  }

  // Hair Styles Vector Rendering
  let hairSVG = '';
  if (hairStl === 'pigtails_bows') {
    hairSVG = `
      <!-- Base Top -->
      <path d="M 48 85 Q 100 38 152 85 Q 130 52 100 52 Q 70 52 48 85 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
      <!-- Left Tail -->
      <path d="M 46 85 Q 15 105 22 145 Q 40 130 46 95 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
      <circle cx="45" cy="90" r="6" fill="#ec4899"/>
      <!-- Right Tail -->
      <path d="M 154 85 Q 185 105 178 145 Q 160 130 154 95 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
      <circle cx="155" cy="90" r="6" fill="#ec4899"/>
    `;
  } else if (hairStl === 'wavy_long') {
    hairSVG = `
      <path d="M 46 90 Q 48 30 100 30 Q 152 30 154 90 Q 168 135 158 150 Q 142 120 146 90 Q 100 45 54 90 Q 58 120 42 150 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3.5"/>
    `;
  } else if (hairStl === 'top_bun_chic') {
    hairSVG = `
      <circle cx="100" cy="26" r="24" fill="${hairCol}" stroke="#0f172a" stroke-width="3.5"/>
      <path d="M 48 85 Q 100 42 152 85 Q 130 58 100 58 Q 70 58 48 85 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3"/>
    `;
  } else if (hairStl === 'afro_curls') {
    hairSVG = `
      <path d="M 42 85 C 25 35 70 15 100 15 C 130 15 175 35 158 85 C 165 108 148 118 148 118 C 135 68 65 68 52 118 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3.5"/>
    `;
  } else if (hairStl === 'side_fringe') {
    hairSVG = `
      <path d="M 46 95 C 42 30 158 30 154 95 Q 152 68 120 68 Q 95 86 75 68 Q 48 68 46 95 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3.5"/>
    `;
  } else if (hairStl === 'smooth_side_part') {
    hairSVG = `
      <path d="M 50 85 Q 100 38 150 85 Q 135 58 100 58 Q 65 58 50 85 Z" fill="${hairCol}" stroke="#0f172a" stroke-width="3.5"/>
    `;
  } else if (hairStl === 'dreads_cool') {
    hairSVG = `
      <path d="M 48 80 Q 58 25 100 25 Q 142 25 152 80" stroke="${hairCol}" stroke-width="14" stroke-linecap="round" fill="none"/>
      <line x1="48" y1="80" x2="38" y2="125" stroke="${hairCol}" stroke-width="9" stroke-linecap="round"/>
      <line x1="64" y1="70" x2="56" y2="135" stroke="${hairCol}" stroke-width="9" stroke-linecap="round"/>
      <line x1="136" y1="70" x2="144" y2="135" stroke="${hairCol}" stroke-width="9" stroke-linecap="round"/>
      <line x1="152" y1="80" x2="162" y2="125" stroke="${hairCol}" stroke-width="9" stroke-linecap="round"/>
    `;
  } else {
    // Spiky Anime (Default Boy Spiky Hair)
    hairSVG = `
      <polygon points="46,75 56,32 76,56 95,20 114,56 134,32 154,75" fill="${hairCol}" stroke="#0f172a" stroke-width="3.5"/>
    `;
  }

  // Detailed Outfits Vector Drawing
  let bodySVG = '';
  if (outfit === 'school_blazer') {
    bodySVG = `
      <!-- Blazer / Uniform -->
      <path d="M 42 140 C 42 125 158 125 158 140 L 175 200 L 25 200 Z" fill="${outfitCol}" stroke="#0f172a" stroke-width="4"/>
      <!-- V-Neck Shirt -->
      <polygon points="80,140 100,172 120,140" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
      <!-- Tie -->
      <polygon points="96,140 104,140 106,170 100,178 94,170" fill="#dc2626" stroke="#0f172a" stroke-width="1.5"/>
      <!-- Badge -->
      <rect x="55" y="160" width="15" height="18" rx="3" fill="#fbbf24" stroke="#0f172a" stroke-width="1.5"/>
    `;
  } else if (outfit === 'lab_coat') {
    bodySVG = `
      <!-- Scientist Lab Coat -->
      <path d="M 40 140 Q 100 120 160 140 L 175 200 L 25 200 Z" fill="#ffffff" stroke="#0f172a" stroke-width="4"/>
      <path d="M 80 140 L 100 170 L 120 140" fill="${outfitCol}"/>
      <line x1="100" y1="170" x2="100" y2="200" stroke="#0f172a" stroke-width="3"/>
      <!-- ID Badge on Pocket -->
      <rect x="52" y="165" width="20" height="24" rx="3" fill="#38bdf8" stroke="#0f172a" stroke-width="1.5"/>
      <circle cx="62" cy="173" r="4" fill="#ffffff"/>
    `;
  } else if (outfit === 'hero_cape') {
    bodySVG = `
      <!-- Red Cape Flowing Behind -->
      <path d="M 25 145 Q 100 160 175 145 L 190 200 L 10 200 Z" fill="#dc2626" stroke="#0f172a" stroke-width="3.5"/>
      <!-- Superhero Suit -->
      <path d="M 44 140 C 44 125 156 125 156 140 L 170 200 L 30 200 Z" fill="${outfitCol}" stroke="#0f172a" stroke-width="4"/>
      <circle cx="100" cy="168" r="16" fill="#fbbf24" stroke="#0f172a" stroke-width="2.5"/>
      <text x="100" y="174" font-size="16" font-weight="900" text-anchor="middle" fill="#dc2626">⚡</text>
    `;
  } else if (outfit === 'sports_jersey') {
    bodySVG = `
      <!-- Sports Jersey #10 -->
      <path d="M 44 140 C 44 125 156 125 156 140 L 170 200 L 30 200 Z" fill="${outfitCol}" stroke="#0f172a" stroke-width="4"/>
      <path d="M 44 140 L 60 200 M 156 140 L 140 200" stroke="#ffffff" stroke-width="4"/>
      <text x="100" y="180" font-size="24" font-weight="900" text-anchor="middle" fill="#ffffff" stroke="#0f172a" stroke-width="1">10</text>
    `;
  } else if (outfit === 'chic_dress') {
    bodySVG = `
      <!-- Cute Dress / Casual Polo -->
      <path d="M 44 140 C 44 125 156 125 156 140 L 180 200 L 20 200 Z" fill="${outfitCol}" stroke="#0f172a" stroke-width="4"/>
      <path d="M 82 140 C 82 155 118 155 118 140" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
    `;
  } else {
    // Tech Gamer Hoodie
    bodySVG = `
      <!-- Gamer Hoodie -->
      <path d="M 44 140 C 44 125 156 125 156 140 L 170 200 L 30 200 Z" fill="${outfitCol}" stroke="#0f172a" stroke-width="4"/>
      <line x1="100" y1="140" x2="100" y2="200" stroke="#0f172a" stroke-width="3"/>
      <!-- Drawstrings -->
      <path d="M 88 140 Q 85 165 92 175 M 112 140 Q 115 165 108 175" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
    `;
  }

  // Accessories
  let accSVG = '';
  if (acc === 'vr_headset') {
    accSVG = `
      <rect x="56" y="72" width="88" height="34" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="3.5"/>
      <line x1="66" y1="89" x2="134" y2="89" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="76" cy="89" r="4.5" fill="#ef4444"/>
    `;
  } else if (acc === 'glasses_round') {
    accSVG = `
      <circle cx="76" cy="88" r="17" fill="none" stroke="#0f172a" stroke-width="4"/>
      <circle cx="124" cy="88" r="17" fill="none" stroke="#0f172a" stroke-width="4"/>
      <line x1="93" y1="88" x2="107" y2="88" stroke="#0f172a" stroke-width="4"/>
    `;
  } else if (acc === 'gamer_headset') {
    accSVG = `
      <path d="M 42 90 C 42 30 158 30 158 90" fill="none" stroke="#0f172a" stroke-width="7"/>
      <rect x="32" y="74" width="18" height="36" rx="8" fill="#a855f7" stroke="#0f172a" stroke-width="3.5"/>
      <rect x="150" y="74" width="18" height="36" rx="8" fill="#a855f7" stroke="#0f172a" stroke-width="3.5"/>
    `;
  } else if (acc === 'gold_crown') {
    accSVG = `
      <polygon points="62,46 72,18 88,34 100,14 112,34 128,18 138,46" fill="#fbbf24" stroke="#0f172a" stroke-width="3.5"/>
      <circle cx="100" cy="25" r="4" fill="#ef4444"/>
    `;
  } else if (acc === 'cap_backwards') {
    accSVG = `
      <path d="M 46 68 Q 100 32 154 68 Z" fill="#ef4444" stroke="#0f172a" stroke-width="3.5"/>
      <rect x="135" y="63" width="28" height="9" rx="4" fill="#dc2626" stroke="#0f172a" stroke-width="2.5"/>
    `;
  } else if (acc === 'headband') {
    accSVG = `
      <path d="M 46 70 Q 100 48 154 70" stroke="#ec4899" stroke-width="8" fill="none"/>
    `;
  }

  // PROMINENT CUTE COMPANION PETS (Rendered Large at Bottom Right Corner!)
  let petSVG = '';
  if (pet === 'dog') {
    petSVG = `
      <!-- Cachorrinho Caramelo 🐶 (PROMINENT PET) -->
      <g transform="translate(130, 115) scale(1.1)">
        <!-- Ears -->
        <ellipse cx="8" cy="22" rx="9" ry="18" fill="#78350f" stroke="#0f172a" stroke-width="2.5"/>
        <ellipse cx="42" cy="22" rx="9" ry="18" fill="#78350f" stroke="#0f172a" stroke-width="2.5"/>
        <!-- Body & Head -->
        <ellipse cx="25" cy="48" rx="20" ry="18" fill="#f59e0b" stroke="#0f172a" stroke-width="3"/>
        <circle cx="25" cy="28" r="20" fill="#fbbf24" stroke="#0f172a" stroke-width="3"/>
        <!-- Eyes & Snout -->
        <circle cx="18" cy="24" r="3.5" fill="#0f172a"/>
        <circle cx="32" cy="24" r="3.5" fill="#0f172a"/>
        <ellipse cx="25" cy="32" rx="7" ry="5" fill="#ffffff"/>
        <circle cx="25" cy="30" r="3" fill="#0f172a"/>
        <!-- Red Collar with Gold Tag -->
        <path d="M 10 38 Q 25 44 40 38" stroke="#ef4444" stroke-width="4" fill="none"/>
        <circle cx="25" cy="43" r="3.5" fill="#fbbf24" stroke="#0f172a" stroke-width="1"/>
      </g>
    `;
  } else if (pet === 'cat') {
    petSVG = `
      <!-- Gatinho Fofo 🐱 (PROMINENT PET) -->
      <g transform="translate(132, 115) scale(1.1)">
        <!-- Pointy Ears -->
        <polygon points="8,22 16,2 26,20" fill="#f97316" stroke="#0f172a" stroke-width="2.5"/>
        <polygon points="24,20 34,2 42,22" fill="#f97316" stroke="#0f172a" stroke-width="2.5"/>
        <polygon points="12,18 16,8 22,17" fill="#fbcfe8"/>
        <polygon points="28,17 34,8 38,18" fill="#fbcfe8"/>
        <!-- Head & Body -->
        <ellipse cx="25" cy="48" rx="18" ry="16" fill="#fb923c" stroke="#0f172a" stroke-width="3"/>
        <circle cx="25" cy="28" r="19" fill="#fb923c" stroke="#0f172a" stroke-width="3"/>
        <!-- Eyes & Whiskers -->
        <circle cx="17" cy="26" r="3.5" fill="#0f172a"/>
        <circle cx="33" cy="26" r="3.5" fill="#0f172a"/>
        <polygon points="25,31 22,35 28,35" fill="#f43f5e"/>
        <!-- Whiskers -->
        <line x1="8" y1="28" x2="16" y2="30" stroke="#0f172a" stroke-width="2"/>
        <line x1="8" y1="34" x2="16" y2="33" stroke="#0f172a" stroke-width="2"/>
        <line x1="42" y1="28" x2="34" y2="30" stroke="#0f172a" stroke-width="2"/>
        <line x1="42" y1="34" x2="34" y2="33" stroke="#0f172a" stroke-width="2"/>
      </g>
    `;
  } else if (pet === 'mini_bot') {
    petSVG = `
      <!-- Robô Auxiliar 🤖 (PROMINENT PET) -->
      <g transform="translate(130, 110) scale(1.1)">
        <!-- Antenna -->
        <line x1="25" y1="12" x2="25" y2="2" stroke="#0f172a" stroke-width="3"/>
        <circle cx="25" cy="0" r="4" fill="#ef4444" stroke="#0f172a" stroke-width="1.5"/>
        <!-- Head -->
        <rect x="5" y="12" width="40" height="32" rx="10" fill="#38bdf8" stroke="#0f172a" stroke-width="3"/>
        <!-- Screen Visor -->
        <rect x="11" y="18" width="28" height="18" rx="6" fill="#0f172a"/>
        <circle cx="18" cy="27" r="4" fill="#38bdf8"/>
        <circle cx="32" cy="27" r="4" fill="#38bdf8"/>
        <circle cx="19" cy="26" r="1.5" fill="#ffffff"/>
        <circle cx="33" cy="26" r="1.5" fill="#ffffff"/>
      </g>
    `;
  } else if (pet === 'owl') {
    petSVG = `
      <!-- Coruja Sabida 🦉 (PROMINENT PET) -->
      <g transform="translate(132, 112) scale(1.1)">
        <!-- Grad Hat -->
        <polygon points="5,14 25,6 45,14 25,20" fill="#0f172a"/>
        <rect x="18" y="14" width="14" height="6" fill="#0f172a"/>
        <!-- Body -->
        <ellipse cx="25" cy="34" rx="20" ry="24" fill="#78350f" stroke="#0f172a" stroke-width="3"/>
        <!-- Big Eyes -->
        <circle cx="16" cy="28" r="9" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        <circle cx="34" cy="28" r="9" fill="#ffffff" stroke="#0f172a" stroke-width="2"/>
        <circle cx="16" cy="28" r="4" fill="#0f172a"/>
        <circle cx="34" cy="28" r="4" fill="#0f172a"/>
        <!-- Beak -->
        <polygon points="25,32 20,38 30,38" fill="#f59e0b" stroke="#0f172a" stroke-width="1.5"/>
      </g>
    `;
  } else if (pet === 'dino') {
    petSVG = `
      <!-- Baby Dino T-Rex 🦖 (PROMINENT PET) -->
      <g transform="translate(128, 110) scale(1.1)">
        <!-- Back Spikes -->
        <polygon points="8,22 2,28 10,32" fill="#047857"/>
        <polygon points="12,34 6,40 14,44" fill="#047857"/>
        <!-- Body & Head -->
        <ellipse cx="28" cy="46" rx="18" ry="18" fill="#10b981" stroke="#0f172a" stroke-width="3"/>
        <circle cx="28" cy="26" r="18" fill="#10b981" stroke="#0f172a" stroke-width="3"/>
        <!-- Snout & Eyes -->
        <circle cx="34" cy="22" r="4" fill="#0f172a"/>
        <circle cx="35" cy="21" r="1.5" fill="#ffffff"/>
        <path d="M 28 32 Q 38 36 44 28" fill="none" stroke="#0f172a" stroke-width="2.5"/>
        <!-- Tiny Arm -->
        <path d="M 20 44 Q 28 46 26 50" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>
      </g>
    `;
  }

  const gradId = `bg_grad_${Math.random().toString(36).substr(2, 9)}`;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style="border-radius: 50%; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.3); display: inline-block; vertical-align: middle;">
      <!-- Background Scene -->
      <g id="bg_layer">
        ${backgroundSVG}
      </g>
      
      <!-- Avatar Character Layers -->
      <g id="character_layer">
        ${bodySVG}
        ${headShape}
        ${eyebrows}
        ${eyesSVG}
        ${eyelashesSVG}
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
  window.AVATAR_PRESETS = HUMAN_AVATAR_PRESETS;
  window.generateAvatarSVG = generateAvatarSVG;
}

if (typeof module !== 'undefined') {
  module.exports = { HUMAN_AVATAR_PRESETS, generateAvatarSVG };
}
