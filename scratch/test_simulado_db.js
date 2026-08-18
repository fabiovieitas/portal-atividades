const dbHelper = require('../db');

async function testSimulado() {
  console.log('--- TESTANDO SIMULADO DIGITAL DB INTEGRATION ---');
  try {
    // 1. Submit sample test response
    console.log('1. Inserindo submissão de teste...');
    await dbHelper.saveSimuladoSubmission({
      simulado_id: 'campos-4ano-agosto-2026',
      student_name: 'Lucas Gabriel da Silva',
      school_name: 'E.M. Profª Eleonora da Silva Pinto',
      class_name: '4º Ano B',
      answers_json: {
        1: 'B',
        2: 'D',
        3: 'Mirela e Enzo viram uma pedra reluzente no Rio Paraíba do Sul...',
        4: 'B',
        5: 'B',
        6: 'B',
        7: 'B',
        8: 'A',
        9: 'C',
        10: 'A'
      },
      score: 9,
      max_score: 9,
      essay_text: 'Mirela e Enzo viram uma pedra reluzente no Rio Paraíba do Sul...'
    });

    // 2. Fetch submissions
    console.log('2. Buscando submissões salvas no banco...');
    const subs = await dbHelper.getSimuladoSubmissions('campos-4ano-agosto-2026');
    console.log(`Submissões salvas: ${subs.length}`);
    console.log('Última submissão:', subs[0]);

    // 3. Fetch stats
    const stats = await dbHelper.getSimuladoStats('campos-4ano-agosto-2026');
    console.log('Estatísticas do Simulado:', stats);

    console.log('✅ TESTE CONCLUÍDO COM SUCESSO!');
  } catch (err) {
    console.error('❌ ERRO NO TESTE:', err);
  }
}

testSimulado();
