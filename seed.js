const Database = require('better-sqlite3');
const db = new Database('database.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    activity_url TEXT NOT NULL,
    icon_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

const activities = [
    {
        title: "Aventura com Code.org",
        description: "Aprenda a programar jogando com o Minecraft! Resolva quebra-cabeças lógicos.",
        activity_url: "https://code.org/minecraft",
        icon_url: "https://cdn-icons-png.flaticon.com/512/616/616430.png"
    },
    {
        title: "Desenho com Robôs",
        description: "Use comandos simples para guiar o robô artista e criar formas geométricas incríveis.",
        activity_url: "https://scratch.mit.edu/projects/editor/?tutorial=getstarted",
        icon_url: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png"
    },
    {
        title: "Laboratório de Circuitos",
        description: "Monte circuitos elétricos virtuais e faça a lâmpada brilhar usando baterias e fios.",
        activity_url: "https://www.tinkercad.com/circuits",
        icon_url: "https://cdn-icons-png.flaticon.com/512/2853/2853173.png"
    }
];

const insert = db.prepare('INSERT INTO activities (title, description, activity_url, icon_url) VALUES (?, ?, ?, ?)');

db.transaction(() => {
    // Clear existing to avoid duplicates on re-run
    db.prepare('DELETE FROM activities').run();
    for (const act of activities) {
        insert.run(act.title, act.description, act.activity_url, act.icon_url);
    }
})();

console.log("Banco de dados populado com atividades iniciais!");
db.close();
