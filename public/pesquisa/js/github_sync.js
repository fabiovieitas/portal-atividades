/**
 * github_sync.js
 * Módulo de comunicação com o servidor e sincronização com GitHub para pesquisa.labkids.online.
 * Inclui cache e persistência local instantânea (localStorage) para que nenhuma edição/exclusão seja perdida no F5.
 */

const GitHubSync = {
  STORAGE_KEY: 'labkids_pesquisa_config',

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
   * Lê o arquivo config.json da persistência local (localStorage), API ou GitHub.
   */
  async carregarConfig() {
    // 1. Prioridade absoluta: configuração salva no localStorage pelo usuário
    const salvoLocal = localStorage.getItem(this.STORAGE_KEY);
    if (salvoLocal) {
      try {
        const parsed = JSON.parse(salvoLocal);
        if (parsed && Array.isArray(parsed.produtos)) {
          return parsed;
        }
      } catch (e) {}
    }

    // 2. Tenta carregar da API Express interna do site
    try {
      const apiRes = await fetch('/api/pesquisa/config?t=' + Date.now());
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && data.produtos && data.produtos.length > 0) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {}

    // 3. Tenta carregar do GitHub se configurado
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
          const parsed = JSON.parse(decoded);
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed));
          return parsed;
        }
      } catch (err) {}
    }

    // 4. Fallback arquivos estáticos
    try {
      const r1 = await fetch('/pesquisa/config.json?t=' + Date.now());
      if (r1.ok) {
        const data = await r1.json();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {}

    try {
      const r2 = await fetch('/config.json?t=' + Date.now());
      if (r2.ok) {
        const data = await r2.json();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {}

    return { produtos: [] };
  },

  /**
   * Salva o config.json no localStorage (anti-perda F5), na API do site e sincroniza no GitHub.
   */
  async salvarConfig(configObj) {
    // 1. Grava instantaneamente no localStorage (garante persistência ao dar F5)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configObj));

    // 2. Salva via API interna do site
    try {
      await fetch('/api/pesquisa/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configObj)
      });
    } catch (e) {}

    // 3. Sincroniza commit no GitHub se houver token
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
   * Lê o histórico de preços CSV com múltiplos fallbacks.
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
   * Dispara a execução imediata do robô (servidor local ou nuvem GitHub Actions).
   */
  async dispararExecucaoManual() {
    // 1. Tenta endpoint interno do servidor primeiro
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
    }
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Erro ${res.status} ao disparar robô no GitHub.`);
  }
};
