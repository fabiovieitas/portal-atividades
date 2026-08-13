const Database = require('better-sqlite3');
const db = new Database('database.db');

try {
  console.log('--- ALL activities ---');
  const activities = db.prepare("SELECT id, title, status FROM activities").all();
  console.log(activities);

  console.log('\n--- ALL projects ---');
  const projects = db.prepare("SELECT id, title FROM projects").all();
  console.log(projects);
} catch (err) {
  console.error(err);
}
