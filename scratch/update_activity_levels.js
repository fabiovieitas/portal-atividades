const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'database.db'));

db.prepare("UPDATE activities SET level = '1-5,6-9' WHERE id IN (3, 4)").run();
console.log("Updated activity levels for 6-9 availability!");
