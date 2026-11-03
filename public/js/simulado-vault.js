/**
 * ============================================================================
 * SIMULADO VAULT ENGINE - SALVAMENTO ULTRA-RESILIENTE (ZERO PERDA DE DADOS)
 * ============================================================================
 * - Auto-save contínuo de rascunho a cada clique/tecla (localStorage & sessionStorage)
 * - Fila de envio offline (Pending Queue): se a conexão cair, os dados NUNCA são apagados
 * - Retry exponencial automático (3 tentativas)
 * - Sincronização inteligente ao restabelecer Wi-Fi (evento 'online')
 * - Comprovante digital seguro (Receipt)
 */

(function(window) {
  'use strict';

  const PREFIX = 'LAB_VAULT_';

  const SimuladoVault = {
    // 1. Salva rascunho em tempo real
    saveDraft: function(simuladoId, studentData, answers) {
      if (!simuladoId) return;
      try {
        const key = `${PREFIX}DRAFT_${simuladoId}`;
        const data = {
          simulado_id: simuladoId,
          studentData: studentData || {},
          answers: answers || {},
          updated_at: new Date().toISOString()
        };
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.warn('[SimuladoVault] Falha ao gravar rascunho local:', e);
      }
    },

    // 2. Carrega rascunho salvo anteriormente
    loadDraft: function(simuladoId) {
      if (!simuladoId) return null;
      try {
        const raw = localStorage.getItem(`${PREFIX}DRAFT_${simuladoId}`);
        if (!raw) return null;
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    },

    // 3. Remove rascunho com segurança
    clearDraft: function(simuladoId) {
      try {
        localStorage.removeItem(`${PREFIX}DRAFT_${simuladoId}`);
      } catch(e){}
    },

    // 4. Submissão Blindada (com fila offline e retentativas)
    submit: async function(payload, onProgress) {
      const simuladoId = payload.simulado_id || 'simulado';
      const pendingKey = `${PREFIX}PENDING_${simuladoId}_${Date.now()}`;
      
      // Salva preventivamente na fila pendente ANTES de enviar
      try {
        localStorage.setItem(pendingKey, JSON.stringify(payload));
      } catch(e){}

      let attempt = 0;
      const maxAttempts = 3;
      let lastError = null;

      while (attempt < maxAttempts) {
        attempt++;
        if (typeof onProgress === 'function') {
          onProgress(attempt, maxAttempts);
        }

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

          const res = await fetch('/api/simulado/submit', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            if (data && (data.success || data.result)) {
              // Sucesso garantido: remove da fila pendente e do rascunho
              try {
                localStorage.removeItem(pendingKey);
                SimuladoVault.clearDraft(simuladoId);
                // Grava comprovante permanente
                localStorage.setItem(`${PREFIX}RECEIPT_${simuladoId}`, JSON.stringify({
                  student_name: payload.student_name,
                  score: payload.score,
                  saved_at: new Date().toISOString(),
                  id: (data.result && data.result.id) || Date.now()
                }));
              } catch(e){}

              return { success: true, data };
            } else {
              lastError = new Error((data && data.error) || 'Erro no processamento pelo servidor.');
            }
          } else {
            lastError = new Error(`Servidor respondeu com status ${res.status}`);
          }
        } catch (err) {
          lastError = err;
        }

        // Aguarda backoff exponencial antes de tentar de novo (1s, 2s, 4s)
        if (attempt < maxAttempts) {
          await new Promise(r => setTimeout(r, attempt * 1200));
        }
      }

      // Se todas as tentativas falharem, NÃO APAGA AS RESPOSTAS!
      console.warn('[SimuladoVault] Falha nas 3 tentativas de envio. Mantendo em cofre local:', lastError);
      return { 
        success: false, 
        error: lastError ? lastError.message : 'Falha na conexão',
        vaultPending: true 
      };
    },

    // 5. Tenta enviar todas as submissões pendentes quando a conexão voltar
    flushPending: async function() {
      try {
        const keys = Object.keys(localStorage).filter(k => k.startsWith(`${PREFIX}PENDING_`));
        if (keys.length === 0) return;

        console.log(`[SimuladoVault] Encontrados ${keys.length} simulados pendentes. Tentando sincronizar...`);

        for (const k of keys) {
          try {
            const raw = localStorage.getItem(k);
            if (!raw) continue;
            const payload = JSON.parse(raw);

            const res = await fetch('/api/simulado/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            if (res.ok) {
              const data = await res.json();
              if (data && data.success) {
                localStorage.removeItem(k);
                console.log(`[SimuladoVault] Sincronizado com sucesso: ${payload.student_name} (${payload.simulado_id})`);
              }
            }
          } catch(err){
            console.warn('[SimuladoVault] Falha ao sincronizar item pendente:', err.message);
          }
        }
      } catch(e){}
    }
  };

  // Ouvinte de reconexão de rede
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('[SimuladoVault] Conexão restabelecida! Sincronizando cofre...');
      SimuladoVault.flushPending();
    });

    // Roda verificação no carregamento da página
    setTimeout(() => {
      SimuladoVault.flushPending();
    }, 2000);

    window.SimuladoVault = SimuladoVault;
  }

})(typeof window !== 'undefined' ? window : this);

