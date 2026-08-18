const dbHelper = require('../db');

async function verify() {
  console.log('--- VERIFYING REMOVAL OF DETETIVE & FÁBRICA DE SÍLABAS ---');
  const acts = await dbHelper.queryAll("SELECT id, title, activity_url FROM activities WHERE title LIKE '%Detetive%' OR title LIKE '%Fábrica%' OR activity_url LIKE '%detetive%' OR activity_url LIKE '%fabrica%'");
  console.log('Matching activities found:', acts.length);
  if (acts.length > 0) {
    console.table(acts);
  } else {
    console.log('✅ Success: 0 matching activities found in production database!');
  }

  const news = await dbHelper.queryAll("SELECT id, title, activity_url FROM news WHERE title LIKE '%Detetive%' OR title LIKE '%Fábrica%' OR activity_url LIKE '%detetive%' OR activity_url LIKE '%fabrica%'");
  console.log('Matching news posts found:', news.length);
  if (news.length > 0) {
    console.table(news);
  } else {
    console.log('✅ Success: 0 matching news posts found in production database!');
  }
}

verify().catch(console.error);
