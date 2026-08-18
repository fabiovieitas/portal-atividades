const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/games/detetive-ortografia/index.html');
const content = fs.readFileSync(filePath, 'utf8');

console.log('File size:', content.length, 'bytes');
console.log('Leaderboard System:', content.includes('saveLeaderboard(') && content.includes('renderLeaderboards()'));
console.log('2 Min Timer & Time Bonus/Penalty:', content.includes('timeSeconds += 4') && content.includes('timeSeconds = Math.max(0, timeSeconds - 5)'));
console.log('Pause Button:', content.includes('function pauseGame()') && content.includes('resumeGame()'));
console.log('Zero Ambiguity Words Check:', content.includes('CACHO[ ? ]O') && content.includes('GALI[ ? ]A') && content.includes('GIRA[ ? ]OL'));
