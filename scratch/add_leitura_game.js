require('dotenv').config();
const dbHelper = require('../db');

async function registerGame() {
  console.log('Registering Leitura Mágica game in Turso and local DB...');

  const sql = `
    INSERT INTO activities (
      title, description, activity_url, icon_url, level, category, subject, bncc_code, status
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `;

  const params = [
    'Leitura Mágica 📖✨',
    'Treino interativo de leitura de palavras! As palavras aparecem na tela com som e tempo para os alunos praticarem.',
    '/games/leitura-palavras/index.html',
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
  console.log('✅ Jogo Leitura Mágica registrado com sucesso no banco!');
}

registerGame().catch(console.error);
