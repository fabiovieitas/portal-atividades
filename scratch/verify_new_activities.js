const dbHelper = require('../db');

async function test() {
  console.log('Aguardando 2.5s para conclusão do seeding automático...');
  await new Promise(r => setTimeout(r, 2500));

  const activities = await dbHelper.getActivities({});
  console.log(`Total atividades no sistema: ${activities.length}`);
  
  const gartic = activities.find(a => a.activity_url === '/atividades/gartic');
  const akinator = activities.find(a => a.activity_url === '/atividades/akinator');

  console.log('Gartic Activity Found:', gartic ? `${gartic.title} (URL: ${gartic.activity_url})` : 'NOT FOUND');
  console.log('Akinator Activity Found:', akinator ? `${akinator.title} (URL: ${akinator.activity_url})` : 'NOT FOUND');

  if (gartic && akinator) {
    console.log('✅ Verificação CONCLUÍDA COM SUCESSO!');
  } else {
    console.error('❌ Verificação FALHOU!');
    process.exit(1);
  }
}

test().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
