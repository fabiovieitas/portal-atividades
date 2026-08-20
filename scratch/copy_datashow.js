const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'public', 'games', 'leitura-datashow');
const destDir = 'C:\\Users\\fabiovieitas\\.gemini\\antigravity-ide\\scratch\\sistema-leitura-datashow';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir);
for (const file of files) {
  const srcFile = path.join(srcDir, file);
  const destFile = path.join(destDir, file);
  fs.copyFileSync(srcFile, destFile);
  console.log(`Copied ${file} -> ${destFile}`);
}

console.log('Copy from public to .gemini scratch finished successfully!');
