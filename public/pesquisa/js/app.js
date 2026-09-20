/**
 * app.js
 * Orquestrador principal da interface Web do LabKids Preços (pesquisa.labkids.online).
 */

let appState = {
  config: { produtos: [] },
  historico: [],
  produtoSelecionado: null,
  editandoIndice: -1
};

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
  configurarEventosUI();
  carregarCredenciaisSalvas();
  await recarregarDados();
});

function carregarCredenciaisSalvas() {
  const repoInput = document.getElementById('ghRepoInput');
  const tokenInput = document.getElementById('ghTokenInput');
  if (repoInput) repoInput.value = GitHubSync.getRepo();
  if (tokenInput) tokenInput.value = GitHubSync.getToken();
}

async function recarregarDados() {
  mostrarToast('Sincronizando dados...', 'info');
  try {
    appState.config = await GitHubSync.carregarConfig();
    appState.historico = await GitHubSync.carregarHistoricoCsv();

    atualizarKPIs();
    renderizarTabelaProdutos();
    popularSeletorGrafico();
    renderizarVisualizacaoGrafico();

    mostrarToast('Dados carregados com sucesso!', 'success');
  } catch (err) {
    console.error(err);
    mostrarToast('Erro ao carregar dados: ' + err.message, 'error');
  }
}

function atualizarKPIs() {
  const produtos = appState.config.produtos || [];
  const ativos = produtos.filter(p => p.ativo).length;

  document.getElementById('kpiTotalProdutos').textContent = produtos.length;
  document.getElementById('kpiProdutosAtivos').textContent = `${ativos} / ${produtos.length}`;

  // Menor preço geral monitorado
  if (appState.historico.length > 0) {
    const menorGeral = Math.min(...appState.historico.map(h => h.preco));
    document.getElementById('kpiMenorPreco').textContent = `R$ ${menorGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    // Último timestamp
    const ultimos = [...appState.historico].sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
    if (ultimos[0]) {
      const d = new Date(ultimos[0].data_hora);
      document.getElementById('kpiUltimaExecucao').textContent = d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
  } else {
    document.getElementById('kpiMenorPreco').textContent = 'R$ 0,00';
    document.getElementById('kpiUltimaExecucao').textContent = 'Nenhuma ainda';
  }
}

function popularSeletorGrafico() {
  const select = document.getElementById('selectProdutoGrafico');
  if (!select) return;

  const produtos = appState.config.produtos || [];
  select.innerHTML = '';

  if (produtos.length === 0) {
    select.innerHTML = '<option value="">Nenhum produto cadastrado</option>';
    return;
  }

  produtos.forEach((p, idx) => {
    const opt = document.createElement('option');
    opt.value = p.nome_produto;
    opt.textContent = p.nome_produto;
    select.appendChild(opt);
  });

  if (!appState.produtoSelecionado && produtos.length > 0) {
    appState.produtoSelecionado = produtos[0].nome_produto;
  }
  select.value = appState.produtoSelecionado || '';
}

function renderizarVisualizacaoGrafico() {
  const select = document.getElementById('selectProdutoGrafico');
  const nome = select ? select.value : appState.produtoSelecionado;
  appState.produtoSelecionado = nome;

  if (!nome) return;

  // Filtra histórico do produto
  const dados = appState.historico.filter(h => h.nome_produto === nome);

  // Renderiza gráfico
  renderizarGraficoPrecos(nome, dados);

  // Renderiza tabela de histórico do produto
  const tbody = document.getElementById('tbodyHistoricoProduto');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (dados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">Nenhum histórico registrado ainda para este produto.</td></tr>`;
    return;
  }

  const ordenados = [...dados].sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
  const menorPreco = Math.min(...dados.map(d => d.preco));

  ordenados.forEach(item => {
    const tr = document.createElement('tr');
    const d = new Date(item.data_hora);
    const ehRecorde = item.preco === menorPreco;

    tr.innerHTML = `
      <td>${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
      <td><span class="badge ${item.plataforma.includes('Mercado') ? 'badge-ml' : 'badge-shopee'}">${item.plataforma}</span></td>
      <td>
        <strong style="color: ${ehRecorde ? 'var(--accent-green)' : 'var(--text-primary)'}">
          R$ ${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </strong>
        ${ehRecorde ? '<span class="badge badge-active" style="margin-left: 8px;">⭐ Menor Preço</span>' : ''}
      </td>
      <td>
        <a href="${item.link_produto}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
          🛒 Ver Oferta
        </a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderizarTabelaProdutos() {
  const tbody = document.getElementById('tbodyGerenciarProdutos');
  if (!tbody) return;

  const produtos = appState.config.produtos || [];
  tbody.innerHTML = '';

  if (produtos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted);">Nenhum produto cadastrado. Clique em "+ Novo Produto".</td></tr>`;
    return;
  }

  const hoje = new Date().toISOString().split('T')[0];

  produtos.forEach((prod, index) => {
    const tr = document.createElement('tr');
    const isML = prod.url_pesquisa.toLowerCase().includes('mercadolivre');
    const isShopee = prod.url_pesquisa.toLowerCase().includes('shopee');
    const expirado = prod.data_limite && hoje > prod.data_limite;

    let badgeStatus = '<span class="badge badge-active">Ativo</span>';
    if (expirado) {
      badgeStatus = '<span class="badge badge-expired">Expirado</span>';
    } else if (!prod.ativo) {
      badgeStatus = '<span class="badge badge-paused">Pausado</span>';
    }

    const badgePlataforma = isML 
      ? '<span class="badge badge-ml">🟡 Mercado Livre</span>' 
      : isShopee 
      ? '<span class="badge badge-shopee">🟠 Shopee</span>' 
      : '<span class="badge badge-paused">Outro</span>';

    tr.innerHTML = `
      <td>
        <strong>${prod.nome_produto}</strong><br/>
        <a href="${prod.url_pesquisa}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-cyan); font-size: 12px; text-decoration: none;">
          🔗 Abrir Pesquisa Filtrada
        </a>
      </td>
      <td>${badgePlataforma}</td>
      <td>A cada ${prod.frequencia_horas}h</td>
      <td>${prod.data_limite || 'Sem limite'}</td>
      <td>
        <label class="switch">
          <input type="checkbox" ${prod.ativo && !expirado ? 'checked' : ''} onchange="toggleProdutoAtivo(${index}, this.checked)">
          <span class="slider"></span>
        </label>
        <span style="margin-left: 8px;">${badgeStatus}</span>
      </td>
      <td>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-secondary btn-sm" onclick="abrirModalEditar(${index})">✏️ Editar</button>
          <button class="btn btn-danger btn-sm" onclick="excluirProduto(${index})">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Ações nos Produtos
async function toggleProdutoAtivo(index, novoStatus) {
  appState.config.produtos[index].ativo = novoStatus;
  await salvarAlteracoesConfig('Status do produto alterado');
  renderizarTabelaProdutos();
  atualizarKPIs();
}

function abrirModalNovo() {
  appState.editandoIndice = -1;
  document.getElementById('modalTitle').textContent = 'Cadastrar Novo Produto';
  document.getElementById('inputNome').value = '';
  document.getElementById('inputUrl').value = '';
  document.getElementById('inputFrequencia').value = '4';
  document.getElementById('inputDataLimite').value = '2026-12-31';
  document.getElementById('inputAtivo').checked = true;
  document.getElementById('produtoModal').classList.add('active');
}

function abrirModalEditar(index) {
  appState.editandoIndice = index;
  const prod = appState.config.produtos[index];
  document.getElementById('modalTitle').textContent = 'Editar Produto';
  document.getElementById('inputNome').value = prod.nome_produto;
  document.getElementById('inputUrl').value = prod.url_pesquisa;
  document.getElementById('inputFrequencia').value = prod.frequencia_horas;
  document.getElementById('inputDataLimite').value = prod.data_limite;
  document.getElementById('inputAtivo').checked = prod.ativo;
  document.getElementById('produtoModal').classList.add('active');
}

function fecharModal() {
  document.getElementById('produtoModal').classList.remove('active');
}

async function salvarProdutoModal(e) {
  e.preventDefault();
  const nome = document.getElementById('inputNome').value.trim();
  const url = document.getElementById('inputUrl').value.trim();
  const frequencia = parseInt(document.getElementById('inputFrequencia').value) || 4;
  const dataLimite = document.getElementById('inputDataLimite').value;
  const ativo = document.getElementById('inputAtivo').checked;

  if (!nome || !url) {
    mostrarToast('Preencha o nome e a URL da pesquisa.', 'error');
    return;
  }

  const novoProduto = {
    nome_produto: nome,
    url_pesquisa: url,
    frequencia_horas: frequencia,
    data_limite: dataLimite,
    ativo: ativo
  };

  if (appState.editandoIndice >= 0) {
    appState.config.produtos[appState.editandoIndice] = novoProduto;
  } else {
    appState.config.produtos.push(novoProduto);
  }

  fecharModal();
  await salvarAlteracoesConfig(appState.editandoIndice >= 0 ? 'Produto atualizado' : 'Novo produto adicionado');
  renderizarTabelaProdutos();
  popularSeletorGrafico();
  atualizarKPIs();
}

async function excluirProduto(index) {
  const nome = appState.config.produtos[index].nome_produto;
  if (!confirm(`Tem certeza que deseja excluir o monitoramento de "${nome}"?`)) return;

  appState.config.produtos.splice(index, 1);
  await salvarAlteracoesConfig('Produto removido');
  renderizarTabelaProdutos();
  popularSeletorGrafico();
  renderizarVisualizacaoGrafico();
  atualizarKPIs();
}

async function salvarAlteracoesConfig(mensagemSucesso) {
  mostrarToast('Salvando alterações...', 'info');
  try {
    const res = await GitHubSync.salvarConfig(appState.config);
    if (res.aviso) {
      mostrarToast(res.aviso, 'info');
    } else {
      mostrarToast(mensagemSucesso + ' e persistido no GitHub!', 'success');
    }
  } catch (err) {
    console.error(err);
    mostrarToast('Erro ao salvar no GitHub: ' + err.message, 'error');
  }
}

// Disparo Manual do GitHub Actions
async function dispararVarredura() {
    const btn = document.getElementById('btnDisparar');
    btn.disabled = true;
    btn.innerHTML = '⏳ Disparando...';

    try {
      await GitHubSync.dispararExecucaoManual();
      mostrarToast('Robô iniciado com sucesso! Coletando preços nos marketplaces...', 'success');

      let contador = 0;
      const polling = setInterval(async () => {
        contador++;
        try {
          const dados = await GitHubSync.carregarHistoricoCsv();
          if (dados && dados.length > historicoGeral.length) {
            clearInterval(polling);
            historicoGeral = dados;
            renderizarCardsProdutos(produtosConfig, historicoGeral);
            if (produtoAtivo) selecionarProduto(produtoAtivo);
            mostrarToast('Novos preços sincronizados e atualizados no gráfico!', 'success');
          }
        } catch (e) {}
        if (contador >= 12) clearInterval(polling);
      }, 5000);
    } catch (err) {
      mostrarToast(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '⚡ Verificar Preços Agora';
    }
  }

// Configuração UI e Eventos
function configurarEventosUI() {
  // Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active');
    });
  });

  // Seletor de Gráfico
  const selectGrafico = document.getElementById('selectProdutoGrafico');
  if (selectGrafico) {
    selectGrafico.addEventListener('change', renderizarVisualizacaoGrafico);
  }

  // Formulário Modal
  const formModal = document.getElementById('formProdutoModal');
  if (formModal) {
    formModal.addEventListener('submit', salvarProdutoModal);
  }

  // Salvar Credenciais GitHub
  const formGh = document.getElementById('formGithubConfig');
  if (formGh) {
    formGh.addEventListener('submit', (e) => {
      e.preventDefault();
      const repo = document.getElementById('ghRepoInput').value;
      const token = document.getElementById('ghTokenInput').value;
      GitHubSync.setRepo(repo);
      GitHubSync.setToken(token);
      mostrarToast('Credenciais do GitHub salvas com sucesso!', 'success');
      recarregarDados();
    });
  }
}

function mostrarToast(mensagem, tipo = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.innerHTML = `
    <span>${tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : 'ℹ️'}</span>
    <span>${mensagem}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
