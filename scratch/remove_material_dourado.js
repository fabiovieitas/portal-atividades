const dbHelper = require('../db');

async function removeUnwanted() {
  console.log('=== REMOVING MATERIAL DOURADO & DESAFIO ADICAO FROM DB & BLOG ===');

  await dbHelper.queryRun(
    "DELETE FROM activities WHERE activity_url LIKE '%material-dourado%' OR activity_url LIKE '%desafio-adicao%' OR title LIKE '%Material Dourado%' OR title LIKE '%Adição%'"
  );

  await dbHelper.queryRun(
    "DELETE FROM news WHERE activity_url LIKE '%material-dourado%' OR activity_url LIKE '%desafio-adicao%' OR title LIKE '%Material Dourado%' OR title LIKE '%Adição%'"
  );

  const remaining = await dbHelper.queryAll("SELECT id, title, activity_url FROM activities");
  console.log(`Remaining activities (${remaining.length}):`);
  console.table(remaining);
}

removeUnwanted().catch(console.error);
