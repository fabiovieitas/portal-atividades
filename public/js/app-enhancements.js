/**
 * App Enhancements JS - Portal de Atividades Lab
 * Tema Kids Padrão, Avatares, Navegação Fluida e Pré-carregamento para Tablets
 */

document.addEventListener('DOMContentLoaded', () => {
  // Força o tema Kids como padrão exclusivo do portal
  document.documentElement.setAttribute('data-theme', 'kids');
  
  initDiceBearAvatarPicker();
  initTabNavigation();
  initTabletPreloader();
});

/* ----------------------------------------------------
 * SELETOR DE AVATAR DICEBEAR PARA ALUNOS
 * ---------------------------------------------------- */
function initDiceBearAvatarPicker() {
  const avatarPickerContainer = document.getElementById('dicebear-avatar-picker');
  if (!avatarPickerContainer) return;

  const styles = [
    { id: 'bottts', name: 'Robôs 🤖' },
    { id: 'funEmoji', name: 'Emojis Divertidos 🤪' },
    { id: 'adventurer', name: 'Aventureiros 🧙‍♂️' },
    { id: 'pixelArt', name: 'Pixel Art 👾' }
  ];

  let currentStyle = localStorage.getItem('student_avatar_style') || 'bottts';
  let currentSeed = localStorage.getItem('student_avatar_seed') || 'aluno_' + Math.floor(Math.random() * 1000);

  function renderPicker() {
    avatarPickerContainer.innerHTML = `
      <div class="avatar-picker-card">
        <div class="avatar-preview">
          <img id="avatar-img-preview" src="/api/avatar?seed=${encodeURIComponent(currentSeed)}&style=${currentStyle}" alt="Seu Avatar">
        </div>
        <div class="avatar-controls">
          <label class="avatar-picker-label">Selecione seu Estilo de Avatar:</label>
          <div class="avatar-style-btns">
            ${styles.map(s => `
              <button type="button" class="avatar-style-btn ${s.id === currentStyle ? 'active' : ''}" data-style="${s.id}">
                ${s.name}
              </button>
            `).join('')}
          </div>
          <button type="button" id="randomize-avatar-btn" class="btn btn-secondary btn-sm style-random-btn">
            🎲 Sorteie um Novo Personagem
          </button>
        </div>
      </div>
    `;

    document.querySelectorAll('.avatar-style-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentStyle = e.target.getAttribute('data-style');
        localStorage.setItem('student_avatar_style', currentStyle);
        updateAvatarPreview();
        renderPicker();
      });
    });

    const randBtn = document.getElementById('randomize-avatar-btn');
    if (randBtn) {
      randBtn.addEventListener('click', () => {
        currentSeed = 'aluno_' + Math.floor(Math.random() * 100000);
        localStorage.setItem('student_avatar_seed', currentSeed);
        updateAvatarPicker();
      });
    }
  }

  function updateAvatarPicker() {
    const preview = document.getElementById('avatar-img-preview');
    if (preview) {
      preview.src = `/api/avatar?seed=${encodeURIComponent(currentSeed)}&style=${currentStyle}&t=${Date.now()}`;
    }
  }

  renderPicker();
}

/* ----------------------------------------------------
 * NAVEGAÇÃO RÁPIDA POR ABAS (SPA Feeling)
 * ---------------------------------------------------- */
function initTabNavigation() {
  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = btn.getAttribute('data-tab');
      
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content-panel').forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const targetPanel = document.getElementById(tabId);
      if (targetPanel) {
        targetPanel.style.display = 'block';
        targetPanel.classList.add('fade-in-panel');
      }
    });
  });
}

/* ----------------------------------------------------
 * PRÉ-CARREGAMENTO SILENCIOSO DE JOGOS PARA TABLETS
 * ---------------------------------------------------- */
function initTabletPreloader() {
  if (!('caches' in window) || !('serviceWorker' in navigator)) return;

  const schedulePreload = window.requestIdleCallback || function(cb) { setTimeout(cb, 3000); };

  schedulePreload(async () => {
    try {
      const cache = await caches.open('portal-lab-v5-pou');
      const isAlreadyCached = await cache.match('/games/pou-online/pou.min.js');
      if (isAlreadyCached) return; // Já está no tablet

      const res = await fetch('/games/pou-online/assets-manifest.json');
      if (!res.ok) return;

      const assets = await res.json();
      // Pré-baixa em lotes de 6 arquivos por vez para não sobrecarregar a rede escolar
      for (let i = 0; i < assets.length; i += 6) {
        const batch = assets.slice(i, i + 6);
        await Promise.all(batch.map(async (url) => {
          try {
            const has = await cache.match(url);
            if (!has) {
              const resp = await fetch(url);
              if (resp.ok) await cache.put(url, resp);
            }
          } catch(e) {}
        }));
      }
      console.log('[Tablet Preloader] Pou Online pré-carregado em cache com sucesso!');
    } catch(err) {
      console.log('[Tablet Preloader] Erro silencioso:', err);
    }
  });
}
