const dbHelper = require('../db');

async function testSubmit5Ano() {
  console.log('Sending test submission for 5º Ano...');
  await dbHelper.saveSimuladoSubmission({
    simulado_id: 'campos-5ano-agosto-2026',
    student_name: 'Gabriel Souza (Teste 5º Ano)',
    school_name: 'E.M. Profª Eleonora da Silva Pinto',
    class_name: '5º Ano',
    shift: 'Manhã',
    answers_json: { 1:'B', 2:'B', 3:'Texto de teste da reescrita da lenda do Ururau da Lapa', 4:'C', 5:'D', 6:'B', 7:'B', 8:'C', 9:'B', 10:'C' },
    score: 9,
    max_score: 9,
    essay_text: 'Texto de teste da reescrita da lenda do Ururau da Lapa'
  });
  console.log('✅ Test 5th grade submission saved to database!');
}

testSubmit5Ano().catch(console.error);
