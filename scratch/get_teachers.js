require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function run() {
  const { data: teachers } = await supabase.from('teachers').select('*');
  console.log('Teachers:', teachers);
}

run();
