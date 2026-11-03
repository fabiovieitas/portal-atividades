/**
 * ============================================================================
 * PORTAL LAB KIDS - SDK UNIVERSAL DE GAMIFICAÇÃO & PONTUAÇÃO PEDAGÓGICA
 * ============================================================================
 * Usado por TODOS os jogos autorais e pelo verificador de missões externas.
 * - Pontua XP no Perfil do Aluno (LocalStorage + API Turso Cloud)
 * - Carimba a Mochila de Conquistas BNCC (Matemática, Português, Ciências, Foco)
 * - Exibe celebração visual com confetes e áudio sintetizado
 * - Identifica automaticamente o aluno logado sem necessidade de redigitar nome
 */

(function (window) {
  'use strict';

  // 1. Áudio Sintetizado de Celebração (Web Audio API - Sem arquivos externos)
  function playRewardChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Acorde Maior de Vitória)
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + (idx * 0.1));
        gain.gain.setValueAtTime(0.01, ctx.currentTime + (idx * 0.1));
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + (idx * 0.1) + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (idx * 0.1) + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + (idx * 0.1));
        osc.stop(ctx.currentTime + (idx * 0.1) + 0.4);
      });
    } catch (e) {
      // AudioContext indisponível ou bloqueado
    }
  }

  // 2. Confetes de Celebração na Tela
  function spawnConfettiParticles() {
    const container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:99999999;overflow:hidden;';
    const colors = ['#fbbf24', '#38bdf8', '#34d399', '#f43f5e', '#a855f7', '#f59e0b'];
    
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.floor(Math.random() * 8) + 8;
      const left = Math.random() * 100;
      const animDur = (Math.random() * 1.5 + 1.2).toFixed(2);
      const delay = (Math.random() * 0.4).toFixed(2);
      
      p.style.cssText = `
        position: absolute;
        top: -20px;
        left: ${left}%;
        width: ${size}px;
        height: ${size * 1.2}px;
        background: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
        opacity: 0.95;
        transform: rotate(${Math.random() * 360}deg);
        animation: labConfettiFall ${animDur}s ease-out ${delay}s forwards;
      `;
      container.appendChild(p);
    }

    if (!document.getElementById('lab-confetti-style')) {
      const style = document.createElement('style');
      style.id = 'lab-confetti-style';
      style.textContent = `
        @keyframes labConfettiFall {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg) scale(0.6); opacity: 0; }
        }
        @keyframes labBannerPop {
          0% { transform: translate(-50%, -60px) scale(0.8); opacity: 0; }
          60% { transform: translate(-50%, 15px) scale(1.05); opacity: 1; }
          100% { transform: translate(-50%, 0) scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(container);
    setTimeout(() => container.remove(), 3200);
  }

  // 3. Exibir Card de Celebração Flutuante
  function showRewardToast(earnedXP, message, subject) {
    playRewardChime();
    spawnConfettiParticles();

    const existing = document.getElementById('labkids-reward-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'labkids-reward-banner';
    banner.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999999;
      background: linear-gradient(135deg, #1e293b, #0f172a);
      border: 2.5px solid #fbbf24;
      border-radius: 20px;
      padding: 14px 22px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(251, 191, 36, 0.3);
      color: #ffffff;
      font-family: 'Fredoka', system-ui, sans-serif;
      display: flex;
      align-items: center;
      gap: 15px;
      max-width: 90vw;
      width: 440px;
      box-sizing: border-box;
      animation: labBannerPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    `;

    banner.innerHTML = `
      <div style="width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b, #d97706); border: 2.5px solid #ffffff; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; flex-shrink: 0; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.5);">
        🏆
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
          <span style="font-size: 0.75rem; background: #10b981; color: #ffffff; padding: 2px 8px; border-radius: 50px; font-weight: 800; text-transform: uppercase;">
            +${earnedXP} XP CONQUISTADO!
          </span>
          <span style="font-size: 0.72rem; color: #94a3b8; font-weight: 700;">🎒 Mochila BNCC</span>
        </div>
        <div style="font-size: 0.95rem; font-weight: 800; color: #f8fafc; line-height: 1.3;">
          ${message || 'Atividade Concluída no Lab Kids!'}
        </div>
      </div>
      <button onclick="this.parentElement.remove()" style="background: none; border: none; color: #94a3b8; font-size: 1.4rem; cursor: pointer; padding: 4px; line-height: 1;" title="Fechar">
        &times;
      </button>
    `;

    document.body.appendChild(banner);
    setTimeout(() => {
      if (banner && banner.parentElement) {
        banner.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        banner.style.opacity = '0';
        banner.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => banner.remove(), 450);
      }
    }, 4500);
  }

  // 4. Engine Principal de Gamificação
  const LabKidsGamification = {
    // Retorna o perfil do aluno atualmente ativo no dispositivo
    getStudent: function () {
      try {
        const raw = localStorage.getItem('lab_student_profile');
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    },

    // Registra a conclusão de uma atividade autoral ou externa
    recordCompletion: function (params = {}) {
      const {
        activityId = 0,
        slug = '',
        title = 'Atividade Lab Kids',
        subject = 'Geral',
        score = 10,
        maxScore = 100,
        accuracy = 100
      } = params;

      // Cálculo de XP equilibrado (Mínimo 15 XP, Máximo 100 XP por atividade)
      let earnedXP = 20;
      if (score > 0) {
        if (score <= 100) {
          earnedXP = Math.max(15, Math.min(100, Math.round(score)));
        } else {
          // Normaliza pontuações grandes (ex: 1200 pontos no Detetive -> 80 XP)
          earnedXP = Math.max(20, Math.min(100, Math.round(score / 15)));
        }
      }

      // 1. Atualizar Mochila de Carimbos BNCC (lab_completed_activities)
      try {
        const completed = JSON.parse(localStorage.getItem('lab_completed_activities') || '[]');
        completed.push({
          id: activityId || slug || 'custom',
          slug: slug,
          title: title,
          subject: subject,
          score: score,
          earned_xp: earnedXP,
          completed_at: new Date().toISOString()
        });
        if (completed.length > 80) completed.shift();
        localStorage.setItem('lab_completed_activities', JSON.stringify(completed));
      } catch (e) {
        console.warn('[Gamification] Erro ao salvar carimbo na mochila:', e);
      }

      // 2. Atualizar Perfil do Aluno Local e Servidor
      const student = this.getStudent();
      if (student) {
        student.points = (Number(student.points) || 0) + earnedXP;
        localStorage.setItem('lab_student_profile', JSON.stringify(student));

        // Enviar para o banco de dados oficial do Turso Cloud se o aluno tiver ID
        if (student.id) {
          fetch(`/api/students/${student.id}/activity-complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              activity_id: activityId || 0,
              score: earnedXP
            })
          }).catch(err => console.warn('[Gamification] Falha na sincronização online:', err));
        }
      }

      // 3. Exibir celebração
      showRewardToast(earnedXP, `Parabéns! Carimbo de <strong>${subject}</strong> adicionado à sua Mochila!`, subject);

      // 4. Disparar evento para qualquer script do jogo ouvir
      window.dispatchEvent(new CustomEvent('labkids:activity-completed', {
        detail: { activityId, slug, title, subject, score, earnedXP, student }
      }));

      return { success: true, earnedXP, student };
    },

    // Notificação visual direta
    showToast: showRewardToast,
    playChime: playRewardChime,
    confetti: spawnConfettiParticles
  };

  window.LabKidsGamification = LabKidsGamification;

})(window);
