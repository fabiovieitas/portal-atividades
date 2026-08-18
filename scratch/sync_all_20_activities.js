const dbHelper = require('../db');

const all20Activities = [
  {
    title: "⭐ Leitura Divertida no Datashow [JOGO AUTORAL]",
    description: "⚡ JOGO AUTORAL LAB KIDS! Ferramenta pedagógica interativa para projeção de palavras, sílabas e leitura guiada em datashow ou tela cheia.",
    activity_url: "/atividades/leitura-datashow",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3429/3429433.png",
    level: "1-5", category: "Alfabetização Autoral", subject: "Português", bncc_code: "EF01LP01, EF01LP08, EF02LP04"
  },
  {
    title: "Brincando com Ariê 1",
    description: "Jogo educativo para auxílio à alfabetização, reconhecimento de cores, frutas e associação de palavras.",
    activity_url: "/atividades/brincando-com-arie-1",
    icon_url: "https://arietoy.com.br/assets_games/br/brincando-com-arie-1/screenshots/brincando-com-arie-1-01.jpg",
    level: "1-5", category: "Alfabetização", subject: "Português", bncc_code: "EI02EF04, EI02ET06, EF01LP10"
  },
  {
    title: "Brincando com Ariê 2",
    description: "Segunda edição da série pedagógica Ariê! Desafios de sílabas, contagem de objetos, memória e associação.",
    activity_url: "/atividades/brincando-com-arie-2",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
    level: "1-5", category: "Alfabetização", subject: "Português", bncc_code: "EI03EF04, EF01LP10, EF01MA01"
  },
  {
    title: "Brincando com Ariê 3",
    description: "Terceiro capítulo com exercícios desafiadores de ortografia, associação de frases, adição e raciocínio.",
    activity_url: "/atividades/brincando-com-arie-3",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081987.png",
    level: "1-5", category: "Alfabetização Avançada", subject: "Português", bncc_code: "EF01LP12, EF02LP01, EF02MA05"
  },
  {
    title: "Chapeuzinho e o Enigma",
    description: "Ajude Chapeuzinho Vermelho a atravessar a floresta resolvendo quebra-cabeças de palavras e atenção!",
    activity_url: "/atividades/chapeuzinho-enigma",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
    level: "1-5", category: "Alfabetização & Raciocínio", subject: "Português", bncc_code: "EF01LP02, EF01LP05, EF15AR04"
  },
  {
    title: "Capitão Alberto e o Faraó",
    description: "Uma aventura histórica pelo Egito Antigo! Desvende mistérios, hieróglifos e desafios de história.",
    activity_url: "/atividades/capitao-alberto-farao",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2617/2617876.png",
    level: "1-5", category: "História & Aventura", subject: "História", bncc_code: "EF01HI01, EF02HI02, EF03HI01"
  },
  {
    title: "Ariê Colorir",
    description: "Atividade artística interativa! Explore a paleta de cores e desenvolva a coordenação motora.",
    activity_url: "/atividades/arie-colorir",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
    level: "1-5", category: "Artes Visuais", subject: "Artes", bncc_code: "EF15AR04, EF15AR02, EI02CG05"
  },
  {
    title: "Tabuada - O Chão é Lava!",
    description: "Jogo dinâmico de matemática e agilidade! Calcule a tabuada rapidamente para salvar os personagens antes que o chão vire lava.",
    activity_url: "/atividades/tabuada-chao-e-lava",
    icon_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
    level: "1-5", category: "Matemática Divertida", subject: "Matemática", bncc_code: "EF02MA05, EF03MA03, EF04MA04"
  },
  {
    title: "Caça-Palavras Temático",
    description: "Desafio de leitura e ortografia! Encontre palavras escondidas por categorias temáticas.",
    activity_url: "/atividades/caca-palavras-temas",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
    level: "1-5", category: "Vocabulário & Leitura", subject: "Português", bncc_code: "EF01LP02, EF02LP04, EF35LP05"
  },
  {
    title: "Tux Math - Matemática Divertida",
    description: "Jogo educativo arcade onde você ajuda o pinguim Tux a defender a cidade resolvendo equações!",
    activity_url: "/atividades/tux-math",
    icon_url: "https://tuxmath.org/images/favicon.png",
    level: "1-5", category: "Matemática", subject: "Matemática", bncc_code: "EF01MA06, EF02MA05, EF03MA03"
  },
  {
    title: "Pou Online - Mascote Virtual & Rotinas",
    description: "Jogo educativo de responsabilidade, cuidados e rotinas! Alimente e cuide do seu bichinho virtual.",
    activity_url: "/atividades/pou-online",
    icon_url: "https://cdn.jogos360.com.br/po/uo/pou-online-d.jpg",
    level: "1-5", category: "Cuidados & Hábitos", subject: "Ciências", bncc_code: "EI03CG04, EI03EO02, EF01CI01"
  },
  {
    title: "Gartic.io - Desenho & Vocabulário",
    description: "Jogo de desenho e adivinhação! Desenhe a palavra sorteada e adivinhe os traços dos outros jogadores.",
    activity_url: "/atividades/gartic",
    icon_url: "https://gartic.io/static/images/avatar/1.png",
    level: "1-5", category: "Artes & Vocabulário", subject: "Artes", bncc_code: "EF15AR04, EF15AR02, EF01LP01"
  },
  {
    title: "Akinator - O Gênio da Lógica",
    description: "Jogo de lógica, classificação e dedução! Pense em um personagem e responda às perguntas do gênio.",
    activity_url: "/atividades/akinator",
    icon_url: "https://pt.akinator.com/assets/img/akinator.png",
    level: "1-5", category: "Lógica & Dedução", subject: "Matemática", bncc_code: "EF01MA09, EF02MA18, EF35LP05"
  },
  {
    title: "Laboratório de Circuitos (Tinkercad)",
    description: "Monte e simule circuitos elétricos, baterias e leds em um ambiente virtual interativo.",
    activity_url: "https://www.tinkercad.com/circuits",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2853/2853173.png",
    level: "6-9", category: "Eletrônica & Robótica", subject: "Ciências", bncc_code: "EF08CI02, EF08CI05"
  },
  {
    title: "LEVEL UP: O Jogo da Vida não tem Botão de Reset [JOGO AUTORAL - AGENDA 21]",
    description: "Simulador autoral de escolhas, desenvolvimento sustentável, projeto de vida e cidadania planetária alinhado à Agenda 21 e ODS da ONU.",
    activity_url: "/atividades/level-up",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
    level: "6-9", category: "Jogo Autoral Lab Kids", subject: "Projeto de Vida", bncc_code: "EF06MA32, EF09MA20"
  },
  {
    title: "Material Dourado Virtual",
    description: "Manipule dezenas e unidades em tempo real para desenvolver o Sistema de Numeração Decimal de forma lúdica.",
    activity_url: "/atividades/material-dourado",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3593/3593452.png",
    level: "1-5", category: "Matemática Divertida", subject: "Matemática", bncc_code: "EF01MA01, EF02MA05"
  },
  {
    title: "Fábrica de Sílabas & Palavras",
    description: "Junte sílabas simples para formar palavras e acelerar o processo de hipótese silábica e leitura.",
    activity_url: "/atividades/fabrica-de-silabas",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
    level: "1-5", category: "Alfabetização", subject: "Português", bncc_code: "EF01LP08, EF01LP10"
  },
  {
    title: "Hábitos de Higiene & Saúde",
    description: "Atividade interativa sobre a importância de escovar os dentes, tomar banho e lavar as mãos para prevenir doenças.",
    activity_url: "/atividades/habitos-de-higiene",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2913/2913498.png",
    level: "1-5", category: "Ciências & Saúde", subject: "Ciências", bncc_code: "EF01CI01, EF02CI04"
  },
  {
    title: "Desafio dos Fatos Rápidos da Adição",
    description: "Desenvolva o cálculo mental rápido e a agilidade nos fatos fundamentais da adição até 20.",
    activity_url: "/atividades/desafio-adicao",
    icon_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
    level: "1-5", category: "Matemática Rápida", subject: "Matemática", bncc_code: "EF01MA06, EF02MA05"
  },
  {
    title: "Detetive da Ortografia (CH, LH, NH, RR, SS)",
    description: "Desafio gamificado de ortografia e fixação dos principais dígrafos da Língua Portuguesa.",
    activity_url: "/atividades/detetive-ortografia",
    icon_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
    level: "1-5", category: "Ortografia & Leitura", subject: "Português", bncc_code: "EF02LP01, EF03LP01"
  }
];

async function syncAll20() {
  console.log('Synchronizing all 20 activities across Turso Cloud DB and SQLite...');
  for (const act of all20Activities) {
    try {
      const existing = await dbHelper.queryGet("SELECT id FROM activities WHERE activity_url = ? LIMIT 1", [act.activity_url]);
      if (existing) {
        await dbHelper.queryRun(
          "UPDATE activities SET title = ?, description = ?, icon_url = ?, level = ?, category = ?, bncc_code = ?, subject = ?, status = 'public' WHERE id = ?",
          [act.title, act.description, act.icon_url, act.level, act.category, act.bncc_code, act.subject, existing.id]
        );
        console.log(`✅ Atualizado [Level ${act.level}]: ${act.title}`);
      } else {
        await dbHelper.queryRun(
          "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
          [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject]
        );
        console.log(`✨ Criado [Level ${act.level}]: ${act.title}`);
      }
    } catch(e) {
      console.error(`Erro em ${act.title}:`, e.message);
    }
  }

  // Count per level
  const kids = await dbHelper.getActivities({ level: '1-5' });
  const tech = await dbHelper.getActivities({ level: '6-9' });
  console.log(`\n🎉 TOTAL 1º ao 5º Ano: ${kids.length} atividades`);
  console.log(`🎉 TOTAL 6º ao 9º Ano: ${tech.length} atividades`);
}

syncAll20().catch(console.error);
