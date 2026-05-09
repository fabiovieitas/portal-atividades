const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('--- Table Info (activities) ---');
const info = db.prepare("PRAGMA table_info(activities)").all();
console.log(JSON.stringify(info, null, 2));

console.log('\n--- Sample activities ---');
const activities = db.prepare("SELECT id, title, level, status FROM activities LIMIT 20").all();
console.log(JSON.stringify(activities, null, 2));

console.log('\n--- Level counts ---');
const counts = db.prepare("SELECT level, COUNT(*) as count FROM activities GROUP BY level").all();
console.log(JSON.stringify(counts, null, 2));
