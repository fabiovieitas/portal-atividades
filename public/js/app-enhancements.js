/**
 * App Enhancements JS - Portal de Atividades Lab
 * Recursos: Busca Instantânea (Ctrl+K), Temas (Dark/Kids), DiceBear Avatar, Navegação Fluida
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initCommandPalette();
  initDiceBearAvatarPicker();
  initTabNavigation();
});

/* ----------------------------------------------------
 * 1. ALTERNADOR DE TEMAS (Light / Dark / Kids)
 * ---------------------------------------------------- */
function initThemeSwitcher() {
  const savedTheme = localStorage.getItem('portal_theme') || 'light';
  applyTheme(savedTheme);

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      let next = 'light';
      if (current === 'light') next = 'dark';
      else if (current === 'dark') next = 'kids';
      else next = 'light';

      applyTheme(next);
      localStorage.setItem('portal_theme', next);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    const icons = { light: '☀️ Claro', dark: '🌙 Escuro', kids: '🎨 Kids' };
    themeToggleBtn.innerHTML = `<span>${icons[theme] || '☀️ Claro'}</span>`;
  }
}

/* ----------------------------------------------------
 * 2. BUSCA INSTANTÂNEA E COMMAND PALETTE (Ctrl + K)
 * ---------------------------------------------------- */
function initCommandPalette() {
  if (!document.getElementById('cmd-palette-overlay')) {
    const paletteHTML = `
      <div id="cmd-palette-overlay" class="cmd-palette-overlay" style="display: none;">
        <div class="cmd-palette-modal">
          <div class="cmd-palette-header">
            <span class="search-icon">🔍</span>
            <input type="text" id="cmd-search-input" placeholder="Buscar jogos, simulados, matérias ou código BNCC... (Esc para fechar)" autocomplete="off">
            <span class="cmd-shortcut-badge">ESC</span>
          </div>
          <div id="cmd-results-container" class="cmd-results-container">
            <div class="cmd-empty-state">Digite algo para iniciar a busca...</div>
          </div>
          <div class="cmd-palette-footer">
            <span>Dica: Use <strong>Ctrl + K</strong> para abrir em qualquer página</span>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', paletteHTML);
  }

  const overlay = document.getElementById('cmd-palette-overlay');
  const searchInput = document.getElementById('cmd-search-input');
  const resultsContainer = document.getElementById('cmd-results-container');

  function openPalette() {
    overlay.style.display = 'flex';
    setTimeout(() => searchInput.focus(), 50);
  }

  function closePalette() {
    overlay.style.display = 'none';
    searchInput.value = '';
    resultsContainer.innerHTML = '<div class="cmd-empty-state">Digite algo para iniciar a busca...</div>';
  }

  // Atalho Global Ctrl + K / Cmd + K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (overlay.style.display === 'none' || !overlay.style.display) {
        openPalette();
      } else {
        closePalette();
      }
    }
    if (e.key === 'Escape' && overlay.style.display === 'flex') {
      closePalette();
    }
  });

  document.querySelectorAll('.open-cmd-palette-btn, #search-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPalette();
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePalette();
  });

  let debounceTimeout = null;
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(debounceTimeout);

    if (!query) {
      resultsContainer.innerHTML = '<div class="cmd-empty-state">Digite algo para iniciar a busca...</div>';
      return;
    }

    resultsContainer.innerHTML = '<div class="cmd-loading-state">Carregando resultados...</div>';

    debounceTimeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
          resultsContainer.innerHTML = `<div class="cmd-empty-state">Nenhum resultado encontrado para "<strong>${escapeHTML(query)}</strong>"</div>`;
          return;
        }

        resultsContainer.innerHTML = data.results.map(item => `
          <a href="${item.external_url || '/activity/' + item.id}" class="cmd-result-item" ${item.external_url ? 'target="_blank"' : ''}>
            <div class="cmd-result-icon">🎮</div>
            <div class="cmd-result-info">
              <div class="cmd-result-title">${escapeHTML(item.title)}</div>
              <div class="cmd-result-meta">
                <span class="badge-cat">${escapeHTML(item.category || 'Atividade')}</span>
                ${item.subject ? `<span class="badge-sub">${escapeHTML(item.subject)}</span>` : ''}
                ${item.target_years ? `<span class="badge-year">${escapeHTML(item.target_years)}</span>` : ''}
              </div>
            </div>
            <div class="cmd-result-arrow">➔</div>
          </a>
        `).join('');
      } catch (err) {
        resultsContainer.innerHTML = '<div class="cmd-error-state">Erro ao buscar resultados.</div>';
      }
    }, 250);
  });
}

/* ----------------------------------------------------
 * 3. SELETOR DE AVATAR DICEBEAR PARA ALUNOS
 * ---------------------------------------------------- */
function initDiceBearAvatarPicker() {
  const avatarPickerContainer = document.getElementById('dicebear-avatar-picker');
  if (!avatarPickerContainer) return;

  const styles = [
    { id: 'bottts', name: 'Robôs' },
    { id: 'funEmoji', name: 'Emojis Divertidos' },
    { id: 'adventurer', name: 'Aventureiros' }
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
        updateAvatarPreview();
      });
    }
  }

  function updateAvatarPreview() {
    const preview = document.getElementById('avatar-img-preview');
    if (preview) {
      preview.src = `/api/avatar?seed=${encodeURIComponent(currentSeed)}&style=${currentStyle}&t=${Date.now()}`;
    }
  }

  renderPicker();
}

/* ----------------------------------------------------
 * 4. NAVEGAÇÃO RÁPIDA POR ABAS (SPA Feeling)
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

function escapeHTML(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
