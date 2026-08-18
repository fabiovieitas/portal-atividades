const dbHelper = require('../db');

async function removeActivities() {
  console.log('=== REMOVING DETETIVE DA ORTOGRAFIA & FÁBRICA DE SÍLABAS ===');

  const delActResult = await dbHelper.queryRun(
    "DELETE FROM activities WHERE activity_url LIKE '%detetive-ortografia%' OR activity_url LIKE '%fabrica-de-silabas%' OR title LIKE '%Detetive da Ortografia%' OR title LIKE '%Fábrica de Sílabas%'"
  );
  console.log('Deleted activities from Turso:', delActResult);

  const delNewsResult = await dbHelper.queryRun(
    "DELETE FROM news WHERE activity_url LIKE '%detetive-ortografia%' OR activity_url LIKE '%fabrica-de-silabas%' OR title LIKE '%Detetive%' OR title LIKE '%Fábrica de Sílabas%'"
  );
  console.log('Deleted news/blogs from Turso:', delNewsResult);

  const remainingActs = await dbHelper.queryAll("SELECT id, title, activity_url, level FROM activities");
  console.log(`Remaining activities (${remainingActs.length}):`);
  console.table(remainingActs);
}

removeActivities().catch(console.error);
