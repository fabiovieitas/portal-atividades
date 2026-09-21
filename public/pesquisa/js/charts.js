/**
 * charts.js
 * Módulo Avançado de Evolução e Gráficos Interativos.
 * Inclui:
 * - KPIs estatísticos (Menor Preço, Maior Preço, Economia/Variação %, Última Coleta)
 * - Gráfico em curva suave com gradiente neon e tooltips premium
 * - Tabela cronológica de registros (Timeline)
 */

let chartInstance = null;
let currentChartData = [];
let currentFilterPeriod = 'todos'; // '7d', '30d', 'todos'

function renderizarGraficoPrecos(nomeProduto, registros) {
  currentChartData = registros || [];
  atualizarKpisEvolucao(nomeProduto, currentChartData);
  atualizarTabelaHistorico(currentChartData);
  desenharGrafico(nomeProduto, filtrarRegistrosPorPeriodo(currentChartData, currentFilterPeriod));
}

function filtrarRegistrosPorPeriodo(registros, periodo) {
  if (!registros || registros.length === 0) return [];
  if (periodo === 'todos') return registros;

  const agora = new Date();
  const dias = periodo === '7d' ? 7 : 30;
  const limite = new Date(agora.getTime() - dias * 24 * 60 * 60 * 1000);

  const filtrados = registros.filter(r => new Date(r.data_hora) >= limite);
  return filtrados.length > 0 ? filtrados : registros; // fallback
}

function setPeriodoGrafico(periodo) {
  currentFilterPeriod = periodo;
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.period === periodo);
  });
  if (appState && appState.produtoSelecionado) {
    const registros = appState.historico.filter(h => 
      h.nome_produto.toLowerCase() === appState.produtoSelecionado.toLowerCase()
    );
    desenharGrafico(appState.produtoSelecionado, filtrarRegistrosPorPeriodo(registros, periodo));
  }
}

function atualizarKpisEvolucao(nomeProduto, registros) {
  const elMenor = document.getElementById('kpiMenorPreco');
  const elMaior = document.getElementById('kpiMaiorPreco');
  const elVariacao = document.getElementById('kpiVariacao');
  const elUltima = document.getElementById('kpiUltimaColeta');

  if (!elMenor || !registros || registros.length === 0) {
    if (elMenor) elMenor.textContent = 'R$ --,--';
    if (elMaior) elMaior.textContent = 'R$ --,--';
    if (elVariacao) elVariacao.innerHTML = '<span style="color:var(--text-muted)">Sem dados</span>';
    if (elUltima) elUltima.textContent = 'Aguardando verificação';
    return;
  }

  const ordenados = [...registros].sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));
  const precos = ordenados.map(r => r.preco);
  const menor = Math.min(...precos);
  const maior = Math.max(...precos);
  const primeiro = precos[0];
  const ultimo = precos[precos.length - 1];

  elMenor.textContent = `R$ ${menor.toFixed(2).replace('.', ',')}`;
  elMaior.textContent = `R$ ${maior.toFixed(2).replace('.', ',')}`;

  const diff = ultimo - primeiro;
  if (primeiro > 0 && Math.abs(diff) > 0.01) {
    const perc = ((diff / primeiro) * 100).toFixed(1);
    if (diff < 0) {
      elVariacao.innerHTML = `<span style="color:var(--accent-green); font-weight:700;">📉 Queda de ${Math.abs(perc)}%</span>`;
    } else {
      elVariacao.innerHTML = `<span style="color:var(--accent-rose); font-weight:700;">📈 Alta de ${perc}%</span>`;
    }
  } else {
    elVariacao.innerHTML = '<span style="color:var(--accent-cyan); font-weight:600;">⚖️ Preço Estável</span>';
  }

  const ultimaData = new Date(ordenados[ordenados.length - 1].data_hora);
  elUltima.textContent = ultimaData.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' +
                         ultimaData.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function atualizarTabelaHistorico(registros) {
  const tbody = document.getElementById('timelineTableBody');
  if (!tbody) return;

  if (!registros || registros.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">Nenhum histórico registrado ainda.</td></tr>';
    return;
  }

  const ordenados = [...registros].sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora)).slice(0, 8);
  const menorPreco = Math.min(...registros.map(r => r.preco));

  tbody.innerHTML = ordenados.map(item => {
    const d = new Date(item.data_hora);
    const dataStr = d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const isMenor = item.preco === menorPreco;
    const linkAfiliado = typeof AffiliateManager !== 'undefined' ? 
      AffiliateManager.converter(item.link_produto, item.plataforma) : item.link_produto;

    return `
      <tr>
        <td style="padding:10px 14px; font-size:13px; color:var(--text-secondary);">${dataStr}</td>
        <td style="padding:10px 14px; font-weight:700; color:${isMenor ? 'var(--accent-green)' : 'var(--text-primary)'};">
          R$ ${item.preco.toFixed(2).replace('.', ',')} ${isMenor ? '⭐ <span style="font-size:11px; background:rgba(16,185,129,0.15); padding:2px 6px; border-radius:4px;">Menor!</span>' : ''}
        </td>
        <td style="padding:10px 14px; font-size:12px;">
          <span class="platform-badge ${item.plataforma.includes('Shopee') ? 'shopee' : 'ml'}">${item.plataforma}</span>
        </td>
        <td style="padding:10px 14px; text-align:right;">
          <a href="${linkAfiliado}" target="_blank" rel="noopener noreferrer" class="btn-buy" style="padding:5px 10px; font-size:12px; display:inline-flex;">
            Ir à Oferta ↗
          </a>
        </td>
      </tr>
    `;
  }).join('');
}

function desenharGrafico(nomeProduto, registros) {
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  if (chartInstance) {
    try {
      chartInstance.destroy();
    } catch (e) {}
    chartInstance = null;
  }

  if (!registros || registros.length === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Nenhum dado histórico registrado para este produto ainda.', canvas.width / 2, 160);
    return;
  }

  const ordenados = [...registros].sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));

  const labels = ordenados.map(item => {
    const d = new Date(item.data_hora);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' +
           d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  });

  const precos = ordenados.map(item => item.preco);
  const menorPreco = Math.min(...precos);
  const maiorPreco = Math.max(...precos);

  const gradiente = ctx.createLinearGradient(0, 0, 0, 360);
  gradiente.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
  gradiente.addColorStop(0.6, 'rgba(59, 130, 246, 0.08)');
  gradiente.addColorStop(1, 'rgba(15, 23, 42, 0.0)');

  const pointBackgroundColors = precos.map(p => p === menorPreco ? '#10b981' : '#00f2fe');
  const pointBorderColors = precos.map(p => p === menorPreco ? '#ffffff' : '#0f172a');
  const pointRadii = precos.map(p => p === menorPreco ? 8 : 5);
  const pointHoverRadii = precos.map(p => p === menorPreco ? 11 : 7);

  if (typeof Chart === 'undefined') {
    console.warn('Chart.js ainda não carregado.');
    return;
  }

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Preço Verificado (R$)',
          data: precos,
          borderColor: '#00f2fe',
          borderWidth: 3,
          backgroundColor: gradiente,
          fill: true,
          tension: 0.35,
          pointBackgroundColor: pointBackgroundColors,
          pointBorderColor: pointBorderColors,
          pointBorderWidth: 2,
          pointRadius: pointRadii,
          pointHoverRadius: pointHoverRadii,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 12 },
            boxWidth: 12,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(0, 242, 254, 0.35)',
          borderWidth: 1,
          padding: 14,
          cornerRadius: 12,
          titleFont: { family: 'Outfit', size: 13, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 13 },
          callbacks: {
            label: function(context) {
              const valor = context.parsed.y;
              let txt = ` Preço: R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
              if (valor === menorPreco) {
                txt += ' ⭐ MENOR PREÇO HISTÓRICO!';
              } else if (maiorPreco > valor) {
                const econ = (((maiorPreco - valor) / maiorPreco) * 100).toFixed(0);
                txt += ` (${econ}% mais barato que o pico)`;
              }
              return txt;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: 'rgba(255, 255, 255, 0.04)',
            drawBorder: false,
          },
          ticks: {
            color: '#64748b',
            font: { family: 'Inter', size: 11 },
            maxRotation: 45,
            minRotation: 0,
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false,
          },
          ticks: {
            color: '#94a3b8',
            font: { family: 'Inter', size: 12 },
            callback: function(value) {
              return 'R$ ' + value.toFixed(0);
            }
          }
        }
      }
    }
  });
}

const ChartsModule = {
  renderizarGrafico: renderizarGraficoPrecos,
  setPeriodo: setPeriodoGrafico
};

window.ChartsModule = ChartsModule;
window.renderizarGraficoPrecos = renderizarGraficoPrecos;
