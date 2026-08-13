const Database = require('better-sqlite3');
const db = new Database('database.db');

try {
  console.log('--- Database Tables ---');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(tables);

  for (const table of tables) {
    console.log(`\n--- Table Info (${table.name}) ---`);
    const info = db.prepare(`PRAGMA table_info(${table.name})`).all();
    console.log(info.map(c => c.name).join(', '));
    
    // Check if table contains news or has a published_at column
    if (table.name === 'news' || info.some(c => c.name === 'published_at')) {
      console.log(`Checking rows for ${table.name}...`);
      const rows = db.prepare(`SELECT * FROM ${table.name}`).all();
      console.log(rows);
    }
  }
} catch (err) {
  console.error(err);
}
