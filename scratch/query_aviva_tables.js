const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tkdtagdpqipdvwceqkoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHRhZ2RwcWlwZHZ3Y2Vxa29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTYwNTcsImV4cCI6MjA5MjI3MjA1N30.XhOng44Aj4pMCQMOhYFEDw6sH_xOiaIO6nYVDSvtwoM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const tables = ['assembly_sessions', 'official_documents', 'churches', 'members', 'news', 'agenda', 'pautas'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(10);
      if (error) {
        console.error(`Table ${table} error:`, error.message);
      } else {
        console.log(`\n--- Table ${table} (Count: ${data ? data.length : 0}) ---`);
        console.log(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error(`Error querying ${table}:`, err.message);
    }
  }
}

checkTables();
