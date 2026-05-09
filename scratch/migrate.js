const Database = require('better-sqlite3');
const db = new Database('database.db');
try { db.prepare('ALTER TABLE comments ADD COLUMN school_name TEXT').run(); } catch(e) { console.log(e.message); }
try { db.prepare('ALTER TABLE comments ADD COLUMN class_name TEXT').run(); } catch(e) { console.log(e.message); }
try { db.prepare('ALTER TABLE comments ADD COLUMN avatar TEXT DEFAULT "🤖"').run(); } catch(e) { console.log(e.message); }
console.log("Migration complete");
