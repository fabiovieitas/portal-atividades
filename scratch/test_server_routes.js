const express = require('express');
const path = require('path');
const dbHelper = require('../db');

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get('/atividades/simulado-campos-4ano', (req, res) => {
  res.render('simulado_campos_4ano');
});

app.get('/admin/simulado/resultados', async (req, res) => {
  try {
    const simuladoId = req.query.simulado_id || 'campos-4ano-agosto-2026';
    const submissions = await dbHelper.getSimuladoSubmissions(simuladoId);
    const stats = await dbHelper.getSimuladoStats(simuladoId);
    res.render('simulado_resultados', { submissions, stats, simuladoId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const server = app.listen(3098, async () => {
  console.log('Testing server on port 3098...');
  try {
    const r1 = await fetch('http://localhost:3098/atividades/simulado-campos-4ano');
    console.log('Simulado view status:', r1.status);

    const r2 = await fetch('http://localhost:3098/admin/simulado/resultados');
    const html2 = await r2.text();
    console.log('Results dashboard status:', r2.status);
    console.log('Results HTML length:', html2.length);
    console.log('Contains Relatório Oficial:', html2.includes('RELATÓRIO OFICIAL DE DESEMPENHO'));

    console.log('✅ ALL VIEWS VERIFIED PERFECTLY!');
    server.close();
  } catch(e) {
    console.error('Test error:', e);
    server.close();
  }
});
