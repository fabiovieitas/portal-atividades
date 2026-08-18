const fs = require('fs');
const path = require('path');

const files = [
  'public/games/chapeuzinho-enigma/index.html',
  'public/games/capitao-alberto-farao/index.html',
  'public/games/arie-colorir/index.html',
  'public/games/tabuada-chao-e-lava/index.html',
  'public/games/caca-palavras-temas/index.html',
  'views/chapeuzinho_enigma_presentation.ejs',
  'views/capitao_alberto_presentation.ejs',
  'views/arie_colorir_presentation.ejs',
  'views/tabuada_lava_presentation.ejs',
  'views/caca_palavras_presentation.ejs'
];

files.forEach(f => {
  const full = path.join(__dirname, '..', f);
  console.log(f, '--> Exists:', fs.existsSync(full));
});
