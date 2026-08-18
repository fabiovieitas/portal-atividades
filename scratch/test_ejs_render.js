const ejs = require('ejs');
const path = require('path');
const dbHelper = require('../db');

async function testEjs() {
  try {
    console.log('Testing EJS compilation of views/index.ejs...');
    const activities = await dbHelper.getActivities({});
    const comments = await dbHelper.getApprovedComments(15);
    const { categories, subjects } = await dbHelper.getCategoriesAndSubjects();
    const projects = await dbHelper.getProjects(12);

    const html = await ejs.renderFile(path.join(__dirname, '../views/index.ejs'), {
      activities,
      selectedLevel: undefined,
      comments: comments || [],
      categories,
      subjects,
      search: undefined,
      selectedCategory: undefined,
      selectedSubject: undefined,
      bncc: undefined,
      projects: projects || [],
      teacher: null
    });

    console.log('✅ SUCCESS! HTML rendered length:', html.length);
  } catch (err) {
    console.error('❌ EJS COMPILATION ERROR:', err.stack || err);
  }
}

testEjs().catch(console.error);
