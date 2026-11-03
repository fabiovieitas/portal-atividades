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
  initCookieConsentBanner();
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
      const cache = await caches.open('portal-lab-v10-pou');
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

/* ----------------------------------------------------
 * BANNER DE CONSENTIMENTO DE COOKIES (LGPD / GOOGLE ADSENSE)
 * ---------------------------------------------------- */
function initCookieConsentBanner() {
  if (localStorage.getItem('labkids_cookie_consent') === 'accepted') return;

  const banner = document.createElement('div');
  banner.id = 'labkids-cookie-banner';
  banner.innerHTML = `
    <div style="position: fixed; bottom: 0; left: 0; right: 0; background: rgba(15, 23, 42, 0.98); border-top: 2px solid #38bdf8; box-shadow: 0 -10px 30px rgba(0,0,0,0.5); z-index: 9999999; padding: 16px 20px; font-family: 'Fredoka', 'Outfit', system-ui, sans-serif; backdrop-filter: blur(12px);">
      <div style="max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 280px; color: #f8fafc; font-size: 0.95rem; line-height: 1.5;">
          🍪 <strong>Privacidade & Cookies:</strong> Utilizamos cookies essenciais e tecnologias de medição para otimizar sua navegação, personalizar conteúdos pedagógicos e exibir anúncios qualificados do Google de acordo com a LGPD. Ao continuar navegando, você concorda com nossa <a href="/privacidade" style="color: #38bdf8; text-decoration: underline; font-weight: 700;">Política de Privacidade</a> e <a href="/cookies" style="color: #38bdf8; text-decoration: underline; font-weight: 700;">Política de Cookies</a>.
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <a href="/cookies" style="color: #cbd5e1; font-size: 0.88rem; text-decoration: none; padding: 10px 16px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.2);">Preferências</a>
          <button id="btn-accept-cookies" type="button" style="background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 10px 24px; border-radius: 50px; font-weight: 800; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); font-family: inherit;">
            ✓ Concordar e Continuar
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('btn-accept-cookies').addEventListener('click', () => {
    localStorage.setItem('labkids_cookie_consent', 'accepted');
    banner.remove();
  });
}
