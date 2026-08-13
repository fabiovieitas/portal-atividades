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
  }
};

module.exports = dbHelper;
