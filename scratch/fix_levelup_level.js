const dbHelper = require('../db');

async function fixLevelUp() {
  console.log("Fixing level for LEVEL UP activities...");
  await dbHelper.queryRun("UPDATE activities SET level = '6-9' WHERE title LIKE '%LEVEL UP%' OR activity_url LIKE '%level-up%'");
  
  const kids = await dbHelper.getActivities({ level: '1-5' });
  const tech = await dbHelper.getActivities({ level: '6-9' });
  console.log(`✅ TOTAL 1º ao 5º Ano: ${kids.length} atividades`);
  console.log(`✅ TOTAL 6º ao 9º Ano: ${tech.length} atividades`);
}

fixLevelUp().catch(console.error);
