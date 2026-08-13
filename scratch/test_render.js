const dbHelper = require('../db');

async function testRender() {
  const activities = await dbHelper.getActivities({ level: '1-5' });
  console.log('Fetched activities for 1-5:', activities.map(a => a.title));
}

testRender();
