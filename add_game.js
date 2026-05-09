
const Database = require('better-sqlite3');
const db = new Database('database.db');

const gameActivity = {
    title: "Missão Respeito: Desafio Digital",
    description: "Um jogo de escolhas para o 9º ano sobre como enfrentar o bullying e o cyberbullying com coragem e empatia.",
    activity_url: "/games/missao-respeito/index.html",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3534/3534033.png"
};

const insert = db.prepare('INSERT INTO activities (title, description, activity_url, icon_url) VALUES (?, ?, ?, ?)');
insert.run(gameActivity.title, gameActivity.description, gameActivity.activity_url, gameActivity.icon_url);

console.log("Jogo 'Missão Respeito' adicionado ao portal!");
db.close();
