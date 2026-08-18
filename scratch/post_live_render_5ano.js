async function postLive() {
  const payload = {
    simulado_id: 'campos-5ano-agosto-2026',
    student_name: 'Gabriel Souza (Teste 5º Ano)',
    school_name: 'E.M. Profª Eleonora da Silva Pinto',
    class_name: '5º Ano',
    shift: 'Manhã',
    answers_json: { 1:'B', 2:'B', 3:'Reescrita da lenda do Ururau no Paraíba do Sul', 4:'C', 5:'D', 6:'B', 7:'B', 8:'C', 9:'B', 10:'C' },
    score: 9,
    max_score: 9,
    essay_text: 'Reescrita da lenda do Ururau no Paraíba do Sul'
  };

  console.log('Posting test submission to live Render app...');
  const res = await fetch('https://portal-atividades.onrender.com/api/simulado/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  console.log('Live Render POST Response:', data);
}

postLive().catch(console.error);
