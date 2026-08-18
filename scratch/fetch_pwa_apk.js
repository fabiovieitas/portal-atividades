const fs = require('fs');
const path = require('path');
const https = require('https');

const downloadsDir = path.join(__dirname, '../public/downloads');
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true });
}

console.log('Criando diretório public/downloads...');
