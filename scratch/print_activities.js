const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'database.db'));

const rows = db.prepare("SELECT * FROM activities").all();
console.log(JSON.stringify(rows, null, 2));
