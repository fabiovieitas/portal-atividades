const fs = require('fs');
const path = require('path');

const games = [
  {
    slug: 'chapeuzinho-enigma',
    viewName: 'chapeuzinho_enigma_presentation.ejs',
    title: 'Chapeuzinho e o Enigma',
    category: 'Alfabetização & Raciocínio (Português)',
    bncc: 'EF01LP02, EF01LP05, EF15AR04',
    level: '1º ao 5º Ano',
    directUrl: 'https://arietoy.com.br/jogo/chapeuzinho-enigma',
    embedUrl: 'https://arietoy.com.br/assets_games/ch/chapeuzinho-enigma/jogo_c3.php?v=1.0.0&id=20&slug=chapeuzinho-enigma',
    thumb: 'https://arietoy.com.br/assets_games/ch/chapeuzinho-enigma/screenshots/chapeuzinho-enigma-01.jpg',
    desc: 'Ajude Chapeuzinho Vermelho a atravessar a floresta mágica desvendando quebra-cabeças de palavras, raciocínio lógico e atenção visual!'
  },
  {
    slug: 'capitao-alberto-farao',
    viewName: 'capitao_alberto_presentation.ejs',
    title: 'Capitão Alberto e o Faraó',
    category: 'História & Aventura (História / Geografia)',
    bncc: 'EF01HI01, EF02HI02, EF03HI01',
    level: '1º ao 5º Ano',
    directUrl: 'https://arietoy.com.br/jogo/capitao-alberto-farao',
    embedUrl: 'https://arietoy.com.br/assets_games/ca/capitao-alberto-farao/jogo_c3.php?v=1.0.0&id=21&slug=capitao-alberto-farao',
    thumb: 'https://arietoy.com.br/assets_games/ca/capitao-alberto-farao/screenshots/capitao-alberto-farao-01.jpg',
    desc: 'Embarque em uma expedição fascinante pelo Egito Antigo com o Capitão Alberto, desvendando enigmas de pirâmides e hieróglifos.'
  },
  {
    slug: 'arie-colorir',
    viewName: 'arie_colorir_presentation.ejs',
    title: 'Ariê Colorir',
    category: 'Artes Visuais & Coordenação Motora',
    bncc: 'EF15AR04, EF15AR02, EI02CG05',
    level: 'Educação Infantil ao 5º Ano',
    directUrl: 'https://arietoy.com.br/jogo/arie-colorir',
    embedUrl: 'https://arietoy.com.br/assets_games/ar/arie-colorir/jogo_c3.php?v=1.0.0&id=22&slug=arie-colorir',
    thumb: 'https://arietoy.com.br/assets_games/ar/arie-colorir/screenshots/arie-colorir-01.jpg',
    desc: 'Atividade interativa de artes que estimula a percepção de cores, criatividade visual e coordenação motora fina das crianças.'
  },
  {
    slug: 'tabuada-chao-e-lava',
    viewName: 'tabuada_lava_presentation.ejs',
    title: 'Tabuada - O Chão é Lava!',
    category: 'Matemática Divertida & Agilidade',
    bncc: 'EF02MA05, EF03MA03, EF04MA04',
    level: '2º ao 5º Ano',
    directUrl: 'https://arietoy.com.br/jogo/tabuada-chao-e-lava',
    embedUrl: 'https://arietoy.com.br/assets_games/ta/tabuada-chao-e-lava/jogo_c3.php?v=1.0.0&id=23&slug=tabuada-chao-e-lava',
    thumb: 'https://arietoy.com.br/assets_games/ta/tabuada-chao-e-lava/screenshots/tabuada-chao-e-lava-01.jpg',
    desc: 'Jogo eletrizante de matemática! Responda rápido aos resultados da tabuada para pular entre as plataformas antes que o chão vire lava.'
  },
  {
    slug: 'caca-palavras-temas',
    viewName: 'caca_palavras_presentation.ejs',
    title: 'Caça-Palavras Temático',
    category: 'Vocabulário & Leitura (Português)',
    bncc: 'EF01LP02, EF02LP04, EF35LP05',
    level: '1º ao 5º Ano',
    directUrl: 'https://arietoy.com.br/jogo/caca-palavras-temas',
    embedUrl: 'https://arietoy.com.br/assets_games/ca/caca-palavras-temas/jogo_c3.php?v=1.0.0&id=24&slug=caca-palavras-temas',
    thumb: 'https://arietoy.com.br/assets_games/ca/caca-palavras-temas/screenshots/caca-palavras-temas-01.jpg',
    desc: 'Desafio dinâmico de caça-palavras organizado por temas pedagógicos como animais, alimentação, escola e natureza.'
  },
  {
    slug: 'brincando-com-arie-2',
    viewName: 'arie2_presentation.ejs',
    title: 'Brincando com Ariê 2',
    category: 'Alfabetização & Consciência Fonológica',
    bncc: 'EI03EF04, EF01LP10, EF01MA01',
    level: 'Educação Infantil ao 2º Ano',
    directUrl: 'https://arietoy.com.br/jogo/brincando-com-arie-2',
    embedUrl: 'https://arietoy.com.br/assets_games/br/brincando-com-arie-2/jogo_c3.php?v=1.5.0&id=16&slug=brincando-com-arie-2',
    thumb: 'https://arietoy.com.br/assets_games/br/brincando-com-arie-2/screenshots/brincando-com-arie-2-01.jpg',
    desc: 'Segunda edição da série pedagógica Ariê, com minijogos de sílabas, contagem de objetos, jogo da memória e formação de palavras.'
  },
  {
    slug: 'brincando-com-arie-3',
    viewName: 'arie3_presentation.ejs',
    title: 'Brincando com Ariê 3',
    category: 'Alfabetização Avançada & Operações Básicas',
    bncc: 'EF01LP12, EF02LP01, EF02MA05',
    level: '1º ao 3º Ano',
    directUrl: 'https://arietoy.com.br/jogo/brincando-com-arie-3',
    embedUrl: 'https://arietoy.com.br/assets_games/br/brincando-com-arie-3/jogo_c3.php?v=1.5.0&id=17&slug=brincando-com-arie-3',
    thumb: 'https://arietoy.com.br/assets_games/br/brincando-com-arie-3/screenshots/brincando-com-arie-3-01.jpg',
    desc: 'Terceiro capítulo com exercícios desafiadores de ortografia, associação de frases, adição, subtração e raciocínio lógico.'
  }
];

const viewsDir = path.join(__dirname, '../views');
const publicGamesDir = path.join(__dirname, '../public/games');

for (const g of games) {
  // 1. Create EJS presentation view
  const ejsContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${g.title} - Guia Pedagógico | Lab Kids</title>
    <link rel="stylesheet" href="/css/style.css?v=4">
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&family=Outfit:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
        body { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #f8fafc; font-family: 'Fredoka', sans-serif; min-height: 100vh; margin: 0; padding: 20px 10px 60px 10px; }
        .container-presentation { max-width: 900px; margin: 0 auto; }
        .top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
        .btn-return-portal { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 12px 24px; border-radius: 50px; font-weight: 800; text-decoration: none; box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4); border: 2px solid rgba(255, 255, 255, 0.3); }
        .hero-banner { background: rgba(30, 41, 59, 0.9); border: 2px solid rgba(255, 255, 255, 0.1); border-radius: 28px; padding: 35px; text-align: center; margin-bottom: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); position: relative; overflow: hidden; }
        .game-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: #f59e0b; margin-top: 10px; }
        .btn-launch-large { display: inline-flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 18px 45px; border-radius: 50px; font-size: 1.4rem; font-weight: 800; text-decoration: none; margin-top: 20px; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.5); border: 3px solid rgba(255, 255, 255, 0.4); transition: transform 0.2s; }
        .btn-launch-large:hover { transform: scale(1.05); }
        .pedagogical-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card-pedagogical { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 25px; }
        .bncc-badge { background: #6366f1; color: white; padding: 6px 14px; border-radius: 20px; font-weight: 700; font-size: 0.85rem; display: inline-block; margin: 4px; }
    </style>
</head>
<body>
    <div class="container-presentation">
        <div class="top-nav">
            <a href="/" class="btn-return-portal">⬅️ VOLTAR AO PORTAL</a>
            <span style="font-size: 1.2rem; font-weight: 700; color: #cbd5e1;">🤖 Lab Kids</span>
        </div>

        <div class="hero-banner">
            <img src="${g.thumb}" style="width: 140px; height: 140px; border-radius: 24px; object-fit: cover; border: 4px solid #f59e0b; box-shadow: 0 10px 25px rgba(0,0,0,0.5);" alt="${g.title}">
            <h1 class="game-title">${g.title}</h1>
            <p style="font-size: 1.15rem; color: #cbd5e1; max-width: 700px; margin: 10px auto;">${g.desc}</p>
            
            <a href="/games/${g.slug}/index.html" class="btn-launch-large">
                🎮 ABRIR E JOGAR AGORA 🚀
            </a>
            <br>
            <a href="${g.directUrl}" target="_blank" rel="noopener" style="color: #94a3b8; font-size: 0.9rem; text-decoration: underline; margin-top: 15px; display: inline-block;">
                🔗 Abrir diretamente no Ariê Toy (em nova aba)
            </a>
        </div>

        <div class="pedagogical-grid">
            <div class="card-pedagogical">
                <h3 style="color: #38bdf8;">📌 Ficha Técnica</h3>
                <p><strong>Público-Alvo:</strong> ${g.level}</p>
                <p><strong>Categoria:</strong> ${g.category}</p>
                <p><strong>Plataforma:</strong> Ariê Toy / Web Digital</p>
            </div>
            <div class="card-pedagogical">
                <h3 style="color: #a855f7;">📘 Habilidades BNCC</h3>
                <div>
                    ${g.bncc.split(',').map(b => `<span class="bncc-badge">${b.trim()}</span>`).join(' ')}
                </div>
            </div>
        </div>

        <!-- AdSense Banner Container -->
        <div style="background: rgba(15, 23, 42, 0.8); border: 2px dashed rgba(255,255,255,0.2); border-radius: 20px; padding: 20px; text-align: center; margin-top: 20px;">
            <span style="font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase;">Publicidade AdSense</span>
            <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-1234567890123456" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
        </div>
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join(viewsDir, g.viewName), ejsContent, 'utf8');

  // 2. Create game launcher HTML file in public/games/<slug>/index.html
  const gameDir = path.join(publicGamesDir, g.slug);
  if (!fs.existsSync(gameDir)) {
    fs.mkdirSync(gameDir, { recursive: true });
  }

  const launcherContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${g.title} | Lab Kids</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: white; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
        header { background: #1e293b; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid rgba(255,255,255,0.1); z-index: 10; }
        .btn-back { background: #ef4444; color: white; padding: 8px 18px; border-radius: 50px; font-weight: bold; text-decoration: none; font-size: 0.9rem; }
        .game-frame { flex: 1; border: none; width: 100%; height: 100%; }
        .fallback-container { padding: 40px; text-align: center; max-width: 600px; margin: auto; }
        .btn-direct { display: inline-block; background: #10b981; color: white; padding: 15px 30px; border-radius: 50px; font-weight: bold; text-decoration: none; font-size: 1.2rem; margin-top: 20px; }
    </style>
</head>
<body>
    <header>
        <a href="/" class="btn-back">⬅️ VOLTAR AO PORTAL</a>
        <h2 style="font-size: 1.1rem; color: #f59e0b;">🎮 ${g.title}</h2>
        <a href="${g.directUrl}" target="_blank" rel="noopener" style="color: #38bdf8; font-size: 0.85rem; text-decoration: none; font-weight: bold;">
            🚀 Abrir Nova Aba
        </a>
    </header>
    
    <iframe class="game-frame" src="${g.embedUrl}" allowfullscreen></iframe>
</body>
</html>`;

  fs.writeFileSync(path.join(gameDir, 'index.html'), launcherContent, 'utf8');
}

console.log('✅ 7 Ariê Toy views and launcher HTML files created successfully!');
