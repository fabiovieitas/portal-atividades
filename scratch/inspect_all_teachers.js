const dbHelper = require('../db');

async function test() {
  await new Promise(r => setTimeout(r, 2000));
  console.log('--- TURSO / SQLITE TEACHERS ---');
  try {
    const tursoTeachers = await dbHelper.queryAll("SELECT * FROM teachers");
    console.log(`Total Turso teachers: ${tursoTeachers.length}`);
    tursoTeachers.forEach(t => console.log(t));
  } catch(e) {
    console.error('Turso query error:', e.message);
  }

  console.log('--- SUPABASE TEACHERS ---');
  if (dbHelper.supabase) {
    try {
      const { data, error } = await dbHelper.supabase.from('teachers').select('*');
      if (error) {
        console.error('Supabase error:', error.message);
      } else {
        console.log(`Total Supabase teachers: ${data ? data.length : 0}`);
        (data || []).forEach(t => console.log(t));
      }
    } catch(e) {
      console.error('Supabase fetch error:', e.message);
    }
  }

  console.log('--- COMBINED getTeachers() ---');
  const combined = await dbHelper.getTeachers();
  console.log(`Combined count: ${combined.length}`);
  console.log(combined);
}

test().catch(console.error);
