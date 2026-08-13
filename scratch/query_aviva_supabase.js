const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tkdtagdpqipdvwceqkoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHRhZ2RwcWlwZHZ3Y2Vxa29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTYwNTcsImV4cCI6MjA5MjI3MjA1N30.XhOng44Aj4pMCQMOhYFEDw6sH_xOiaIO6nYVDSvtwoM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNews() {
  const { data: news, error } = await supabase
    .from('news')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching news:', error);
  } else {
    console.log('--- GERADOR-ATAS-AVIVA News ---');
    console.log(JSON.stringify(news, null, 2));
  }
}

checkNews();
