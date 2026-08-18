const dbHelper = require('../db');
const bcrypt = require('bcrypt');

async function testTeacherSync() {
  console.log('Testing teacher registration and cloud sync...');
  const testEmail = 'prof.test.cloud@labkids.edu.br';
  const testPass = 'Senha123!';
  const hash = await bcrypt.hash(testPass, 10);

  // 1. Insert into Turso
  try {
    await dbHelper.queryRun(
      "INSERT INTO teachers (name, email, password_hash) VALUES (?, ?, ?)",
      ['Professora Maria Silva', testEmail, hash]
    );
    console.log('✅ Inserido no Turso Cloud!');
  } catch(e) {
    console.error('Erro Turso:', e.message);
  }

  // 2. Insert into Supabase if connected
  if (dbHelper.supabase) {
    try {
      const { error } = await dbHelper.supabase.from('teachers').insert({
        name: 'Professora Maria Silva',
        email: testEmail,
        password_hash: hash
      });
      if (error) console.error('Erro Supabase:', error.message);
      else console.log('✅ Inserido no Supabase!');
    } catch(e) {
      console.error('Erro Supabase Catch:', e.message);
    }
  }

  // 3. Query all teachers
  const allTeachers = await dbHelper.getTeachers();
  console.log('\n--- TODOS OS PROFESSORES CADASTRADOS NO CLOUD ---');
  console.log(allTeachers.map(t => ({ id: t.id, name: t.name, email: t.email })));
}

testTeacherSync().catch(console.error);
