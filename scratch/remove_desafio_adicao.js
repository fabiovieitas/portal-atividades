const dbHelper = require('../db');

async function removeDesafioAdicao() {
  console.log('=== REMOVING DESAFIO ADIÇÃO FROM DB & BLOG ===');

  const delAct = await dbHelper.queryRun(
    "DELETE FROM activities WHERE activity_url LIKE '%desafio-adicao%' OR title LIKE '%Desafio dos Fatos Rápidos%' OR title LIKE '%Adição%'"
  );
  console.log('Deleted activity from activities table:', delAct);

  const delNews = await dbHelper.queryRun(
    "DELETE FROM news WHERE activity_url LIKE '%desafio-adicao%' OR title LIKE '%Fatos Rápidos da Adição%' OR title LIKE '%Adição%'"
  );
  console.log('Deleted post from news table:', delNews);

  const remaining = await dbHelper.queryAll("SELECT id, title, activity_url FROM activities");
  console.log(`Remaining activities (${remaining.length}):`);
  console.table(remaining);
}

removeDesafioAdicao().catch(console.error);
