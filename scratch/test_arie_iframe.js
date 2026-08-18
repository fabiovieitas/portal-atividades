const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const matches = data.match(/<iframe[^>]+src=["']([^"']+)["']/gi);
        resolve({ url, status: res.statusCode, iframes: matches });
      });
    }).on('error', (e) => resolve({ url, error: e.message }));
  });
}

async function run() {
  const games = [
    'chapeuzinho-enigma',
    'capitao-alberto-farao',
    'arie-colorir',
    'tabuada-chao-e-lava',
    'caca-palavras-temas'
  ];

  for (const g of games) {
    const pageUrl = `https://arietoy.com.br/jogo/${g}`;
    const res = await checkUrl(pageUrl);
    console.log(g, res);
  }
}

run();
