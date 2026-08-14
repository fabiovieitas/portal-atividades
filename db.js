require('dotenv').config();
const { createClient: createTursoClient } = require('@libsql/client');
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
  `);
} catch (e) {
  console.warn('[DB Engine] SQLite local driver standard bypass (running in serverless environment):', e.message);
}

// Turso Cloud Client setup
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoToken = process.env.TURSO_AUTH_TOKEN;

let tursoClient = null;
if (tursoUrl && tursoToken) {
  try {
    tursoClient = createTursoClient({ url: tursoUrl, authToken: tursoToken });
    console.log('[DB Engine] Turso Cloud conectado!');
  } catch (e) {
    console.warn('[DB Engine] Falha ao iniciar Turso Client:', e.message);
  }
} else {
  console.log('[DB Engine] Turso não configurado no .env, tentando SQLite local.');
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

  async isOnline() {
    return true;
  },

  // 1. Get Activities
  async getActivities({ level, search, category, bncc, subject, status = 'public', adminMode = false }) {
    let sql = "SELECT * FROM activities WHERE 1=1";
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
    return await queryAll(sql, params);
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
    return await queryAll(sql, [limit]);
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
    return await queryAll("SELECT * FROM news ORDER BY published_at DESC");
  },

  // 6. Get Single News
  async getSingleNews(id) {
    return await queryGet("SELECT * FROM news WHERE id = ?", [id]);
  },

  // 7. Get Teacher Session
  async getTeacherBySession(sessionId) {
    if (!sessionId) return null;
    const session = await queryGet("SELECT teacher_id, expires FROM teacher_sessions WHERE id = ?", [sessionId]);
    if (!session) return null;
    return await queryGet("SELECT id, name, email, password_hash FROM teachers WHERE id = ?", [session.teacher_id]);
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
    return await queryAll("SELECT * FROM schools WHERE active = 1 ORDER BY name ASC");
  },

  async addSchool(name, code = '', city = 'Angra dos Reis') {
    await queryRun("INSERT INTO schools (name, code, city) VALUES (?, ?, ?)", [name, code, city]);
  },

  async deleteSchool(id) {
    await queryRun("DELETE FROM schools WHERE id = ?", [id]);
  },

  async getClassesBySchool(schoolId) {
    return await queryAll("SELECT * FROM school_classes WHERE school_id = ? ORDER BY name ASC", [schoolId]);
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

  async addStudent({ class_id, name, avatar_config = '{}' }) {
    const avatarStr = typeof avatar_config === 'object' ? JSON.stringify(avatar_config) : avatar_config;
    await queryRun(
      "INSERT INTO students (class_id, name, avatar_config, medals_json, points) VALUES (?, ?, ?, '[]', 0)",
      [class_id, name, avatarStr]
    );
  },

  async deleteStudent(id) {
    await queryRun("DELETE FROM students WHERE id = ?", [id]);
  },

  async updateStudentAvatar(studentId, avatar_config) {
    const avatarStr = typeof avatar_config === 'object' ? JSON.stringify(avatar_config) : avatar_config;
    await queryRun("UPDATE students SET avatar_config = ? WHERE id = ?", [avatarStr, studentId]);
  },

  async verifyClassPin(classId, pin) {
    const row = await queryGet("SELECT class_pin FROM school_classes WHERE id = ?", [classId]);
    if (!row) return false;
    return String(row.class_pin).trim() === String(pin).trim();
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
    );`
  ];

  for (const sql of tables) {
    await queryRun(sql);
  }

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
        await queryRun("INSERT INTO schools (name, city) VALUES (?, ?)", [name, 'Angra dos Reis']);
      }
      const school1 = await queryGet("SELECT id FROM schools WHERE name LIKE '%Faísca%' LIMIT 1");
      if (school1) {
        await queryRun("INSERT INTO school_classes (school_id, name, grade_level, class_pin) VALUES (?, ?, ?, ?)", [school1.id, '3º Ano A', '3º Ano', '1234']);
        await queryRun("INSERT INTO school_classes (school_id, name, grade_level, class_pin) VALUES (?, ?, ?, ?)", [school1.id, '4º Ano A', '4º Ano', '1234']);
        await queryRun("INSERT INTO school_classes (school_id, name, grade_level, class_pin) VALUES (?, ?, ?, ?)", [school1.id, '5º Ano A', '5º Ano', '1234']);
      }
    }
  } catch (err) {
    console.error('[DB Engine Seed Warning]:', err.message);
  }
}

initTables().catch(err => console.error('[DB Init Error]:', err.message));

module.exports = dbHelper;

