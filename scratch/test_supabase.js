require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function test() {
  console.time('Supabase fetch activities');
  const { data, error } = await supabase.from('activities').select('*');
  console.timeEnd('Supabase fetch activities');

  if (error) {
    console.error('Error fetching activities:', error);
  } else {
    console.log('Total activities count:', data.length);
    if (data.length > 0) {
      console.log('Sample activity:', data[0]);
      const levels = [...new Set(data.map(a => a.level))];
      const statuses = [...new Set(data.map(a => a.status))];
      console.log('Unique levels in DB:', levels);
      console.log('Unique statuses in DB:', statuses);
    }
  }

  console.time('Supabase fetch comments');
  const { data: comments, error: commErr } = await supabase.from('comments').select('*, activities(title)').eq('approved', 1).limit(15);
  console.timeEnd('Supabase fetch comments');
  if (commErr) console.error('Comments error:', commErr);

  console.time('Supabase fetch categories');
  const { data: catData } = await supabase.from('activities').select('category');
  console.timeEnd('Supabase fetch categories');
}

test();
