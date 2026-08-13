const Database = require('better-sqlite3');
const db = new Database('database.db');

try {
  console.log('--- teacher_planning rows ---');
  const planning = db.prepare("SELECT * FROM teacher_planning").all();
  console.log(planning);

  console.log('\n--- activities with status = pending or private ---');
  const activities = db.prepare("SELECT id, title, status, teacher_id FROM activities WHERE status != 'public'").all();
  console.log(activities);
} catch (err) {
  console.error(err);
}
