const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tkdtagdpqipdvwceqkoa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrZHRhZ2RwcWlwZHZ3Y2Vxa29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2OTYwNTcsImV4cCI6MjA5MjI3MjA1N30.XhOng44Aj4pMCQMOhYFEDw6sH_xOiaIO6nYVDSvtwoM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const tables = ['assembly_sessions', 'official_documents', 'churches', 'news', 'pautas'];
  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) {
        console.error(`Table ${table} error:`, error.message);
      } else {
        console.log(`Table ${table} has ${data.length} rows`);
        if (table === 'official_documents') {
          console.log('Official documents:');
          data.forEach(d => {
            console.log(`- ID: ${d.id}, Titulo: ${d.titulo}, Criado em: ${d.created_at}, Categoria: ${d.categoria}, Sincronizado: ${d.sincronizado || d.status}`);
          });
        }
        if (table === 'pautas') {
          console.log('Pautas:');
          data.forEach(d => {
            console.log(`- ID: ${d.id}, Titulo: ${d.titulo}, Data: ${d.data_reuniao || d.data}, Status: ${d.status}`);
          });
        }
        if (table === 'assembly_sessions') {
          console.log('Assembly sessions:');
          data.forEach(d => {
            console.log(`- ID: ${d.id}, Titulo: ${d.titulo}, Token: ${d.token}, Active: ${d.is_active}, Assinaturas: ${d.fotos_assinatura_urls}`);
          });
        }
      }
    } catch (err) {
      console.error(`Error querying ${table}:`, err.message);
    }
  }
}

checkTables();
