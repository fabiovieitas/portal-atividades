/**
 * ============================================================================
 * PORTAL LAB KIDS - STUDIO DE AVATARES ÉPICOS (ENGINE 5.0)
 * ============================================================================
 * 100% Focado em Heróis do Lab, Molduras Colecionáveis por XP e Fundos Temáticos:
 * - 24+ Heróis e Mascotes Colecionáveis (Robôs, Ninjas, Magos, Dinos, Dragões, etc.)
 * - Molduras Gamers Trancadas por XP (Madeira, Bronze, Neon, Craft, Brasil, Free Fire, Xbox, Mengão, Diamante, Campeão)
 * - Fundos e Arenas Temáticas (Free Fire, Xbox, Flamengo, Brasil, Minecraft, Galáxia, etc.)
 * ============================================================================
 */

const DUOLINGO_AVATAR_PRESETS = {
  // 1. ROSTER DE HERÓIS DO LAB (Mascotes e Personagens Colecionáveis por XP)
  heroes: [
    // --- NÍVEL 1: RECRUTAS INICIAIS (0 XP - Liberados para todos) ---
    { id: 'leo_robot', name: 'Robô Léo', style: 'bottts', seed: 'LeoRobot', bg: '38bdf8', icon: '🤖', title: 'Mascote Oficial do Lab', requiredXP: 0, badge: 'Inicial' },
    { id: 'astro_kid', name: 'Astro Kid', style: 'bottts', seed: 'AstroKid', bg: '818cf8', icon: '🚀', title: 'Explorador Espacial', requiredXP: 0, badge: 'Inicial' },
    { id: 'sparky_volt', name: 'Sparky Elétrico', style: 'bottts', seed: 'SparkyVolt', bg: 'facc15', icon: '⚡', title: 'Energia Pura', requiredXP: 0, badge: 'Inicial' },
    { id: 'dra_sofia', name: 'Dra. Sofia', style: 'lorelei', seed: 'Sofia', bg: 'ffd5dc', icon: '🔬', title: 'Cientista Mirim', requiredXP: 0, badge: 'Inicial' },
    { id: 'super_sorriso', name: 'Super Sorriso', style: 'big-smile', seed: 'SuperSmile', bg: 'fbbf24', icon: '😄', title: 'Mestre da Alegria', requiredXP: 0, badge: 'Inicial' },
    { id: 'solzinho_pop', name: 'Solzinho Pop', style: 'fun-emoji', seed: 'SunnyPop', bg: 'fde047', icon: '🌟', title: 'Energia Solar', requiredXP: 0, badge: 'Inicial' },
    { id: 'capitao_estudo', name: 'Capitão Estudo', style: 'adventurer', seed: 'CapitaoAventura', bg: '60a5fa', icon: '🛡️', title: 'Líder da Turma', requiredXP: 0, badge: 'Inicial' },
    { id: 'pixel_boy', name: 'Pixel Boy', style: 'pixel-art', seed: 'RetroKnight', bg: 'fbbf24', icon: '👾', title: 'Gamer 8-Bit', requiredXP: 0, badge: 'Inicial' },

    // --- NÍVEL 2: AVENTUREIROS GAMERS (50 a 100 XP) ---
    { id: 'arcade_pro', name: 'Arcade Pro', style: 'pixel-art', seed: 'ArcadeMaster', bg: 'a855f7', icon: '🕹️', title: 'Campeão dos Jogos', requiredXP: 50, reqDesc: 'Conquiste 50 XP' },
    { id: 'dino_rex', name: 'Dino Rex', style: 'fun-emoji', seed: 'DinoRex', bg: '10b981', icon: '🦖', title: 'Fera Pré-Histórica', requiredXP: 75, reqDesc: 'Conquiste 75 XP' },
    { id: 'gizmo_maker', name: 'Gizmo Maker', style: 'bottts', seed: 'GizmoMaker', bg: '38bdf8', icon: '⚙️', title: 'Engenheiro Robótico', requiredXP: 100, reqDesc: 'Alcance 100 XP' },
    { id: 'arqueira_luz', name: 'Arqueira da Luz', style: 'adventurer', seed: 'ArqueiraLuz', bg: 'ec4899', icon: '🏹', title: 'Precisão Máxima', requiredXP: 100, reqDesc: 'Alcance 100 XP' },

    // --- NÍVEL 3: MESTRES DO CONHECIMENTO (150 a 300 XP) ---
    { id: 'ninja_tabuada', name: 'Ninja da Tabuada', style: 'adventurer', seed: 'Ninja', bg: '0f172a', icon: '⚔️', title: 'Mestre do Cálculo', requiredXP: 150, reqDesc: 'Conquiste 150 XP' },
    { id: 'kitsune_ninja', name: 'Raposa Kitsune', style: 'fun-emoji', seed: 'KitsuneFox', bg: 'f97316', icon: '🦊', title: 'Raposa Veloz', requiredXP: 200, reqDesc: 'Conquiste 200 XP' },
    { id: 'mago_numeros', name: 'Mago dos Números', style: 'adventurer', seed: 'MagoArcano', bg: 'c0aedd', icon: '🧙‍♂️', title: 'Arcano da Lógica', requiredXP: 250, reqDesc: 'Conquiste 250 XP' },
    { id: 'princesa_sofia', name: 'Princesa Sofia', style: 'lorelei', seed: 'PrincesaSofia', bg: 'ffdfbf', icon: '👑', title: 'Guardiã da Leitura', requiredXP: 300, reqDesc: 'Conquiste 300 XP' },

    // --- NÍVEL 4: GUARDIÕES SUPREMOS (400 a 750 XP) ---
    { id: 'detetive_cyber', name: 'Detetive Cyber', style: 'pixel-art', seed: 'NeoDetetive', bg: '1e293b', icon: '🕵️', title: 'Investigador Neon', requiredXP: 400, reqDesc: 'Conquiste 400 XP' },
    { id: 'cyber_titan', name: 'Cyber Titan', style: 'bottts', seed: 'CyberTitan', bg: '334155', icon: '🛡️', title: 'Defensor Blindado', requiredXP: 500, reqDesc: 'Conquiste 500 XP' },
    { id: 'dragao_fogo', name: 'Dragão de Fogo', style: 'fun-emoji', seed: 'FireDragon', bg: 'ea580c', icon: '🔥', title: 'Chamas do Saber', requiredXP: 600, reqDesc: 'Conquiste 600 XP' },
    { id: 'guerreira_luna', name: 'Guerreira Luna', style: 'adventurer', seed: 'LunaValente', bg: 'f43f5e', icon: '🗡️', title: 'Heroína Lendária', requiredXP: 750, reqDesc: 'Conquiste 750 XP' },

    // --- NÍVEL 5: LENDAS DA TEMPORADA (1000 a 2000 XP) ---
    { id: 'nexus_cosmico', name: 'Nexus Cósmico', style: 'bottts', seed: 'NexusGalaxy', bg: '1e1b4b', icon: '🌌', title: 'Soberano das Estrelas', requiredXP: 1000, reqDesc: 'Lenda do Lab (1000 XP)' },
    { id: 'cavaleiro_ouro', name: 'Cavaleiro de Ouro', style: 'adventurer', seed: 'CavaleiroDeOuro', bg: 'b45309', icon: '⚡', title: 'Armadura Dourada', requiredXP: 1250, reqDesc: 'Conquiste 1250 XP' },
    { id: 'fenix_dourada', name: 'Fênix Dourada', style: 'fun-emoji', seed: 'CosmicPanda', bg: 'b45309', icon: '🏆', title: 'Renascida da Vitória', requiredXP: 1500, reqDesc: 'Conquiste 1500 XP' },
    { id: 'mestre_supremo', name: 'Mestre Supremo', style: 'adventurer', seed: 'MestreSupremo', bg: '78350f', icon: '👑', title: 'Grande Lenda do Lab', requiredXP: 2000, reqDesc: 'Mestre Supremo (2000 XP)' }
  ],

  // 2. MOLDURAS GAMERS (Frames Colecionáveis - Todas trancadas para ganhar com XP!)
  frames: [
    {
      id: 'frame_none',
      name: 'Sem Moldura',
      icon: '🚫',
      desc: 'Borda padrão sem efeito',
      requiredXP: 0,
      badge: 'Inicial',
      borderStyle: 'border: 3px solid rgba(255,255,255,0.7); box-shadow: 0 4px 15px rgba(0,0,0,0.15);'
    },
    {
      id: 'frame_madeira',
      name: 'Madeira Rústica',
      icon: '🪵',
      desc: 'Borda rústica de explorador mirim',
      requiredXP: 20,
      badge: '20 XP',
      borderStyle: 'border: 5px solid #854d0e; outline: 2px solid #713f12; box-shadow: 0 0 12px rgba(133, 77, 14, 0.6), inset 0 0 6px #713f12;'
    },
    {
      id: 'frame_bronze',
      name: 'Aço de Batalha',
      icon: '🛡️',
      desc: 'Aro reforçado metálico com rebites',
      requiredXP: 60,
      badge: '60 XP',
      borderStyle: 'border: 5px solid #94a3b8; outline: 2px solid #475569; box-shadow: 0 0 14px rgba(148, 163, 184, 0.8), inset 0 0 6px #334155;'
    },
    {
      id: 'frame_cyber',
      name: 'Neon Cyberpunk',
      icon: '⚡',
      desc: 'Brilho ciano e azul elétrico arcade',
      requiredXP: 120,
      badge: '120 XP',
      borderStyle: 'border: 5px solid #00f2fe; outline: 2px solid #0284c7; box-shadow: 0 0 20px #00f2fe, inset 0 0 10px rgba(0, 242, 254, 0.6); animation: neonCyberPulse 2s infinite ease-in-out;'
    },
    {
      id: 'frame_craft',
      name: 'Bloco Craft',
      icon: '⛏️',
      desc: 'Estilo bloco de esmeralda cúbico',
      requiredXP: 250,
      badge: '250 XP',
      borderStyle: 'border: 5px solid #10b981; outline: 3px solid #065f46; box-shadow: 0 0 16px rgba(16, 185, 129, 0.85), inset 0 0 8px #047857;'
    },
    {
      id: 'frame_brasil',
      name: 'Pátria Canarinho',
      icon: '🇧🇷',
      desc: 'Ouro e verde da Seleção com estrelas',
      requiredXP: 400,
      badge: '400 XP',
      borderStyle: 'border: 5px solid #facc15; outline: 3px solid #15803d; box-shadow: 0 0 22px rgba(250, 204, 21, 0.95), 0 0 35px rgba(21, 128, 61, 0.6);'
    },
    {
      id: 'frame_freefire',
      name: 'Fogo Free Fire',
      icon: '🔥',
      desc: 'Chamas carmesim e fogo ardente',
      requiredXP: 600,
      badge: '600 XP',
      borderStyle: 'border: 5px solid #ff4500; outline: 3px solid #dc2626; box-shadow: 0 0 24px #ef4444, inset 0 0 14px #f97316; animation: flamePulse 1.8s infinite ease-in-out;'
    },
    {
      id: 'frame_xbox',
      name: 'Xbox Ultra Verde',
      icon: '🎮',
      desc: 'Verde oficial Xbox com aura gamer',
      requiredXP: 850,
      badge: '850 XP',
      borderStyle: 'border: 5px solid #107c10; outline: 3px solid #052e16; box-shadow: 0 0 24px #22c55e, inset 0 0 12px #107c10;'
    },
    {
      id: 'frame_flamengo',
      name: 'Nação Rubro-Negra',
      icon: '🔴⚫',
      desc: 'Raça rubro-negra com detalhes de ouro',
      requiredXP: 1100,
      badge: '1100 XP',
      borderStyle: 'border: 5px solid #dc2626; outline: 3px solid #09090b; box-shadow: 0 0 25px rgba(220, 38, 38, 0.95), 0 0 10px #fbbf24;'
    },
    {
      id: 'frame_diamante',
      name: 'Diamante Radiante',
      icon: '💎',
      desc: 'Cristal raro com brilho celestial',
      requiredXP: 1500,
      badge: '1500 XP',
      borderStyle: 'border: 5px solid #e0f2fe; outline: 3px solid #38bdf8; box-shadow: 0 0 30px #38bdf8, 0 0 45px rgba(255, 255, 255, 0.9); animation: diamondShimmer 2.5s infinite;'
    },
    {
      id: 'frame_campeao',
      name: 'Coroa da Glória (TOP 1)',
      icon: '👑',
      desc: 'Ouro real da temporada com gemas',
      requiredXP: 2000,
      badge: '2000 XP',
      borderStyle: 'border: 6px solid #fbbf24; outline: 3px solid #b45309; box-shadow: 0 0 35px #fbbf24, inset 0 0 18px #fbbf24;'
    }
  ],

  // 3. CENÁRIOS & FUNDOS TEMÁTICOS (Arenas de Batalha com Cenários Reais)
  bgColors: [
    {
      id: 'freefire',
      label: 'Free Fire Battle 🔥',
      image: '/img/arenas/freefire.webp',
      thumb: '/img/arenas/freefire_thumb.webp',
      gradient: 'linear-gradient(135deg, #7f1d1d 0%, #ea580c 50%, #450a0a 100%)',
      hex: 'ea580c',
      themeClass: 'theme-freefire'
    },
    {
      id: 'xbox',
      label: 'Xbox Game Pass 🎮',
      image: '/img/arenas/xbox.webp',
      thumb: '/img/arenas/xbox_thumb.webp',
      gradient: 'linear-gradient(135deg, #052e16 0%, #107c10 50%, #064e3b 100%)',
      hex: '107c10',
      themeClass: 'theme-xbox'
    },
    {
      id: 'flamengo',
      label: 'Manto Rubro-Negro 🔴⚫',
      image: '/img/arenas/flamengo.webp',
      thumb: '/img/arenas/flamengo_thumb.webp',
      gradient: 'linear-gradient(135deg, #450a0a 0%, #dc2626 50%, #09090b 100%)',
      hex: 'dc2626',
      themeClass: 'theme-flamengo'
    },
    {
      id: 'brasil',
      label: 'Brasil Canarinho 🇧🇷',
      image: '/img/arenas/brasil.webp',
      thumb: '/img/arenas/brasil_thumb.webp',
      gradient: 'linear-gradient(135deg, #15803d 0%, #facc15 50%, #1d4ed8 100%)',
      hex: 'facc15',
      themeClass: 'theme-brasil'
    },
    {
      id: 'minecraft',
      label: 'Minecraft Craft ⛏️',
      image: '/img/arenas/minecraft.webp',
      thumb: '/img/arenas/minecraft_thumb.webp',
      gradient: 'linear-gradient(135deg, #15803d 0%, #22c55e 50%, #78350f 100%)',
      hex: '22c55e',
      themeClass: 'theme-minecraft'
    },
    {
      id: 'galaxy',
      label: 'Galáxia Espacial 🚀',
      image: '/img/arenas/galaxy.webp',
      thumb: '/img/arenas/galaxy_thumb.webp',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #581c87 100%)',
      hex: '818cf8',
      themeClass: 'theme-galaxy'
    },
    {
      id: 'playstation',
      label: 'PlayStation Blue ⚡',
      image: '/img/arenas/playstation.webp',
      thumb: '/img/arenas/playstation_thumb.webp',
      gradient: 'linear-gradient(135deg, #002244 0%, #003791 50%, #00f2fe 100%)',
      hex: '003791',
      themeClass: 'theme-playstation'
    },
    {
      id: 'ouro_campeao',
      label: 'Ouro Campeão 🏆',
      image: '/img/arenas/ouro_campeao.webp',
      thumb: '/img/arenas/ouro_campeao_thumb.webp',
      gradient: 'linear-gradient(135deg, #78350f 0%, #f59e0b 50%, #fbbf24 100%)',
      hex: 'fbbf24',
      themeClass: 'theme-ouro'
    },
    {
      id: 'ninja_dark',
      label: 'Dojo das Sombras 🥋',
      image: '/img/arenas/ninja_dark.webp',
      thumb: '/img/arenas/ninja_dark_thumb.webp',
      gradient: 'linear-gradient(135deg, #020617 0%, #1e1b4b 50%, #0f172a 100%)',
      hex: '0f172a',
      themeClass: 'theme-ninja'
    },
    {
      id: 'candy_pop',
      label: 'Doce Pop Rainbow 🍭',
      image: '/img/arenas/candy_pop.webp',
      thumb: '/img/arenas/candy_pop_thumb.webp',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #a855f7 100%)',
      hex: 'ec4899',
      themeClass: 'theme-candy'
    }
  ]
};

/**
 * Constrói a URL do avatar de forma inteligente
 */
function buildDiceBearUrl(config = {}, isTilePreview = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch (e) { config = {}; }
  }

  const style = config.style || 'bottts';
  const seed = config.seed || 'LeoRobot';
  
  // Resolução de cores de fundo temáticas
  let bgHex = '38bdf8';
  if (config.bg) {
    const foundBg = DUOLINGO_AVATAR_PRESETS.bgColors.find(b => b.id === config.bg || b.hex === config.bg.replace('#', ''));
    bgHex = foundBg ? foundBg.hex : config.bg.replace('#', '');
  }

  let url = `/api/avatar-proxy?style=${encodeURIComponent(style)}&seed=${encodeURIComponent(seed)}`;
  if (bgHex && bgHex !== 'transparent') {
    url += `&backgroundColor=${bgHex}`;
  }

  return url;
}

/**
 * Gera a tag HTML com o Avatar no Estilo Figurinha 3D Gamer envolvido na Moldura Selecionada
 */
function generateAvatarSVG(config = {}, size = 220, isTilePreview = false, isChampion = false) {
  if (typeof config === 'string') {
    try { config = JSON.parse(config); } catch(e){ config = {}; }
  }

  const url = buildDiceBearUrl(config, isTilePreview);
  const borderRadius = isTilePreview ? '16px' : '26px';
  const stickerFilter = isTilePreview 
    ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' 
    : 'drop-shadow(0 0 2px #ffffff) drop-shadow(0 0 5px #ffffff) drop-shadow(0 14px 28px rgba(0,0,0,0.32))';

  // Resolução da moldura selecionada
  let frameCss = '';
  let frameCorner = '';
  if (config.frame && config.frame !== 'frame_none') {
    const f = DUOLINGO_AVATAR_PRESETS.frames.find(fr => fr.id === config.frame);
    if (f) {
      frameCss = f.borderStyle;
      if (f.id === 'frame_brasil') frameCorner = '🇧🇷';
      else if (f.id === 'frame_freefire') frameCorner = '🔥';
      else if (f.id === 'frame_xbox') frameCorner = '🎮';
      else if (f.id === 'frame_flamengo') frameCorner = '🔴⚫';
      else if (f.id === 'frame_diamante') frameCorner = '💎';
      else if (f.id === 'frame_campeao') frameCorner = '👑';
    }
  }

  const hasCrown = Boolean(isChampion || config.isChampion || config.frame === 'frame_campeao');
  const crownHtml = hasCrown ? `
    <div style="position: absolute; top: -16px; left: 50%; transform: translateX(-50%); font-size: ${Math.max(22, Math.round(size * 0.28))}px; filter: drop-shadow(0 4px 10px rgba(245,158,11,0.7)); z-index: 10; animation: crownFloat 2.5s infinite ease-in-out;">
      👑
    </div>
  ` : '';

  const cornerBadgeHtml = frameCorner ? `
    <div style="position: absolute; bottom: -8px; right: -8px; font-size: ${Math.max(16, Math.round(size * 0.2))}px; filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4)); z-index: 9;">
      ${frameCorner}
    </div>
  ` : '';

  return `
    <div style="position: relative; display: inline-block; width: ${size}px; height: ${size}px; vertical-align: middle; box-sizing: border-box; border-radius: ${borderRadius}; ${frameCss}">
      ${crownHtml}
      ${cornerBadgeHtml}
      <img src="${url}" width="100%" height="100%" 
           style="border-radius: calc(${borderRadius} - 4px); display: block; object-fit: contain; filter: ${stickerFilter}; transition: transform 0.25s ease;" 
           alt="Avatar Lab Kids" />
    </div>
  `;
}

// Injeção de Animações das Molduras e Coroas
if (typeof document !== 'undefined') {
  const crownStyleId = 'lab-avatar-frames-style';
  if (!document.getElementById(crownStyleId)) {
    const st = document.createElement('style');
    st.id = crownStyleId;
    st.textContent = `
      @keyframes crownFloat {
        0%, 100% { transform: translateX(-50%) translateY(0) rotate(-3deg); }
        50% { transform: translateX(-50%) translateY(-6px) rotate(3deg); }
      }
      @keyframes flamePulse {
        0%, 100% { box-shadow: 0 0 20px #ef4444, inset 0 0 10px #f97316; }
        50% { box-shadow: 0 0 32px #ff4500, inset 0 0 16px #facc15; }
      }
      @keyframes neonCyberPulse {
        0%, 100% { box-shadow: 0 0 16px #00f2fe, inset 0 0 8px rgba(0,242,254,0.5); }
        50% { box-shadow: 0 0 28px #38bdf8, inset 0 0 14px rgba(2,132,199,0.8); }
      }
      @keyframes diamondShimmer {
        0%, 100% { box-shadow: 0 0 25px #38bdf8, 0 0 40px rgba(255,255,255,0.8); }
        50% { box-shadow: 0 0 40px #a855f7, 0 0 55px rgba(255,255,255,1); }
      }
    `;
    document.head.appendChild(st);
  }
}

// Exportações Globais
if (typeof window !== 'undefined') {
  window.DUOLINGO_AVATAR_PRESETS = DUOLINGO_AVATAR_PRESETS;
  window.generateAvatarSVG = generateAvatarSVG;
  window.buildDiceBearUrl = buildDiceBearUrl;
}

if (typeof module !== 'undefined') {
  module.exports = { DUOLINGO_AVATAR_PRESETS, generateAvatarSVG, buildDiceBearUrl };
}
