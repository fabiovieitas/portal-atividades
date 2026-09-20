/**
 * charts.js
 * Módulo de renderização de gráficos interativos com Chart.js para o LabKids Preços.
 */

let chartInstance = null;

/**
 * Renderiza ou atualiza o gráfico de linha histórico do produto selecionado.
 * @param {string} nomeProduto Nome do produto
 * @param {Array} registros Lista de objetos { data_hora, preco, link, plataforma }
 */
function renderizarGraficoPrecos(nomeProduto, registros) {
  const canvas = document.getElementById('priceChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Destrói gráfico anterior se já existir
  if (chartInstance) {
    chartInstance.destroy();
  }

  if (!registros || registros.length === 0) {
    // Exibe mensagem de vazio
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Nenhum dado histórico registrado para este produto.', canvas.width / 2, 180);
    return;
  }

  // Ordena cronologicamente
  const ordenados = [...registros].sort((a, b) => new Date(a.data_hora) - new Date(b.data_hora));

  const labels = ordenados.map(item => {
    const d = new Date(item.data_hora);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' +
           d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  });

  const precos = ordenados.map(item => item.preco);
  const menorPreco = Math.min(...precos);

  // Gradiente de preenchimento abaixo da linha
  const gradiente = ctx.createLinearGradient(0, 0, 0, 360);
  gradiente.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
  gradiente.addColorStop(0.7, 'rgba(59, 130, 246, 0.08)');
  gradiente.addColorStop(1, 'rgba(15, 23, 42, 0.0)');

  // Configuração dos pontos: destaca o menor preço de todos
  const pointBackgroundColors = precos.map(p => p === menorPreco ? '#10b981' : '#00f2fe');
  const pointBorderColors = precos.map(p => p === menorPreco ? '#ffffff' : '#0f172a');
  const pointRadii = precos.map(p => p === menorPreco ? 8 : 5);
  const pointHoverRadii = precos.map(p => p === menorPreco ? 11 : 7);

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Menor Preço (R$)',
          data: precos,
          borderColor: '#00f2fe',
          borderWidth: 2.8,
          backgroundColor: gradiente,
          fill: true,
          tension: 0.3,
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
          borderColor: 'rgba(0, 242, 254, 0.3)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 10,
          titleFont: { family: 'Outfit', size: 13, weight: 'bold' },
          bodyFont: { family: 'Inter', size: 13 },
          callbacks: {
            label: function(context) {
              const valor = context.parsed.y;
              let txt = ` Preço: R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
              if (valor === menorPreco) {
                txt += ' ⭐ (Menor Histórico!)';
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
