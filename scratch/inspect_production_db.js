const dbHelper = require('../db');

async function checkProd() {
  console.log('--- TURSO CLOUD SIMULADO SUBMISSIONS CHECK ---');
  try {
    const subs = await dbHelper.queryAll("SELECT id, simulado_id, student_name, school_name, class_name, score, max_score, created_at FROM simulado_submissions ORDER BY id DESC");
    console.log(`Total simulado submissions in Turso Cloud: ${subs.length}`);
    console.table(subs);
  } catch(e) {
    console.error('Error querying simulado_submissions:', e);
  }
}

checkProd().catch(console.error);
