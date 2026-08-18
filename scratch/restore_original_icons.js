const fs = require('fs');
const path = require('path');
const dbHelper = require('../db');

const originalIconsMap = {
  "Brincando com Ariê 1": "https://arietoy.com.br/assets_games/br/brincando-com-arie-1/screenshots/brincando-com-arie-1-01.jpg",
  "Pou Online - Mascote Virtual & Rotinas": "https://cdn.jogos360.com.br/po/uo/pou-online-d.jpg",
  "Gartic.io - Desenho & Vocabulário": "https://gartic.io/static/images/avatar/1.png",
  "Akinator - O Gênio da Lógica": "https://pt.akinator.com/assets/img/akinator.png",
  "Laboratório de Circuitos": "https://cdn-icons-png.flaticon.com/512/2853/2853173.png",
  "Laboratório de Circuitos (Tinkercad)": "https://cdn-icons-png.flaticon.com/512/2853/2853173.png",
  "Leitura Divertida no Datashow": "https://cdn-icons-png.flaticon.com/512/3426/3426653.png",
  "⭐ Leitura Divertida no Datashow [JOGO AUTORAL]": "https://cdn-icons-png.flaticon.com/512/3426/3426653.png",
  "Tux Math - Matemática Divertida": "https://tuxmath.org/images/favicon.png",
  "LEVEL UP: O Jogo da Vida não tem Botão de Reset": "https://cdn-icons-png.flaticon.com/512/2991/2991108.png"
};

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  console.log('Restaurando ícones originais para as atividades anteriores...');

  for (const [title, iconUrl] of Object.entries(originalIconsMap)) {
    try {
      const existing = await dbHelper.queryGet("SELECT id FROM activities WHERE title LIKE ? LIMIT 1", [`%${title.replace('⭐ ', '').split('[')[0].trim()}%`]);
      if (existing) {
        await dbHelper.queryRun("UPDATE activities SET icon_url = ? WHERE id = ?", [iconUrl, existing.id]);
        console.log(`✅ Ícone original restaurado para: "${title}" (${iconUrl})`);
      }
    } catch(e) {
      console.error(`Erro ao restaurar ícone de ${title}:`, e.message);
    }
  }

  console.log('✅ Todos os ícones anteriores foram restaurados com sucesso!');
}

run().catch(console.error);
