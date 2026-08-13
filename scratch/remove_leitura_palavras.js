require('dotenv').config();
const dbHelper = require('../db');

async function removeGame() {
  console.log('Removing Leitura Mágica from Turso and local DB...');

  const sql = "DELETE FROM activities WHERE activity_url LIKE '%/games/leitura-palavras/%' OR title LIKE '%Leitura Mágica%'";

  if (dbHelper.tursoClient) {
    await dbHelper.tursoClient.execute(sql);
  }

  try {
    dbHelper.sqlite.prepare(sql).run();
  } catch (e) {}

  dbHelper.clearCache();
  console.log('✅ Activity removed from database successfully!');
}

removeGame().catch(console.error);
