const dbHelper = require('../db');

async function test() {
  console.log('Testing dbHelper.supabase connection...');
  if (!dbHelper.supabase) {
    console.error('❌ dbHelper.supabase is null or undefined!');
    process.exit(1);
  }

  console.log('✅ dbHelper.supabase is valid object!');
  
  try {
    const { data, error } = await dbHelper.supabase.from('teachers').select('id, email').limit(5);
    if (error) {
      console.error('Supabase query error:', error.message);
    } else {
      console.log('✅ Supabase teachers query successful! Total rows:', data ? data.length : 0);
    }
  } catch(e) {
    console.error('Exception querying Supabase:', e);
  }
}

test().catch(console.error);
