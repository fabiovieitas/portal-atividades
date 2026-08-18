const ejs = require('ejs');
const path = require('path');
const dbHelper = require('../db');

async function testKids() {
  try {
    console.log('Testing level 1-5 activities render...');
    const activities = await dbHelper.getActivities({ level: '1-5' });
    console.log('Activities count for 1-5:', activities.length);
    console.log('Titles:', activities.map(a => a.title));

    const html = await ejs.renderFile(path.join(__dirname, '../views/index.ejs'), {
      activities,
      selectedLevel: '1-5',
      comments: [],
      categories: [],
      subjects: [],
      search: undefined,
      selectedCategory: undefined,
      selectedSubject: undefined,
      bncc: undefined,
      projects: [],
      teacher: null
    });

    console.log('✅ SUCCESS! 1-5 rendered HTML length:', html.length);
  } catch (err) {
    console.error('❌ ERROR:', err);
  }
}

testKids().catch(console.error);
