const fs = require('fs');
const path = require('path');

const hPath = path.join(__dirname, '../public/games/habitos-de-higiene/index.html');
const mPath = path.join(__dirname, '../public/games/material-dourado/index.html');

const hContent = fs.readFileSync(hPath, 'utf8');
const mContent = fs.readFileSync(mPath, 'utf8');

console.log('Habitos de higiene size:', hContent.length, 'bytes');
console.log('Habitos contains Bosses & Stages:', hContent.includes('FASE 1') && hContent.includes('Monstro da Sujeira') && hContent.includes('AudioContext'));

console.log('\nMaterial Dourado size:', mContent.length, 'bytes');
console.log('Material Dourado contains 3D Placa, Barra, Cubo & Modes:', mContent.includes('placa-100') && mContent.includes('MODO DESAFIO') && mContent.includes('autoGroup()'));
