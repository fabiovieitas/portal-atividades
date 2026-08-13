require('dotenv').config();
const dbHelper = require('../db');

async function registerGame() {
  console.log('Registering Leitura Divertida no Datashow in Turso and local DB...');

  const sql = `
    INSERT INTO activities (
      title, description, activity_url, icon_url, level, category, subject, bncc_code, status
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `;

  const params = [
    'Leitura Divertida no Datashow 📺⭐',
    'Sistema de Cards de Alfabetização e Leitura em alta resolução para projeção em sala de aula.',
    '/games/leitura-datashow/index.html',
    'https://cdn-icons-png.flaticon.com/512/3426/3426653.png',
    '1-5',
    'Leitura',
    'Português',
    'EF01LP02',
    'public'
  ];

  await dbHelper.tursoClient.execute({ sql, args: params });

  try {
    dbHelper.sqlite.prepare(sql).run(...params);
  } catch (e) {}

  dbHelper.clearCache();
  console.log('✅ Jogo Leitura Divertida no Datashow registrado com SUCESSO!');
}

registerGame().catch(console.error);
