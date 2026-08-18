const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../public/games/detetive-ortografia/index.html');
const content = fs.readFileSync(filePath, 'utf8');

console.log('File size:', content.length, 'bytes');
console.log('Contains STAGES:', content.includes('const STAGES = ['));
console.log('Contains Stage 1, 2, 3, 4:', content.includes('FASE 1') && content.includes('FASE 2') && content.includes('FASE 3') && content.includes('FASE 4'));
console.log('Contains Boss Fight Mechanic:', content.includes('startBossFight()') && content.includes('updateBossHpBar()'));
console.log('Contains Stage Clear Modal:', content.includes('advanceStage()') && content.includes('stageCleared()'));
