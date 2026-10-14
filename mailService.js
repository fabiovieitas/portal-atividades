require('dotenv').config();
const { Resend } = require('resend');

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

// Default sender address: Use onboarding@resend.dev for test mode or verified domain (ex: contato@labkids.online)
const DEFAULT_FROM = process.env.EMAIL_FROM || 'Portal Lab Kids <onboarding@resend.dev>';
const BASE_URL = process.env.BASE_URL || 'https://labkids.online';

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
  <title>Ative sua Conta de Professor - Portal Lab Kids</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 35px 30px; text-align: center;">
              <div style="font-size: 40px; margin-bottom: 8px;">🤖 🚀</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Portal Lab Kids</h1>
              <p style="margin: 5px 0 0 0; color: #e0e7ff; font-size: 14px; font-weight: 500;">Área do Professor & Inovação Pedagógica</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
                Olá, Professor(a) ${name}! 👋
              </h2>
              <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Seja muito bem-vindo(a) ao <strong>Portal Lab Kids</strong>! Você deu o primeiro passo para transformar suas aulas com jogos educativos, desafios interativos e missões alinhadas à BNCC.
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Para proteger os dados dos nossos estudantes (LGPD) e ativar seus recursos pedagógicos exclusivos, utilize o código de 6 dígitos abaixo:
              </p>

              <!-- OTP Code Box -->
              <div style="background: #f8fafc; border: 2px dashed #6366f1; border-radius: 12px; padding: 22px 15px; text-align: center; margin-bottom: 26px;">
                <span style="display: block; font-size: 12px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                  Seu Código de Ativação
                </span>
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #1e1b4b; display: inline-block;">
                  ${code}
                </span>
                <span style="display: block; font-size: 12px; color: #64748b; margin-top: 8px;">
                  Válido por 24 horas
                </span>
              </div>

              <!-- 1-Click Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #64748b;">Ou se preferir, ative diretamente em 1 clique:</p>
                <a href="${activationUrl}" target="_blank" style="display: inline-block; background: #4f46e5; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);">
                  Ativar Minha Conta de Educador 🚀
                </a>
              </div>

              <!-- Extra Information & LGPD notice -->
              <div style="background: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 4px; padding: 12px 16px; margin-bottom: 25px;">
                <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">
                  🔒 <strong>Ambiente Seguro:</strong> Sua conta dá acesso à criação de turmas, emissão de QR Codes e curadoria de atividades. Seus dados estão protegidos de acordo com a LGPD.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                Se você não realizou este cadastro no Portal Lab Kids, por favor ignore esta mensagem. Nenhuma conta será ativada sem a confirmação deste código.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 25px 30px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; color: #334155;">
                Portal Lab Kids — Jogos Educativos & Atividades BNCC
              </p>
              <p style="margin: 0; font-size: 12px; color: #64748b;">
                Criado com dedicação pelo <strong>Prof. Fábio Vieitas</strong> • Campos dos Goytacazes - RJ
              </p>
            </td>
          </tr>

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
  const subject = `Ative sua conta de Professor(a) — Código: ${code} 🚀`;

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
    const data = await resend.emails.send({
      from: DEFAULT_FROM,
      to: [email],
      subject: subject,
      html: html
    });

    console.log(`✅ [Resend] E-mail de ativação enviado com sucesso para ${email}! ID:`, data.id || data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ [Resend Error] Falha ao enviar e-mail de ativação:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendTeacherActivationEmail,
  buildActivationEmailHtml
};
