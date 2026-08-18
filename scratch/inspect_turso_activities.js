const dbHelper = require('../db');

async function test() {
  await new Promise(r => setTimeout(r, 2000));
  const rows = await dbHelper.getActivities({});
  console.log('--- ALL ACTIVITIES IN DB ---');
  rows.forEach(r => console.log(`ID: ${r.id} | Title: "${r.title}" | URL: "${r.activity_url}" | Status: "${r.status}"`));
}

test().catch(console.error);
