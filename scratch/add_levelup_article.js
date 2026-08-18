const dbHelper = require('../db');

async function seedLevelUp() {
  console.log('Seeding Level UP autoral game and blog article...');

  // 1. Update/Insert Level UP Activity
  const titleAct = "LEVEL UP: O Jogo da Vida não tem Botão de Reset [JOGO AUTORAL]";
  const descAct = "Simulador autoral de escolhas, projeto de vida e tomada de decisão sobre finanças, ética e cidadania.";
  const urlAct = "/atividades/level-up";
  const iconAct = "https://cdn-icons-png.flaticon.com/512/2991/2991108.png";

  const existingAct = await dbHelper.queryGet("SELECT id FROM activities WHERE title LIKE '%LEVEL UP%' LIMIT 1");
  if (existingAct) {
    await dbHelper.queryRun(
      "UPDATE activities SET title = ?, description = ?, activity_url = ?, icon_url = ?, level = '6-9', category = 'Jogo Autoral Lab Kids', bncc_code = 'EF06MA32, EF09MA20', subject = 'Projeto de Vida' WHERE id = ?",
      [titleAct, descAct, urlAct, iconAct, existingAct.id]
    );
    console.log('✅ Atividade Level UP atualizada com sucesso!');
  } else {
    await dbHelper.queryRun(
      "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, '6-9', 'Jogo Autoral Lab Kids', 'public', 'EF06MA32, EF09MA20', 'Projeto de Vida')",
      [titleAct, descAct, urlAct, iconAct]
    );
    console.log('✨ Atividade Level UP criada com sucesso!');
  }

  // 2. Insert Level UP Blog Article
  const titleArt = "⭐ LEVEL UP: Como Usar o Jogo Autoral de Projeto de Vida e Tomada de Decisão no 6º ao 9º Ano";
  const summaryArt = "Conheça o simulador autoral exclusivo do Lab Kids desenvolvido para trabalhar finanças, cidadania digital e projeto de vida com estudantes dos anos finais.";
  const contentArt = `
    <h2>⭐ Apresentação do Jogo Autoral Level UP</h2>
    <p>O <strong>LEVEL UP: O Jogo da Vida não tem Botão de Reset</strong> é uma experiência interativa e <strong>autoral</strong> que coloca os alunos diante de dilemas reais sobre escolhas financeiras, ética nas redes sociais, respeito e projeto de vida.</p>
    
    <h2>📘 Habilidades BNCC Atendidas</h2>
    <ul>
      <li><strong>EF06MA32:</strong> Educação Financeira e análise de situações de consumo consciente.</li>
      <li><strong>EF09MA20:</strong> Análise de gráficos e tomada de decisões fundamentadas.</li>
      <li><strong>CG01 & CG06:</strong> Competências Gerais da Educação Básica focadas em Projeto de Vida e Empatia.</li>
    </ul>

    <h2>📝 Registro para o Diário de Classe (Copiar e Colar)</h2>
    <div style="background: #f1f5f9; padding: 20px; border-radius: 16px; border-left: 4px solid #7c3aed; font-family: monospace;">
      <em>"Aplicação pedagógica do jogo digital autoral LEVEL UP: O Jogo da Vida para a análise de dilemas éticos, educação financeira, cidadania digital e projeto de vida nos anos finais (Habilidades BNCC: EF06MA32, EF09MA20, CG01, CG06)."</em>
    </div>
  `;

  const existingArt = await dbHelper.queryGet("SELECT id FROM news WHERE title LIKE '%LEVEL UP%' LIMIT 1");
  if (existingArt) {
    await dbHelper.queryRun(
      "UPDATE news SET title = ?, summary = ?, content = ?, image_url = ?, category = 'Jogo Autoral Lab Kids', author = 'Prof. Fábio Vieitas', activity_url = '/atividades/level-up' WHERE id = ?",
      [titleArt, summaryArt, contentArt, iconAct, existingArt.id]
    );
    console.log('✅ Artigo Level UP atualizado!');
  } else {
    await dbHelper.queryRun(
      "INSERT INTO news (title, summary, content, image_url, category, author, activity_url, created_at, published_at) VALUES (?, ?, ?, ?, 'Jogo Autoral Lab Kids', 'Prof. Fábio Vieitas', '/atividades/level-up', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
      [titleArt, summaryArt, contentArt, iconAct]
    );
    console.log('📰 Artigo Level UP criado!');
  }

  console.log('🎉 LEVEL UP SEEDED PERFECTLY!');
}

seedLevelUp().catch(console.error);
