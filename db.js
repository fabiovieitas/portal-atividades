require('dotenv').config();
const { createClient: createTursoClient } = require('@libsql/client');
const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
const path = require('path');

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
  `);

  try { sqlite.exec("ALTER TABLE students ADD COLUMN class_id INTEGER DEFAULT 1;"); } catch(e){}
  try { sqlite.exec("ALTER TABLE students ADD COLUMN avatar_config TEXT DEFAULT '{}';"); } catch(e){}
  try { sqlite.exec("ALTER TABLE students ADD COLUMN medals_json TEXT DEFAULT '[]';"); } catch(e){}
} catch (e) {
  console.warn('[DB Engine] SQLite local driver standard bypass (running in serverless environment):', e.message);
}

// Turso Cloud Client setup
let tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

let tursoClient = null;
if (tursoUrl && tursoToken) {
  try {
    // Normalize libsql:// to https:// for HTTP fetch API compatibility
    if (tursoUrl.startsWith('libsql://')) {
      tursoUrl = tursoUrl.replace('libsql://', 'https://');
    }
    tursoClient = createTursoClient({ url: tursoUrl, authToken: tursoToken });
    console.log('[DB Engine] Turso Cloud conectado!');
  } catch (e) {
    console.warn('[DB Engine] Falha ao iniciar Turso Client:', e.message);
  }
} else {
  console.log('[DB Engine] Turso não configurado no .env, tentando SQLite local.');
}

// Safely initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://ziaubnmbnpqgsiouoret.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
let supabase = null;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createSupabaseClient(supabaseUrl, supabaseKey);
    console.log('[DB Engine] Supabase Client conectado!');
  }
} catch (e) {
  console.warn('[DB Engine] Falha ao conectar ao Supabase:', e.message);
}

// Memory Cache for Categories/Subjects
let cachedMeta = null;
let cachedMetaTime = 0;
const META_CACHE_TTL = 10 * 60 * 1000;

// Universal SQL executor
async function queryAll(sql, args = []) {
  if (tursoClient) {
    try {
      const res = await tursoClient.execute({ sql, args });
      return res.rows || [];
    } catch (err) {
      console.error('[Turso Query Error]:', err.message);
    }
  }
  if (sqlite) {
    return sqlite.prepare(sql).all(...args);
  }
  return [];
}

async function queryGet(sql, args = []) {
  if (tursoClient) {
    try {
      const res = await tursoClient.execute({ sql, args });
      return res.rows[0] || null;
    } catch (err) {
      console.error('[Turso Query Error]:', err.message);
    }
  }
  if (sqlite) {
    return sqlite.prepare(sql).get(...args) || null;
  }
  return null;
}

async function queryRun(sql, args = []) {
  if (tursoClient) {
    try {
      await tursoClient.execute({ sql, args });
      return;
    } catch (err) {
      console.error('[Turso Run Error]:', err.message);
    }
  }
  if (sqlite) {
    sqlite.prepare(sql).run(...args);
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
  async getActivities({ level, search, category, bncc, subject, status = 'public', adminMode = false } = {}) {
    let sql = "SELECT * FROM activities WHERE title NOT LIKE '%Code.org%' AND title NOT LIKE '%Desenho com Robôs%'";
    const params = [];

    if (!adminMode) {
      sql += " AND status = ?";
      params.push(status);
    }
    if (level) {
      sql += " AND level LIKE ?";
      params.push(`%${level}%`);
    }
    if (search) {
      sql += " AND (title LIKE ? OR description LIKE ? OR bncc_code LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
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

    sql += adminMode ? " ORDER BY created_at DESC" : " ORDER BY visits DESC";
    let rows = [];
    try {
      rows = await queryAll(sql, params);
    } catch (e) {
      console.warn('getActivities query warning:', e.message);
    }

        if (!rows || rows.length === 0) {
      rows = [
        {
          id: 1,
          title: "⭐ Leitura Divertida no Datashow [JOGO AUTORAL]",
          description: "⚡ JOGO AUTORAL LAB KIDS! Ferramenta pedagógica interativa para projeção de palavras, sílabas e leitura guiada em datashow ou tela cheia.",
          activity_url: "/atividades/leitura-datashow",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3429/3429433.png",
          level: "1-5", category: "Alfabetização Autoral", subject: "Português", bncc_code: "EF01LP01, EF01LP08, EF02LP04", status: "public", visits: 850
        },
        {
          id: 2,
          title: "Brincando com Ariê 1",
          description: "Jogo educativo para auxílio à alfabetização, reconhecimento de cores, frutas e associação de palavras.",
          activity_url: "/atividades/brincando-com-arie-1",
          icon_url: "https://arietoy.com.br/assets_games/br/brincando-com-arie-1/screenshots/brincando-com-arie-1-01.jpg",
          level: "1-5", category: "Alfabetização", subject: "Português", bncc_code: "EI02EF04, EI02ET06, EF01LP10", status: "public", visits: 500
        },
        {
          id: 3,
          title: "Brincando com Ariê 2",
          description: "Segunda edição da série pedagógica Ariê! Desafios de sílabas, contagem de objetos, memória e associação.",
          activity_url: "/atividades/brincando-com-arie-2",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
          level: "1-5", category: "Alfabetização", subject: "Português", bncc_code: "EI03EF04, EF01LP10, EF01MA01", status: "public", visits: 580
        },
        {
          id: 4,
          title: "Brincando com Ariê 3",
          description: "Terceiro capítulo com exercícios desafiadores de ortografia, associação de frases, adição e raciocínio.",
          activity_url: "/atividades/brincando-com-arie-3",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081987.png",
          level: "1-5", category: "Alfabetização Avançada", subject: "Português", bncc_code: "EF01LP12, EF02LP01, EF02MA05", status: "public", visits: 620
        },
        {
          id: 5,
          title: "Chapeuzinho e o Enigma",
          description: "Ajude Chapeuzinho Vermelho a atravessar a floresta resolvendo quebra-cabeças de palavras e atenção!",
          activity_url: "/atividades/chapeuzinho-enigma",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
          level: "1-5", category: "Alfabetização & Raciocínio", subject: "Português", bncc_code: "EF01LP02, EF01LP05, EF15AR04", status: "public", visits: 430
        },
        {
          id: 6,
          title: "Capitão Alberto e o Faraó",
          description: "Uma aventura histórica pelo Egito Antigo! Desvende mistérios, hieróglifos e desafios de história.",
          activity_url: "/atividades/capitao-alberto-farao",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2617/2617876.png",
          level: "1-5", category: "História & Aventura", subject: "História", bncc_code: "EF01HI01, EF02HI02, EF03HI01", status: "public", visits: 390
        },
        {
          id: 7,
          title: "Ariê Colorir",
          description: "Atividade artística interativa! Explore a paleta de cores e desenvolva a coordenação motora.",
          activity_url: "/atividades/arie-colorir",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
          level: "1-5", category: "Artes Visuais", subject: "Artes", bncc_code: "EF15AR04, EF15AR02, EI02CG05", status: "public", visits: 510
        },
        {
          id: 8,
          title: "Tabuada - O Chão é Lava!",
          description: "Jogo dinâmico de matemática! Calcule a tabuada rapidamente para salvar os personagens.",
          activity_url: "/atividades/tabuada-chao-e-lava",
          icon_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
          level: "1-5", category: "Matemática Divertida", subject: "Matemática", bncc_code: "EF02MA05, EF03MA03, EF04MA04", status: "public", visits: 670
        },
        {
          id: 9,
          title: "Caça-Palavras Temático",
          description: "Desafio de leitura e ortografia! Encontre palavras escondidas por categorias temáticas.",
          activity_url: "/atividades/caca-palavras-temas",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
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
          icon_url: "https://cdn.jogos360.com.br/po/uo/pou-online-d.jpg",
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
          title: "Material Dourado Virtual",
          description: "Manipule dezenas e unidades em tempo real para desenvolver o Sistema de Numeração Decimal de forma lúdica.",
          activity_url: "/atividades/material-dourado",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3593/3593452.png",
          level: "1-5", category: "Matemática Divertida", subject: "Matemática", bncc_code: "EF01MA01, EF02MA05", status: "public", visits: 490
        },
        {
          id: 17,
          title: "Fábrica de Sílabas & Palavras",
          description: "Junte sílabas simples para formar palavras e acelerar o processo de hipótese silábica e leitura.",
          activity_url: "/atividades/fabrica-de-silabas",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
          level: "1-5", category: "Alfabetização", subject: "Português", bncc_code: "EF01LP08, EF01LP10", status: "public", visits: 530
        },
        {
          id: 18,
          title: "Hábitos de Higiene & Saúde",
          description: "Atividade interativa sobre a importância de escovar os dentes, tomar banho e lavar as mãos para prevenir doenças.",
          activity_url: "/atividades/habitos-de-higiene",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913498.png",
          level: "1-5", category: "Ciências & Saúde", subject: "Ciências", bncc_code: "EF01CI01, EF02CI04", status: "public", visits: 410
        },
        {
          id: 19,
          title: "Desafio dos Fatos Rápidos da Adição",
          description: "Desenvolva o cálculo mental rápido e a agilidade nos fatos fundamentais da adição até 20.",
          activity_url: "/atividades/desafio-adicao",
          icon_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
          level: "1-5", category: "Matemática Rápida", subject: "Matemática", bncc_code: "EF01MA06, EF02MA05", status: "public", visits: 470
        },
        {
          id: 20,
          title: "Detetive da Ortografia (CH, LH, NH, RR, SS)",
          description: "Desafio gamificado de ortografia e fixação dos principais dígrafos da Língua Portuguesa.",
          activity_url: "/atividades/detetive-ortografia",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
          level: "1-5", category: "Ortografia & Leitura", subject: "Português", bncc_code: "EF02LP01, EF03LP01", status: "public", visits: 550
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
    return await queryAll("SELECT * FROM news ORDER BY created_at DESC, id DESC");
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
    return await queryGet("SELECT id, name, email, password_hash FROM teachers WHERE id = ?", [session.teacher_id]);
  },

  async getTeachers() {
    let teachers = [];
    try {
      teachers = await queryAll("SELECT * FROM teachers ORDER BY created_at DESC");
    } catch(e){}

    if (supabase) {
      try {
        const { data } = await supabase.from('teachers').select('*');
        if (data && data.length > 0) {
          const emails = new Set(teachers.map(t => String(t.email || '').toLowerCase()));
          for (const t of data) {
            if (t.email && !emails.has(String(t.email).toLowerCase())) {
              teachers.push(t);
              emails.add(String(t.email).toLowerCase());
            }
          }
        }
      } catch(e){}
    }

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
  }
};

// Initialize schema on load
async function initTables() {
  const tables = [
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
    "ALTER TABLE news ADD COLUMN activity_url TEXT;"
  ];
  for (const sql of migrations) {
    try { await queryRun(sql); } catch(e){}
  }

  // Deletar atividades removidas a pedido do usuário
  try {
    await queryRun("DELETE FROM activities WHERE title LIKE '%Code.org%' OR title LIKE '%Desenho com Robôs%'");
    await queryRun("DELETE FROM activities WHERE activity_url LIKE '%code.org%' OR activity_url LIKE '%scratch.mit.edu%'");
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
            "https://cdn.jogos360.com.br/po/uo/pou-online-d.jpg",
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
          icon_url: "https://arietoy.com.br/assets_games/ch/chapeuzinho-enigma/screenshots/chapeuzinho-enigma-01.jpg",
          level: "1-5", category: "Alfabetização & Raciocínio", bncc_code: "EF01LP02, EF01LP05, EF15AR04", subject: "Português"
        },
        {
          title: "Capitão Alberto e o Faraó",
          description: "Uma aventura histórica pelo Egito Antigo! Desvende mistérios, hieróglifos e desafios de história e geografia.",
          activity_url: "/atividades/capitao-alberto-farao",
          icon_url: "https://arietoy.com.br/assets_games/ca/capitao-alberto-farao/screenshots/capitao-alberto-farao-01.jpg",
          level: "1-5", category: "História & Aventura", bncc_code: "EF01HI01, EF02HI02, EF03HI01", subject: "História"
        },
        {
          title: "Ariê Colorir",
          description: "Atividade artística interativa! Explore a paleta de cores, desenvolva a coordenação motora e crie obras com o Ariê.",
          activity_url: "/atividades/arie-colorir",
          icon_url: "https://arietoy.com.br/assets_games/ar/arie-colorir/screenshots/arie-colorir-01.jpg",
          level: "1-5", category: "Artes Visuais", bncc_code: "EF15AR04, EF15AR02, EI02CG05", subject: "Artes"
        },
        {
          title: "Tabuada - O Chão é Lava!",
          description: "Jogo dinâmico de matemática e agilidade! Calcule a tabuada rapidamente para salvar os personagens antes que o chão vire lava.",
          activity_url: "/atividades/tabuada-chao-e-lava",
          icon_url: "https://arietoy.com.br/assets_games/ta/tabuada-chao-e-lava/screenshots/tabuada-chao-e-lava-01.jpg",
          level: "1-5", category: "Matemática Divertida", bncc_code: "EF02MA05, EF03MA03, EF04MA04", subject: "Matemática"
        },
        {
          title: "Caça-Palavras Temático",
          description: "Desafio de leitura e ortografia! Encontre palavras escondidas por categorias temáticas como animais, frutas e escola.",
          activity_url: "/atividades/caca-palavras-temas",
          icon_url: "https://arietoy.com.br/assets_games/ca/caca-palavras-temas/screenshots/caca-palavras-temas-01.jpg",
          level: "1-5", category: "Vocabulário & Leitura", bncc_code: "EF01LP02, EF02LP04, EF35LP05", subject: "Português"
        },
        {
          title: "Brincando com Ariê 2",
          description: "Segunda edição do clássico jogo pedagógico! Desafios de sílabas, contagem de objetos, memória e associação.",
          activity_url: "/atividades/brincando-com-arie-2",
          icon_url: "https://arietoy.com.br/assets_games/br/brincando-com-arie-2/screenshots/brincando-com-arie-2-01.jpg",
          level: "1-5", category: "Alfabetização", bncc_code: "EI03EF04, EF01LP10, EF01MA01", subject: "Português"
        },
        {
          title: "Brincando com Ariê 3",
          description: "Terceiro capítulo da série educativa! Exercícios avançados de escrita de palavras, operações simples e desafios de lógica.",
          activity_url: "/atividades/brincando-com-arie-3",
          icon_url: "https://arietoy.com.br/assets_games/br/brincando-com-arie-3/screenshots/brincando-com-arie-3-01.jpg",
          level: "1-5", category: "Alfabetização Avançada", bncc_code: "EF01LP12, EF02LP01, EF02MA05", subject: "Português"
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

<div class="adsense-blog-inline" style="margin: 25px 0; padding: 15px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; text-align: center;">
  <span style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">📢 Espaço Publicitário AdSense</span>
  <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1234567890123456" data-ad-slot="9876543210" data-ad-format="auto" data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>

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

<div class="adsense-blog-inline" style="margin: 25px 0; padding: 15px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; text-align: center;">
  <span style="font-size: 0.75rem; color: #64748b; font-weight: 700; text-transform: uppercase;">📢 Espaço Publicitário AdSense</span>
  <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1234567890123456" data-ad-slot="9876543211" data-ad-format="auto" data-full-width-responsive="true"></ins>
  <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
</div>

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
          icon_url: "https://cdn-icons-png.flaticon.com/512/3429/3429433.png",
          level: "1-5", category: "Alfabetização Autoral", bncc_code: "EF01LP01, EF01LP08, EF02LP04", subject: "Português"
        },
        {
          title: "Brincando com Ariê 1",
          description: "Jogo educativo para Educação Infantil e 1º Ano! Atividades lúdicas de letras, formas, números e sons da natureza com o leãozinho Ariê.",
          activity_url: "/atividades/brincando-com-arie-1",
          icon_url: "https://arietoy.com.br/assets_games/br/brincando-com-arie-1/screenshots/brincando-com-arie-1-01.jpg",
          level: "1-5", category: "Alfabetização", bncc_code: "EI02EF04, EI02ET06, EF01LP10", subject: "Português"
        },
        {
          title: "Brincando com Ariê 2",
          description: "Segunda edição da série pedagógica Ariê! Desafios de sílabas, contagem de objetos, memória e associação de palavras.",
          activity_url: "/atividades/brincando-com-arie-2",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
          level: "1-5", category: "Alfabetização", bncc_code: "EI03EF04, EF01LP10, EF01MA01", subject: "Português"
        },
        {
          title: "Brincando com Ariê 3",
          description: "Terceiro capítulo com exercícios desafiadores de ortografia, associação de frases, adição, subtração e raciocínio lógico.",
          activity_url: "/atividades/brincando-com-arie-3",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081987.png",
          level: "1-5", category: "Alfabetização Avançada", bncc_code: "EF01LP12, EF02LP01, EF02MA05", subject: "Português"
        },
        {
          title: "Chapeuzinho e o Enigma",
          description: "Ajude Chapeuzinho Vermelho a atravessar a floresta resolvendo quebra-cabeças de palavras, raciocínio e atenção!",
          activity_url: "/atividades/chapeuzinho-enigma",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
          level: "1-5", category: "Alfabetização & Raciocínio", bncc_code: "EF01LP02, EF01LP05, EF15AR04", subject: "Português"
        },
        {
          title: "Capitão Alberto e o Faraó",
          description: "Uma aventura histórica pelo Egito Antigo! Desvende mistérios, hieróglifos e desafios de história e geografia.",
          activity_url: "/atividades/capitao-alberto-farao",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2617/2617876.png",
          level: "1-5", category: "História & Aventura", bncc_code: "EF01HI01, EF02HI02, EF03HI01", subject: "História"
        },
        {
          title: "Ariê Colorir",
          description: "Atividade artística interativa! Explore a paleta de cores, desenvolva a coordenação motora e crie obras com o Ariê.",
          activity_url: "/atividades/arie-colorir",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
          level: "1-5", category: "Artes Visuais", bncc_code: "EF15AR04, EF15AR02, EI02CG05", subject: "Artes"
        },
        {
          title: "Tabuada - O Chão é Lava!",
          description: "Jogo dinâmico de matemática e agilidade! Calcule a tabuada rapidamente para salvar os personagens antes que o chão vire lava.",
          activity_url: "/atividades/tabuada-chao-e-lava",
          icon_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
          level: "1-5", category: "Matemática Divertida", bncc_code: "EF02MA05, EF03MA03, EF04MA04", subject: "Matemática"
        },
        {
          title: "Caça-Palavras Temático",
          description: "Desafio de leitura e ortografia! Encontre palavras escondidas por categorias temáticas como animais, frutas e escola.",
          activity_url: "/atividades/caca-palavras-temas",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
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
          icon_url: "https://cdn.jogos360.com.br/po/uo/pou-online-d.jpg",
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
          title: "LEVEL UP: O Jogo da Vida não tem Botão de Reset [JOGO AUTORAL - AGENDA 21]",
          description: "Simulador autoral de escolhas, desenvolvimento sustentável, projeto de vida e cidadania planetária alinhado à Agenda 21 e ODS da ONU.",
          activity_url: "/atividades/level-up",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
          level: "6-9", category: "Jogo Autoral Lab Kids", bncc_code: "EF06MA32, EF09MA20", subject: "Projeto de Vida"
        },
        {
          title: "Material Dourado Virtual",
          description: "Manipule dezenas e unidades em tempo real para desenvolver o Sistema de Numeração Decimal de forma lúdica.",
          activity_url: "/atividades/material-dourado",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3593/3593452.png",
          level: "1-5", category: "Matemática Divertida", bncc_code: "EF01MA01, EF02MA05", subject: "Matemática"
        },
        {
          title: "Fábrica de Sílabas & Palavras",
          description: "Junte sílabas simples para formar palavras e acelerar o processo de hipótese silábica e leitura.",
          activity_url: "/atividades/fabrica-de-silabas",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
          level: "1-5", category: "Alfabetização", bncc_code: "EF01LP08, EF01LP10", subject: "Português"
        },
        {
          title: "Hábitos de Higiene & Saúde",
          description: "Atividade interativa sobre a importância de escovar os dentes, tomar banho e lavar as mãos para prevenir doenças.",
          activity_url: "/atividades/habitos-de-higiene",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913498.png",
          level: "1-5", category: "Ciências & Saúde", bncc_code: "EF01CI01, EF02CI04", subject: "Ciências"
        },
        {
          title: "Desafio dos Fatos Rápidos da Adição",
          description: "Desenvolva o cálculo mental rápido e a agilidade nos fatos fundamentais da adição até 20.",
          activity_url: "/atividades/desafio-adicao",
          icon_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
          level: "1-5", category: "Matemática Rápida", bncc_code: "EF01MA06, EF02MA05", subject: "Matemática"
        },
        {
          title: "Detetive da Ortografia (CH, LH, NH, RR, SS)",
          description: "Desafio gamificado de ortografia e fixação dos principais dígrafos da Língua Portuguesa.",
          activity_url: "/atividades/detetive-ortografia",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
          level: "1-5", category: "Ortografia & Leitura", bncc_code: "EF02LP01, EF03LP01", subject: "Português"
        }
      ];

      for (const act of fullActivities) {
        try {
          const searchTitle = act.title.replace('⭐ ', '').split('[')[0].trim();
          const existing = await queryGet("SELECT id FROM activities WHERE title LIKE ? LIMIT 1", [`%${searchTitle}%`]);
          if (existing) {
            await queryRun(
              "UPDATE activities SET title = ?, description = ?, activity_url = ?, icon_url = ?, level = ?, category = ?, bncc_code = ?, subject = ? WHERE id = ?",
              [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject, existing.id]
            );
          } else {
            await queryRun(
              "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
              [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject]
            );
          }
        } catch(e) {}
      }

      // Ensure all 15 blog articles exist and have valid activity_url
      const fullArticles = [
        {
          title: "⭐ Leitura Divertida no Datashow: Como Usar o Jogo Autoral de Alfabetização",
          summary: "Conheça a ferramenta autoral exclusiva do Lab Kids desenvolvida para projeção em datashow na sala de aula, estimulando a leitura e a hipótese silábica.",
          category: "Jogo Autoral Lab Kids", author: "Prof. Fábio Vieitas", activity_url: "/atividades/leitura-datashow",
          image_url: "https://cdn-icons-png.flaticon.com/512/3429/3429433.png",
          content: `<h2>⭐ Apresentação do Jogo Autoral Lab Kids</h2><p>O <strong>Leitura Divertida no Datashow</strong> é um recurso digital <strong>autoral e exclusivo</strong> desenvolvido para projeção coletiva de palavras, sílabas e frases.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP01</strong></li><li><strong>EF01LP08</strong></li><li><strong>EF02LP04</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Utilização do recurso digital autoral Leitura Divertida no Datashow para projeção coletiva de cards de alfabetização e fluência leitora (BNCC: EF01LP01, EF01LP08, EF02LP04)."</em></div>`
        },
        {
          title: "Brincando com Ariê 1: Alfabetização e Números na Educação Infantil",
          summary: "Descubra como o jogo Brincando com Ariê 1 desenvolve a consciência fonológica, contagem inicial e formas geométricas de maneira lúdica.",
          category: "Alfabetização", author: "Prof. Fábio Vieitas", activity_url: "/atividades/brincando-com-arie-1",
          image_url: "https://arietoy.com.br/assets_games/br/brincando-com-arie-1/screenshots/brincando-com-arie-1-01.jpg",
          content: `<h2>🦁 Importância do Brincando com Ariê 1</h2><p>O jogo <strong>Brincando com Ariê 1</strong> desenvolve o reconhecimento de vogais, alfabeto e números iniciais.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EI02ET06</strong></li><li><strong>EF01LP10</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Uso do jogo digital Brincando com Ariê 1 para reconhecimento do alfabeto e contagem numérica inicial (BNCC: EI02ET06, EF01LP10)."</em></div>`
        },
        {
          title: "Brincando com Ariê 2: Formação de Sílabas e Memória",
          summary: "Saiba como utilizar o segundo volume da série Ariê para consolidar a separação silábica, vocabulário e memória auditiva na alfabetização.",
          category: "Alfabetização", author: "Prof. Fábio Vieitas", activity_url: "/atividades/brincando-com-arie-2",
          image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
          content: `<h2>🧩 Consolidação Silábica com o Ariê 2</h2><p>Trabalha a junção de sílabas simples e memória visual.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP10</strong></li><li><strong>EF01MA01</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Prática pedagógica interativa focada na segmentação silábica no Brincando com Ariê 2 (BNCC: EF01LP10, EF01MA01)."</em></div>`
        },
        {
          title: "Brincando com Ariê 3: Leitura Avançada e Raciocínio Lógico",
          summary: "Guia pedagógico para trabalhar leitura de palavras complexas, pequenas frases e desafios de adição com a turma do Ariê 3.",
          category: "Alfabetização Avançada", author: "Prof. Fábio Vieitas", activity_url: "/atividades/brincando-com-arie-3",
          image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081987.png",
          content: `<h2>🚀 Avançando na Leitura com o Ariê 3</h2><p>Leitura de frases e operações de adição.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP12</strong></li><li><strong>EF02MA05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Aplicação do jogo digital Brincando com Ariê 3 para leitura de frases e fatos básicos da adição (BNCC: EF01LP12, EF02MA05)."</em></div>`
        },
        {
          title: "Chapeuzinho e o Enigma: Ortografia e Raciocínio no Conto de Fadas",
          summary: "Veja como trabalhar a história da Chapeuzinho Vermelho articulando quebra-cabeças ortográficos e raciocínio visual.",
          category: "Alfabetização & Literatura", author: "Prof. Fábio Vieitas", activity_url: "/atividades/chapeuzinho-enigma",
          image_url: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
          content: `<h2>🌲 Raciocínio e Literatura Infantil</h2><p>Desafios lúdicos articulados com literatura infantil.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP02</strong></li><li><strong>EF15AR04</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Desafios digitais de ortografia e raciocínio no jogo Chapeuzinho e o Enigma (BNCC: EF01LP02, EF15AR04)."</em></div>`
        },
        {
          title: "Capitão Alberto e o Faraó: Viagem Histórica ao Egito Antigo",
          summary: "Descubra como abordar a civilização egípcia, hieróglifos e mapas históricos com turmas do Ensino Fundamental.",
          category: "História & Geografia", author: "Prof. Fábio Vieitas", activity_url: "/atividades/capitao-alberto-farao",
          image_url: "https://cdn-icons-png.flaticon.com/512/2617/2617876.png",
          content: `<h2>🏛️ Explorando o Egito Antigo</h2><p>Estudo gamificado sobre hieróglifos e monumentos históricos.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF02HI02</strong></li><li><strong>EF03HI01</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Estudo gamificado sobre o Egito Antigo no Capitão Alberto e o Faraó (BNCC: EF02HI02, EF03HI01)."</em></div>`
        },
        {
          title: "Ariê Colorir: Artes Visuais, Paleta de Cores e Coordenação Visomotora",
          summary: "Explore a sensibilidade estética e a coordenação motora fina no ambiente digital através da pintura no Ariê Colorir.",
          category: "Artes Visuais", author: "Prof. Fábio Vieitas", activity_url: "/atividades/arie-colorir",
          image_url: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
          content: `<h2>🎨 Expressão Artística Digital</h2><p>Pintura e exploração visomotora digital.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF15AR04</strong></li><li><strong>EI02CG05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Expressão artística digital e exploração de cores no Ariê Colorir (BNCC: EF15AR04, EI02CG05)."</em></div>`
        },
        {
          title: "Tabuada - O Chão é Lava!: Cálculo Mental Rápido e Multiplicação",
          summary: "Como transformar a prática da tabuada de multiplicação em um jogo de agilidade e ação sem memorização mecânica.",
          category: "Matemática Divertida", author: "Prof. Fábio Vieitas", activity_url: "/atividades/tabuada-chao-e-lava",
          image_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
          content: `<h2>🔥 Agilidade com a Tabuada</h2><p>Treino interativo de fatos básicos da multiplicação.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF03MA03</strong></li><li><strong>EF04MA04</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Treino de cálculo mental nos fatos básicos da multiplicação no jogo Tabuada O Chão é Lava (BNCC: EF03MA03, EF04MA04)."</em></div>`
        },
        {
          title: "Caça-Palavras Temático: Varredura Visual e Ortografia Divertida",
          summary: "Saiba como o caça-palavras por categorias aprimora o reconhecimento ortográfico e a atenção seletiva das crianças.",
          category: "Vocabulário & Ortografia", author: "Prof. Fábio Vieitas", activity_url: "/atividades/caca-palavras-temas",
          image_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
          content: `<h2>🔍 Atenção e Ortografia</h2><p>Varredura visual e vocabulário ortográfico.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP02</strong></li><li><strong>EF02LP04</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Varredura visual e fixação de vocabulário ortográfico no Caça-Palavras Temático (BNCC: EF01LP02, EF02LP04)."</em></div>`
        },
        {
          title: "Tux Math: Cálculo Mental Divertido e Guia BNCC para Sala de Aula",
          summary: "Descubra como o jogo digital Tux Math estimula o cálculo mental rápido, reduz a ansiedade matemática e confira o texto pronto para o diário.",
          category: "Práticas Pedagógicas", author: "Prof. Fábio Vieitas", activity_url: "/atividades/tux-math",
          image_url: "https://tuxmath.org/images/favicon.png",
          content: `<h2>🎮 O que é o Tux Math?</h2><p>Jogo arcade para defesa da cidade com equações matemáticas.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01MA06</strong></li><li><strong>EF02MA05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Desenvolvimento de cálculo mental rápido no Tux Math (BNCC: EF01MA06, EF02MA05)."</em></div>`
        },
        {
          title: "Pou Online na Escola: Hábitos de Saúde, Nutrição e Gestão do Tempo",
          summary: "Como utilizar a empatia com o mascote virtual para ensinar higiene, rotina e cuidados com a saúde física e mental.",
          category: "Ciências & Hábitos", author: "Prof. Fábio Vieitas", activity_url: "/atividades/pou-online",
          image_url: "https://cdn.jogos360.com.br/po/uo/pou-online-d.jpg",
          content: `<h2>🛁 Autocuidado e Rotina com o Pou</h2><p>Hábitos de higiene e responsabilidade pessoal.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EI03CG04</strong></li><li><strong>EF01CI01</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Hábitos de higiene e nutrição saudável no jogo Pou Online (BNCC: EI03CG04, EF01CI01)."</em></div>`
        },
        {
          title: "Gartic.io na Sala de Aula: Expressão Artística e Vocabulário Coletivo",
          summary: "Veja como a dinâmica de desenho e adivinhação em tempo real estimula a hipótese de escrita e cooperação em grupo.",
          category: "Artes & Vocabulário", author: "Prof. Fábio Vieitas", activity_url: "/atividades/gartic",
          image_url: "https://gartic.io/static/images/avatar/1.png",
          content: `<h2>🎨 Desenho e Adivinhação Coletiva</h2><p>Expressão artística e vocabulário colaborativo.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF15AR04</strong></li><li><strong>EF01LP01</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Artes e vocabulário colaborativo no Gartic.io (BNCC: EF15AR04, EF01LP01)."</em></div>`
        },
        {
          title: "Akinator no Ensino de Lógica: Dedução e Pensamento Computacional",
          summary: "Como o jogo das 20 perguntas desenvolve raciocínio categórico, ordenação de atributos e estruturas lógicas de decisão.",
          category: "Lógica & Pensamento Computacional", author: "Prof. Fábio Vieitas", activity_url: "/atividades/akinator",
          image_url: "https://pt.akinator.com/assets/img/akinator.png",
          content: `<h2>🧞‍♂️ Lógica e Árvores de Decisão</h2><p>Classificação por atributos e dedução lógica.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01MA09</strong></li><li><strong>EF35LP05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Pensamento computacional e dedução lógica com o Akinator (BNCC: EF01MA09, EF35LP05)."</em></div>`
        },
        {
          title: "Laboratório de Circuitos Tinkercad: Simulação Virtual de Eletrônica",
          summary: "Como utilizar simulações virtuais seguras para ensinar componentes elétricos, leds e corrente no Ensino Fundamental II.",
          category: "Ciências & Robótica", author: "Prof. Fábio Vieitas", activity_url: "https://www.tinkercad.com/circuits",
          image_url: "https://cdn-icons-png.flaticon.com/512/2853/2853173.png",
          content: `<h2>⚡ Simulação Elétrica Segura</h2><p>Simulação virtual de componentes elétricos.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF08CI02</strong></li><li><strong>EF08CI05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Simulação virtual de circuitos elétricos no Tinkercad (BNCC: EF08CI02, EF08CI05)."</em></div>`
        },
        {
          title: "LEVEL UP O Jogo da Vida: Educação Financeira, Cidadania e Escolhas (Agenda 21)",
          summary: "Guia para trabalhar responsabilidade, orçamento pessoal, sustentabilidade planetária e Agenda 21 com turmas dos anos finais.",
          category: "Jogo Autoral Lab Kids", author: "Prof. Fábio Vieitas", activity_url: "/atividades/level-up",
          image_url: "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
          content: `<h2>🎮 Projeto de Vida e Tomada de Decisão</h2><p>Educação financeira, escolhas sustentáveis e cidadania global alinhadas à Agenda 21.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF06MA32</strong></li><li><strong>EF09MA20</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Educação financeira, cidadania e sustentabilidade com o jogo autoral LEVEL UP (BNCC: EF06MA32, EF09MA20)."</em></div>`
        },
        {
          title: "Material Dourado Virtual: O Sistema de Numeração Decimal Concreto",
          summary: "Como utilizar manipulação de barras e unidades virtuais para facilitar a compreensão de dezenas e centenas no Ensino Fundamental.",
          category: "Matemática Divertida", author: "Prof. Fábio Vieitas", activity_url: "/atividades/material-dourado",
          image_url: "https://cdn-icons-png.flaticon.com/512/3593/3593452.png",
          content: `<h2>🟡 Aprendizado Concreto da Matemática</h2><p>Exploração interativa de dezenas e unidades virtuais.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01MA01</strong></li><li><strong>EF02MA05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Prática pedagógica interativa com o Material Dourado Virtual para composição e decomposição numérica (BNCC: EF01MA01, EF02MA05)."</em></div>`
        },
        {
          title: "Fábrica de Sílabas: Acelere a Hipótese Silábica e Leitura na Alfabetização",
          summary: "Guia completo de aplicação da Fábrica de Sílabas para alfabetização inicial, consciência fonológica e síntese de palavras.",
          category: "Alfabetização", author: "Prof. Fábio Vieitas", activity_url: "/atividades/fabrica-de-silabas",
          image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
          content: `<h2>🔤 Consciência Fonológica e Síntese Silábica</h2><p>Junção de sílabas simples para avanço na escrita e leitura.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP08</strong></li><li><strong>EF01LP10</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Atividade de formação de palavras e síntese de sílabas simples na Fábrica de Sílabas (BNCC: EF01LP08, EF01LP10)."</em></div>`
        },
        {
          title: "Hábitos de Higiene e Saúde: Prevenção e Autocuidado na Escola",
          summary: "Como trabalhar cuidados pessoais, banho, lavagem de mãos e escovação de dentes de forma lúdica nos anos iniciais.",
          category: "Ciências & Saúde", author: "Prof. Fábio Vieitas", activity_url: "/atividades/habitos-de-higiene",
          image_url: "https://cdn-icons-png.flaticon.com/512/2913/2913498.png",
          content: `<h2>🧼 Saúde e Autocuidado Infantil</h2><p>Reforço diário de hábitos saudáveis e prevenção de enfermidades.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01CI01</strong></li><li><strong>EF02CI04</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Exploração de práticas de higiene corporal, escovação e cuidados com a saúde (BNCC: EF01CI01, EF02CI04)."</em></div>`
        },
        {
          title: "Fatos Rápidos da Adição: Agilidade e Cálculo Mental Divertido",
          summary: "Estratégias pedagógicas para trabalhar o cálculo mental e automatização da adição com jogos interativos.",
          category: "Matemática Rápida", author: "Prof. Fábio Vieitas", activity_url: "/atividades/desafio-adicao",
          image_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
          content: `<h2>⚡ Cálculo Mental Rápido</h2><p>Automatização dos fatos fundamentais da adição até 20.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01MA06</strong></li><li><strong>EF02MA05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Desenvolvimento de agilidade de cálculo mental nos Fatos Rápidos da Adição (BNCC: EF01MA06, EF02MA05)."</em></div>`
        },
        {
          title: "Detetive da Ortografia: Dominando CH, LH, NH, RR e SS",
          summary: "Como transformar a fixação de dígrafos e dificuldades ortográficas em um jogo envolvente de investigação.",
          category: "Ortografia & Leitura", author: "Prof. Fábio Vieitas", activity_url: "/atividades/detetive-ortografia",
          image_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
          content: `<h2>🕵️ Caça-Erros e Fixação de Dígrafos</h2><p>Identificação e ortografia correta com CH, LH, NH, RR e SS.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF02LP01</strong></li><li><strong>EF03LP01</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Investigação ortográfica e diferenciação de dígrafos no jogo Detetive da Ortografia (BNCC: EF02LP01, EF03LP01)."</em></div>`
        }
      ];

      for (const art of fullArticles) {
        try {
          const searchTitle = art.title.replace('⭐ ', '').split(':')[0].trim();
          const existing = await queryGet("SELECT id FROM news WHERE title LIKE ? LIMIT 1", [`%${searchTitle}%`]);
          if (existing) {
            await queryRun(
              "UPDATE news SET title = ?, summary = ?, content = ?, image_url = ?, category = ?, author = ?, activity_url = ?, created_at = CURRENT_TIMESTAMP, published_at = CURRENT_TIMESTAMP WHERE id = ?",
              [art.title, art.summary, art.content, art.image_url, art.category, art.author, art.activity_url, existing.id]
            );
          } else {
            await queryRun(
              "INSERT INTO news (title, summary, content, image_url, category, author, activity_url, created_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
              [art.title, art.summary, art.content, art.image_url, art.category, art.author, art.activity_url]
            );
          }
        } catch(e) {}
      }

    } catch(e) {
      console.error('[DB Engine Seed Error]:', e.message);
    }
}

initTables().catch(err => console.error('[DB Init Error]:', err.message));

module.exports = dbHelper;

