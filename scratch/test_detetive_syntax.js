const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/games/detetive-ortografia/index.html');
const content = fs.readFileSync(filePath, 'utf8');

console.log('File size:', content.length, 'bytes');
console.log('Contains DICTIONARY:', content.includes('const DICTIONARY = ['));
console.log('Contains Canvas:', content.includes('<canvas id="bg-canvas"></canvas>'));
console.log('Contains Powerups:', content.includes('useFreeze()') && content.includes('useLupa()'));
console.log('Contains Sound Fx:', content.includes('function playFx('));
