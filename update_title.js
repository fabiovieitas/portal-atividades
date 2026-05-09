
const Database = require('better-sqlite3');
const db = new Database('database.db');

const gameUpdate = {
    oldTitle: "Missão Respeito: Desafio Digital",
    newTitle: "LEVEL UP: O Jogo da Vida não tem Botão de Reset",
    newDesc: "Um RPG de escolhas éticas baseado na famosa palestra escolar. Enfrente dilemas reais onde cada decisão é permanente.",
    icon_url: "https://cdn-icons-png.flaticon.com/512/5930/5930147.png"
};

const update = db.prepare('UPDATE activities SET title = ?, description = ?, icon_url = ? WHERE title = ?');
update.run(gameUpdate.newTitle, gameUpdate.newDesc, gameUpdate.icon_url, gameUpdate.oldTitle);

console.log("Título do jogo atualizado no banco de dados!");
db.close();
