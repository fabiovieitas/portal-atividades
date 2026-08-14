/**
 * Premium Vector Avatar Engine - Lab Kids & Duolingo Style
 * Craftsmanship & Visual Excellence:
 * High-definition vector graphics with multi-tone shading, specular highlights,
 * fluid curves, multi-layered hair styles, crisp clothing folds, and rich accessories.
 */

const DUOLINGO_AVATAR_PRESETS = {
  genders: [
    { id: 'boy', label: 'Menino 👦' },
    { id: 'girl', label: 'Menina 👧' }
  ],
  skinColors: [
    { id: '#3b2219', label: 'Ébano Escuro' },
    { id: '#4a2c1d', label: 'Café Intenso' },
    { id: '#5c3826', label: 'Chocolate' },
    { id: '#6e4530', label: 'Canela' },
    { id: '#80523b', label: 'Moreno Jambo' },
    { id: '#946147', label: 'Moreno Médio' },
    { id: '#a86f53', label: 'Bronzeado' },
    { id: '#bc7d5f', label: 'Dourado' },
    { id: '#ce8c6e', label: 'Trigo' },
    { id: '#df9b7d', label: 'Caramelo Claro' },
    { id: '#eaab8f', label: 'Pêssego Warm' },
    { id: '#f2bba2', label: 'Bege Suave' },
    { id: '#f7cbb6', label: 'Rosado Claro' },
    { id: '#fbdbcb', label: 'Porcelana' },
    { id: '#ffe7dc', label: 'Alabastro' }
  ],
  eyeColors: [
    { id: '#1cb0f6', label: 'Azul Duolingo' },
    { id: '#58cc02', label: 'Verde Esmeralda' },
    { id: '#78350f', label: 'Castanho Avelã' },
    { id: '#1e293b', label: 'Preto Profundo' },
    { id: '#ce82ff', label: 'Roxo Mágico' },
    { id: '#ff9600', label: 'Âmbar Dourado' }
  ],
  eyeShapes: [
    { id: 'duo_sparkle', label: 'Expressivo Brilhante' },
    { id: 'happy_curved', label: 'Sorridente Encantador' },
    { id: 'playful_wink', label: 'Piscada Charmosa' },
    { id: 'anime_star', label: 'Olho Anime Estrela' }
  ],
  hairStyles: [
    { id: 'duo_spiky_premium', label: 'Espetado Moderno' },
    { id: 'curly_afro_hd', label: 'Afro Volumoso HD' },
    { id: 'smooth_side_part', label: 'Penteado Executivo' },
    { id: 'wavy_long_diva', label: 'Ondulado Longo Elegante' },
    { id: 'pigtails_cute_bows', label: 'Maria-Chiquinha com Laços' },
    { id: 'high_bun_top', label: 'Coque Alto Sofisticado' },
    { id: 'fringe_bob_style', label: 'Liso Franja Bob' },
    { id: 'dreads_braided', label: 'Dreadlocks Estilosos' },
    { id: 'fade_top_short', label: 'Degradê Rente' },
    { id: 'korean_curtain', label: 'Cabelo Coreano / Franja' },
    { id: 'bald_clean', label: 'Careca / Rente' }
  ],
  hairColors: [
    { id: '#1a1a1a', label: 'Preto Ônix' },
    { id: '#42281d', label: 'Castanho Escuro' },
    { id: '#784824', label: 'Castanho Mel' },
    { id: '#a3632b', label: 'Castanho Claro' },
    { id: '#d99738', label: 'Loiro Dourado' },
    { id: '#c94a2b', label: 'Ruivo Vivo' },
    { id: '#58cc02', label: 'Verde Duolingo' },
    { id: '#1cb0f6', label: 'Azul Cyan' },
    { id: '#ce82ff', label: 'Roxo Neon' },
    { id: '#ff6699', label: 'Rosa Chiclete' }
  ],
  glasses: [
    { id: 'none', label: 'Sem Óculos' },
    { id: 'duo_nerd_black', label: 'Óculos Nerd Duolingo' },
    { id: 'round_harry_gold', label: 'Óculos Redondo Dourado' },
    { id: 'wayfarer_cool', label: 'Óculos de Sol Escuro' },
    { id: 'cat_eye_chic', label: 'Óculos Gatinho Retro' },
    { id: 'vr_headset_cyber', label: 'Óculos VR Cyberpunk' }
  ],
  hats: [
    { id: 'none', label: 'Sem Chapéu' },
    { id: 'duo_green_cap', label: 'Boné Verde Duolingo "d"' },
    { id: 'purple_gamer_cap', label: 'Boné Roxo Gamer' },
    { id: 'winter_beanie_pompom', label: 'Gorro de Lã com Pompom' },
    { id: 'royal_gold_crown', label: 'Coroa de Ouro com Joias' },
    { id: 'cute_bow_headband', label: 'Tiara com Laço Fofo' },
    { id: 'headscarf_hijab', label: 'Turbante / Hijab' }
  ],
  outfits: [
    { id: 'overalls_turtleneck', label: 'Jardineira Jeans & Cacharrel' },
    { id: 'duo_green_hoodie', label: 'Moletom Verde Duolingo' },
    { id: 'school_blazer_tie', label: 'Blazer Escolar com Gravata' },
    { id: 'hero_suit_cape', label: 'Traje de Herói com Capa' },
    { id: 'scientist_lab_coat', label: 'Jaleco de Cientista com Crachá' },
    { id: 'sports_jersey_10', label: 'Camiseta Esportiva #10' },
    { id: 'chic_summer_dress', label: 'Vestido de Verão Charmoso' },
    { id: 'casual_street_jacket', label: 'Jaqueta Streetwear' }
  ],
  outfitColors: [
    '#1cb0f6', '#58cc02', '#ff4b4b', '#ffc800', '#ce82ff', '#ff9600', '#202f36', '#ffffff'
  ],
  pets: [
    { id: 'none', label: 'Sem Mascote' },
    { id: 'duo_owl_pet', label: 'Corujinha Duo 🦉' },
    { id: 'dog_caramelo_pet', label: 'Cachorrinho Caramelo 🐶' },
    { id: 'cat_fofo_pet', label: 'Gatinho Miau 🐱' },
    { id: 'dino_rex_pet', label: 'Baby Dino T-Rex 🦖' },
    { id: 'helper_bot_pet', label: 'Robô Auxiliar 🤖' }
  ],
  bgColors: [
    '#e55b5b', '#58cc02', '#1cb0f6', '#ffc800', '#ce82ff', '#ff9600', '#202f36', '#89e219', '#14d4f4'
  ]
};

/**
 * Renders a Premium High-Definition Vector Avatar SVG
 */
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const gender = config.gender || 'boy';
  const skin = config.skinColor || '#eaab8f';
  const eyeCol = config.eyeColor || '#1cb0f6';
  const eyeShp = config.eyeShape || 'duo_sparkle';
  const hairStl = config.hairStyle || 'duo_spiky_premium';
  const hairCol = config.hairColor || '#42281d';
  const glass = config.glasses || 'duo_nerd_black';
  const hat = config.hats || 'none';
  const outfit = config.outfit || 'overalls_turtleneck';
  const outfitCol = config.outfitColor || '#1cb0f6';
  const pet = config.pet || 'none';
  const bgColor = config.bg || '#e55b5b';

  const isGirl = (gender === 'girl');

  // Background rect
  const bgSVG = isTilePreview ? '' : `<rect width="200" height="240" rx="18" fill="${bgColor}" />`;

  // Duolingo Premium Head Base (Squircle with 2-Tone Shading & Ears)
  const headSVG = `
    <!-- Neck Shadow & Neck -->
    <path d="M 86 116 L 86 138 Q 100 144 114 138 L 114 116 Z" fill="${skin}" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 86 116 Q 100 125 114 116" fill="rgba(0,0,0,0.1)"/>

    <!-- Left Ear -->
    <g>
      <circle cx="43" cy="88" r="12" fill="${skin}" stroke="#1e293b" stroke-width="3.5"/>
      <path d="M 45 84 Q 40 88 45 92" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2" stroke-linecap="round"/>
    </g>
    <!-- Right Ear -->
    <g>
      <circle cx="157" cy="88" r="12" fill="${skin}" stroke="#1e293b" stroke-width="3.5"/>
      <path d="M 155 84 Q 160 88 155 92" fill="none" stroke="rgba(0,0,0,0.2)" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- Main Head Squircle -->
    <rect x="47" y="46" width="106" height="88" rx="30" ry="26" fill="${skin}" stroke="#1e293b" stroke-width="4"/>

    <!-- Soft Cheek Blush -->
    <ellipse cx="64" cy="100" rx="9" ry="5" fill="#ff4b4b" opacity="${isGirl ? '0.35' : '0.2'}"/>
    <ellipse cx="136" cy="100" rx="9" ry="5" fill="#ff4b4b" opacity="${isGirl ? '0.35' : '0.2'}"/>
  `;

  // Premium Eyes Vector
  let eyesSVG = '';
  if (eyeShp === 'happy_curved') {
    eyesSVG = `
      <path d="M 66 88 Q 78 74 90 88" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
      <path d="M 110 88 Q 122 74 134 88" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
    `;
  } else if (eyeShp === 'playful_wink') {
    eyesSVG = `
      <!-- Open Eye -->
      <rect x="64" y="72" width="26" height="30" rx="12" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
      <ellipse cx="77" cy="87" rx="8" ry="10" fill="${eyeCol}"/>
      <ellipse cx="77" cy="89" rx="5" ry="6" fill="#1e293b"/>
      <circle cx="80" cy="83" r="3" fill="#ffffff"/>
      <!-- Wink Eye -->
      <path d="M 110 88 Q 122 76 134 88" fill="none" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
      <text x="126" y="78" font-size="10" fill="#ffc800">✨</text>
    `;
  } else if (eyeShp === 'anime_star') {
    eyesSVG = `
      <rect x="64" y="72" width="26" height="30" rx="12" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
      <rect x="110" y="72" width="26" height="30" rx="12" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
      <circle cx="77" cy="87" r="8" fill="${eyeCol}"/>
      <circle cx="123" cy="87" r="8" fill="${eyeCol}"/>
      <text x="73" y="91" font-size="12" fill="#ffffff">⭐</text>
      <text x="119" y="91" font-size="12" fill="#ffffff">⭐</text>
    `;
  } else {
    // Expressive Sparkle Eyes (Premium Duolingo Classic)
    eyesSVG = `
      <!-- Left Eye -->
      <rect x="64" y="70" width="27" height="31" rx="13" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
      <ellipse cx="77.5" cy="85.5" rx="8.5" ry="10.5" fill="${eyeCol}"/>
      <ellipse cx="77.5" cy="87.5" rx="5" ry="6" fill="#1e293b"/>
      <circle cx="81" cy="81" r="3.5" fill="#ffffff"/>
      <circle cx="74" cy="90" r="1.5" fill="#ffffff"/>
      
      <!-- Right Eye -->
      <rect x="109" y="70" width="27" height="31" rx="13" fill="#ffffff" stroke="#1e293b" stroke-width="3.5"/>
      <ellipse cx="122.5" cy="85.5" rx="8.5" ry="10.5" fill="${eyeCol}"/>
      <ellipse cx="122.5" cy="87.5" rx="5" ry="6" fill="#1e293b"/>
      <circle cx="126" cy="81" r="3.5" fill="#ffffff"/>
      <circle cx="119" cy="90" r="1.5" fill="#ffffff"/>
    `;
  }

  // Eyelashes for Girl characters
  let lashesSVG = '';
  if (isGirl) {
    lashesSVG = `
      <path d="M 62 70 Q 74 62 88 70" stroke="#1e293b" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 60 67 L 55 62 M 64 64 L 60 59" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
      <path d="M 112 70 Q 126 62 138 70" stroke="#1e293b" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 140 67 L 145 62 M 136 64 L 140 59" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
    `;
  }

  // Eyebrows
  const eyebrowsSVG = `
    <path d="M 64 63 Q 77 56 88 63" fill="none" stroke="${hairCol}" stroke-width="${isGirl ? 3.5 : 5}" stroke-linecap="round"/>
    <path d="M 112 63 Q 123 56 136 63" fill="none" stroke="${hairCol}" stroke-width="${isGirl ? 3.5 : 5}" stroke-linecap="round"/>
  `;

  // Nose & Cute Tongue Mouth
  const noseMouthSVG = `
    <!-- Cute Soft Nose -->
    <path d="M 98 88 Q 100 95 104 93" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    <!-- Duolingo Open Smile Mouth with Tongue -->
    <path d="M 80 104 Q 100 124 120 104 Z" fill="#9e2a2b" stroke="#1e293b" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 88 114 Q 100 106 112 114 Q 100 124 88 114 Z" fill="#ff758f"/>
  `;

  // Premium Multi-Layer Hair Vectors
  let hairSVG = '';
  if (hairStl === 'duo_spiky_premium') {
    hairSVG = `
      <path d="M 50 64 C 44 32 85 18 100 18 C 122 18 150 32 150 64 L 142 42 L 122 52 L 100 30 L 76 50 L 56 38 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
      <path d="M 102 34 L 118 50 L 102 44 Z" fill="rgba(255,255,255,0.15)"/>
    `;
  } else if (hairStl === 'curly_afro_hd') {
    hairSVG = `
      <circle cx="100" cy="54" r="44" fill="${hairCol}" stroke="#1e293b" stroke-width="4"/>
      <circle cx="62" cy="65" r="16" fill="${hairCol}"/>
      <circle cx="138" cy="65" r="16" fill="${hairCol}"/>
    `;
  } else if (hairStl === 'wavy_long_diva') {
    hairSVG = `
      <path d="M 42 75 Q 44 24 100 24 Q 156 24 158 75 Q 168 115 154 135 Q 140 105 144 75 Q 100 38 56 75 Q 60 105 46 135 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
    `;
  } else if (hairStl === 'pigtails_cute_bows') {
    hairSVG = `
      <path d="M 46 68 Q 100 32 154 68 Q 130 46 100 46 Q 70 46 46 68 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3.5"/>
      <path d="M 44 68 Q 14 90 20 130 Q 38 115 44 80 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3.5"/>
      <path d="M 156 68 Q 186 90 180 130 Q 162 115 156 80 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3.5"/>
      <circle cx="43" cy="74" r="7" fill="#ec4899" stroke="#1e293b" stroke-width="2"/>
      <circle cx="157" cy="74" r="7" fill="#ec4899" stroke="#1e293b" stroke-width="2"/>
    `;
  } else if (hairStl === 'high_bun_top') {
    hairSVG = `
      <circle cx="100" cy="20" r="22" fill="${hairCol}" stroke="#1e293b" stroke-width="4"/>
      <path d="M 46 70 Q 100 40 154 70 Q 130 50 100 50 Q 70 50 46 70 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3.5"/>
    `;
  } else if (hairStl === 'fringe_bob_style') {
    hairSVG = `
      <path d="M 44 80 C 40 28 160 28 156 80 L 158 115 C 158 115 142 90 146 70 Q 100 42 54 70 C 58 90 42 115 42 115 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="4"/>
      <path d="M 64 68 Q 100 78 136 68 Q 100 56 64 68 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="2"/>
    `;
  } else if (hairStl === 'dreads_braided') {
    hairSVG = `
      <path d="M 46 75 Q 56 20 100 20 Q 144 20 154 75" stroke="${hairCol}" stroke-width="15" stroke-linecap="round" fill="none"/>
      <line x1="46" y1="75" x2="36" y2="125" stroke="${hairCol}" stroke-width="10" stroke-linecap="round"/>
      <line x1="62" y1="65" x2="52" y2="135" stroke="${hairCol}" stroke-width="10" stroke-linecap="round"/>
      <line x1="138" y1="65" x2="148" y2="135" stroke="${hairCol}" stroke-width="10" stroke-linecap="round"/>
      <line x1="154" y1="75" x2="164" y2="125" stroke="${hairCol}" stroke-width="10" stroke-linecap="round"/>
    `;
  } else if (hairStl === 'fade_top_short') {
    hairSVG = `
      <path d="M 48 68 Q 100 32 152 68 Q 135 50 100 50 Q 65 50 48 68 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="3.5"/>
    `;
  } else if (hairStl === 'korean_curtain') {
    hairSVG = `
      <path d="M 46 72 C 45 32 155 32 154 72 Q 130 52 105 72 Q 95 72 70 52 Q 50 52 46 72 Z" fill="${hairCol}" stroke="#1e293b" stroke-width="4"/>
    `;
  }

  // Glasses (Nerd Glasses faithful to Duolingo screenshot)
  let glassesSVG = '';
  if (glass === 'duo_nerd_black') {
    glassesSVG = `
      <g>
        <rect x="56" y="68" width="40" height="30" rx="9" fill="none" stroke="#1e293b" stroke-width="5.5"/>
        <rect x="104" y="68" width="40" height="30" rx="9" fill="none" stroke="#1e293b" stroke-width="5.5"/>
        <line x1="96" y1="77" x2="104" y2="77" stroke="#1e293b" stroke-width="5.5"/>
        <line x1="42" y1="77" x2="56" y2="77" stroke="#1e293b" stroke-width="4.5"/>
        <line x1="144" y1="77" x2="158" y2="77" stroke="#1e293b" stroke-width="4.5"/>
        <!-- Glare Line -->
        <line x1="62" y1="74" x2="72" y2="74" stroke="rgba(255,255,255,0.6)" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="110" y1="74" x2="120" y2="74" stroke="rgba(255,255,255,0.6)" stroke-width="2.5" stroke-linecap="round"/>
      </g>
    `;
  } else if (glass === 'round_harry_gold') {
    glassesSVG = `
      <g>
        <circle cx="76" cy="83" r="17" fill="none" stroke="#fbbf24" stroke-width="4.5"/>
        <circle cx="124" cy="83" r="17" fill="none" stroke="#fbbf24" stroke-width="4.5"/>
        <line x1="93" y1="83" x2="107" y2="83" stroke="#fbbf24" stroke-width="4.5"/>
      </g>
    `;
  } else if (glass === 'wayfarer_cool') {
    glassesSVG = `
      <g>
        <path d="M 54 70 L 98 70 L 92 98 L 60 98 Z" fill="#1e293b" stroke="#1e293b" stroke-width="3"/>
        <path d="M 102 70 L 146 70 L 140 98 L 108 98 Z" fill="#1e293b" stroke="#1e293b" stroke-width="3"/>
        <line x1="98" y1="73" x2="102" y2="73" stroke="#1e293b" stroke-width="4"/>
      </g>
    `;
  } else if (glass === 'vr_headset_cyber') {
    glassesSVG = `
      <g>
        <rect x="52" y="68" width="96" height="34" rx="12" fill="#0f172a" stroke="#38bdf8" stroke-width="3.5"/>
        <line x1="62" y1="85" x2="138" y2="85" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="72" cy="85" r="4" fill="#ef4444"/>
      </g>
    `;
  }

  // Hats & Caps
  let hatSVG = '';
  if (hat === 'duo_green_cap') {
    hatSVG = `
      <g>
        <path d="M 44 60 Q 100 20 156 60 Z" fill="#58cc02" stroke="#1e293b" stroke-width="4"/>
        <path d="M 125 56 Q 170 60 178 68 Q 140 68 125 56 Z" fill="#46a302" stroke="#1e293b" stroke-width="3"/>
        <circle cx="100" cy="42" r="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
        <text x="100" y="46" font-size="9" font-weight="900" text-anchor="middle" fill="#58cc02">d</text>
      </g>
    `;
  } else if (hat === 'purple_gamer_cap') {
    hatSVG = `
      <g>
        <path d="M 44 60 Q 100 20 156 60 Z" fill="#ce82ff" stroke="#1e293b" stroke-width="4"/>
        <path d="M 125 56 Q 170 60 178 68 Q 140 68 125 56 Z" fill="#a559d8" stroke="#1e293b" stroke-width="3"/>
      </g>
    `;
  } else if (hat === 'winter_beanie_pompom') {
    hatSVG = `
      <g>
        <circle cx="100" cy="14" r="12" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <path d="M 44 64 Q 100 18 156 64 Z" fill="#ce82ff" stroke="#1e293b" stroke-width="4"/>
        <rect x="40" y="58" width="120" height="15" rx="7" fill="#a559d8" stroke="#1e293b" stroke-width="3.5"/>
      </g>
    `;
  } else if (hat === 'royal_gold_crown') {
    hatSVG = `
      <g>
        <polygon points="60,45 70,16 86,32 100,12 114,32 130,16 140,45" fill="#fbbf24" stroke="#1e293b" stroke-width="3.5"/>
        <circle cx="100" cy="22" r="4" fill="#ef4444"/>
      </g>
    `;
  } else if (hat === 'cute_bow_headband') {
    hatSVG = `
      <g>
        <path d="M 44 66 Q 100 46 156 66" stroke="#ec4899" stroke-width="8" fill="none"/>
        <circle cx="135" cy="52" r="10" fill="#ec4899" stroke="#1e293b" stroke-width="2"/>
      </g>
    `;
  }

  // Premium Clothing Vectors
  let outfitSVG = '';
  if (outfit === 'overalls_turtleneck') {
    outfitSVG = `
      <!-- High Turtleneck Sweater -->
      <path d="M 40 135 C 40 120 160 120 160 135 L 178 240 L 22 240 Z" fill="${outfitCol}" stroke="#1e293b" stroke-width="4" stroke-linejoin="round"/>
      <rect x="78" y="123" width="44" height="22" rx="7" fill="${outfitCol}" stroke="#1e293b" stroke-width="3.5"/>
      <!-- Denim Overalls Straps & Pants -->
      <path d="M 58 158 L 58 240 L 142 240 L 142 158 Z" fill="#1b4965" stroke="#1e293b" stroke-width="4"/>
      <rect x="70" y="158" width="16" height="64" fill="#143642"/>
      <rect x="114" y="158" width="16" height="64" fill="#143642"/>
      <circle cx="78" cy="172" r="3.5" fill="#fbbf24"/>
      <circle cx="122" cy="172" r="3.5" fill="#fbbf24"/>
    `;
  } else if (outfit === 'duo_green_hoodie') {
    outfitSVG = `
      <path d="M 40 135 C 40 120 160 120 160 135 L 178 240 L 22 240 Z" fill="#58cc02" stroke="#1e293b" stroke-width="4"/>
      <path d="M 84 135 L 100 162 L 116 135" fill="none" stroke="#1e293b" stroke-width="3.5"/>
      <circle cx="100" cy="178" r="14" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
      <text x="100" y="183" font-size="16" font-weight="900" text-anchor="middle" fill="#58cc02">d</text>
    `;
  } else if (outfit === 'hero_suit_cape') {
    outfitSVG = `
      <path d="M 20 142 Q 100 158 180 142 L 195 240 L 5 240 Z" fill="#dc2626" stroke="#1e293b" stroke-width="4"/>
      <path d="M 40 135 C 40 120 160 120 160 135 L 178 240 L 22 240 Z" fill="${outfitCol}" stroke="#1e293b" stroke-width="4"/>
      <circle cx="100" cy="170" r="16" fill="#fbbf24" stroke="#1e293b" stroke-width="2.5"/>
      <text x="100" y="176" font-size="16" font-weight="900" text-anchor="middle" fill="#dc2626">⚡</text>
    `;
  } else if (outfit === 'scientist_lab_coat') {
    outfitSVG = `
      <path d="M 38 135 Q 100 118 162 135 L 178 240 L 22 240 Z" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
      <path d="M 78 135 L 100 168 L 122 135" fill="${outfitCol}"/>
      <line x1="100" y1="168" x2="100" y2="240" stroke="#1e293b" stroke-width="3.5"/>
      <rect x="50" y="162" width="20" height="24" rx="3" fill="#38bdf8" stroke="#1e293b" stroke-width="2"/>
    `;
  } else {
    // School Blazer
    outfitSVG = `
      <path d="M 40 135 C 40 120 160 120 160 135 L 178 240 L 22 240 Z" fill="${outfitCol}" stroke="#1e293b" stroke-width="4"/>
      <polygon points="78,135 100,165 122,135" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
      <polygon points="95,135 105,135 107,168 100,176 93,168" fill="#dc2626" stroke="#1e293b" stroke-width="1.5"/>
    `;
  }

  // Mascot Companion
  let petSVG = '';
  if (pet === 'duo_owl_pet') {
    petSVG = `
      <!-- Duo Owl Pet -->
      <g transform="translate(136, 138) scale(0.98)">
        <ellipse cx="25" cy="30" rx="22" ry="26" fill="#58cc02" stroke="#1e293b" stroke-width="3.5"/>
        <ellipse cx="25" cy="35" rx="15" ry="17" fill="#89e219"/>
        <circle cx="15" cy="24" r="9" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
        <circle cx="35" cy="24" r="9" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
        <circle cx="15" cy="24" r="4" fill="#1cb0f6"/>
        <circle cx="35" cy="24" r="4" fill="#1cb0f6"/>
        <polygon points="25,28 20,35 30,35" fill="#ff9600" stroke="#1e293b" stroke-width="1.5"/>
      </g>
    `;
  } else if (pet === 'dog_caramelo_pet') {
    petSVG = `
      <g transform="translate(132, 135) scale(0.98)">
        <ellipse cx="10" cy="22" rx="8" ry="16" fill="#78350f" stroke="#1e293b" stroke-width="2.5"/>
        <ellipse cx="40" cy="22" rx="8" ry="16" fill="#78350f" stroke="#1e293b" stroke-width="2.5"/>
        <ellipse cx="25" cy="46" rx="18" ry="16" fill="#f59e0b" stroke="#1e293b" stroke-width="3"/>
        <circle cx="25" cy="28" r="19" fill="#fbbf24" stroke="#1e293b" stroke-width="3"/>
        <circle cx="18" cy="24" r="3.5" fill="#1e293b"/>
        <circle cx="32" cy="24" r="3.5" fill="#1e293b"/>
        <circle cx="25" cy="31" r="3.5" fill="#1e293b"/>
      </g>
    `;
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" style="border-radius: 18px; overflow: hidden; display: inline-block; vertical-align: middle;">
      ${bgSVG}
      <g id="duo_avatar_character">
        ${outfitSVG}
        ${headSVG}
        ${eyebrowsSVG}
        ${eyesSVG}
        ${lashesSVG}
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
