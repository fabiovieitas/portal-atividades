async function checkLiveHTML() {
  console.log('Fetching live HTML from https://portal-atividades.onrender.com/admin/simulado/resultados ...');
  const res = await fetch('https://portal-atividades.onrender.com/admin/simulado/resultados');
  const html = await res.text();
  console.log('HTML length:', html.length);
  console.log('Contains Gabriel Souza?', html.includes('Gabriel Souza'));
  console.log('Contains Lucas Gabriel?', html.includes('Lucas Gabriel'));
  console.log('Contains Mariana Ribeiro?', html.includes('Mariana Ribeiro'));
  
  // Extract all student names from table
  const matches = [...html.matchAll(/class="student-name-text">([^<]+)</g)];
  console.log('Student names found in table:', matches.map(m => m[1]));
}

checkLiveHTML().catch(console.error);
