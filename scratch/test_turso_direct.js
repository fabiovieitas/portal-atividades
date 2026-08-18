require('dotenv').config();
const { createClient } = require('@libsql/client');

let url = process.env.TURSO_DATABASE_URL;
const token = process.env.TURSO_AUTH_TOKEN;

if (url && url.startsWith('libsql://')) {
  url = url.replace('libsql://', 'https://');
}

const client = createClient({ url, authToken: token });

async function run() {
  console.log('--- TESTING TURSO CLOUD DIRECTLY ---');
  
  // 1. Ensure simulado_submissions table exists on Turso Cloud!
  await client.execute(`
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
  `);
  console.log('✅ simulado_submissions table created/ensured on Turso Cloud!');

  // 2. Query Turso Cloud
  const res = await client.execute("SELECT * FROM simulado_submissions ORDER BY id DESC");
  console.log(`Submissions in Turso Cloud: ${res.rows.length}`);
  console.table(res.rows);
}

run().catch(console.error);
