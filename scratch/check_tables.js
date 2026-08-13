require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function run() {
  try {
    const tables = ['exams', 'exam_submissions', 'global_exams'];
    for (const t of tables) {
      const { data, error } = await supabase.from(t).select('*').limit(1);
      console.log(`Table ${t}:`, error ? `ERROR: ${error.message}` : `OK (count: ${data.length})`);
    }
  } catch (err) {
    console.error(err);
  }
}

run();
