const dbHelper = require('../db');

async function runTest() {
  console.log('Testing dbHelper...');
  console.time('isOnline check');
  const online = await dbHelper.isOnline();
  console.timeEnd('isOnline check');
  console.log('Is Supabase online?:', online);

  console.time('getActivities (level=1-5)');
  const activities = await dbHelper.getActivities({ level: '1-5' });
  console.timeEnd('getActivities (level=1-5)');
  console.log('Activities count:', activities.length);

  console.time('getApprovedComments');
  const comments = await dbHelper.getApprovedComments();
  console.timeEnd('getApprovedComments');
  console.log('Comments count:', comments.length);

  console.time('getCategoriesAndSubjects');
  const meta = await dbHelper.getCategoriesAndSubjects();
  console.timeEnd('getCategoriesAndSubjects');
  console.log('Categories:', meta.categories, 'Subjects:', meta.subjects);
}

runTest();
