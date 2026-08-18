const dbHelper = require('../db');

const new5Activities = [
  {
    title: "Material Dourado Virtual",
    description: "Manipule dezenas e unidades em tempo real para desenvolver o Sistema de Numeração Decimal de forma lúdica.",
    activity_url: "/atividades/material-dourado",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3593/3593452.png",
    level: "1-5", category: "Matemática Divertida", bncc_code: "EF01MA01, EF02MA05", subject: "Matemática"
  },
  {
    title: "Fábrica de Sílabas & Palavras",
    description: "Junte sílabas simples para formar palavras e acelerar o processo de hipótese silábica e leitura.",
    activity_url: "/atividades/fabrica-de-silabas",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
    level: "1-5", category: "Alfabetização", bncc_code: "EF01LP08, EF01LP10", subject: "Português"
  },
  {
    title: "Hábitos de Higiene & Saúde",
    description: "Atividade interativa sobre a importância de escovar os dentes, tomar banho e lavar as mãos para prevenir doenças.",
    activity_url: "/atividades/habitos-de-higiene",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913498.png",
    level: "1-5", category: "Ciências & Saúde", bncc_code: "EF01CI01, EF02CI04", subject: "Ciências"
  },
  {
    title: "Desafio dos Fatos Rápidos da Adição",
    description: "Desenvolva o cálculo mental rápido e a agilidade nos fatos fundamentais da adição até 20.",
    activity_url: "/atividades/desafio-adicao",
    icon_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
    level: "1-5", category: "Matemática Rápida", bncc_code: "EF01MA06, EF02MA05", subject: "Matemática"
  },
  {
    title: "Detetive da Ortografia (CH, LH, NH, RR, SS)",
    description: "Desafio gamificado de ortografia e fixação dos principais dígrafos da Língua Portuguesa.",
    activity_url: "/atividades/detetive-ortografia",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
    level: "1-5", category: "Ortografia & Leitura", bncc_code: "EF02LP01, EF03LP01", subject: "Português"
  }
];

const new5Articles = [
  {
    title: "Material Dourado Virtual: Como Ensinar Dezena e Unidade no Ensino Fundamental",
    summary: "Descubra como o recurso do Material Dourado Virtual desenvolve o Sistema de Numeração Decimal e confira o texto pronto para registrar no seu Diário de Classe.",
    category: "Matemática & BNCC", author: "Prof. Fábio Vieitas", activity_url: "/atividades/material-dourado",
    image_url: "https://cdn-icons-png.flaticon.com/512/3593/3593452.png",
    content: `<h2>🟡 A Importância do Material Dourado no Aprendizado Decimal</h2><p>O uso do <strong>Material Dourado Virtual</strong> permite que o aluno visualize concretamente a transição de 10 unidades para 1 dezena.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01MA01:</strong> Utilizar números naturais como indicador de quantidade.</li><li><strong>EF02MA05:</strong> Construir fatos básicos da adição e compor/decompor números.</li></ul><h2>📝 Registro para o Diário de Classe (Copiar e Colar)</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px; font-family: monospace;"><em>"Utilização do recurso digital pedagógico Material Dourado Virtual para a compreensão do Sistema de Numeração Decimal, composição e decomposição de dezenas e unidades (Habilidades BNCC: EF01MA01, EF02MA05)."</em></div>`
  },
  {
    title: "Fábrica de Sílabas: Acelere a Hipótese Silábica e Leitura no 1º Ano",
    summary: "Guia prático para trabalhar junção de sílabas simples em sala de aula ou no datashow com registro pronto para o Diário de Classe.",
    category: "Alfabetização", author: "Prof. Fábio Vieitas", activity_url: "/atividades/fabrica-de-silabas",
    image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
    content: `<h2>🔤 Consciência Silábica e Formação de Palavras</h2><p>Trabalhar sílabas de forma manipulável acelera a aquisição da leitura fluente nos anos iniciais.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP08:</strong> Relacionar elementos sonoros às suas formas gráficas.</li><li><strong>EF01LP10:</strong> Nomear as letras do alfabeto e recitar a série na ordem.</li></ul><h2>📝 Registro para o Diário de Classe (Copiar e Colar)</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px; font-family: monospace;"><em>"Prática pedagógica interativa na Fábrica de Sílabas para a junção silábica, associação grafema-fonema e formação de palavras simples (Habilidades BNCC: EF01LP08, EF01LP10)."</em></div>`
  },
  {
    title: "Hábitos de Higiene e Saúde na Escola: Atividade Prática e Guia BNCC",
    summary: "Como utilizar atividades digitais para ensinar escovação, banho e lavagem das mãos com texto pronto para o Diário de Classe.",
    category: "Ciências & Saúde", author: "Prof. Fábio Vieitas", activity_url: "/atividades/habitos-de-higiene",
    image_url: "https://cdn-icons-png.flaticon.com/512/2913/2913498.png",
    content: `<h2>🧼 Saúde e Autocuidado na Infância</h2><p>Construir hábitos diários de higiene previne doenças e estimula a autonomia do estudante.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01CI01:</strong> Comparar características físicas e hábitos de higiene corporal.</li><li><strong>EF02CI04:</strong> Descrever a importância da prevenção de doenças.</li></ul><h2>📝 Registro para o Diário de Classe (Copiar e Colar)</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px; font-family: monospace;"><em>"Atividade de Ciências sobre Hábitos de Higiene e Saúde Corporal para o desenvolvimento de práticas de autocuidado e prevenção de doenças (Habilidades BNCC: EF01CI01, EF02CI04)."</em></div>`
  },
  {
    title: "Desafio dos Fatos Rápidos da Adição: Cálculo Mental até 20 sem Decorar",
    summary: "Aprenda como utilizar o cálculo mental gamificado para automatizar os fatos da adição com registro pronto para o Diário.",
    category: "Matemática Rápida", author: "Prof. Fábio Vieitas", activity_url: "/atividades/desafio-adicao",
    image_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
    content: `<h2>⚡ Cálculo Mental e Automatização dos Fatos</h2><p>A agilidade nos fatos simples libera memória de trabalho para a resolução de problemas complexos.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01MA06:</strong> Construir fatos básicos da adição para procedimentos de cálculo.</li><li><strong>EF02MA05:</strong> Utilizar cálculo mental na adição e subtração.</li></ul><h2>📝 Registro para o Diário de Classe (Copiar e Colar)</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px; font-family: monospace;"><em>"Desenvolvimento do cálculo mental e agilidade nos fatos básicos da adição até 20 através do jogo Desafio da Adição (Habilidades BNCC: EF01MA06, EF02MA05)."</em></div>`
  },
  {
    title: "Detetive da Ortografia: Dificuldades Ortográficas CH, LH, NH, RR e SS no 2º e 3º Ano",
    summary: "Como trabalhar dígrafos complexos com um jogo de caça-erros ortográficos e registro pronto para o Diário de Classe.",
    category: "Língua Portuguesa", author: "Prof. Fábio Vieitas", activity_url: "/atividades/detetive-ortografia",
    image_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
    content: `<h2>🕵️ Fixação Ortográfica e Dígrafos Complexos</h2><p>Superar as dúvidas entre CH/X, LH/LI e RR/R de forma dinâmica e interativa.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF02LP01:</strong> Utilizar grafias corretas de palavras com correspondências regulares e irregulares.</li><li><strong>EF03LP01:</strong> Ler e escrever palavras com valores sonoros de dígrafos.</li></ul><h2>📝 Registro para o Diário de Classe (Copiar e Colar)</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px; font-family: monospace;"><em>"Exercício gamificado de ortografia e identificação dos dígrafos CH, LH, NH, RR e SS no jogo Detetive da Ortografia (Habilidades BNCC: EF02LP01, EF03LP01)."</em></div>`
  }
];

async function seedNew5() {
  console.log('Seeding 5 new high-demand activities and blog articles...');
  
  for (const act of new5Activities) {
    try {
      const existing = await dbHelper.queryGet("SELECT id FROM activities WHERE title LIKE ? LIMIT 1", [`%${act.title}%`]);
      if (existing) {
        await dbHelper.queryRun(
          "UPDATE activities SET title = ?, description = ?, activity_url = ?, icon_url = ?, level = ?, category = ?, bncc_code = ?, subject = ? WHERE id = ?",
          [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject, existing.id]
        );
        console.log(`✅ Atividade atualizada: ${act.title}`);
      } else {
        await dbHelper.queryRun(
          "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
          [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject]
        );
        console.log(`✨ Atividade criada: ${act.title}`);
      }
    } catch(e) {
      console.error(`Erro ao semear ${act.title}:`, e.message);
    }
  }

  for (const art of new5Articles) {
    try {
      const existing = await dbHelper.queryGet("SELECT id FROM news WHERE title LIKE ? LIMIT 1", [`%${art.title.split(':')[0]}%`]);
      if (existing) {
        await dbHelper.queryRun(
          "UPDATE news SET title = ?, summary = ?, content = ?, image_url = ?, category = ?, author = ?, activity_url = ?, created_at = CURRENT_TIMESTAMP, published_at = CURRENT_TIMESTAMP WHERE id = ?",
          [art.title, art.summary, art.content, art.image_url, art.category, art.author, art.activity_url, existing.id]
        );
        console.log(`✅ Artigo atualizado: ${art.title.substring(0, 40)}...`);
      } else {
        await dbHelper.queryRun(
          "INSERT INTO news (title, summary, content, image_url, category, author, activity_url, created_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
          [art.title, art.summary, art.content, art.image_url, art.category, art.author, art.activity_url]
        );
        console.log(`📰 Artigo criado: ${art.title.substring(0, 40)}...`);
      }
    } catch(e) {
      console.error(`Erro ao semear artigo ${art.title}:`, e.message);
    }
  }

  console.log('🎉 20 ACTIVITIES AND 20 BLOG ARTICLES SEEDED PERFECTLY!');
}

seedNew5().catch(console.error);
