const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.js');
let dbCode = fs.readFileSync(dbPath, 'utf8');

// Replace Brincando com Ariê 1 icon URL
dbCode = dbCode.replace(
  /https:\/\/cdn-icons-png\.flaticon\.com\/512\/3081\/3081884\.png/g,
  'https://arietoy.com.br/assets_games/br/brincando-com-arie-1/screenshots/brincando-com-arie-1-01.jpg'
);

// Replace Tux Math icon URL
dbCode = dbCode.replace(
  /https:\/\/cdn-icons-png\.flaticon\.com\/512\/2165\/2165683\.png/g,
  'https://tuxmath.org/images/favicon.png'
);

// Replace Tinkercad icon URL
dbCode = dbCode.replace(
  /https:\/\/cdn-icons-png\.flaticon\.com\/512\/3067\/3067345\.png/g,
  'https://cdn-icons-png.flaticon.com/512/2853/2853173.png'
);

fs.writeFileSync(dbPath, dbCode, 'utf8');
console.log('✅ db.js synced with original icons!');
