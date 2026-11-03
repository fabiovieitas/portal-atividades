/**
 * ============================================================================
 * LAB KIDS GAMIFICATION ENGINE (SISTEMA DE ENGAJAMENTO & MONETIZAÇÃO)
 * ============================================================================
 * - Login Diário com Sequência de Chamas (Daily Streak 🔥) -> +50 XP
 * - Tempo Online Ativo no Laboratório (Foco nos Estudos ⏱️) -> +10 XP a cada 2 min
 * - Explorador Curioso (Navegar por matérias, jogos e notícias 🗺️) -> +5 a +15 XP
 * - Atividades e Desafios Concluídos 🏆 -> +30 a +100 XP
 * - Patentes / Níveis de Jogador ⭐ (Recruta -> Explorador -> Detetive -> Mestre -> Lenda)
 */

(function() {
  'use strict';

  const LEVELS = [
    { level: 1, minXP: 0, title: 'Recruta Digital 🥉', icon: '🥉' },
    { level: 2, minXP: 100, title: 'Explorador Curioso 🥈', icon: '🥈' },
    { level: 3, minXP: 250, title: 'Detetive das Ciências 🥇', icon: '🥇' },
    { level: 4, minXP: 500, title: 'Mestre dos Circuitos 💎', icon: '💎' },
    { level: 5, minXP: 1000, title: 'Lenda do Lab Kids 👑', icon: '👑' }
  ];

  function getStudent() {
    try {
      const raw = localStorage.getItem('lab_student_profile');
      return raw ? JSON.parse(raw) : null;
    } catch(e) {
      return null;
    }
  }

  function saveStudent(st) {
    if (!st) return;
    try {
      localStorage.setItem('lab_student_profile', JSON.stringify(st));
      // Dispara evento customizado para sincronizar UI
      window.dispatchEvent(new CustomEvent('lab_student_updated', { detail: st }));
    } catch(e) {}
  }

  function calculateLevel(xp) {
    let current = LEVELS[0];
    for (const lvl of LEVELS) {
      if (xp >= lvl.minXP) {
        current = lvl;
      }
    }
    return current;
  }

  // Mostra Toast Gamificado Flutuante (estilo Duolingo)
  function showGamificationToast(title, message, icon = '⭐', type = 'xp') {
    let container = document.getElementById('gamification-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'gamification-toast-container';
      container.style.cssText = 'position: fixed; bottom: 25px; right: 25px; z-index: 9999999; display: flex; flex-direction: column; gap: 10px; pointer-events: none; max-width: 380px; width: 90%;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isLevelUp = type === 'levelup';
    const bg = isLevelUp 
      ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
      : 'linear-gradient(135deg, #10b981, #059669)';

    toast.style.cssText = `
      background: ${bg};
      color: #ffffff;
      padding: 14px 18px;
      border-radius: 18px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.35);
      border: 2px solid rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: 'Outfit', 'Nunito', sans-serif;
      transform: translateY(50px) scale(0.9);
      opacity: 0;
      transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
      pointer-events: auto;
    `;

    toast.innerHTML = `
      <div style="font-size: 2.2rem; line-height: 1; flex-shrink: 0;">${icon}</div>
      <div style="flex: 1;">
        <div style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9;">${title}</div>
        <div style="font-size: 1.05rem; font-weight: 900; margin-top: 2px;">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    // Animação de entrada
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0) scale(1)';
      toast.style.opacity = '1';
    });

    // Animação de saída
    setTimeout(() => {
      toast.style.transform = 'translateY(-20px) scale(0.9)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 4500);
  }

  // Efeito de Confete Simples em Canvas para Level Up
  function launchLevelUpCelebration() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:fixed; inset:0; width:100vw; height:100vh; pointer-events:none; z-index:9999998;';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'];
    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravidade
        p.rotation += p.vr;
        p.opacity -= 0.012;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      frame++;
      if (frame < 90) {
        requestAnimationFrame(animate);
      } else {
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    }
    animate();
  }

  // Adiciona Pontos (XP) com detecção de Level Up
  function addXP(amount, reason = 'Conquista!') {
    let student = getStudent();
    if (!student) return;

    const prevXP = Number(student.points || 0);
    const prevLevel = calculateLevel(prevXP);
    const newXP = prevXP + amount;
    student.points = newXP;

    const newLevel = calculateLevel(newXP);
    const didLevelUp = newLevel.level > prevLevel.level;

    saveStudent(student);

    if (didLevelUp) {
      launchLevelUpCelebration();
      showGamificationToast(
        '🎉 SUBIU DE NÍVEL!',
        `Você agora é Nível ${newLevel.level}: ${newLevel.title}`,
        newLevel.icon,
        'levelup'
      );
    } else {
      showGamificationToast(reason, `+${amount} XP Conquistados!`, '⭐', 'xp');
    }

    // Tenta sincronizar com o backend se o aluno tiver ID no banco
    if (student.id && typeof student.id === 'number') {
      fetch(`/api/students/${student.id}/avatar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ points: newXP })
      }).catch(() => {});
    }
  }

  // 1. LOGIN DIÁRIO & SEQUÊNCIA DE DIAS (DAILY STREAK 🔥)
  function checkDailyStreak() {
    let student = getStudent();
    if (!student) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const lastLogin = student.last_login_date || '';

    if (lastLogin === todayStr) {
      // Já recebeu a recompensa de hoje
      return;
    }

    // Calcula se foi no dia seguinte (ontem)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let currentStreak = Number(student.daily_streak || 0);
    if (lastLogin === yesterdayStr) {
      currentStreak += 1;
    } else {
      currentStreak = 1; // Quebrou sequência ou primeiro dia
    }

    student.daily_streak = currentStreak;
    student.last_login_date = todayStr;
    student.points = Number(student.points || 0) + 50;
    saveStudent(student);

    setTimeout(() => {
      showGamificationToast(
        `🔥 SEQUÊNCIA DIÁRIA: DIA ${currentStreak}!`,
        `Parabéns por voltar hoje! Você ganhou +50 XP de bônus!`,
        '🔥',
        'xp'
      );
    }, 1500);
  }

  // 2. TEMPO ONLINE / FOCO NOS ESTUDOS ⏱️ (+10 XP a cada 2 min ativo)
  let lastActiveTimestamp = Date.now();
  let accumulatedActiveSeconds = 0;

  function registerHeartbeat() {
    lastActiveTimestamp = Date.now();
  }

  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'].forEach(evt => {
    window.addEventListener(evt, registerHeartbeat, { passive: true });
  });

  setInterval(() => {
    const student = getStudent();
    if (!student) return;

    const idleSeconds = (Date.now() - lastActiveTimestamp) / 1000;
    // Se o aluno interagiu nos últimos 30 segundos, conta como tempo ativo
    if (idleSeconds < 35) {
      accumulatedActiveSeconds += 10;
      if (accumulatedActiveSeconds >= 120) { // 2 minutos
        accumulatedActiveSeconds = 0;
        addXP(10, '⏱️ Tempo de Estudo no Lab');
        if (student && student.id) {
          fetch('/api/gamification/heartbeat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: student.id, minutes: 2 })
          }).catch(function(){});
        }
      }
    }
  }, 10000);

  // 3. EXPLORADOR DO LAB (Passear pelo site gera pontos)
  function checkPageExploration() {
    const student = getStudent();
    if (!student) return;

    const currentPath = window.location.pathname;
    let exploredPages = [];
    try {
      exploredPages = JSON.parse(sessionStorage.getItem('lab_explored_pages') || '[]');
    } catch(e) {}

    if (!exploredPages.includes(currentPath)) {
      exploredPages.push(currentPath);
      sessionStorage.setItem('lab_explored_pages', JSON.stringify(exploredPages));

      if (currentPath.startsWith('/atividades/') || currentPath.startsWith('/atividade/')) {
        addXP(5, '🗺️ Explorador de Desafios');
      } else if (currentPath === '/noticias') {
        addXP(15, '📰 Leitor Informado');
      } else if (currentPath === '/ranking') {
        addXP(10, '🏆 Olho no Placar');
      }
    }
  }

  // 4. ATUALIZAR BADGE DE XP NA BARRA SUPERIOR
  function updateNavbarBadge() {
    const student = getStudent();
    const badgeContainer = document.getElementById('navbar-student-badge');
    if (!badgeContainer) return;

    if (!student) {
      badgeContainer.style.display = 'none';
      return;
    }

    const xp = Number(student.points || 0);
    const streak = Number(student.daily_streak || 1);
    const levelObj = calculateLevel(xp);

    badgeContainer.style.display = 'inline-flex';
    badgeContainer.innerHTML = `
      <a href="/aluno" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.12); border:1.5px solid rgba(255,255,255,0.25); padding:4px 12px; border-radius:50px; color:#ffffff; font-size:0.85rem; font-weight:800; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.12)'">
        <span>🔥 ${streak}d</span>
        <span style="color:#fbbf24;">⭐ ${xp} XP</span>
        <span style="background:#2563eb; padding:2px 8px; border-radius:12px; font-size:0.75rem;">${levelObj.title.split(' ')[0]} ${levelObj.level}</span>
      </a>
    `;
  }

  // Inicialização ao carregar o DOM
  window.addEventListener('DOMContentLoaded', () => {
    checkDailyStreak();
    checkPageExploration();
    updateNavbarBadge();
  });

  window.addEventListener('lab_student_updated', () => {
    updateNavbarBadge();
  });

  // Exporta globalmente para uso nas atividades e jogos
  window.LabGamification = {
    addXP,
    getStudent,
    saveStudent,
    calculateLevel,
    showToast: showGamificationToast
  };

})();
