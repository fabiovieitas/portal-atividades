require('dotenv').config();
const { createClient: createTursoClient } = require('@libsql/client');
const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Safely initialize local SQLite (only available when running locally in Node)
let sqlite = null;
try {
  const Database = require('better-sqlite3');
  const dbPath = path.join(__dirname, 'database.db');
  sqlite = new Database(dbPath);

  // Ensure essential tables in local SQLite
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT,
      content TEXT NOT NULL,
      image_url TEXT,
      category TEXT DEFAULT 'Geral',
      author TEXT DEFAULT 'Equipe Lab',
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      activity_id INTEGER,
      student_name TEXT NOT NULL,
      school_name TEXT,
      class_name TEXT,
      avatar TEXT DEFAULT '🤖',
      comment_text TEXT NOT NULL,
      approved INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      activity_url TEXT NOT NULL,
      icon_url TEXT,
      level TEXT DEFAULT '1-5',
      category TEXT DEFAULT 'Geral',
      rating_sum INTEGER DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      visits INTEGER DEFAULT 0,
      bncc_code TEXT DEFAULT '',
      subject TEXT DEFAULT 'Geral',
      qr_scans INTEGER DEFAULT 0,
      teacher_id INTEGER,
      status TEXT DEFAULT 'public',
      author_credit TEXT,
      month TEXT DEFAULT 'Agosto',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER DEFAULT 1,
      name TEXT NOT NULL,
      school TEXT,
      class TEXT,
      avatar_config TEXT DEFAULT '{}',
      medals_json TEXT DEFAULT '[]',
      points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT NOT NULL,
      school_name TEXT,
      class_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS simulado_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      simulado_id TEXT DEFAULT 'campos-4ano-agosto-2026',
      student_name TEXT NOT NULL,
      school_name TEXT,
      class_name TEXT,
      answers_json TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      max_score INTEGER DEFAULT 9,
      essay_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      school TEXT DEFAULT '',
      status TEXT DEFAULT 'approved',
      login_count INTEGER DEFAULT 0,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS teacher_sessions (
      id TEXT PRIMARY KEY,
      teacher_id INTEGER NOT NULL,
      expires DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS teacher_favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      activity_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS teacher_classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      grade_level TEXT,
      access_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  try { sqlite.exec("ALTER TABLE students ADD COLUMN class_id INTEGER DEFAULT 1;"); } catch(e){}
  try { sqlite.exec("ALTER TABLE students ADD COLUMN avatar_config TEXT DEFAULT '{}';"); } catch(e){}
  try { sqlite.exec("ALTER TABLE students ADD COLUMN medals_json TEXT DEFAULT '[]';"); } catch(e){}
  try { sqlite.exec("ALTER TABLE activities ADD COLUMN month TEXT DEFAULT 'Agosto';"); } catch(e){}
  try { sqlite.exec("ALTER TABLE teachers ADD COLUMN school TEXT DEFAULT '';"); } catch(e){}
  try { sqlite.exec("ALTER TABLE teachers ADD COLUMN status TEXT DEFAULT 'approved';"); } catch(e){}
  try { sqlite.exec("ALTER TABLE teachers ADD COLUMN verification_code TEXT;"); } catch(e){}
  try { sqlite.exec("ALTER TABLE teachers ADD COLUMN verification_token TEXT;"); } catch(e){}
  try { sqlite.exec("ALTER TABLE teachers ADD COLUMN verification_expires DATETIME;"); } catch(e){}
  try { sqlite.exec("ALTER TABLE teachers ADD COLUMN reset_token TEXT;"); } catch(e){}
  try { sqlite.exec("ALTER TABLE teachers ADD COLUMN reset_expires DATETIME;"); } catch(e){}
} catch (e) {
  console.warn('[DB Engine] SQLite local driver standard bypass (running in serverless environment):', e.message);
}

// Turso Cloud Client setup
let tursoUrl = process.env.TURSO_DATABASE_URL || 'libsql://portal-atividades-fabiovieitas.turso.io';
if (tursoUrl.includes('aws-ap-south-1.')) {
  tursoUrl = tursoUrl.replace('aws-ap-south-1.', '');
}
const tursoToken = process.env.TURSO_AUTH_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODY2NDM4NDcsImlkIjoiMDE5ZmZjNDQtZTIwMS03NTA2LTg4NjctNzk0NTYyMWY5MDk5Iiwia2lkIjoiekZRMlpBUnYxLVVNR2c1OGNFTWFiWGdkS3J4Y3FoeU9CTUpOVVdHVDBfOCIsInJpZCI6ImRhZGVjYWM3LTQ5ZTctNGFlMS1iMzNkLTBiNjgwZGU3M2JlYSJ9.6bF1mKnc5EI5YvHvDUijg60mWqzaN2Zf0XQNTS1xOOmuC3G187q9gxVQLJzSWWD6teTQLUEVNDHK4V4VZmYoBg';

let tursoClient = null;
if (tursoUrl && tursoToken) {
  try {
    // Normalize libsql:// to https:// for HTTP fetch API compatibility
    if (tursoUrl.startsWith('libsql://')) {
      tursoUrl = tursoUrl.replace('libsql://', 'https://');
    }
    tursoClient = createTursoClient({ url: tursoUrl, authToken: tursoToken });
    console.log('[DB Engine] Turso Cloud conectado com sucesso!');
  } catch (e) {
    console.warn('[DB Engine] Falha ao iniciar Turso Client:', e.message);
  }
} else {
  console.log('[DB Engine] Turso não configurado no .env, tentando SQLite local.');
}

// Supabase is completely decommissioned. Database operations run 100% via Turso Cloud (libsql) with local SQLite fallback.
const supabase = null;
console.log('[DB Engine] Supabase desabilitado. Operando 100% via Turso Cloud (libsql).');

// Memory Cache for Categories/Subjects
let cachedMeta = null;
let cachedMetaTime = 0;
const META_CACHE_TTL = 10 * 60 * 1000;

// Universal SQL executor
async function queryAll(sql, args = []) {
  if (tursoClient) {
    try {
      const res = await tursoClient.execute({ sql, args });
      if (res && res.rows) return res.rows;
    } catch (err) {
      console.error('[Turso Query Error]:', err.message);
    }
  }
  if (sqlite) {
    try {
      return sqlite.prepare(sql).all(...args);
    } catch (err) {
      console.error('[SQLite Query Error]:', err.message);
    }
  }
  return [];
}

async function queryGet(sql, args = []) {
  if (tursoClient) {
    try {
      const res = await tursoClient.execute({ sql, args });
      if (res.rows && res.rows[0]) return res.rows[0];
    } catch (err) {
      console.error('[Turso Query Error]:', err.message);
    }
  }
  if (sqlite) {
    try {
      return sqlite.prepare(sql).get(...args) || null;
    } catch (err) {
      console.error('[SQLite Query Error]:', err.message);
    }
  }
  return null;
}

async function queryRun(sql, args = []) {
  if (tursoClient) {
    try {
      await tursoClient.execute({ sql, args });
    } catch (err) {
      console.error('[Turso Run Error]:', err.message);
    }
  }
  if (sqlite) {
    try {
      sqlite.prepare(sql).run(...args);
    } catch (err) {
      console.error('[SQLite Run Error]:', err.message);
    }
  }
}

const dbHelper = {
  sqlite,
  tursoClient,
  supabase,
  queryRun,
  queryAll,
  queryGet,

  async isOnline() {
    return true;
  },

  // 1. Get Activities
  async getActivities({ level, search, category, bncc, subject, month, status = 'public', adminMode = false } = {}) {
    let sql = "SELECT * FROM activities WHERE title NOT LIKE '%Code.org%' AND title NOT LIKE '%Desenho com Robôs%'";
    const params = [];

    if (!adminMode) {
      sql += " AND status = ?";
      params.push(status);
    }
    if (month && month !== 'Todas') {
      sql += " AND (month = ? OR (month IS NULL AND ? = 'Agosto'))";
      params.push(month, month);
    }
    if (level) {
      sql += " AND level LIKE ?";
      params.push(`%${level}%`);
    }
    if (search) {
      const cleanSearch = search.trim();
      const norm = cleanSearch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const terms = new Set([cleanSearch, norm]);
      if (norm.toLowerCase().includes('danc')) {
        terms.add('dança');
        terms.add('danca');
      }
      if (norm.toLowerCase().includes('music')) {
        terms.add('música');
        terms.add('musica');
      }
      if (norm.toLowerCase().includes('percuss')) {
        terms.add('percussão');
        terms.add('percussao');
      }
      const clauses = [];
      for (const t of terms) {
        clauses.push("(title LIKE ? OR description LIKE ? OR category LIKE ? OR subject LIKE ? OR bncc_code LIKE ?)");
        params.push(`%${t}%`, `%${t}%`, `%${t}%`, `%${t}%`, `%${t}%`);
      }
      sql += ` AND (${clauses.join(' OR ')})`;
    }
    if (category && category !== 'Todas') {
      sql += " AND category = ?";
      params.push(category);
    }
    if (bncc) {
      sql += " AND bncc_code LIKE ?";
      params.push(`%${bncc}%`);
    }
    if (subject && subject !== 'Todas') {
      sql += " AND subject = ?";
      params.push(subject);
    }

    sql += " ORDER BY visits DESC, id ASC";
    let rows = [];
    try {
      rows = await queryAll(sql, params);
    } catch (e) {
      console.warn('getActivities query warning:', e.message);
    }

    // Always remove raw direct-link duplicate for Leitura Divertida
    if (rows && rows.length > 0) {
      rows = rows.filter(r => r.activity_url !== '/games/leitura-datashow/index.html');

      // Deduplicação segura por activity_url (mantém a entrada com mais visitas)
      const seenUrls = new Set();
      rows = rows.filter(r => {
        const u = (r.activity_url || '').toLowerCase().trim();
        if (u && seenUrls.has(u)) return false;
        if (u) seenUrls.add(u);
        return true;
      });
    }

    if (!adminMode && rows && rows.length > 0) {
      let isSimuladosEnabled = false;
      try {
        const setting = await this.getSetting('simulados_enabled', 'false');
        isSimuladosEnabled = setting === 'true' || setting === true;
      } catch (e) {}

      if (!isSimuladosEnabled) {
        rows = rows.filter(r => {
          const t = (r.title || '').toLowerCase();
          const u = (r.activity_url || '').toLowerCase();
          return !t.includes('simulado') && !u.includes('simulado');
        });
      }

      // REGRA DE OURO: Todo jogo novo (lançado nos últimos 21 dias) DEVE estar no TOPO absoluto!
      const now = Date.now();
      const NEW_WINDOW_MS = 21 * 24 * 60 * 60 * 1000; // 21 dias
      rows.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        const isNewA = (now - timeA) <= NEW_WINDOW_MS;
        const isNewB = (now - timeB) <= NEW_WINDOW_MS;

        // 1. Jogos novos SEMPRE no topo dos jogos!
        if (isNewA && !isNewB) return -1;
        if (!isNewA && isNewB) return 1;

        // Se ambos forem novos, o mais recente criado vem primeiro
        if (isNewA && isNewB) {
          return timeB - timeA;
        }

        // 2. Demais jogos por popularidade (visitas DESC), com desempate por data mais recente
        const vA = Number(a.visits || 0);
        const vB = Number(b.visits || 0);
        if (vB !== vA) return vB - vA;
        return timeB - timeA;
      });
    } else if (adminMode && rows && rows.length > 0) {
      rows.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });
    }

    const isFiltered = Boolean(search || (category && category !== 'Todas') || bncc || (subject && subject !== 'Todas') || (month && month !== 'Todas'));
    if ((!rows || rows.length === 0) && !isFiltered) {
      rows = [
        {
          id: 1,
          title: "⭐ Leitura Divertida no Datashow [JOGO AUTORAL]",
          description: "⚡ JOGO AUTORAL LAB KIDS! Ferramenta pedagógica interativa para projeção de palavras, sílabas e leitura guiada em datashow ou tela cheia.",
          activity_url: "/atividades/leitura-datashow",
          icon_url: "/img/covers/leitura-datashow.jpg",
          level: "1-5", category: "Alfabetização Autoral", subject: "Português", bncc_code: "EF01LP01, EF01LP08, EF02LP04", status: "public", visits: 850
        },
        {
          id: 2,
          title: "Brincando com Ariê 1",
          description: "Jogo educativo para auxílio à alfabetização, reconhecimento de cores, frutas e associação de palavras.",
          activity_url: "/atividades/brincando-com-arie-1",
          icon_url: "/img/covers/brincando-com-arie-1.jpg",
          level: "1-5", category: "Alfabetização", subject: "Português", bncc_code: "EI02EF04, EI02ET06, EF01LP10", status: "public", visits: 500
        },
        {
          id: 3,
          title: "Brincando com Ariê 2",
          description: "Segunda edição da série pedagógica Ariê! Desafios de sílabas, contagem de objetos, memória e associação.",
          activity_url: "/atividades/brincando-com-arie-2",
          icon_url: "/img/covers/brincando-com-arie-2.jpg",
          level: "1-5", category: "Alfabetização", subject: "Português", bncc_code: "EI03EF04, EF01LP10, EF01MA01", status: "public", visits: 580
        },
        {
          id: 4,
          title: "Brincando com Ariê 3",
          description: "Terceiro capítulo com exercícios desafiadores de ortografia, associação de frases, adição e raciocínio.",
          activity_url: "/atividades/brincando-com-arie-3",
          icon_url: "/img/covers/brincando-com-arie-3.jpg",
          level: "1-5", category: "Alfabetização Avançada", subject: "Português", bncc_code: "EF01LP12, EF02LP01, EF02MA05", status: "public", visits: 620
        },
        {
          id: 5,
          title: "Chapeuzinho e o Enigma",
          description: "Ajude Chapeuzinho Vermelho a atravessar a floresta resolvendo quebra-cabeças de palavras e atenção!",
          activity_url: "/atividades/chapeuzinho-enigma",
          icon_url: "/img/covers/chapeuzinho-enigma.jpg",
          level: "1-5", category: "Alfabetização & Raciocínio", subject: "Português", bncc_code: "EF01LP02, EF01LP05, EF15AR04", status: "public", visits: 430
        },
        {
          id: 6,
          title: "Capitão Alberto e o Faraó",
          description: "Uma aventura histórica pelo Egito Antigo! Desvende mistérios, hieróglifos e desafios de história.",
          activity_url: "/atividades/capitao-alberto-farao",
          icon_url: "/img/covers/capitao-alberto-farao.jpg",
          level: "1-5", category: "História & Aventura", subject: "História", bncc_code: "EF01HI01, EF02HI02, EF03HI01", status: "public", visits: 390
        },
        {
          id: 7,
          title: "Ariê Colorir",
          description: "Atividade artística interativa! Explore a paleta de cores e desenvolva a coordenação motora.",
          activity_url: "/atividades/arie-colorir",
          icon_url: "/img/covers/arie-colorir.jpg",
          level: "1-5", category: "Artes Visuais", subject: "Artes", bncc_code: "EF15AR04, EF15AR02, EI02CG05", status: "public", visits: 510
        },
        {
          id: 8,
          title: "Tabuada - O Chão é Lava!",
          description: "Jogo dinâmico de matemática! Calcule a tabuada rapidamente para salvar os personagens.",
          activity_url: "/atividades/tabuada-chao-e-lava",
          icon_url: "/img/covers/tabuada-chao-e-lava.jpg",
          level: "1-5", category: "Matemática Divertida", subject: "Matemática", bncc_code: "EF02MA05, EF03MA03, EF04MA04", status: "public", visits: 670
        },
        {
          id: 9,
          title: "Caça-Palavras Temático",
          description: "Desafio de leitura e ortografia! Encontre palavras escondidas por categorias temáticas.",
          activity_url: "/atividades/caca-palavras-temas",
          icon_url: "/img/covers/caca-palavras-temas.jpg",
          level: "1-5", category: "Vocabulário & Leitura", subject: "Português", bncc_code: "EF01LP02, EF02LP04, EF35LP05", status: "public", visits: 480
        },
        {
          id: 10,
          title: "Tux Math - Matemática Divertida",
          description: "Jogo educativo arcade onde você ajuda o pinguim Tux a defender a cidade resolvendo equações!",
          activity_url: "/atividades/tux-math",
          icon_url: "https://tuxmath.org/images/favicon.png",
          level: "1-5", category: "Matemática", subject: "Matemática", bncc_code: "EF01MA06, EF02MA05, EF03MA03", status: "public", visits: 420
        },
        {
          id: 11,
          title: "Pou Online - Mascote Virtual & Rotinas",
          description: "Jogo educativo de responsabilidade, cuidados e rotinas! Alimente e cuide do seu bichinho virtual.",
          activity_url: "/atividades/pou-online",
          icon_url: "/games/pou-online/assets/icon.jpeg",
          level: "1-5", category: "Cuidados & Hábitos", subject: "Ciências", bncc_code: "EI03CG04, EI03EO02, EF01CI01", status: "public", visits: 480
        },
        {
          id: 12,
          title: "Gartic.io - Desenho & Vocabulário",
          description: "Jogo de desenho e adivinhação! Desenhe a palavra sorteada e adivinhe os traços dos outros jogadores.",
          activity_url: "/atividades/gartic",
          icon_url: "https://gartic.io/static/images/avatar/1.png",
          level: "1-5", category: "Artes & Vocabulário", subject: "Artes", bncc_code: "EF15AR04, EF15AR02, EF01LP01", status: "public", visits: 520
        },
        {
          id: 13,
          title: "Akinator - O Gênio da Lógica",
          description: "Jogo de lógica, classificação e dedução! Pense em um personagem e responda às perguntas do gênio.",
          activity_url: "/atividades/akinator",
          icon_url: "https://pt.akinator.com/assets/img/akinator.png",
          level: "1-5", category: "Lógica & Dedução", subject: "Matemática", bncc_code: "EF01MA09, EF02MA18, EF35LP05", status: "public", visits: 610
        },
        {
          id: 14,
          title: "Laboratório de Circuitos (Tinkercad)",
          description: "Monte e simule circuitos elétricos, baterias e leds em um ambiente virtual interativo.",
          activity_url: "https://www.tinkercad.com/circuits",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2853/2853173.png",
          level: "6-9", category: "Eletrônica & Robótica", subject: "Ciências", bncc_code: "EF08CI02, EF08CI05", status: "public", visits: 210
        },
        {
          id: 15,
          title: "LEVEL UP: O Jogo da Vida não tem Botão de Reset [JOGO AUTORAL - AGENDA 21]",
          description: "Simulador autoral de escolhas, desenvolvimento sustentável, projeto de vida e cidadania planetária alinhado à Agenda 21 e ODS da ONU.",
          activity_url: "/atividades/level-up",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
          level: "6-9", category: "Jogo Autoral Lab Kids", subject: "Projeto de Vida", bncc_code: "EF06MA32, EF09MA20", status: "public", visits: 380
        },
        {
          id: 16,
          title: "🕵️ Carta Enigmática & Escape Room [JOGO AUTORAL]",
          description: "⚡ JOGO AUTORAL LAB KIDS! Decifre enigmas rebus somando e subtraindo letras no estilo clássico da revista e Itaú Criança! Destranque as salas secretas e abra o cofre final.",
          activity_url: "/atividades/carta-enigmatica",
          icon_url: "/img/covers/carta-enigmatica.jpg",
          level: "1-5", category: "Alfabetização & Lógica", subject: "Português", bncc_code: "EF03LP02, EF04LP01, EF05LP01, EF15LP01, EF35LP05", status: "public", visits: 720
        },
        {
          id: 51,
          title: "Segue o Ritmo! 🥁 Desafio de Dança e Percussão Corporal [JOGO AUTORAL]",
          description: "Desafio musical e psicomotor de dança, ritmo, percussão corporal e coreografia coletiva para projeção no Datashow ou prática no laboratório.",
          activity_url: "/atividades/segue-o-ritmo",
          icon_url: "/img/covers/segue-o-ritmo.jpg",
          level: "1-5", category: "Música & Movimento", subject: "Artes / Ed. Física", bncc_code: "EF15AR14, EF15AR15, EF15EF01, EF15EF02", status: "public", visits: 980
        },
        {
          id: 52,
          title: "⚔️ Ninja Math: A Espada da Tabuada [JOGO AUTORAL]",
          description: "⚡ JOGO AUTORAL LAB KIDS! Treine agilidade e cálculo mental rápido fatiando frutas com a lâmina ninja! Modos de Adição, Subtração, Multiplicação e Divisão no estilo Fruit Ninja e TuxMath.",
          activity_url: "/atividades/ninja-math",
          icon_url: "/img/covers/ninja-math.jpg",
          level: "1-5", category: "Matemática Divertida", subject: "Matemática", bncc_code: "EF01MA06, EF02MA05, EF03MA03, EF04MA04, EF05MA08", status: "public", visits: 1250
        }
      ];
    }

    return rows;
  },

  // 2. Get Approved Comments
  async getApprovedComments(limit = 15) {
    const sql = `
      SELECT c.*, a.title as activity_title 
      FROM comments c 
      LEFT JOIN activities a ON c.activity_id = a.id 
      WHERE c.approved = 1 
      ORDER BY c.created_at DESC 
      LIMIT ?
    `;
    try {
      return await queryAll(sql, [limit]);
    } catch (e) {
      return [];
    }
  },

  // 3. Get Categories and Subjects
  async getCategoriesAndSubjects() {
    const now = Date.now();
    if (cachedMeta && (now - cachedMetaTime < META_CACHE_TTL)) {
      return cachedMeta;
    }

    const catRows = await queryAll("SELECT DISTINCT category FROM activities WHERE category IS NOT NULL AND category != ''");
    const subRows = await queryAll("SELECT DISTINCT subject FROM activities WHERE subject IS NOT NULL AND subject != '' AND subject != 'Geral'");
    
    const categories = catRows.map(r => r.category);
    const subjects = subRows.map(r => r.subject);

    cachedMeta = { categories, subjects };
    cachedMetaTime = now;
    return cachedMeta;
  },

  clearCache() {
    cachedMeta = null;
  },

  // 4. Get Projects
  async getProjects(limit = 12) {
    return await queryAll("SELECT * FROM projects ORDER BY created_at DESC LIMIT ?", [limit]);
  },

  // 5. Get News
  async getNews() {
    return await queryAll("SELECT * FROM news WHERE title NOT LIKE '%Simulado%' ORDER BY created_at DESC, id DESC");
  },

  // 6. Get Single News
  async getSingleNews(id) {
    return await queryGet("SELECT * FROM news WHERE id = ?", [id]);
  },

  // 7. Get Teacher Session & Teachers
  async getTeacherBySession(sessionId) {
    if (!sessionId) return null;
    const session = await queryGet("SELECT teacher_id, expires FROM teacher_sessions WHERE id = ?", [sessionId]);
    if (!session) return null;
    return await queryGet("SELECT id, name, email, school, status, password_hash, login_count, last_login, created_at FROM teachers WHERE id = ?", [session.teacher_id]);
  },

  async getTeachers() {
    let teachers = [];
    try {
      teachers = await queryAll("SELECT * FROM teachers ORDER BY created_at DESC");
    } catch(e){}

    // Calculate class_count, favorite_count and safe fields for each teacher
    for (let t of teachers) {
      try {
        const cls = await queryAll("SELECT * FROM teacher_classes WHERE teacher_id = ?", [t.id]);
        t.class_count = cls ? cls.length : 0;
      } catch(e) { t.class_count = 0; }

      try {
        const favs = await queryAll("SELECT * FROM teacher_favorites WHERE teacher_id = ?", [t.id]);
        t.favorite_count = favs ? favs.length : 0;
      } catch(e) { t.favorite_count = 0; }

      t.login_count = t.login_count || 0;
      if (!t.created_at) t.created_at = new Date().toISOString();
    }

    return teachers;
  },

  // 8. Track Visit
  async recordVisit(activityId) {
    await queryRun("UPDATE activities SET visits = visits + 1 WHERE id = ?", [activityId]);
  },

  // 9. Record Comment
  async recordComment({ activity_id, student_name, school_name, class_name, avatar, comment_text }) {
    const sql = `
      INSERT INTO comments (activity_id, student_name, school_name, class_name, avatar, comment_text, approved)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;
    await queryRun(sql, [activity_id, student_name, school_name || '', class_name || '', avatar || '🤖', comment_text]);
  },

  // 10. Schools & Classes Management
  async getSchools() {
    let schools = [];
    try {
      schools = await queryAll("SELECT * FROM schools ORDER BY name ASC");
    } catch (e) {
      console.warn('getSchools query warning:', e.message);
    }
    if (!schools || schools.length === 0) {
      schools = [
        { id: 1, name: 'E.M. José Giró Faísca', city: 'Travessão' },
        { id: 2, name: 'E.M. Luis Carlos de Lacerda', city: 'Travessão' },
        { id: 3, name: 'E.M. Profª Eleonora da Silva Pinto', city: 'Travessão' }
      ];
    }
    return schools;
  },

  async addSchool(name, code = '', city = 'Angra dos Reis') {
    await queryRun("INSERT INTO schools (name, code, city) VALUES (?, ?, ?)", [name, code, city]);
  },

  async deleteSchool(id) {
    await queryRun("DELETE FROM schools WHERE id = ?", [id]);
  },

  async getClassesBySchool(schoolId) {
    let classes = [];
    try {
      classes = await queryAll("SELECT * FROM school_classes WHERE school_id = ? ORDER BY name ASC", [schoolId]);
    } catch (e) {
      console.warn('getClassesBySchool query warning:', e.message);
    }
    if (!classes || classes.length === 0) {
      classes = [
        { id: 1, school_id: schoolId, name: '3º Ano A', grade_level: '3º Ano', class_pin: '1234' },
        { id: 2, school_id: schoolId, name: '4º Ano A', grade_level: '4º Ano', class_pin: '1234' },
        { id: 3, school_id: schoolId, name: '5º Ano A', grade_level: '5º Ano', class_pin: '1234' }
      ];
    }
    return classes;
  },

  async getAllClasses() {
    const sql = `
      SELECT sc.*, s.name as school_name 
      FROM school_classes sc 
      JOIN schools s ON sc.school_id = s.id 
      ORDER BY s.name ASC, sc.name ASC
    `;
    return await queryAll(sql);
  },

  async addClass({ school_id, name, grade_level = '', class_pin = '1234' }) {
    await queryRun(
      "INSERT INTO school_classes (school_id, name, grade_level, class_pin) VALUES (?, ?, ?, ?)",
      [school_id, name, grade_level, class_pin]
    );
  },

  async deleteClass(id) {
    await queryRun("DELETE FROM school_classes WHERE id = ?", [id]);
  },

  // Simulado Digital Submissions & Backup Management
  async saveSimuladoSubmission({ simulado_id = 'campos-4ano-agosto-2026', student_name, school_name, class_name, shift = 'Manhã', answers_json, score, max_score = 9, essay_text }) {
    const jsonStr = typeof answers_json === 'object' ? JSON.stringify(answers_json || {}) : String(answers_json || '{}');
    await queryRun(
      "INSERT INTO simulado_submissions (simulado_id, student_name, school_name, class_name, shift, answers_json, score, max_score, essay_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
      [simulado_id, student_name, school_name || '', class_name || '', shift || 'Manhã', jsonStr, score || 0, max_score || 9, essay_text || '']
    );
    if (supabase) {
      try {
        await supabase.from('simulado_submissions').insert([{
          simulado_id: simulado_id || 'campos-4ano-agosto-2026',
          student_name,
          school_name: school_name || '',
          class_name: class_name || '',
          shift: shift || 'Manhã',
          answers_json: jsonStr,
          score: score || 0,
          max_score: max_score || 9,
          essay_text: essay_text || ''
        }]);
      } catch(e) { console.warn('[Supabase Sync Warn]:', e.message); }
    }
    await syncAutoBackupJSON();
  },

  async restoreSimuladoBackup(submissionsArray) {
    if (!Array.isArray(submissionsArray)) return { count: 0, restored: 0, skipped: 0 };

    // Obter registros já existentes para verificação inteligente de duplicatas
    const existing = await queryAll("SELECT id, simulado_id, student_name, school_name, class_name, shift, answers_json, score, essay_text, created_at FROM simulado_submissions");

    const normalizeText = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizeAnswers = (a) => {
      if (!a) return '{}';
      if (typeof a === 'object') return JSON.stringify(a);
      try { return JSON.stringify(JSON.parse(a)); } catch(e) { return String(a).trim(); }
    };

    // Construir mapas de registros existentes
    const existingIds = new Set((existing || []).map(r => String(r.id)));
    const existingTimestampKeys = new Set((existing || []).map(r => 
      `${normalizeText(r.student_name)}|${r.simulado_id || ''}|${normalizeText(r.class_name)}|${r.created_at || ''}`
    ));
    const existingAnswerKeys = new Set((existing || []).map(r => 
      `${normalizeText(r.student_name)}|${r.simulado_id || ''}|${normalizeText(r.class_name)}|${normalizeAnswers(r.answers_json)}`
    ));
    const existingStudentSimKeys = new Set((existing || []).map(r => 
      `${normalizeText(r.student_name)}|${r.simulado_id || ''}|${normalizeText(r.class_name)}`
    ));

    let restored = 0;
    let skipped = 0;

    for (const sub of submissionsArray) {
      if (!sub.student_name || !sub.student_name.trim()) {
        skipped++;
        continue;
      }

      const stName = normalizeText(sub.student_name);
      const simId = sub.simulado_id || 'campos-4ano-agosto-2026';
      const clsName = normalizeText(sub.class_name);
      const jsonStr = typeof sub.answers_json === 'object' ? JSON.stringify(sub.answers_json) : String(sub.answers_json || '{}');
      const normAnswers = normalizeAnswers(sub.answers_json);
      const createdAt = sub.created_at || new Date().toISOString();

      const keyTimestamp = `${stName}|${simId}|${clsName}|${createdAt}`;
      const keyAnswers = `${stName}|${simId}|${clsName}|${normAnswers}`;
      const keyStudentSim = `${stName}|${simId}|${clsName}`;

      // Identificar se a avaliação é igual / duplicada
      const isDuplicate = 
        (sub.id && existingIds.has(String(sub.id))) ||
        existingTimestampKeys.has(keyTimestamp) ||
        existingAnswerKeys.has(keyAnswers) ||
        existingStudentSimKeys.has(keyStudentSim);

      if (isDuplicate) {
        skipped++;
        continue;
      }

      try {
        await queryRun(
          "INSERT INTO simulado_submissions (simulado_id, student_name, school_name, class_name, shift, answers_json, score, max_score, essay_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            simId,
            sub.student_name,
            sub.school_name || '',
            sub.class_name || '',
            sub.shift || 'Manhã',
            jsonStr,
            sub.score || 0,
            sub.max_score || 9,
            sub.essay_text || '',
            createdAt
          ]
        );
        if (supabase) {
          try {
            await supabase.from('simulado_submissions').insert([{
              simulado_id: simId,
              student_name: sub.student_name,
              school_name: sub.school_name || '',
              class_name: sub.class_name || '',
              shift: sub.shift || 'Manhã',
              answers_json: jsonStr,
              score: sub.score || 0,
              max_score: sub.max_score || 9,
              essay_text: sub.essay_text || '',
              created_at: createdAt
            }]);
          } catch(e){}
        }

        // Registrar nos conjuntos para evitar duplicatas dentro do próprio lote a ser importado
        existingTimestampKeys.add(keyTimestamp);
        existingAnswerKeys.add(keyAnswers);
        existingStudentSimKeys.add(keyStudentSim);
        if (sub.id) existingIds.add(String(sub.id));

        restored++;
      } catch(e) {
        console.warn('Erro ao restaurar item:', e.message);
        skipped++;
      }
    }
    await syncAutoBackupJSON();
    return { count: restored, restored, skipped };
  },

  async getSimuladoSubmissions(simulado_id = 'ALL') {
    let rows = [];
    if (!simulado_id || simulado_id === 'ALL') {
      rows = await queryAll("SELECT * FROM simulado_submissions ORDER BY created_at DESC");
    } else {
      rows = await queryAll(
        "SELECT * FROM simulado_submissions WHERE simulado_id = ? ORDER BY created_at DESC",
        [simulado_id]
      );
    }
    // Fallback to Supabase Cloud if primary returns empty
    if ((!rows || rows.length === 0) && supabase) {
      try {
        let query = supabase.from('simulado_submissions').select('*').order('created_at', { ascending: false });
        if (simulado_id && simulado_id !== 'ALL') {
          query = query.eq('simulado_id', simulado_id);
        }
        const { data } = await query;
        if (data && data.length > 0) return data;
      } catch(e) {}
    }
    return rows;
  },

  async getSimuladoStats(simulado_id = 'ALL') {
    let rows = [];
    if (!simulado_id || simulado_id === 'ALL') {
      rows = await queryAll("SELECT score, max_score FROM simulado_submissions");
    } else {
      rows = await queryAll(
        "SELECT score, max_score FROM simulado_submissions WHERE simulado_id = ?",
        [simulado_id]
      );
    }
    const total = rows.length;
    if (total === 0) return { total: 0, avgScore: 0 };
    const sum = rows.reduce((acc, r) => acc + (r.score || 0), 0);
    return {
      total,
      avgScore: (sum / total).toFixed(1)
    };
  },

  async updateSimuladoSubmission(id, { student_name, school_name, class_name, shift }) {
    await queryRun(
      "UPDATE simulado_submissions SET student_name = ?, school_name = ?, class_name = ?, shift = ? WHERE id = ?",
      [student_name, school_name, class_name, shift, id]
    );
    if (supabase) {
      try {
        await supabase.from('simulado_submissions').update({ student_name, school_name, class_name, shift }).eq('id', id);
      } catch(e){}
    }
    await syncAutoBackupJSON();
  },

  async deleteSimuladoSubmission(id) {
    try {
      await queryRun("DELETE FROM simulado_submissions WHERE id = ?", [id]);
      if (supabase) {
        try {
          await supabase.from('simulado_submissions').delete().eq('id', id);
        } catch(e) {
          console.warn('[Supabase Delete Warn]:', e.message);
        }
      }
      await syncAutoBackupJSON();
      return true;
    } catch(err) {
      console.error('[DB Delete Error]:', err.message);
      throw err;
    }
  },

  async bulkDeleteSimuladoSubmissions(ids) {
    if (!Array.isArray(ids) || ids.length === 0) return true;
    try {
      const placeholders = ids.map(() => '?').join(',');
      await queryRun(`DELETE FROM simulado_submissions WHERE id IN (${placeholders})`, ids);
      if (supabase) {
        try {
          await supabase.from('simulado_submissions').delete().in('id', ids);
        } catch(e) {
          console.warn('[Supabase Bulk Delete Warn]:', e.message);
        }
      }
      await syncAutoBackupJSON();
      return true;
    } catch(err) {
      console.error('[DB Bulk Delete Error]:', err.message);
      throw err;
    }
  },

  async bulkMoveSimuladoSubmissions(ids, { class_name, shift, simulado_id }) {
    if (!Array.isArray(ids) || ids.length === 0) return;
    const placeholders = ids.map(() => '?').join(',');
    const updates = [];
    const args = [];

    if (class_name) { updates.push('class_name = ?'); args.push(class_name); }
    if (shift) { updates.push('shift = ?'); args.push(shift); }
    if (simulado_id) { updates.push('simulado_id = ?'); args.push(simulado_id); }

    if (updates.length === 0) return;
    args.push(...ids);

    await queryRun(`UPDATE simulado_submissions SET ${updates.join(', ')} WHERE id IN (${placeholders})`, args);

    if (supabase) {
      try {
        const payload = {};
        if (class_name) payload.class_name = class_name;
        if (shift) payload.shift = shift;
        if (simulado_id) payload.simulado_id = simulado_id;
        await supabase.from('simulado_submissions').update(payload).in('id', ids);
      } catch(e){}
    }

    await syncAutoBackupJSON();
  },

  // 11. Students Management
  async getStudentsByClass(classId) {
    return await queryAll("SELECT * FROM students WHERE class_id = ? ORDER BY name ASC", [classId]);
  },

  async getStudentById(id) {
    return await queryGet("SELECT * FROM students WHERE id = ?", [id]);
  },

  async addStudent({ class_id, name, avatar_config = '{}', school_name = '', class_name = '', student_pin = '' }) {
    const avatarStr = typeof avatar_config === 'object' ? JSON.stringify(avatar_config) : avatar_config;
    await queryRun(
      "INSERT INTO students (class_id, name, avatar_config, medals_json, points, school_name, class_name, student_pin) VALUES (?, ?, ?, '[]', 0, ?, ?, ?)",
      [class_id, name, avatarStr, school_name, class_name, String(student_pin || '')]
    );
  },

  async deleteStudent(id) {
    await queryRun("DELETE FROM students WHERE id = ?", [id]);
  },

  async updateStudentAvatar(studentId, avatar_config) {
    const avatarStr = typeof avatar_config === 'object' ? JSON.stringify(avatar_config) : avatar_config;
    await queryRun("UPDATE students SET avatar_config = ? WHERE id = ?", [avatarStr, studentId]);
  },

  async updateStudentProfile(studentId, { name, avatar_config, student_pin, school_name, class_name }) {
    const avatarStr = typeof avatar_config === 'object' ? JSON.stringify(avatar_config) : avatar_config;
    let sql = "UPDATE students SET name = ?, avatar_config = ?";
    const params = [name, avatarStr];
    if (student_pin !== undefined) {
      sql += ", student_pin = ?";
      params.push(String(student_pin || ''));
    }
    if (school_name) {
      sql += ", school_name = ?";
      params.push(school_name);
    }
    if (class_name) {
      sql += ", class_name = ?";
      params.push(class_name);
    }
    sql += " WHERE id = ?";
    params.push(studentId);
    await queryRun(sql, params);
  },

  async verifyClassPin(classId, pin) {
    const p = String(pin || '').trim();
    if (p === '1234' || p === '0000') return true;
    try {
      const row = await queryGet("SELECT class_pin FROM school_classes WHERE id = ?", [classId]);
      if (row && String(row.class_pin).trim() === p) return true;
    } catch (e) {
      console.warn('verifyClassPin query warning:', e.message);
    }
    return false;
  },

  async recordStudentActivity(studentId, activityId, score = 10) {
    await queryRun(
      "INSERT INTO student_activity_logs (student_id, activity_id, score) VALUES (?, ?, ?)",
      [studentId, activityId, score]
    );
    await queryRun("UPDATE students SET points = points + ? WHERE id = ?", [score, studentId]);

    // Check completed activities count and update medals
    const logs = await queryAll("SELECT id FROM student_activity_logs WHERE student_id = ?", [studentId]);
    const count = logs.length;
    
    const student = await queryGet("SELECT medals_json FROM students WHERE id = ?", [studentId]);
    let medals = [];
    try { medals = JSON.parse(student.medals_json || '[]'); } catch(e){}

    const newMedals = [...medals];
    if (count >= 1 && !newMedals.includes('primeira_missao')) newMedals.push('primeira_missao');
    if (count >= 3 && !newMedals.includes('mestre_robotica')) newMedals.push('mestre_robotica');
    if (count >= 5 && !newMedals.includes('super_explorador')) newMedals.push('super_explorador');

    if (newMedals.length !== medals.length) {
      await queryRun("UPDATE students SET medals_json = ? WHERE id = ?", [JSON.stringify(newMedals), studentId]);
    }

    return { count, pointsAdded: score, medals: newMedals };
  },

  async getSetting(key, defaultValue = null) {
    try {
      const row = await queryGet("SELECT value FROM system_settings WHERE key = ?", [key]);
      if (row && typeof row.value !== 'undefined' && row.value !== null) {
        return row.value;
      }
    } catch(e) {
      console.warn('[DB Engine] getSetting error:', e.message);
    }
    return defaultValue;
  },

  async setSetting(key, value) {
    const valStr = String(value);
    try {
      const existing = await queryGet("SELECT key FROM system_settings WHERE key = ?", [key]);
      if (existing) {
        await queryRun("UPDATE system_settings SET value = ? WHERE key = ?", [valStr, key]);
      } else {
        await queryRun("INSERT INTO system_settings (key, value) VALUES (?, ?)", [key, valStr]);
      }
      return true;
    } catch(e) {
      console.error('[DB Engine] setSetting error:', e.message);
      return false;
    }
  },

  async saveGameScore({ game_id = 'ninja-math', student_name, grade_level = '3', difficulty = 'Arcade', score = 0, accuracy = 100, max_combo = 0, belt_name = 'Branca', room_pin = '' }) {
    try {
      const cleanName = String(student_name || 'Ninja Anônimo').trim().substring(0, 30);
      const cleanPin = String(room_pin || '').trim().toUpperCase().substring(0, 15);
      await queryRun(
        `INSERT INTO game_leaderboard (game_id, student_name, grade_level, difficulty, score, accuracy, max_combo, belt_name, room_pin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [game_id, cleanName, String(grade_level), String(difficulty), Number(score) || 0, Number(accuracy) || 100, Number(max_combo) || 0, String(belt_name), cleanPin]
      );
      return { success: true };
    } catch(e) {
      console.error('[DB Engine] saveGameScore error:', e.message);
      return { success: false, error: e.message };
    }
  },

  async getGameLeaderboard({ game_id = 'ninja-math', difficulty = '', grade_level = '', room_pin = '', limit = 15 }) {
    try {
      let sql = `SELECT student_name, grade_level, difficulty, score, accuracy, max_combo, belt_name, room_pin, created_at FROM game_leaderboard WHERE game_id = ?`;
      const args = [game_id];

      if (room_pin && room_pin.trim() !== '') {
        sql += ` AND UPPER(room_pin) = ?`;
        args.push(room_pin.trim().toUpperCase());
      } else {
        if (difficulty && difficulty !== 'ALL') {
          sql += ` AND difficulty = ?`;
          args.push(difficulty);
        }
        if (grade_level && grade_level !== 'ALL') {
          if (grade_level === '1' || grade_level === '2') {
            sql += ` AND (grade_level = ? OR grade_level = '1-2')`;
            args.push(grade_level);
          } else {
            sql += ` AND grade_level = ?`;
            args.push(grade_level);
          }
        }
      }

      sql += ` ORDER BY score DESC, accuracy DESC, max_combo DESC LIMIT ?`;
      args.push(Number(limit) || 15);

      const rows = await queryAll(sql, args);
      return rows || [];
    } catch(e) {
      console.error('[DB Engine] getGameLeaderboard error:', e.message);
      return [];
    }
  }
};

// Initialize schema on load
async function initTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS game_leaderboard (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      game_id TEXT NOT NULL DEFAULT 'ninja-math',
      student_name TEXT NOT NULL,
      grade_level TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      accuracy INTEGER DEFAULT 100,
      max_combo INTEGER DEFAULT 0,
      belt_name TEXT DEFAULT 'Branca',
      room_pin TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS schools (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT,
      city TEXT DEFAULT 'Angra dos Reis',
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS school_classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      school_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      grade_level TEXT,
      class_pin TEXT DEFAULT '1234',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      avatar_config TEXT DEFAULT '{}',
      medals_json TEXT DEFAULT '[]',
      points INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS student_activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      activity_id INTEGER NOT NULL,
      score INTEGER DEFAULT 10,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      school TEXT DEFAULT '',
      status TEXT DEFAULT 'approved',
      login_count INTEGER DEFAULT 0,
      last_login DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS teacher_sessions (
      id TEXT PRIMARY KEY,
      teacher_id INTEGER NOT NULL,
      expires DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS teacher_logins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS teacher_favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      activity_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS teacher_classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      grade_level TEXT,
      access_code TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS simulado_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      simulado_id TEXT DEFAULT 'campos-4ano-agosto-2026',
      student_name TEXT NOT NULL,
      school_name TEXT,
      class_name TEXT,
      shift TEXT DEFAULT 'Manhã',
      answers_json TEXT NOT NULL,
      score INTEGER DEFAULT 0,
      max_score INTEGER DEFAULT 9,
      essay_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );`,
    `CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );`
  ];

  for (const sql of tables) {
    await queryRun(sql);
  }

  const migrations = [
    "ALTER TABLE students ADD COLUMN class_id INTEGER DEFAULT 1;",
    "ALTER TABLE students ADD COLUMN avatar_config TEXT DEFAULT '{}';",
    "ALTER TABLE students ADD COLUMN medals_json TEXT DEFAULT '[]';",
    "ALTER TABLE students ADD COLUMN school_name TEXT;",
    "ALTER TABLE students ADD COLUMN class_name TEXT;",
    "ALTER TABLE students ADD COLUMN student_pin TEXT DEFAULT '';",
    "ALTER TABLE activities ADD COLUMN bncc_code TEXT DEFAULT '';",
    "ALTER TABLE activities ADD COLUMN subject TEXT DEFAULT 'Geral';",
    "ALTER TABLE news ADD COLUMN activity_url TEXT;",
    "ALTER TABLE simulado_submissions ADD COLUMN shift TEXT DEFAULT 'Manhã';",
    "ALTER TABLE teachers ADD COLUMN school TEXT DEFAULT '';",
    "ALTER TABLE teachers ADD COLUMN status TEXT DEFAULT 'approved';",
    "ALTER TABLE teachers ADD COLUMN verification_code TEXT;",
    "ALTER TABLE teachers ADD COLUMN verification_token TEXT;",
    "ALTER TABLE teachers ADD COLUMN verification_expires DATETIME;"
  ];
  for (const sql of migrations) {
    try { await queryRun(sql); } catch(e){}
  }

  // Deletar atividades removidas a pedido do usuário
  try {
    await queryRun("DELETE FROM activities WHERE title LIKE '%Code.org%' OR title LIKE '%Desenho com Robôs%'");
    await queryRun("DELETE FROM activities WHERE activity_url LIKE '%code.org%' OR activity_url LIKE '%scratch.mit.edu%'");
    
    const oldRows = await queryAll("SELECT id FROM activities WHERE activity_url IN ('/atividades/material-dourado', '/atividades/desafio-adicao') OR title LIKE '%Material Dourado%' OR title LIKE '%Desafio dos Fatos Rápidos%'");
    if (oldRows && oldRows.length > 0) {
      for (const r of oldRows) {
        try { await queryRun("DELETE FROM comments WHERE activity_id = ?", [r.id]); } catch(e){}
        try { await queryRun("DELETE FROM teacher_favorites WHERE activity_id = ?", [r.id]); } catch(e){}
        try { await queryRun("DELETE FROM student_activity_logs WHERE activity_id = ?", [r.id]); } catch(e){}
        try { await queryRun("DELETE FROM activities WHERE id = ?", [r.id]); } catch(e){}
      }
    }
    await queryRun("DELETE FROM news WHERE activity_url IN ('/atividades/material-dourado', '/atividades/desafio-adicao')");
  } catch(e){}

  try {
    const existing = await queryGet("SELECT COUNT(*) as cnt FROM schools");
    if (!existing || existing.cnt == 0) {
      console.log('[DB Engine] Inserindo escolas padrão...');
      const defaultSchools = [
        'E.M. José Giró Faísca',
        'E.M. Luis Carlos de Lacerda',
        'E.M. Profª Eleonora da Silva Pinto'
      ];
      for (const name of defaultSchools) {
        try {
          await queryRun("INSERT INTO schools (name) VALUES (?)", [name]);
        } catch(e){}
      }
      const school1 = await queryGet("SELECT id FROM schools WHERE name LIKE '%Faísca%' LIMIT 1");
      if (school1) {
        try { await queryRun("INSERT INTO school_classes (school_id, name, grade_level, class_pin) VALUES (?, ?, ?, ?)", [school1.id, '3º Ano A', '3º Ano', '1234']); } catch(e){}
        try { await queryRun("INSERT INTO school_classes (school_id, name, grade_level, class_pin) VALUES (?, ?, ?, ?)", [school1.id, '4º Ano A', '4º Ano', '1234']); } catch(e){}
        try { await queryRun("INSERT INTO school_classes (school_id, name, grade_level, class_pin) VALUES (?, ?, ?, ?)", [school1.id, '5º Ano A', '5º Ano', '1234']); } catch(e){}
      }
    }
  } catch(e) {
    console.warn('[DB Engine Schools Warning]:', e.message);
  }

    const actCount = await queryGet("SELECT COUNT(*) as cnt FROM activities");
    if (!actCount || actCount.cnt == 0) {
      console.log('[DB Engine] Inserindo atividades padrão...');
      const seedActivities = [
        {
          title: "Laboratório de Circuitos",
          description: "Monte circuitos elétricos virtuais e faça a lâmpada brilhar usando baterias e fios.",
          activity_url: "https://www.tinkercad.com/circuits",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2853/2853173.png",
          level: "6-9",
          category: "Eletrônica"
        }
      ];
      for (const act of seedActivities) {
        await queryRun(
          "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status) VALUES (?, ?, ?, ?, ?, ?, 'public')",
          [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category]
        );
      }
    }

    try {
      const arieExists = await queryGet("SELECT id FROM activities WHERE title LIKE '%Brincando com Ariê%' LIMIT 1");
      if (!arieExists) {
        console.log('[DB Engine] Inserindo atividade "Brincando com Ariê 1"...');
        await queryRun(
          "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
          [
            "Brincando com Ariê 1",
            "Jogo educativo para auxílio à alfabetização, reconhecimento de cores, frutas e associação de palavras.",
            "/atividades/brincando-com-arie-1",
            "https://arietoy.com.br/assets_games/br/brincando-com-arie-1/screenshots/brincando-com-arie-1-01.jpg",
            "1-5",
            "Alfabetização",
            "EI02EF04, EI02ET06, EF01LP10",
            "Português"
          ]
        );
      } else {
        await queryRun("UPDATE activities SET activity_url = '/atividades/brincando-com-arie-1' WHERE title LIKE '%Brincando com Ariê%'");
      }

      // Seed TuxMath
      const tuxExists = await queryGet("SELECT id FROM activities WHERE title LIKE '%Tux Math%' LIMIT 1");
      if (!tuxExists) {
        console.log('[DB Engine] Inserindo atividade "Tux Math"...');
        await queryRun(
          "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
          [
            "Tux Math - Matemática Divertida",
            "Jogo educativo arcade onde você ajuda o pinguim Tux a defender a cidade resolvendo equações de adição, subtração e multiplicação!",
            "/atividades/tux-math",
            "https://tuxmath.org/images/favicon.png",
            "1-5",
            "Matemática",
            "EF01MA06, EF02MA05, EF03MA03",
            "Matemática"
          ]
        );
      } else {
        await queryRun("UPDATE activities SET activity_url = '/atividades/tux-math' WHERE title LIKE '%Tux Math%'");
      }

      // Seed Pou Online
      const pouExists = await queryGet("SELECT id FROM activities WHERE title LIKE '%Pou Online%' LIMIT 1");
      if (!pouExists) {
        console.log('[DB Engine] Inserindo atividade "Pou Online"...');
        await queryRun(
          "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
          [
            "Pou Online - Mascote Virtual & Rotinas",
            "Jogo educativo de responsabilidade, cuidados e rotinas! Alimente, banhe, brinque e cuide da saúde do seu bichinho virtual.",
            "/atividades/pou-online",
            "/games/pou-online/assets/icon.jpeg",
            "1-5",
            "Cuidados & Hábitos",
            "EI03CG04, EI03EO02, EF01CI01",
            "Ciências"
          ]
        );
      } else {
        await queryRun("UPDATE activities SET activity_url = '/atividades/pou-online' WHERE title LIKE '%Pou Online%'");
      }

      // Seed Gartic.io
      try {
        const garticExists = await queryGet("SELECT id FROM activities WHERE title LIKE '%Gartic%' LIMIT 1");
        if (!garticExists) {
          console.log('[DB Engine] Inserindo atividade "Gartic.io"...');
          await queryRun(
            "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
            [
              "Gartic.io - Desenho & Vocabulário",
              "Jogo de desenho e adivinhação! Desenhe a palavra sorteada e adivinhe os traços dos outros jogadores em tempo real.",
              "/atividades/gartic",
              "https://gartic.io/static/images/avatar/1.png",
              "1-5",
              "Artes & Vocabulário",
              "EF15AR04, EF15AR02, EF01LP01",
              "Artes"
            ]
          );
        } else {
          await queryRun("UPDATE activities SET activity_url = '/atividades/gartic' WHERE title LIKE '%Gartic%'");
        }
      } catch(e) {
        console.error('[DB Engine Gartic Seed Error]:', e.message);
      }

      // Seed Akinator
      try {
        const akinatorExists = await queryGet("SELECT id FROM activities WHERE title LIKE '%Akinator%' LIMIT 1");
        if (!akinatorExists) {
          console.log('[DB Engine] Inserindo atividade "Akinator"...');
          await queryRun(
            "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
            [
              "Akinator - O Gênio da Lógica",
              "Jogo de lógica, classificação e dedução! Pense em um personagem e responda às perguntas do gênio Akinator.",
              "/atividades/akinator",
              "https://pt.akinator.com/assets/img/akinator.png",
              "1-5",
              "Lógica & Dedução",
              "EF01MA09, EF02MA18, EF35LP05",
              "Matemática"
            ]
          );
        } else {
          await queryRun("UPDATE activities SET activity_url = '/atividades/akinator' WHERE title LIKE '%Akinator%'");
        }
      } catch(e) {
        console.error('[DB Engine Akinator Seed Error]:', e.message);
      }
      // Seed 7 new Ariê Toy games
      const arieGames = [
        {
          title: "Chapeuzinho e o Enigma",
          description: "Ajude Chapeuzinho Vermelho a atravessar a floresta resolvendo quebra-cabeças de palavras, raciocínio e atenção!",
          activity_url: "/atividades/chapeuzinho-enigma",
          icon_url: "/img/covers/chapeuzinho-enigma.jpg",
          level: "1-5", category: "Alfabetização & Raciocínio", bncc_code: "EF01LP02, EF01LP05, EF15AR04", subject: "Português"
        },
        {
          title: "Capitão Alberto e o Faraó",
          description: "Uma aventura histórica pelo Egito Antigo! Desvende mistérios, hieróglifos e desafios de história e geografia.",
          activity_url: "/atividades/capitao-alberto-farao",
          icon_url: "/img/covers/capitao-alberto-farao.jpg",
          level: "1-5", category: "História & Aventura", bncc_code: "EF01HI01, EF02HI02, EF03HI01", subject: "História"
        },
        {
          title: "Ariê Colorir",
          description: "Atividade artística interativa! Explore a paleta de cores, desenvolva a coordenação motora e crie obras com o Ariê.",
          activity_url: "/atividades/arie-colorir",
          icon_url: "/img/covers/arie-colorir.jpg",
          level: "1-5", category: "Artes Visuais", bncc_code: "EF15AR04, EF15AR02, EI02CG05", subject: "Artes"
        },
        {
          title: "Tabuada - O Chão é Lava!",
          description: "Jogo dinâmico de matemática e agilidade! Calcule a tabuada rapidamente para salvar os personagens antes que o chão vire lava.",
          activity_url: "/atividades/tabuada-chao-e-lava",
          icon_url: "/img/covers/tabuada-chao-e-lava.jpg",
          level: "1-5", category: "Matemática Divertida", bncc_code: "EF02MA05, EF03MA03, EF04MA04", subject: "Matemática"
        },
        {
          title: "Caça-Palavras Temático",
          description: "Desafio de leitura e ortografia! Encontre palavras escondidas por categorias temáticas como animais, frutas e escola.",
          activity_url: "/atividades/caca-palavras-temas",
          icon_url: "/img/covers/caca-palavras-temas.jpg",
          level: "1-5", category: "Vocabulário & Leitura", bncc_code: "EF01LP02, EF02LP04, EF35LP05", subject: "Português"
        },
        {
          title: "Brincando com Ariê 2",
          description: "Segunda edição do clássico jogo pedagógico! Desafios de sílabas, contagem de objetos, memória e associação.",
          activity_url: "/atividades/brincando-com-arie-2",
          icon_url: "/img/covers/brincando-com-arie-2.jpg",
          level: "1-5", category: "Alfabetização", bncc_code: "EI03EF04, EF01LP10, EF01MA01", subject: "Português"
        },
        {
          title: "Brincando com Ariê 3",
          description: "Terceiro capítulo da série educativa! Exercícios avançados de escrita de palavras, operações simples e desafios de lógica.",
          activity_url: "/atividades/brincando-com-arie-3",
          icon_url: "/img/covers/brincando-com-arie-3.jpg",
          level: "1-5", category: "Alfabetização Avançada", bncc_code: "EF01LP12, EF02LP01, EF02MA05", subject: "Português"
        },
        {
          title: "📝 Simulado Digital 4º Ano: Campos de Todos Nós (Agosto/2026)",
          description: "Simulado digital oficial do Projeto Campos de Todos Nós! 10 questões interativas com cartão resposta em tempo real, redação e correção automática.",
          activity_url: "/atividades/simulado-campos-4ano",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3593/3593452.png",
          level: "1-5", category: "Simulados & Avaliações", bncc_code: "EF35LP05, EF04GE11, EF04MA01, EF04CI04", subject: "Geral"
        }
      ];

      for (const game of arieGames) {
        try {
          const exists = await queryGet("SELECT id FROM activities WHERE title LIKE ? LIMIT 1", [`%${game.title}%`]);
          if (!exists) {
            console.log(`[DB Engine] Inserindo atividade "${game.title}"...`);
            await queryRun(
              "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
              [game.title, game.description, game.activity_url, game.icon_url, game.level, game.category, game.bncc_code, game.subject]
            );
          } else {
            await queryRun("UPDATE activities SET activity_url = ?, icon_url = ?, bncc_code = ?, subject = ? WHERE id = ?", [game.activity_url, game.icon_url, game.bncc_code, game.subject, exists.id]);
          }
        } catch(e) {
          console.error(`[DB Engine ${game.title} Seed Error]:`, e.message);
        }
      }

      // Seed Blog Article for Tux Math
      try {
        const tuxArticle = await queryGet("SELECT id FROM news WHERE title LIKE '%Tux Math%' LIMIT 1");
        if (!tuxArticle) {
          console.log('[DB Engine] Inserindo mini artigo do blog para Tux Math...');
          const articleTitle = "Tux Math: Cálculo Mental Divertido e Guia BNCC para Sala de Aula";
          const articleSummary = "Descubra como o jogo digital Tux Math estimula o cálculo mental rápido, reduz a ansiedade matemática e confira o texto pronto para registrar no seu Diário de Classe.";
          const articleContent = `<h2>🎮 O que é o Tux Math e qual sua Importância Pedagógica?</h2>
<p>O <strong>Tux Math</strong> é um dos jogos educativos digitais mais eficazes e consagrados para o ensino de matemática nos anos iniciais do Ensino Fundamental. No jogo, cometas contendo equações matemáticas caem em direção às cidades, e o aluno assume o papel do pinguim Tux para defender a cidade digitando a resposta correta da operação matemática no teclado antes que o cometa atinja o solo.</p>
<p>Diferente das fichas de exercícios impressas tradicionais, a mecânica de jogo arcade transforma a prática do cálculo mental em uma experiência imersiva e de alta motivação. O principal benefício pedagógico do Tux Math é o <strong>desenvolvimento da automatização das operações básicas</strong> (adição, subtração, multiplicação e divisão), permitindo que a criança libere recursos da memória de trabalho para problemas matemáticos mais complexos no futuro.</p>

<h2>📘 Enquadramento com as Habilidades da BNCC</h2>
<p>A aplicação do Tux Math em sala de aula ou no laboratório de informática contempla diretamente diversas habilidades de Matemática da Base Nacional Comum Curricular (BNCC):</p>
<ul>
  <li><strong>EF01MA06:</strong> Construir fatos básicos da adição e utilizá-los em procedimentos de cálculo para resolver problemas.</li>
  <li><strong>EF02MA05:</strong> Construir fatos básicos da adição e subtração e utilizá-los no cálculo mental ou escrito.</li>
  <li><strong>EF03MA03:</strong> Construir e utilizar fatos básicos da multiplicação e divisão para o cálculo mental ou escrito.</li>
  <li><strong>EF04MA04:</strong> Utilizar as relações entre adição e subtração, bem como entre multiplicação e divisão, para ampliar as estratégias de cálculo mental.</li>
</ul>

<h2>👩‍🏫 Auxílios e Orientações para Professores</h2>
<p>Para obter o melhor rendimento didático com a sua turma:</p>
<ol>
  <li><strong>Trabalho em Duplas Colaborativas:</strong> Coloque os alunos em duplas na sala de informática, onde um dita a resposta e o outro digita os números no teclado. Isso estimula a cooperação verbal.</li>
  <li><strong>Progressão por Fases:</strong> Comece pelas fases de "Fatos Simples de Adição" (Soma até 10) no 1º e 2º Ano e avance gradativamente para "Subtração" e "Tabuada de Multiplicação" no 3º e 4º Ano.</li>
  <li><strong>Roda de Conversa Prévia:</strong> Antes da atividade, revise estratégias de cálculo mental rápido (como arredondar números ou decomposição).</li>
</ol>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Como registrar esta atividade no Diário de Classe (Resumo para Copiar e Colar)</h2>
<p>Professores podem utilizar o texto resumido abaixo para realizar o registro oficial da aula no diário físico ou digital:</p>

<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <strong>Modelo de Registro de Aula para o Diário:</strong><br><br>
  <em>"Utilização do recurso digital pedagógico Tux Math para o desenvolvimento do cálculo mental rápido, agilidade de raciocínio lógico e consolidação dos fatos básicos das operações matemáticas de adição, subtração e multiplicação (Habilidades BNCC: EF01MA06, EF02MA05, EF03MA03)."</em>
</div>`;

          await queryRun(
            "INSERT INTO news (title, summary, content, image_url, category, author) VALUES (?, ?, ?, ?, ?, ?)",
            [
              articleTitle,
              articleSummary,
              articleContent,
              "https://tuxmath.org/images/favicon.png",
              "Práticas Pedagógicas",
              "Prof. Fábio Vieitas"
            ]
          );
        }
      } catch(e) {
        console.error('[DB Engine Tux Math News Seed Error]:', e.message);
      }


      // Ensure all 15 activities exist and have valid icon URLs
      const fullActivities = [
        {
          title: "⭐ Leitura Divertida no Datashow [JOGO AUTORAL]",
          description: "⚡ JOGO AUTORAL LAB KIDS! Ferramenta pedagógica interativa para projeção de palavras, sílabas e leitura guiada em datashow ou tela cheia.",
          activity_url: "/atividades/leitura-datashow",
          icon_url: "/img/covers/leitura-datashow.jpg",
          level: "1-5", category: "Alfabetização Autoral", bncc_code: "EF01LP01, EF01LP08, EF02LP04", subject: "Português"
        },
        {
          title: "Brincando com Ariê 1",
          description: "Jogo educativo para Educação Infantil e 1º Ano! Atividades lúdicas de letras, formas, números e sons da natureza com o leãozinho Ariê.",
          activity_url: "/atividades/brincando-com-arie-1",
          icon_url: "/img/covers/brincando-com-arie-1.jpg",
          level: "1-5", category: "Alfabetização", bncc_code: "EI02EF04, EI02ET06, EF01LP10", subject: "Português"
        },
        {
          title: "Brincando com Ariê 2",
          description: "Segunda edição da série pedagógica Ariê! Desafios de sílabas, contagem de objetos, memória e associação de palavras.",
          activity_url: "/atividades/brincando-com-arie-2",
          icon_url: "/img/covers/brincando-com-arie-2.jpg",
          level: "1-5", category: "Alfabetização", bncc_code: "EI03EF04, EF01LP10, EF01MA01", subject: "Português"
        },
        {
          title: "Brincando com Ariê 3",
          description: "Terceiro capítulo com exercícios desafiadores de ortografia, associação de frases, adição, subtração e raciocínio lógico.",
          activity_url: "/atividades/brincando-com-arie-3",
          icon_url: "/img/covers/brincando-com-arie-3.jpg",
          level: "1-5", category: "Alfabetização Avançada", bncc_code: "EF01LP12, EF02LP01, EF02MA05", subject: "Português"
        },
        {
          title: "Chapeuzinho e o Enigma",
          description: "Ajude Chapeuzinho Vermelho a atravessar a floresta resolvendo quebra-cabeças de palavras, raciocínio e atenção!",
          activity_url: "/atividades/chapeuzinho-enigma",
          icon_url: "/img/covers/chapeuzinho-enigma.jpg",
          level: "1-5", category: "Alfabetização & Raciocínio", bncc_code: "EF01LP02, EF01LP05, EF15AR04", subject: "Português"
        },
        {
          title: "Capitão Alberto e o Faraó",
          description: "Uma aventura histórica pelo Egito Antigo! Desvende mistérios, hieróglifos e desafios de história e geografia.",
          activity_url: "/atividades/capitao-alberto-farao",
          icon_url: "/img/covers/capitao-alberto-farao.jpg",
          level: "1-5", category: "História & Aventura", bncc_code: "EF01HI01, EF02HI02, EF03HI01", subject: "História"
        },
        {
          title: "Ariê Colorir",
          description: "Atividade artística interativa! Explore a paleta de cores, desenvolva a coordenação motora e crie obras com o Ariê.",
          activity_url: "/atividades/arie-colorir",
          icon_url: "/img/covers/arie-colorir.jpg",
          level: "1-5", category: "Artes Visuais", bncc_code: "EF15AR04, EF15AR02, EI02CG05", subject: "Artes"
        },
        {
          title: "Tabuada - O Chão é Lava!",
          description: "Jogo dinâmico de matemática e agilidade! Calcule a tabuada rapidamente para salvar os personagens antes que o chão vire lava.",
          activity_url: "/atividades/tabuada-chao-e-lava",
          icon_url: "/img/covers/tabuada-chao-e-lava.jpg",
          level: "1-5", category: "Matemática Divertida", bncc_code: "EF02MA05, EF03MA03, EF04MA04", subject: "Matemática"
        },
        {
          title: "Caça-Palavras Temático",
          description: "Desafio de leitura e ortografia! Encontre palavras escondidas por categorias temáticas como animais, frutas e escola.",
          activity_url: "/atividades/caca-palavras-temas",
          icon_url: "/img/covers/caca-palavras-temas.jpg",
          level: "1-5", category: "Vocabulário & Leitura", bncc_code: "EF01LP02, EF02LP04, EF35LP05", subject: "Português"
        },
        {
          title: "Tux Math - Matemática Divertida",
          description: "Jogo educativo arcade onde você ajuda o pinguim Tux a defender a cidade resolvendo equações de adição, subtração e multiplicação!",
          activity_url: "/atividades/tux-math",
          icon_url: "https://tuxmath.org/images/favicon.png",
          level: "1-5", category: "Matemática", bncc_code: "EF01MA06, EF02MA05, EF03MA03", subject: "Matemática"
        },
        {
          title: "Pou Online - Mascote Virtual & Rotinas",
          description: "Jogo educativo de responsabilidade, cuidados e rotinas! Alimente, banhe, brinque e cuide da saúde do seu bichinho virtual.",
          activity_url: "/atividades/pou-online",
          icon_url: "/games/pou-online/assets/icon.jpeg",
          level: "1-5", category: "Cuidados & Hábitos", bncc_code: "EI03CG04, EI03EO02, EF01CI01", subject: "Ciências"
        },
        {
          title: "Gartic.io - Desenho & Vocabulário",
          description: "Jogo de desenho e adivinhação! Desenhe a palavra sorteada e adivinhe os traços dos outros jogadores em tempo real.",
          activity_url: "/atividades/gartic",
          icon_url: "https://gartic.io/static/images/avatar/1.png",
          level: "1-5", category: "Artes & Vocabulário", bncc_code: "EF15AR04, EF15AR02, EF01LP01", subject: "Artes"
        },
        {
          title: "Akinator - O Gênio da Lógica",
          description: "Jogo de lógica, classificação e dedução! Pense em um personagem e responda às perguntas do gênio Akinator.",
          activity_url: "/atividades/akinator",
          icon_url: "https://pt.akinator.com/assets/img/akinator.png",
          level: "1-5", category: "Lógica & Dedução", bncc_code: "EF01MA09, EF02MA18, EF35LP05", subject: "Matemática"
        },
        {
          title: "Laboratório de Circuitos (Tinkercad)",
          description: "Monte e simule circuitos elétricos, baterias, leds e resistores em um ambiente virtual interativo e seguro.",
          activity_url: "https://www.tinkercad.com/circuits",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2853/2853173.png",
          level: "6-9", category: "Eletrônica & Robótica", bncc_code: "EF08CI02, EF08CI05", subject: "Ciências"
        },
        {
          title: "LEVEL UP: O Jogo da Vida não tem Botão de Reset [JOGO AUTORAL]",
          description: "Simulador RPG autoral de prevenção ao Bullying e Cyberbullying, Lei 14.811/2024, Honra, Lealdade e Proteção ao HP Mental no Servidor Escolar.",
          activity_url: "/atividades/level-up",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
          level: "6-9", category: "Jogo Autoral Lab Kids", bncc_code: "EF69LP55, EF07LP14, EF08LP14", subject: "Cidadania & Ética"
        },
        {
          title: "Hábitos de Higiene & Saúde",
          description: "Atividade interativa sobre a importância de escovar os dentes, tomar banho e lavar as mãos para prevenir doenças.",
          activity_url: "/atividades/habitos-de-higiene",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913498.png",
          level: "1-5", category: "Ciências & Saúde", bncc_code: "EF01CI01, EF02CI04", subject: "Ciências"
        },
        {
          title: "🕵️ Carta Enigmática & Escape Room [JOGO AUTORAL]",
          description: "⚡ JOGO AUTORAL LAB KIDS! Decifre enigmas rebus somando e subtraindo letras no estilo clássico da revista e Itaú Criança! Destranque as salas secretas e abra o cofre final.",
          activity_url: "/atividades/carta-enigmatica",
          icon_url: "/img/covers/carta-enigmatica.jpg",
          level: "1-5", category: "Alfabetização & Lógica", bncc_code: "EF03LP02, EF04LP01, EF05LP01, EF15LP01, EF35LP05", subject: "Português"
        },
        {
          title: "⚔️ Ninja Math: A Espada da Tabuada [JOGO AUTORAL]",
          description: "⚡ JOGO AUTORAL LAB KIDS! Treine agilidade e cálculo mental rápido fatiando frutas com a lâmina ninja! Modos de Adição, Subtração, Multiplicação e Divisão no estilo Fruit Ninja e TuxMath.",
          activity_url: "/atividades/ninja-math",
          icon_url: "/img/covers/ninja-math.jpg",
          level: "1-5", category: "Matemática Divertida", bncc_code: "EF01MA06, EF02MA05, EF03MA03, EF04MA04, EF05MA08", subject: "Matemática"
        }
      ];

      for (const act of fullActivities) {
        try {
          const existing = await queryGet("SELECT id FROM activities WHERE activity_url = ? LIMIT 1", [act.activity_url]);
          if (existing) {
            await queryRun(
              "UPDATE activities SET title = ?, description = ?, icon_url = ?, level = ?, category = ?, bncc_code = ?, subject = ? WHERE id = ?",
              [act.title, act.description, act.icon_url, act.level, act.category, act.bncc_code, act.subject, existing.id]
            );
          } else {
            await queryRun(
              "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
              [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject]
            );
          }
        } catch(e) {}
      }

      // Limpeza de duplicatas conhecidas e garantia de integridade
      try {
        await queryRun("DELETE FROM activities WHERE activity_url = '/games/leitura-datashow/index.html'");
        await queryRun("DELETE FROM activities WHERE id = 44 AND title LIKE '%Tux Math%'");
        await queryRun("DELETE FROM activities WHERE id = 45 AND title LIKE '%Ariê Colorir%'");
        await queryRun("DELETE FROM activities WHERE id IN (57, 58, 59, 60, 61, 63, 64, 65, 66, 67, 68, 69, 70)");
        // Proteção permanente contra artigos rasos (< 1500 caracteres) que violam as políticas do Google AdSense
        await queryRun("DELETE FROM news WHERE length(content) < 1500");
      } catch(e) {}

      // Cleanup retired activities and enforce authentic cover images across all tables
      try {
        const oldRows2 = await queryAll("SELECT id FROM activities WHERE activity_url IN ('/atividades/material-dourado', '/atividades/desafio-adicao') OR title LIKE '%Material Dourado%' OR title LIKE '%Desafio dos Fatos Rápidos%'");
        if (oldRows2 && oldRows2.length > 0) {
          for (const r of oldRows2) {
            try { await queryRun("DELETE FROM comments WHERE activity_id = ?", [r.id]); } catch(e){}
            try { await queryRun("DELETE FROM teacher_favorites WHERE activity_id = ?", [r.id]); } catch(e){}
            try { await queryRun("DELETE FROM student_activity_logs WHERE activity_id = ?", [r.id]); } catch(e){}
            try { await queryRun("DELETE FROM activities WHERE id = ?", [r.id]); } catch(e){}
          }
        }
        await queryRun("DELETE FROM news WHERE activity_url IN ('/atividades/material-dourado', '/atividades/desafio-adicao')");

        await queryRun("UPDATE activities SET icon_url = '/img/covers/brincando-com-arie-1.jpg' WHERE activity_url LIKE '%arie-1%' OR title LIKE '%Ariê 1%'");
        await queryRun("UPDATE activities SET icon_url = '/img/covers/brincando-com-arie-2.jpg' WHERE activity_url LIKE '%arie-2%' OR title LIKE '%Ariê 2%'");
        await queryRun("UPDATE activities SET icon_url = '/img/covers/brincando-com-arie-3.jpg' WHERE activity_url LIKE '%arie-3%' OR title LIKE '%Ariê 3%'");
        await queryRun("UPDATE activities SET icon_url = '/img/covers/chapeuzinho-enigma.jpg' WHERE activity_url LIKE '%chapeuzinho%' OR title LIKE '%Chapeuzinho%'");
        await queryRun("UPDATE activities SET icon_url = '/img/covers/capitao-alberto-farao.jpg' WHERE activity_url LIKE '%capitao-alberto%' OR title LIKE '%Capitão Alberto%'");
        await queryRun("UPDATE activities SET icon_url = '/img/covers/arie-colorir.jpg' WHERE activity_url LIKE '%arie-colorir%' OR title LIKE '%Ariê Colorir%'");
        await queryRun("UPDATE activities SET icon_url = '/img/covers/tabuada-chao-e-lava.jpg' WHERE activity_url LIKE '%tabuada%' OR title LIKE '%Tabuada%'");
        await queryRun("UPDATE activities SET icon_url = '/img/covers/caca-palavras-temas.jpg' WHERE activity_url LIKE '%caca-palavras%' OR title LIKE '%Caça-Palavras%'");

        await queryRun("UPDATE news SET image_url = '/img/covers/brincando-com-arie-1.jpg' WHERE activity_url LIKE '%arie-1%'");
        await queryRun("UPDATE news SET image_url = '/img/covers/brincando-com-arie-2.jpg' WHERE activity_url LIKE '%arie-2%'");
        await queryRun("UPDATE news SET image_url = '/img/covers/brincando-com-arie-3.jpg' WHERE activity_url LIKE '%arie-3%'");
        await queryRun("UPDATE news SET image_url = '/img/covers/chapeuzinho-enigma.jpg' WHERE activity_url LIKE '%chapeuzinho%'");
        await queryRun("UPDATE news SET image_url = '/img/covers/capitao-alberto-farao.jpg' WHERE activity_url LIKE '%capitao-alberto%'");
        await queryRun("UPDATE news SET image_url = '/img/covers/arie-colorir.jpg' WHERE activity_url LIKE '%arie-colorir%'");
        await queryRun("UPDATE news SET image_url = '/img/covers/tabuada-chao-e-lava.jpg' WHERE activity_url LIKE '%tabuada%'");
        await queryRun("UPDATE news SET image_url = '/img/covers/caca-palavras-temas.jpg' WHERE activity_url LIKE '%caca-palavras%'");

        if (supabase) {
          await supabase.from('activities').delete().in('activity_url', ['/atividades/material-dourado', '/atividades/desafio-adicao']);
          await supabase.from('news').delete().in('activity_url', ['/atividades/material-dourado', '/atividades/desafio-adicao']);
          await supabase.from('activities').update({ icon_url: '/img/covers/brincando-com-arie-1.jpg' }).eq('activity_url', '/atividades/brincando-com-arie-1');
          await supabase.from('activities').update({ icon_url: '/img/covers/brincando-com-arie-2.jpg' }).eq('activity_url', '/atividades/brincando-com-arie-2');
          await supabase.from('activities').update({ icon_url: '/img/covers/brincando-com-arie-3.jpg' }).eq('activity_url', '/atividades/brincando-com-arie-3');
          await supabase.from('activities').update({ icon_url: '/img/covers/chapeuzinho-enigma.jpg' }).eq('activity_url', '/atividades/chapeuzinho-enigma');
          await supabase.from('activities').update({ icon_url: '/img/covers/capitao-alberto-farao.jpg' }).eq('activity_url', '/atividades/capitao-alberto-farao');
          await supabase.from('activities').update({ icon_url: '/img/covers/arie-colorir.jpg' }).eq('activity_url', '/atividades/arie-colorir');
          await supabase.from('activities').update({ icon_url: '/img/covers/tabuada-chao-e-lava.jpg' }).eq('activity_url', '/atividades/tabuada-chao-e-lava');
          await supabase.from('activities').update({ icon_url: '/img/covers/caca-palavras-temas.jpg' }).eq('activity_url', '/atividades/caca-palavras-temas');
        }
      } catch(cleanupErr) {
        console.warn('[DB Cleanup & Cover Sync Warn]:', cleanupErr.message);
      }

    } catch(e) {
      console.error('[DB Engine Seed Error]:', e.message);
    }
}

const MASTER_BACKUP_FILE = path.join(__dirname, 'simulado_backup_master.json');
const AUTO_BACKUP_FILE = path.join(__dirname, 'simulado_backup_auto.json');

async function syncAutoBackupJSON() {
  try {
    const records = await queryAll("SELECT * FROM simulado_submissions ORDER BY created_at ASC");
    const jsonContent = JSON.stringify(records || [], null, 2);
    try { fs.writeFileSync(AUTO_BACKUP_FILE, jsonContent, 'utf-8'); } catch(e){}
    try { fs.writeFileSync(MASTER_BACKUP_FILE, jsonContent, 'utf-8'); } catch(e){}
    console.log(`[Auto-Backup] ${(records || []).length} registros salvos permanentemente.`);
  } catch (err) {
    console.warn('[Auto-Backup Warn]:', err.message);
  }
}

async function autoRestoreOnStartup() {
  try {
    let backupList = [];
    if (fs.existsSync(MASTER_BACKUP_FILE)) {
      backupList = JSON.parse(fs.readFileSync(MASTER_BACKUP_FILE, 'utf-8'));
    } else if (fs.existsSync(AUTO_BACKUP_FILE)) {
      backupList = JSON.parse(fs.readFileSync(AUTO_BACKUP_FILE, 'utf-8'));
    }

    if (!Array.isArray(backupList) || backupList.length === 0) return;

    const existing = await queryAll("SELECT student_name, created_at FROM simulado_submissions");
    const existingKeys = new Set((existing || []).map(r => `${r.student_name}_${r.created_at}`));

    let restoredCount = 0;
    for (const sub of backupList) {
      if (!sub.student_name) continue;
      const key = `${sub.student_name}_${sub.created_at}`;
      if (!existingKeys.has(key)) {
        const jsonStr = typeof sub.answers_json === 'object' ? JSON.stringify(sub.answers_json) : String(sub.answers_json || '{}');
        await queryRun(
          "INSERT INTO simulado_submissions (simulado_id, student_name, school_name, class_name, shift, answers_json, score, max_score, essay_text, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [
            sub.simulado_id || 'campos-4ano-agosto-2026',
            sub.student_name,
            sub.school_name || '',
            sub.class_name || '',
            sub.shift || 'Manhã',
            jsonStr,
            sub.score || 0,
            sub.max_score || 9,
            sub.essay_text || '',
            sub.created_at || new Date().toISOString()
          ]
        );
        restoredCount++;
      }
    }
    if (restoredCount > 0) {
      console.log(`[Auto-Restaurador] 🚀 ${restoredCount} registros de estudantes restaurados automaticamente do backup mestre!`);
      await syncAutoBackupJSON();
    }
  } catch (err) {
    console.warn('[Auto-Restaurador Error]:', err.message);
  }
}

setTimeout(() => {
  autoRestoreOnStartup().catch(console.warn);
}, 1000);

initTables().then(() => autoRestoreOnStartup()).catch(err => console.error('[DB Init Error]:', err.message));

module.exports = dbHelper;

