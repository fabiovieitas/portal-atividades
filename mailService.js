require('dotenv').config();
const { Resend } = require('resend');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Default sender address: Use onboarding@resend.dev for test mode or verified domain (ex: contato@labkids.online)
const DEFAULT_FROM = process.env.EMAIL_FROM || 'Portal Lab Kids <onboarding@resend.dev>';
const BASE_URL = process.env.BASE_URL || 'https://labkids.online';

/**
 * Common Header for Portal Lab Kids Emails
 */
function buildEmailHeader({ preheader = '', bannerTag = 'PORTAL LAB KIDS • EDUCAÇÃO & BNCC', headline = 'Portal Lab Kids', subheadline = 'Jogos Educativos, Brincadeiras & Desafios BNCC' }) {
  return `
  <!-- Preheader text (invisível na tela, visível na prévia da caixa de entrada) -->
  <div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    ${preheader} &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <!-- Header Banner -->
  <tr>
    <td style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%); padding: 36px 28px 30px 28px; text-align: center; border-bottom: 3px solid #38bdf8;">
      
      <!-- Top Tag Badge -->
      <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px auto;">
        <tr>
          <td style="background: rgba(56, 189, 248, 0.15); border: 1px solid #38bdf8; border-radius: 50px; padding: 5px 16px; text-align: center;">
            <span style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px;">
              ⚡ ${bannerTag}
            </span>
          </td>
        </tr>
      </table>

      <!-- Mascot Robot Icon -->
      <div style="margin-bottom: 14px;">
        <img src="https://labkids.online/img/robot-icon-512.png" alt="Mascote Robô Lab Kids" width="68" height="68" style="display: inline-block; width: 68px; height: 68px; border-radius: 18px; border: 2.5px solid #38bdf8; background: #0f172a; box-shadow: 0 8px 24px rgba(56, 189, 248, 0.35); vertical-align: middle;" />
      </div>

      <!-- Brand Title -->
      <h1 style="margin: 0 0 6px 0; color: #ffffff; font-family: 'Fredoka', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 27px; font-weight: 700; letter-spacing: -0.3px;">
        ${headline}
      </h1>

      <p style="margin: 0; color: #cbd5e1; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500;">
        ${subheadline}
      </p>

      <!-- Quick Nav Links -->
      <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 18px auto 0 auto;">
        <tr>
          <td style="padding: 0 8px;">
            <a href="${BASE_URL}/" target="_blank" style="font-family: 'Outfit', sans-serif; font-size: 12px; color: #94a3b8; text-decoration: none; font-weight: 600;">🏠 Início</a>
          </td>
          <td style="color: #475569; font-size: 11px;">•</td>
          <td style="padding: 0 8px;">
            <a href="${BASE_URL}/#atividades" target="_blank" style="font-family: 'Outfit', sans-serif; font-size: 12px; color: #94a3b8; text-decoration: none; font-weight: 600;">🎮 Jogos BNCC</a>
          </td>
          <td style="color: #475569; font-size: 11px;">•</td>
          <td style="padding: 0 8px;">
            <a href="${BASE_URL}/noticias" target="_blank" style="font-family: 'Outfit', sans-serif; font-size: 12px; color: #94a3b8; text-decoration: none; font-weight: 600;">📰 Blog</a>
          </td>
          <td style="color: #475569; font-size: 11px;">•</td>
          <td style="padding: 0 8px;">
            <a href="${BASE_URL}/professor/login" target="_blank" style="font-family: 'Outfit', sans-serif; font-size: 12px; color: #38bdf8; text-decoration: none; font-weight: 700;">🧑‍🏫 Área do Professor</a>
          </td>
        </tr>
      </table>

    </td>
  </tr>
  `;
}

/**
 * Common Footer for Portal Lab Kids Emails
 */
function buildEmailFooter() {
  return `
  <!-- Color Accent Strip -->
  <tr>
    <td style="height: 4px; background: linear-gradient(90deg, #38bdf8 0%, #6366f1 33%, #f59e0b 66%, #10b981 100%); line-height: 4px; font-size: 4px;">&nbsp;</td>
  </tr>

  <!-- Institutional Footer -->
  <tr>
    <td style="background-color: #0f172a; padding: 30px 25px; text-align: center; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;">
      
      <div style="margin-bottom: 12px;">
        <span style="font-family: 'Fredoka', sans-serif; font-size: 18px; font-weight: 700; color: #ffffff;">
          🤖 Portal Lab Kids
        </span>
        <span style="display: inline-block; background: #38bdf8; color: #0f172a; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 20px; margin-left: 6px; vertical-align: middle;">
          1º AO 5º ANO
        </span>
      </div>

      <p style="margin: 0 0 10px 0; font-size: 13px; color: #94a3b8; line-height: 1.6;">
        Tecnologia educacional, gamificação e recursos digitais para escolas e educadores.<br>
        Idealizado e desenvolvido com dedicação pelo <strong>Prof. Fábio Vieitas Marques</strong>.
      </p>

      <p style="margin: 0 0 16px 0; font-size: 12px; color: #64748b;">
        📍 Campos dos Goytacazes - RJ • <a href="mailto:contato@labkids.online" style="color: #38bdf8; text-decoration: none;">contato@labkids.online</a>
      </p>

      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 14px; margin-top: 14px;">
        <p style="margin: 0; font-size: 11px; color: #64748b; line-height: 1.5;">
          Você está recebendo este e-mail oficial porque iniciou um cadastro ou possui conta de educador no Portal Lab Kids.<br>
          Seus dados estão protegidos conforme a Lei Geral de Proteção de Dados (LGPD).
        </p>
      </div>

    </td>
  </tr>
  `;
}

/**
 * Generates the responsive HTML email template for teacher activation
 */
function buildActivationEmailHtml({ name, code, token, email }) {
  const activationUrl = `${BASE_URL}/professor/ativar?token=${token}&email=${encodeURIComponent(email)}`;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ative sua Conta de Professor — Portal Lab Kids</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">

  <!-- Outer background container -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #0b1120; padding: 35px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.25);">
          
          <!-- Unified Header -->
          ${buildEmailHeader({
            preheader: `Seu código de ativação do Portal Lab Kids é ${code}. Complete seu cadastro de professor agora!`,
            bannerTag: 'ÁREA DO PROFESSOR • ATIVAÇÃO',
            headline: 'Portal Lab Kids',
            subheadline: 'Inovação Pedagógica & Gamificação para suas Aulas'
          })}

          <!-- Body Content -->
          <tr>
            <td style="padding: 38px 32px 32px 32px; background: #ffffff;">
              
              <!-- Greeting Tag -->
              <div style="display: inline-block; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 50px; padding: 4px 14px; margin-bottom: 14px;">
                <span style="font-size: 12px; font-weight: 700; color: #047857; text-transform: uppercase; letter-spacing: 0.5px;">
                  ✨ Bem-vindo(a) à Rede de Educadores
                </span>
              </div>

              <!-- Main Greeting -->
              <h2 style="margin: 0 0 14px 0; color: #0f172a; font-family: 'Fredoka', 'Outfit', sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3;">
                Olá, Professor(a) ${name}! 👋
              </h2>

              <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 1.65; color: #475569;">
                Ficamos muito felizes com a sua chegada ao <strong>Portal Lab Kids</strong>! Você acaba de desbloquear uma plataforma completa de jogos interativos, brincadeiras pedagógicas e atividades alinhadas à <strong>BNCC do 1º ao 5º Ano</strong>.
              </p>

              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.65; color: #475569;">
                Para confirmar a titularidade do seu e-mail e garantir a segurança das suas turmas (LGPD), use o código de verificação abaixo:
              </p>

              <!-- OTP Code Display Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%); border: 2px dashed #0284c7; border-radius: 18px; padding: 26px 20px; text-align: center;">
                    <span style="display: block; font-size: 12px; font-weight: 800; color: #0284c7; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px;">
                      🔑 SEU CÓDIGO DE ATIVAÇÃO
                    </span>
                    <div style="font-family: 'Fredoka', 'Courier New', monospace; font-size: 42px; font-weight: 700; letter-spacing: 10px; color: #0f172a; margin: 4px 0 10px 0; text-shadow: 0 2px 8px rgba(2, 132, 199, 0.15);">
                      ${code}
                    </div>
                    <span style="display: inline-block; background: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 50px;">
                      ⏱️ Válido por 24 horas
                    </span>
                  </td>
                </tr>
              </table>

              <!-- 1-Click Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 32px 0;">
                <tr>
                  <td align="center">
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; font-weight: 500;">
                      Prefere rapidez? Clique no botão abaixo para ativar na hora:
                    </p>
                    <a href="${activationUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-family: 'Fredoka', 'Outfit', sans-serif; font-weight: 600; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35); border: 1px solid rgba(255, 255, 255, 0.2);">
                      🚀 Ativar Minha Conta de Educador
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Highlights: What the Teacher gets -->
              <div style="background: #f8fafc; border-radius: 16px; padding: 22px 20px; border: 1px solid #e2e8f0; margin-bottom: 26px;">
                <h4 style="margin: 0 0 14px 0; font-size: 14px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.6px;">
                  🌟 O que você pode fazer na sua Área do Professor:
                </h4>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="32" valign="top" style="font-size: 20px; padding-bottom: 10px;">🎮</td>
                    <td style="font-size: 14px; color: #475569; padding-bottom: 10px; line-height: 1.5;">
                      <strong>Jogos & Desafios BNCC:</strong> Mais de 20 games interativos de matemática, leitura e lógica.
                    </td>
                  </tr>
                  <tr>
                    <td width="32" valign="top" style="font-size: 20px; padding-bottom: 10px;">📺</td>
                    <td style="font-size: 14px; color: #475569; padding-bottom: 10px; line-height: 1.5;">
                      <strong>Modo Datashow:</strong> Atividades de leitura coletiva e dinâmicas preparadas para projeção na TV ou telão.
                    </td>
                  </tr>
                  <tr>
                    <td width="32" valign="top" style="font-size: 20px;">📱</td>
                    <td style="font-size: 14px; color: #475569; line-height: 1.5;">
                      <strong>QR Codes Exclusivos:</strong> Gere links rápidos com QR Code para os alunos jogarem no celular, tablet ou laboratório.
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Pedagogical Tip Box with Prof. Fabio -->
              <div style="background: #fefce8; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="42" valign="middle">
                      <img src="https://labkids.online/img/logo-prof.png" alt="Prof. Fábio" width="38" height="38" style="display: block; border-radius: 50%; border: 1.5px solid #f59e0b;" onerror="this.style.display='none'" />
                    </td>
                    <td style="padding-left: 12px;">
                      <p style="margin: 0 0 3px 0; font-size: 12px; font-weight: 800; color: #92400e; text-transform: uppercase;">
                        💡 Dica do Prof. Fábio:
                      </p>
                      <p style="margin: 0; font-size: 13px; color: #78350f; line-height: 1.5;">
                        Após ativar sua conta, acerte o planejamento da semana experimentando a atividade <em>"Leitura no Datashow"</em> ou o clássico <em>"Tux Math"</em> com a sua turma!
                      </p>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center;">
                Caso não tenha solicitado este cadastro, fique tranquilo: nenhuma conta será criada sem a validação deste código.
              </p>

            </td>
          </tr>

          <!-- Unified Footer -->
          ${buildEmailFooter()}

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

/**
 * Dispatches teacher activation email via Resend (or logs to console if no API key is provided)
 */
async function sendTeacherActivationEmail({ name, email, code, token }) {
  const html = buildActivationEmailHtml({ name, code, token, email });
  const subject = `🚀 Ative sua conta de Professor(a) — Código: ${code} • Portal Lab Kids`;

  if (!resend) {
    console.log('\n======================================================');
    console.log('📬 [Resend - Modo Simulado (sem RESEND_API_KEY no .env)]');
    console.log(`Para: ${name} <${email}>`);
    console.log(`Assunto: ${subject}`);
    console.log(`Código de Ativação: ${code}`);
    console.log(`Link Direto: ${BASE_URL}/professor/ativar?token=${token}&email=${encodeURIComponent(email)}`);
    console.log('======================================================\n');
    return { success: true, simulated: true, code, token };
  }

  try {
    const res = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [email],
      subject: subject,
      html: html
    });

    if (res && res.error) {
      console.warn(`[Resend Warning] Tentativa com '${DEFAULT_FROM}' retornou erro:`, res.error.message);
      // Fallback para onboarding se necessário
      if (DEFAULT_FROM !== 'Portal Lab Kids <onboarding@resend.dev>') {
        try {
          const fallbackRes = await resend.emails.send({
            from: 'Portal Lab Kids <onboarding@resend.dev>',
            to: [email],
            subject: subject,
            html: html
          });
          if (!fallbackRes.error) {
            console.log(`✅ [Resend] E-mail enviado com sucesso via fallback para ${email}! ID:`, fallbackRes.data?.id);
            return { success: true, data: fallbackRes.data };
          }
        } catch (fErr) {
          console.error('❌ [Resend Fallback Error]:', fErr.message);
        }
      }
      return { success: false, error: res.error.message };
    }

    console.log(`✅ [Resend] E-mail de ativação enviado com sucesso para ${email}! ID:`, res.data?.id || res);
    return { success: true, data: res.data };
  } catch (error) {
    console.error('❌ [Resend Error] Falha ao enviar e-mail de ativação:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Generates the responsive HTML email template for new activity / game launch
 */
function buildNewActivityEmailHtml({ teacherName, activity }) {
  const activityUrl = `${BASE_URL}/qr/${activity.id}`;
  const iconUrl = activity.icon_url && activity.icon_url.startsWith('http') 
    ? activity.icon_url 
    : (activity.icon_url ? `${BASE_URL}${activity.icon_url.startsWith('/') ? '' : '/'}${activity.icon_url}` : 'https://labkids.online/img/robot-icon-512.png');

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎮 Novo Jogo Liberado — Portal Lab Kids</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">

  <!-- Outer background container -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #0b1120; padding: 35px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.25);">
          
          <!-- Unified Header -->
          ${buildEmailHeader({
            preheader: `Novo jogo pedagógico liberado: ${activity.title}! Alinhado à BNCC para enriquecer suas aulas.`,
            bannerTag: 'NOVIDADE PEDAGÓGICA • LANÇAMENTO',
            headline: 'Novo Jogo Liberado! 🚀',
            subheadline: 'Mais uma atividade interativa pronta para a sua turma'
          })}

          <!-- Body Content -->
          <tr>
            <td style="padding: 38px 32px 32px 32px; background: #ffffff;">

              <!-- Salutation -->
              <h2 style="margin: 0 0 14px 0; color: #0f172a; font-family: 'Fredoka', 'Outfit', sans-serif; font-size: 22px; font-weight: 700; line-height: 1.3;">
                Olá, Professor(a)${teacherName ? ' ' + teacherName : ''}! 👋
              </h2>

              <p style="margin: 0 0 22px 0; font-size: 15px; line-height: 1.65; color: #475569;">
                Acabamos de lançar uma nova atividade no <strong>Portal Lab Kids</strong> especialmente pensada para engajar os estudantes e reforçar habilidades essenciais da BNCC:
              </p>

              <!-- Activity Card Feature -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 20px; border: 2px solid #0284c7; overflow: hidden; margin-bottom: 26px; box-shadow: 0 12px 30px rgba(2, 132, 199, 0.2);">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    
                    <!-- Game Icon / Thumbnail -->
                    <div style="margin-bottom: 14px;">
                      <img src="${iconUrl}" alt="${activity.title}" width="80" height="80" style="display: inline-block; width: 80px; height: 80px; border-radius: 20px; border: 3px solid #38bdf8; background: #0f172a; box-shadow: 0 8px 24px rgba(56, 189, 248, 0.35); object-fit: cover;" onerror="this.src='https://labkids.online/img/robot-icon-512.png'" />
                    </div>

                    <!-- Game Title -->
                    <h3 style="margin: 0 0 12px 0; color: #ffffff; font-family: 'Fredoka', sans-serif; font-size: 24px; font-weight: 700;">
                      ${activity.title}
                    </h3>

                    <!-- Badges -->
                    <div style="margin-bottom: 16px;">
                      <span style="display: inline-block; background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid #0284c7; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 3px;">
                        📂 ${activity.category || 'Jogo Educativo'}
                      </span>
                      <span style="display: inline-block; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid #d97706; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 3px;">
                        📚 ${activity.subject || 'Multidisciplinar'}
                      </span>
                      <span style="display: inline-block; background: rgba(34, 197, 94, 0.2); color: #4ade80; border: 1px solid #16a34a; padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 800; text-transform: uppercase; margin: 3px;">
                        🎯 ${activity.level || '1º ao 5º Ano'}
                      </span>
                    </div>

                    ${activity.bncc_code ? `
                    <div style="background: rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 8px 14px; margin-bottom: 16px; display: inline-block;">
                      <span style="color: #cbd5e1; font-size: 13px;">📍 Código BNCC: <strong style="color: #38bdf8;">${activity.bncc_code}</strong></span>
                    </div>
                    ` : ''}

                    <p style="margin: 0 0 22px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1; max-width: 460px; margin-left: auto; margin-right: auto;">
                      ${activity.description || 'Uma atividade dinâmica e interativa projetada para desenvolver o raciocínio lógico e o aprendizado ativo das crianças.'}
                    </p>

                    <!-- Direct Launch CTA Button -->
                    <div>
                      <a href="${activityUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%); color: #0f172a; text-decoration: none; padding: 14px 34px; border-radius: 50px; font-family: 'Fredoka', 'Outfit', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 0.3px; box-shadow: 0 8px 24px rgba(56, 189, 248, 0.45);">
                        🎮 Jogar & Gerar QR Code da Turma
                      </a>
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Classroom Application Tip -->
              <div style="background: #fdf4ff; border-left: 4px solid #a855f7; border-radius: 8px; padding: 14px 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 800; color: #7e22ce; text-transform: uppercase;">
                  💡 Como aplicar em sala de aula:
                </p>
                <p style="margin: 0; font-size: 13px; color: #581c87; line-height: 1.5;">
                  Você pode abrir este jogo na TV/Datashow para uma rodada colaborativa com toda a sala, ou compartilhar o QR Code no mural da escola para os estudantes praticarem em casa!
                </p>
              </div>

            </td>
          </tr>

          <!-- Unified Footer -->
          ${buildEmailFooter()}

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

/**
 * Broadcasts new activity launch to a list of teachers via Resend
 */
async function broadcastNewActivityToTeachers({ activity, teachers }) {
  if (!teachers || teachers.length === 0) {
    return { success: true, count: 0, message: 'Nenhum professor ativo para notificar.' };
  }

  const subject = `🎮 Novo Jogo Liberado: ${activity.title} — Portal Lab Kids!`;

  if (!resend) {
    console.log('\n======================================================');
    console.log(`📬 [Resend Broadcast - Modo Simulado para ${teachers.length} professores]`);
    console.log(`Assunto: ${subject}`);
    console.log(`Atividade: ${activity.title} (ID: ${activity.id})`);
    console.log(`Destinatários (${teachers.length}):`, teachers.map(t => t.email).join(', '));
    console.log('======================================================\n');
    return { success: true, simulated: true, count: teachers.length };
  }

  let sentCount = 0;
  for (const t of teachers) {
    try {
      const html = buildNewActivityEmailHtml({ teacherName: t.name, activity });
      await resend.emails.send({
        from: DEFAULT_FROM,
        to: [t.email],
        subject: subject,
        html: html
      });
      sentCount++;
      // Polite delay between sends
      await new Promise(r => setTimeout(r, 60));
    } catch (err) {
      console.warn(`[Broadcast Error] Falha ao enviar para ${t.email}:`, err.message);
    }
  }

  console.log(`✅ [Resend Broadcast] Lançamento enviado com sucesso para ${sentCount}/${teachers.length} professores!`);
  return { success: true, count: sentCount };
}

/**
 * Generates the responsive HTML email template for password reset
 */
function buildPasswordResetEmailHtml({ name, token, email }) {
  const resetUrl = `${BASE_URL}/professor/redefinir-senha?token=${token}&email=${encodeURIComponent(email)}`;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redefinição de Senha — Portal Lab Kids</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #0b1120; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">

  <!-- Outer background container -->
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #0b1120; padding: 35px 12px;">
    <tr>
      <td align="center">

        <!-- Main Card Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(56, 189, 248, 0.25);">
          
          <!-- Unified Header -->
          ${buildEmailHeader({
            preheader: 'Solicitação para redefinir sua senha de acesso ao Portal Lab Kids. Link válido por 1 hora.',
            bannerTag: 'ÁREA DO PROFESSOR • RECUPERAÇÃO DE SENHA',
            headline: 'Redefinição de Senha 🔑',
            subheadline: 'Segurança & Proteção de Acesso Pedagógico'
          })}

          <!-- Body Content -->
          <tr>
            <td style="padding: 38px 32px 32px 32px; background: #ffffff;">
              
              <!-- Greeting Tag -->
              <div style="display: inline-block; background: #fef3c7; border: 1px solid #fde68a; border-radius: 50px; padding: 4px 14px; margin-bottom: 14px;">
                <span style="font-size: 12px; font-weight: 700; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px;">
                  🔒 Recuperação de Acesso
                </span>
              </div>

              <!-- Main Greeting -->
              <h2 style="margin: 0 0 14px 0; color: #0f172a; font-family: 'Fredoka', 'Outfit', sans-serif; font-size: 24px; font-weight: 700; line-height: 1.3;">
                Olá, Professor(a)${name ? ' ' + name : ''}! 👋
              </h2>

              <p style="margin: 0 0 18px 0; font-size: 15px; line-height: 1.65; color: #475569;">
                Recebemos uma solicitação para redefinir a senha da sua conta de educador no <strong>Portal Lab Kids</strong>.
              </p>

              <p style="margin: 0 0 28px 0; font-size: 15px; line-height: 1.65; color: #475569;">
                Para criar uma nova senha e voltar a acessar seus recursos de sala de aula, clique no botão seguro abaixo:
              </p>

              <!-- 1-Click Action Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-family: 'Fredoka', 'Outfit', sans-serif; font-weight: 600; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35); border: 1px solid rgba(255, 255, 255, 0.2);">
                      🔑 Criar Minha Nova Senha 🚀
                    </a>
                    <span style="display: block; font-size: 12px; color: #64748b; margin-top: 10px;">
                      ⏱️ Este link é válido por <strong>1 hora</strong>
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Safety Notice -->
              <div style="background: #f8fafc; border-left: 4px solid #0284c7; border-radius: 6px; padding: 14px 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 800; color: #0369a1; text-transform: uppercase;">
                  🛡️ Dica de Segurança:
                </p>
                <p style="margin: 0; font-size: 13px; color: #334155; line-height: 1.5;">
                  Se você não solicitou a redefinição de senha, fique tranquilo: nenhuma alteração foi realizada na sua conta. Você pode simplesmente ignorar esta mensagem.
                </p>
              </div>

              <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5; text-align: center;">
                Caso o botão não funcione, você também pode copiar e colar o link no seu navegador:<br>
                <a href="${resetUrl}" style="color: #0284c7; word-break: break-all; font-size: 11px;">${resetUrl}</a>
              </p>

            </td>
          </tr>

          <!-- Unified Footer -->
          ${buildEmailFooter()}

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
}

/**
 * Dispatches teacher password reset email via Resend
 */
async function sendTeacherPasswordResetEmail({ name, email, token }) {
  const html = buildPasswordResetEmailHtml({ name, token, email });
  const subject = `🔑 Redefinição de Senha — Portal Lab Kids`;

  if (!resend) {
    console.log('\n======================================================');
    console.log('📬 [Resend - Reset de Senha Simulado (sem RESEND_API_KEY no .env)]');
    console.log(`Para: ${name} <${email}>`);
    console.log(`Assunto: ${subject}`);
    console.log(`Link: ${BASE_URL}/professor/redefinir-senha?token=${token}&email=${encodeURIComponent(email)}`);
    console.log('======================================================\n');
    return { success: true, simulated: true };
  }

  try {
    const res = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [email],
      subject: subject,
      html: html
    });

    if (res && res.error) {
      console.warn(`[Resend Warning] Envio reset com '${DEFAULT_FROM}' retornou erro:`, res.error.message);
      if (DEFAULT_FROM !== 'Portal Lab Kids <onboarding@resend.dev>') {
        try {
          const fallbackRes = await resend.emails.send({
            from: 'Portal Lab Kids <onboarding@resend.dev>',
            to: [email],
            subject: subject,
            html: html
          });
          if (!fallbackRes.error) {
            console.log(`✅ [Resend] Reset enviado com sucesso via fallback para ${email}! ID:`, fallbackRes.data?.id);
            return { success: true, data: fallbackRes.data };
          }
        } catch (fErr) {
          console.error('❌ [Resend Fallback Error]:', fErr.message);
        }
      }
      return { success: false, error: res.error.message };
    }

    console.log(`✅ [Resend] E-mail de redefinição de senha enviado para ${email}! ID:`, res.data?.id || res);
    return { success: true, data: res.data };
  } catch (error) {
    console.error('❌ [Resend Error] Falha ao enviar e-mail de reset:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendTeacherActivationEmail,
  buildActivationEmailHtml,
  buildNewActivityEmailHtml,
  broadcastNewActivityToTeachers,
  buildPasswordResetEmailHtml,
  sendTeacherPasswordResetEmail
};
