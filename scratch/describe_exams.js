require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  try {
    const { data: exams, error: error1 } = await supabase.from('exams').select('*').limit(1);
    console.log('EXAMS SAMPLE:', exams, error1);

    const { data: submissions, error: error2 } = await supabase.from('exam_submissions').select('*').limit(1);
    console.log('SUBMISSIONS SAMPLE:', submissions, error2);
  } catch (err) {
    console.error(err);
  }
}

run();
