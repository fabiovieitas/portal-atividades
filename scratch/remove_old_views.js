const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, '../views');
const files = ['desafio_adicao_presentation.ejs', 'material_dourado_presentation.ejs'];

files.forEach(f => {
  const p = path.join(viewsDir, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`Deleted view file: ${p}`);
  }
});
