const dbHelper = require('../db');

async function test() {
  console.log('Aguardando inicialização do banco de dados (initTables)...');
  await new Promise(r => setTimeout(r, 2500));

  console.log('\n--- VERIFICANDO NOVAS ATIVIDADES NO BANCO ---');
  const activities = await dbHelper.getActivities({ adminMode: true });
  console.log(`Total de atividades cadastradas: ${activities.length}`);
  
  const newSlugs = [
    'chapeuzinho-enigma',
    'capitao-alberto-farao',
    'arie-colorir',
    'tabuada-chao-e-lava',
    'caca-palavras-temas',
    'brincando-com-arie-2',
    'brincando-com-arie-3'
  ];

  newSlugs.forEach(slug => {
    const found = activities.find(a => a.activity_url.includes(slug));
    if (found) {
      console.log(`✅ Encontrada: ${found.title} (${found.activity_url})`);
    } else {
      console.error(`❌ Não encontrada para slug: ${slug}`);
    }
  });

  console.log('\n--- VERIFICANDO ARTIGO DO BLOG (TUX MATH) ---');
  const news = await dbHelper.getNews();
  console.log(`Total de artigos no blog: ${news.length}`);
  const tuxArticle = news.find(n => n.title.includes('Tux Math'));
  if (tuxArticle) {
    console.log(`✅ Artigo do blog cadastrado: "${tuxArticle.title}" (ID: ${tuxArticle.id})`);
  } else {
    console.error('❌ Artigo do Tux Math não encontrado no blog!');
  }
}

test().catch(console.error);
