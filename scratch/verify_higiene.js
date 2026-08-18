const fs = require('fs');
const path = require('path');

const hPath = path.join(__dirname, '../public/games/habitos-de-higiene/index.html');
const content = fs.readFileSync(hPath, 'utf8');

console.log('File size:', content.length, 'bytes');
console.log('Contains Leaderboard / Ranking:', content.includes('RANKING DOS CAMPEÕES') && content.includes('leaderboard'));
console.log('Contains Canvas 60FPS physics:', content.includes('FloatingGerm') && content.includes('animateCanvas'));
console.log('Contains Scrubbing & Brushing Mini-Games:', content.includes('scrub-hand-container') && content.includes('teeth-container'));
