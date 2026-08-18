const dbHelper = require('../db');

async function test() {
  console.log('Testando busca de professores cadastrados no dbHelper...');
  await new Promise(r => setTimeout(r, 2000));

  const teachers = await dbHelper.getTeachers();
  console.log(`Total de professores encontrados: ${teachers.length}`);
  teachers.forEach(t => console.log(`- ID: ${t.id} | Nome: "${t.name}" | E-mail: "${t.email}"`));
}

test().catch(console.error);
