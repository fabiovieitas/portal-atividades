const fs = require('fs');
const path = require('path');

const gamesDir = path.join(__dirname, '../public/games');

const toRemove = [
  'desafio-adicao',
  'material-dourado',
  'detetive-ortografia',
  'fabrica-de-silabas'
];

toRemove.forEach(dirName => {
  const fullPath = path.join(gamesDir, dirName);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`Deleted folder: ${fullPath}`);
  } else {
    console.log(`Folder already gone: ${fullPath}`);
  }
});
