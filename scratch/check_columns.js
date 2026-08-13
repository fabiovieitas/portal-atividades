require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function run() {
  try {
    // Try inserting a test exam with num_questions
    const { data, error } = await supabase.from('exams').insert({
      title: 'Teste Temp',
      pdf_url: 'http://temp.pdf',
      access_code: 'XYZ123',
      num_questions: 10,
      teacher_id: null // since it's a test, let's see if we can get a column error before a foreign key error, or just select
    }).select();
    
    console.log('Result:', data, 'Error:', error);
  } catch (err) {
    console.error(err);
  }
}

run();
