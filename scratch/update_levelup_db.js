const db = require('../db');

async function updateLevelUp() {
  console.log("Updating LEVEL UP article in Turso Cloud DB news table...");

  await db.queryRun(
    `UPDATE news 
     SET title = ?, 
         summary = ?, 
         category = ?, 
         content = ? 
     WHERE title LIKE '%LEVEL UP%' OR activity_url LIKE '%level-up%'`,
    [
      "LEVEL UP: O Jogo da Vida não tem Botão de Reset — Prevenção ao Bullying & Lei 14.811/2024",
      "Guia pedagógico de simulação RPG para turmas do 6º ao 9º Ano sobre conscientização contra cyberbullying, saúde mental e responsabilidade jurídica.",
      "Jogo Autoral Lab Kids",
      `<h2>🛡️ Prevenção ao Bullying & Cyberbullying na Estética RPG</h2>
<p>O jogo autoral LEVEL UP simula situações reais do cotidiano escolar e digital em formato RPG. Através de dilemas éticos, os alunos experimentam o impacto das suas escolhas na saúde mental dos colegas e conhecem os limites legais da intimidação sistemática sob a Lei 14.811/2024.</p>

<h2>📘 Habilidades BNCC</h2>
<ul>
  <li><strong>EF69LP55</strong> - Análise crítica dos impactos de publicações na cultura digital e redes sociais.</li>
  <li><strong>EF07LP14</strong> - Práticas éticas de linguagem e convivência cidadã no ambiente escolar e virtual.</li>
  <li><strong>EF08LP14</strong> - Construção de posicionamento empático e combate aos discursos de ódio e intimidação.</li>
</ul>

<h2>📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; padding: 20px; border-radius: 16px; border-left: 4px solid #8b5cf6;">
<em>"Realização da atividade temática e simulação em formato RPG 'LEVEL UP: O Jogo da Vida não tem Botão de Reset', promovendo a conscientização sobre prevenção ao bullying, cyberbullying, saúde mental e a Lei 14.811/2024 (BNCC: EF69LP55, EF07LP14, EF08LP14)."</em>
</div>`
    ]
  );

  console.log("✅ LEVEL UP news article cleaned and updated in Turso Cloud DB!");
  process.exit(0);
}

updateLevelUp();
