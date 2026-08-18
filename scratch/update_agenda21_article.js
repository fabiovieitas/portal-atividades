const dbHelper = require('../db');

async function updateAgenda21Article() {
  console.log('Updating Level UP article with Agenda 21 & ODS ONU details...');

  const titleAct = "LEVEL UP: O Jogo da Vida não tem Botão de Reset [JOGO AUTORAL - AGENDA 21]";
  const descAct = "Simulador autoral de escolhas, desenvolvimento sustentável, projeto de vida e cidadania planetária alinhado à Agenda 21 e ODS da ONU.";
  const urlAct = "/atividades/level-up";
  const iconAct = "https://cdn-icons-png.flaticon.com/512/2991/2991108.png";

  const existingAct = await dbHelper.queryGet("SELECT id FROM activities WHERE title LIKE '%LEVEL UP%' LIMIT 1");
  if (existingAct) {
    await dbHelper.queryRun(
      "UPDATE activities SET title = ?, description = ?, activity_url = ?, icon_url = ?, level = '6-9', category = 'Jogo Autoral Lab Kids', bncc_code = 'EF06MA32, EF09MA20', subject = 'Projeto de Vida' WHERE id = ?",
      [titleAct, descAct, urlAct, iconAct, existingAct.id]
    );
    console.log('✅ Atividade Level UP (Agenda 21) atualizada!');
  }

  const titleArt = "⭐ LEVEL UP & Agenda 21: Como Trabalhar Desenvolvimento Sustentável e ODS da ONU no 6º ao 9º Ano";
  const summaryArt = "Saiba como o jogo autoral LEVEL UP conecta Projeto de Vida, Educação Financeira e os compromissos da Agenda 21 com texto pronto para o Diário de Classe.";
  const contentArt = `
    <h2>🌱 A Conexão Direta entre o LEVEL UP e a Agenda 21</h2>
    <p>A <strong>Agenda 21</strong> é o plano de ação global formulado para promover o <strong>desenvolvimento sustentável</strong>, a sustentabilidade socioambiental e o consumo consciente em todo o planeta.</p>
    <p>No jogo autoral <strong>LEVEL UP: O Jogo da Vida não tem Botão de Reset</strong>, os estudantes vivenciam escolhas do cotidiano em que cada decisão financeira, ambiental e social gera impactos imediatos na comunidade e no seu futuro.</p>
    
    <h2>🌍 Alinhamento com os ODS da ONU (Agenda 2030)</h2>
    <ul>
      <li><strong>ODS 12 - Consumo e Produção Responsáveis:</strong> Escolhas conscientes de compra e redução de desperdício.</li>
      <li><strong>ODS 16 - Paz, Justiça e Instituições Eficazes:</strong> Ética nas relações, cidadania digital e respeito mútuo.</li>
      <li><strong>ODS 8 - Trabalho Decente e Crescimento Econômico:</strong> Projeto de Vida e planejamento de futuro.</li>
    </ul>

    <h2>📘 Habilidades BNCC Atendidas</h2>
    <ul>
      <li><strong>EF06MA32 & EF09MA20:</strong> Educação Financeira e análise de tomadas de decisão.</li>
      <li><strong>Temas Contemporâneos Transversais (TCTs do MEC):</strong> Meio Ambiente, Economia e Cidadania.</li>
      <li><strong>CG01 & CG06:</strong> Competências Gerais de Conhecimento e Projeto de Vida.</li>
    </ul>

    <h2>📝 Registro para o Diário de Classe (Copiar e Colar)</h2>
    <div style="background: #f1f5f9; padding: 20px; border-radius: 16px; border-left: 4px solid #10b981; font-family: monospace;">
      <em>"Aplicação do jogo digital autoral LEVEL UP focado nos princípios da Agenda 21 e nos Objetivos de Desenvolvimento Sustentável (ODS da ONU), abordando escolhas éticas, sustentabilidade, educação financeira e projeto de vida (BNCC: EF06MA32, EF09MA20, CG01, CG06)."</em>
    </div>
  `;

  const existingArt = await dbHelper.queryGet("SELECT id FROM news WHERE title LIKE '%LEVEL UP%' LIMIT 1");
  if (existingArt) {
    await dbHelper.queryRun(
      "UPDATE news SET title = ?, summary = ?, content = ?, image_url = ?, category = 'Agenda 21 & Sustentabilidade', author = 'Prof. Fábio Vieitas', activity_url = '/atividades/level-up' WHERE id = ?",
      [titleArt, summaryArt, contentArt, iconAct, existingArt.id]
    );
    console.log('✅ Artigo Level UP (Agenda 21) atualizado!');
  } else {
    await dbHelper.queryRun(
      "INSERT INTO news (title, summary, content, image_url, category, author, activity_url, created_at, published_at) VALUES (?, ?, ?, ?, 'Agenda 21 & Sustentabilidade', 'Prof. Fábio Vieitas', '/atividades/level-up', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
      [titleArt, summaryArt, contentArt, iconAct]
    );
    console.log('📰 Artigo Level UP (Agenda 21) criado!');
  }

  console.log('🎉 AGENDA 21 ARTICLE SEEDED PERFECTLY!');
}

updateAgenda21Article().catch(console.error);
