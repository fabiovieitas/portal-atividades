const dbHelper = require('../db');

async function test() {
  console.log('Removendo "Aventura com Code.org" e "Desenho com Robôs" do banco Turso...');
  await new Promise(r => setTimeout(r, 2000));

  try {
    await dbHelper.queryRun("DELETE FROM activities WHERE title LIKE '%Code.org%' OR title LIKE '%Desenho com Robôs%'");
    console.log('✅ Atividades deletadas com sucesso do Turso Cloud!');
  } catch(e) {
    console.error('Erro ao deletar:', e.message);
  }

  const activities = await dbHelper.getActivities({});
  console.log('--- ATIVIDADES RESTANTES NO BANCO ---');
  activities.forEach(a => console.log(`ID: ${a.id} | Title: "${a.title}"`));
}

test().catch(console.error);
