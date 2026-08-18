const http = require('http');
const express = require('express');
const app = require('../server');

const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(`Test server running on port ${port}`);

  const routes = [
    '/atividades/chapeuzinho-enigma',
    '/atividades/capitao-alberto-farao',
    '/atividades/arie-colorir',
    '/atividades/tabuada-chao-e-lava',
    '/atividades/caca-palavras-temas',
    '/games/chapeuzinho-enigma/index.html',
    '/games/capitao-alberto-farao/index.html',
    '/games/arie-colorir/index.html',
    '/games/tabuada-chao-e-lava/index.html',
    '/games/caca-palavras-temas/index.html'
  ];

  for (const r of routes) {
    await new Promise((res) => {
      http.get(`http://localhost:${port}${r}`, (response) => {
        console.log(r, '--> Status:', response.statusCode);
        res();
      });
    });
  }

  server.close();
  process.exit(0);
});
