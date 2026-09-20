/**
 * github_sync.js
 * Módulo de comunicação com o servidor e sincronização com GitHub para pesquisa.labkids.online.
 */

const GitHubSync = {
  getRepo() {
    return localStorage.getItem('gh_repo') || 'fabiovieitas/portal-atividades';
  },

  setRepo(repo) {
    localStorage.setItem('gh_repo', repo.trim());
  },

  getToken() {
    return localStorage.getItem('gh_token') || '';
  },

  setToken(token) {
    localStorage.setItem('gh_token', token.trim());
  },

  lastConfigSha: null,

  /**
   * Lê o arquivo config.json da API do site ou fallback para GitHub / estático.
   */
  async carregarConfig() {
    // 1. Tenta carregar da API Express interna do site
    try {
      const apiRes = await fetch('/api/pesquisa/config?t=' + Date.now());
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && data.produtos) return data;
      }
    } catch (e) {}

    // 2. Tenta carregar do GitHub se configurado
    const repo = this.getRepo();
    const token = this.getToken();
    if (repo && token) {
      try {
        const headers = { 'Accept': 'application/vnd.github.v3+json', 'Authorization': `token ${token}` };
        const res = await fetch(`https://api.github.com/repos/${repo}/contents/pesquisa_bot/config.json`, { headers });
        if (res.ok) {
          const data = await res.json();
          this.lastConfigSha = data.sha;
          const decoded = decodeURIComponent(escape(atob(data.content.replace(/\s/g, ''))));
          return JSON.parse(decoded);
        }
      } catch (err) {}
    }

    // 3. Fallback estático
    try {
      const r1 = await fetch('/pesquisa/config.json?t=' + Date.now());
      if (r1.ok) return await r1.json();
    } catch (e) {}
    try {
      const r2 = await fetch('/config.json?t=' + Date.now());
      if (r2.ok) return await r2.json();
    } catch (e) {}

    return { produtos: [] };
  },

  /**
   * Salva o config.json atualizado na API do site e sincroniza no GitHub.
   */
  async salvarConfig(configObj) {
    let salvoNoServidor = false;

    // 1. Salva via API interna do site
    try {
      const res = await fetch('/api/pesquisa/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configObj)
      });
      if (res.ok) salvoNoServidor = true;
    } catch (e) {}

    // 2. Sincroniza commit no GitHub se houver token
    const repo = this.getRepo();
    const token = this.getToken();

    if (repo && token) {
      try {
        if (!this.lastConfigSha) {
          const checkRes = await fetch(`https://api.github.com/repos/${repo}/contents/pesquisa_bot/config.json`, {
            headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
          });
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            this.lastConfigSha = checkData.sha;
          }
        }

        const contentStr = JSON.stringify(configObj, null, 2);
        const contentBase64 = btoa(unescape(encodeURIComponent(contentStr)));

        await fetch(`https://api.github.com/repos/${repo}/contents/pesquisa_bot/config.json`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
          },
          body: JSON.stringify({
            message: 'Painel Web: Atualização de produtos [skip ci]',
            content: contentBase64,
            sha: this.lastConfigSha
          })
        });
      } catch (ghErr) {
        console.warn('Não foi possível sincronizar com o GitHub:', ghErr);
      }
    }

    return { sucesso: true };
  },

  /**
   * Lê o histórico de preços CSV.
   */
  async carregarHistoricoCsv() {
    let csvText = '';

    // 1. Tenta API interna do site
    try {
      const res = await fetch('/api/pesquisa/historico?t=' + Date.now());
      if (res.ok) csvText = await res.text();
    } catch (e) {}

    // 2. Fallback arquivo estático
    if (!csvText || csvText.length < 10) {
      try {
        const localRes = await fetch('/pesquisa/historico_precos.csv?t=' + Date.now());
        if (localRes.ok) csvText = await localRes.text();
      } catch (e) {}
    }
    if (!csvText || csvText.length < 10) {
      try {
        const rootRes = await fetch('/historico_precos.csv?t=' + Date.now());
        if (rootRes.ok) csvText = await rootRes.text();
      } catch (e) {}
    }

    if (!csvText) return [];
    return this.parseCsv(csvText);
  },

  parseCsv(texto) {
    const linhas = texto.trim().split(/\r?\n/);
    if (linhas.length <= 1) return [];

    const resultados = [];
    for (let i = 1; i < linhas.length; i++) {
      const linha = linhas[i].trim();
      if (!linha) continue;

      const colunas = linha.split(',');
      if (colunas.length >= 3) {
        resultados.push({
          data_hora: colunas[0]?.trim() || '',
          nome_produto: colunas[1]?.trim() || '',
          preco: parseFloat(colunas[2]?.trim() || '0'),
          link_produto: colunas[3]?.trim() || '',
          plataforma: colunas[4]?.trim() || 'Desconhecida'
        });
      }
    }

    return resultados;
  },

  /**
   * Dispara a execução imediata do robô no GitHub Actions.
   */
  async dispararExecucaoManual() {
    // 1. Tenta acionar endpoint interno do servidor primeiro
    try {
      const serverRes = await fetch('/api/pesquisa/verificar', { method: 'POST' });
      if (serverRes.ok) {
        const data = await serverRes.json();
        if (data.sucesso) return true;
      }
    } catch (e) {}

    // 2. Disparo direto no GitHub Actions via token do usuário
    const repo = this.getRepo();
    const token = this.getToken();

    if (!repo || !token) {
      throw new Error('Configure o seu GitHub Token na aba "Conexão" para disparar o robô na nuvem.');
    }

    const res = await fetch(`https://api.github.com/repos/${repo}/actions/workflows/agendador_precos.yml/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        ref: 'main',
        inputs: { forcar_execucao: true }
      })
    });

    if (res.status === 204 || res.ok) {
      return true;
    } else {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Erro ao acionar workflow (HTTP ${res.status})`);
    }
  }
};
