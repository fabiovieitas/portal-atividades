const Database = require('better-sqlite3');
const path = require('path');

try {
  const db = new Database(path.join(__dirname, '..', 'database.db'));
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('SQLite Tables:', tables);

  for (const t of tables) {
    const count = db.prepare(`SELECT count(*) as cnt FROM ${t.name}`).all();
    console.log(`Table ${t.name}: ${count[0].cnt} rows`);
  }

  const activities = db.prepare("SELECT id, title, level, category, status FROM activities LIMIT 10").all();
  console.log('Sample activities from SQLite:', activities);
} catch (err) {
  console.error('SQLite check error:', err);
}
