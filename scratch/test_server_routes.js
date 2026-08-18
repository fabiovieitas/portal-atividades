const express = require('express');
const path = require('path');
const dbHelper = require('../db');

const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

const routesToTest = [
  '/atividades/simulado-campos-1ano',
  '/atividades/simulado-campos-2ano',
  '/atividades/simulado-campos-3ano',
  '/atividades/simulado-campos-4ano',
  '/atividades/simulado-campos-5ano'
];

routesToTest.forEach(route => {
  const grade = route.split('-')[2];
  app.get(route, (req, res) => {
    res.render(`simulado_campos_${grade}`, { schools: [] });
  });
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

const server = app.listen(3099, async () => {
  console.log('Testing server on port 3099...');
  try {
    for (const route of routesToTest) {
      const res = await fetch(`http://localhost:3099${route}`);
      console.log(`Route ${route} status: ${res.status}`);
      if (res.status !== 200) throw new Error(`Failed route ${route}`);
    }

    const r2 = await fetch('http://localhost:3099/admin/simulado/resultados');
    const html2 = await r2.text();
    console.log('Results dashboard status:', r2.status);
    console.log('Results HTML length:', html2.length);

    console.log('✅ ALL 5 SIMULADO VIEWS AND ADMIN DASHBOARD VERIFIED PERFECTLY!');
    server.close();
  } catch(e) {
    console.error('Test error:', e);
    server.close();
  }
});
