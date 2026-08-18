const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.js');
let dbCode = fs.readFileSync(dbPath, 'utf8');

const fullSeederCode = `
      // Ensure all 15 activities exist and have valid icon URLs
      const fullActivities = [
        {
          title: "⭐ Leitura Divertida no Datashow [JOGO AUTORAL]",
          description: "⚡ JOGO AUTORAL LAB KIDS! Ferramenta pedagógica interativa para projeção de palavras, sílabas e leitura guiada em datashow ou tela cheia.",
          activity_url: "/atividades/leitura-datashow",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3429/3429433.png",
          level: "1-5", category: "Alfabetização Autoral", bncc_code: "EF01LP01, EF01LP08, EF02LP04", subject: "Português"
        },
        {
          title: "Brincando com Ariê 1",
          description: "Jogo educativo para Educação Infantil e 1º Ano! Atividades lúdicas de letras, formas, números e sons da natureza com o leãozinho Ariê.",
          activity_url: "/atividades/brincando-com-arie-1",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081884.png",
          level: "1-5", category: "Alfabetização", bncc_code: "EI02EF04, EI02ET06, EF01LP10", subject: "Português"
        },
        {
          title: "Brincando com Ariê 2",
          description: "Segunda edição da série pedagógica Ariê! Desafios de sílabas, contagem de objetos, memória e associação de palavras.",
          activity_url: "/atividades/brincando-com-arie-2",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
          level: "1-5", category: "Alfabetização", bncc_code: "EI03EF04, EF01LP10, EF01MA01", subject: "Português"
        },
        {
          title: "Brincando com Ariê 3",
          description: "Terceiro capítulo com exercícios desafiadores de ortografia, associação de frases, adição, subtração e raciocínio lógico.",
          activity_url: "/atividades/brincando-com-arie-3",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081987.png",
          level: "1-5", category: "Alfabetização Avançada", bncc_code: "EF01LP12, EF02LP01, EF02MA05", subject: "Português"
        },
        {
          title: "Chapeuzinho e o Enigma",
          description: "Ajude Chapeuzinho Vermelho a atravessar a floresta resolvendo quebra-cabeças de palavras, raciocínio e atenção!",
          activity_url: "/atividades/chapeuzinho-enigma",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
          level: "1-5", category: "Alfabetização & Raciocínio", bncc_code: "EF01LP02, EF01LP05, EF15AR04", subject: "Português"
        },
        {
          title: "Capitão Alberto e o Faraó",
          description: "Uma aventura histórica pelo Egito Antigo! Desvende mistérios, hieróglifos e desafios de história e geografia.",
          activity_url: "/atividades/capitao-alberto-farao",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2617/2617876.png",
          level: "1-5", category: "História & Aventura", bncc_code: "EF01HI01, EF02HI02, EF03HI01", subject: "História"
        },
        {
          title: "Ariê Colorir",
          description: "Atividade artística interativa! Explore a paleta de cores, desenvolva a coordenação motora e crie obras com o Ariê.",
          activity_url: "/atividades/arie-colorir",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
          level: "1-5", category: "Artes Visuais", bncc_code: "EF15AR04, EF15AR02, EI02CG05", subject: "Artes"
        },
        {
          title: "Tabuada - O Chão é Lava!",
          description: "Jogo dinâmico de matemática e agilidade! Calcule a tabuada rapidamente para salvar os personagens antes que o chão vire lava.",
          activity_url: "/atividades/tabuada-chao-e-lava",
          icon_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
          level: "1-5", category: "Matemática Divertida", bncc_code: "EF02MA05, EF03MA03, EF04MA04", subject: "Matemática"
        },
        {
          title: "Caça-Palavras Temático",
          description: "Desafio de leitura e ortografia! Encontre palavras escondidas por categorias temáticas como animais, frutas e escola.",
          activity_url: "/atividades/caca-palavras-temas",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
          level: "1-5", category: "Vocabulário & Leitura", bncc_code: "EF01LP02, EF02LP04, EF35LP05", subject: "Português"
        },
        {
          title: "Tux Math - Matemática Divertida",
          description: "Jogo educativo arcade onde você ajuda o pinguim Tux a defender a cidade resolvendo equações de adição, subtração e multiplicação!",
          activity_url: "/atividades/tux-math",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2165/2165683.png",
          level: "1-5", category: "Matemática", bncc_code: "EF01MA06, EF02MA05, EF03MA03", subject: "Matemática"
        },
        {
          title: "Pou Online - Mascote Virtual & Rotinas",
          description: "Jogo educativo de responsabilidade, cuidados e rotinas! Alimente, banhe, brinque e cuide da saúde do seu bichinho virtual.",
          activity_url: "/atividades/pou-online",
          icon_url: "https://cdn.jogos360.com.br/po/uo/pou-online-d.jpg",
          level: "1-5", category: "Cuidados & Hábitos", bncc_code: "EI03CG04, EI03EO02, EF01CI01", subject: "Ciências"
        },
        {
          title: "Gartic.io - Desenho & Vocabulário",
          description: "Jogo de desenho e adivinhação! Desenhe a palavra sorteada e adivinhe os traços dos outros jogadores em tempo real.",
          activity_url: "/atividades/gartic",
          icon_url: "https://gartic.io/static/images/avatar/1.png",
          level: "1-5", category: "Artes & Vocabulário", bncc_code: "EF15AR04, EF15AR02, EF01LP01", subject: "Artes"
        },
        {
          title: "Akinator - O Gênio da Lógica",
          description: "Jogo de lógica, classificação e dedução! Pense em um personagem e responda às perguntas do gênio Akinator.",
          activity_url: "/atividades/akinator",
          icon_url: "https://pt.akinator.com/assets/img/akinator.png",
          level: "1-5", category: "Lógica & Dedução", bncc_code: "EF01MA09, EF02MA18, EF35LP05", subject: "Matemática"
        },
        {
          title: "Laboratório de Circuitos (Tinkercad)",
          description: "Monte e simule circuitos elétricos, baterias, leds e resistores em um ambiente virtual interativo e seguro.",
          activity_url: "https://www.tinkercad.com/circuits",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3067/3067345.png",
          level: "6-9", category: "Eletrônica & Robótica", bncc_code: "EF08CI02, EF08CI05", subject: "Ciências"
        },
        {
          title: "LEVEL UP: O Jogo da Vida não tem Botão de Reset",
          description: "Simulador de escolhas, projeto de vida e tomada de decisão sobre finanças, estudos e cidadania.",
          activity_url: "/games/missao-respeito/index.html",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
          level: "6-9", category: "Projeto de Vida", bncc_code: "EF06MA32, EF09MA20", subject: "Geral"
        }
      ];

      for (const act of fullActivities) {
        try {
          const searchTitle = act.title.replace('⭐ ', '').split('[')[0].trim();
          const existing = await queryGet("SELECT id FROM activities WHERE title LIKE ? LIMIT 1", [\`%\${searchTitle}%\`]);
          if (existing) {
            await queryRun(
              "UPDATE activities SET title = ?, description = ?, activity_url = ?, icon_url = ?, level = ?, category = ?, bncc_code = ?, subject = ? WHERE id = ?",
              [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject, existing.id]
            );
          } else {
            await queryRun(
              "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
              [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject]
            );
          }
        } catch(e) {}
      }

      // Ensure all 15 blog articles exist and have valid activity_url
      const fullArticles = [
        {
          title: "⭐ Leitura Divertida no Datashow: Como Usar o Jogo Autoral de Alfabetização",
          summary: "Conheça a ferramenta autoral exclusiva do Lab Kids desenvolvida para projeção em datashow na sala de aula, estimulando a leitura e a hipótese silábica.",
          category: "Jogo Autoral Lab Kids", author: "Prof. Fábio Vieitas", activity_url: "/atividades/leitura-datashow",
          image_url: "https://cdn-icons-png.flaticon.com/512/3429/3429433.png",
          content: \`<h2>⭐ Apresentação do Jogo Autoral Lab Kids</h2><p>O <strong>Leitura Divertida no Datashow</strong> é um recurso digital <strong>autoral e exclusivo</strong> desenvolvido para projeção coletiva de palavras, sílabas e frases.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP01</strong></li><li><strong>EF01LP08</strong></li><li><strong>EF02LP04</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Utilização do recurso digital autoral Leitura Divertida no Datashow para projeção coletiva de cards de alfabetização e fluência leitora (BNCC: EF01LP01, EF01LP08, EF02LP04)."</em></div>\`
        },
        {
          title: "Brincando com Ariê 1: Alfabetização e Números na Educação Infantil",
          summary: "Descubra como o jogo Brincando com Ariê 1 desenvolve a consciência fonológica, contagem inicial e formas geométricas de maneira lúdica.",
          category: "Alfabetização", author: "Prof. Fábio Vieitas", activity_url: "/atividades/brincando-com-arie-1",
          image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081884.png",
          content: \`<h2>🦁 Importância do Brincando com Ariê 1</h2><p>O jogo <strong>Brincando com Ariê 1</strong> desenvolve o reconhecimento de vogais, alfabeto e números iniciais.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EI02ET06</strong></li><li><strong>EF01LP10</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Uso do jogo digital Brincando com Ariê 1 para reconhecimento do alfabeto e contagem numérica inicial (BNCC: EI02ET06, EF01LP10)."</em></div>\`
        },
        {
          title: "Brincando com Ariê 2: Formação de Sílabas e Memória",
          summary: "Saiba como utilizar o segundo volume da série Ariê para consolidar a separação silábica, vocabulário e memória auditiva na alfabetização.",
          category: "Alfabetização", author: "Prof. Fábio Vieitas", activity_url: "/atividades/brincando-com-arie-2",
          image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
          content: \`<h2>🧩 Consolidação Silábica com o Ariê 2</h2><p>Trabalha a junção de sílabas simples e memória visual.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP10</strong></li><li><strong>EF01MA01</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Prática pedagógica interativa focada na segmentação silábica no Brincando com Ariê 2 (BNCC: EF01LP10, EF01MA01)."</em></div>\`
        },
        {
          title: "Brincando com Ariê 3: Leitura Avançada e Raciocínio Lógico",
          summary: "Guia pedagógico para trabalhar leitura de palavras complexas, pequenas frases e desafios de adição com a turma do Ariê 3.",
          category: "Alfabetização Avançada", author: "Prof. Fábio Vieitas", activity_url: "/atividades/brincando-com-arie-3",
          image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081987.png",
          content: \`<h2>🚀 Avançando na Leitura com o Ariê 3</h2><p>Leitura de frases e operações de adição.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP12</strong></li><li><strong>EF02MA05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Aplicação do jogo digital Brincando com Ariê 3 para leitura de frases e fatos básicos da adição (BNCC: EF01LP12, EF02MA05)."</em></div>\`
        },
        {
          title: "Chapeuzinho e o Enigma: Ortografia e Raciocínio no Conto de Fadas",
          summary: "Veja como trabalhar a história da Chapeuzinho Vermelho articulando quebra-cabeças ortográficos e raciocínio visual.",
          category: "Alfabetização & Literatura", author: "Prof. Fábio Vieitas", activity_url: "/atividades/chapeuzinho-enigma",
          image_url: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
          content: \`<h2>🌲 Raciocínio e Literatura Infantil</h2><p>Desafios lúdicos articulados com literatura infantil.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP02</strong></li><li><strong>EF15AR04</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Desafios digitais de ortografia e raciocínio no jogo Chapeuzinho e o Enigma (BNCC: EF01LP02, EF15AR04)."</em></div>\`
        },
        {
          title: "Capitão Alberto e o Faraó: Viagem Histórica ao Egito Antigo",
          summary: "Descubra como abordar a civilização egípcia, hieróglifos e mapas históricos com turmas do Ensino Fundamental.",
          category: "História & Geografia", author: "Prof. Fábio Vieitas", activity_url: "/atividades/capitao-alberto-farao",
          image_url: "https://cdn-icons-png.flaticon.com/512/2617/2617876.png",
          content: \`<h2>🏛️ Explorando o Egito Antigo</h2><p>Estudo gamificado sobre hieróglifos e monumentos históricos.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF02HI02</strong></li><li><strong>EF03HI01</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Estudo gamificado sobre o Egito Antigo no Capitão Alberto e o Faraó (BNCC: EF02HI02, EF03HI01)."</em></div>\`
        },
        {
          title: "Ariê Colorir: Artes Visuais, Paleta de Cores e Coordenação Visomotora",
          summary: "Explore a sensibilidade estética e a coordenação motora fina no ambiente digital através da pintura no Ariê Colorir.",
          category: "Artes Visuais", author: "Prof. Fábio Vieitas", activity_url: "/atividades/arie-colorir",
          image_url: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
          content: \`<h2>🎨 Expressão Artística Digital</h2><p>Pintura e exploração visomotora digital.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF15AR04</strong></li><li><strong>EI02CG05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Expressão artística digital e exploração de cores no Ariê Colorir (BNCC: EF15AR04, EI02CG05)."</em></div>\`
        },
        {
          title: "Tabuada - O Chão é Lava!: Cálculo Mental Rápido e Multiplicação",
          summary: "Como transformar a prática da tabuada de multiplicação em um jogo de agilidade e ação sem memorização mecânica.",
          category: "Matemática Divertida", author: "Prof. Fábio Vieitas", activity_url: "/atividades/tabuada-chao-e-lava",
          image_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
          content: \`<h2>🔥 Agilidade com a Tabuada</h2><p>Treino interativo de fatos básicos da multiplicação.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF03MA03</strong></li><li><strong>EF04MA04</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Treino de cálculo mental nos fatos básicos da multiplicação no jogo Tabuada O Chão é Lava (BNCC: EF03MA03, EF04MA04)."</em></div>\`
        },
        {
          title: "Caça-Palavras Temático: Varredura Visual e Ortografia Divertida",
          summary: "Saiba como o caça-palavras por categorias aprimora o reconhecimento ortográfico e a atenção seletiva das crianças.",
          category: "Vocabulário & Ortografia", author: "Prof. Fábio Vieitas", activity_url: "/atividades/caca-palavras-temas",
          image_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
          content: \`<h2>🔍 Atenção e Ortografia</h2><p>Varredura visual e vocabulário ortográfico.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01LP02</strong></li><li><strong>EF02LP04</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Varredura visual e fixação de vocabulário ortográfico no Caça-Palavras Temático (BNCC: EF01LP02, EF02LP04)."</em></div>\`
        },
        {
          title: "Tux Math: Cálculo Mental Divertido e Guia BNCC para Sala de Aula",
          summary: "Descubra como o jogo digital Tux Math estimula o cálculo mental rápido, reduz a ansiedade matemática e confira o texto pronto para o diário.",
          category: "Práticas Pedagógicas", author: "Prof. Fábio Vieitas", activity_url: "/atividades/tux-math",
          image_url: "https://cdn-icons-png.flaticon.com/512/2165/2165683.png",
          content: \`<h2>🎮 O que é o Tux Math?</h2><p>Jogo arcade para defesa da cidade com equações matemáticas.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01MA06</strong></li><li><strong>EF02MA05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Desenvolvimento de cálculo mental rápido no Tux Math (BNCC: EF01MA06, EF02MA05)."</em></div>\`
        },
        {
          title: "Pou Online na Escola: Hábitos de Saúde, Nutrição e Gestão do Tempo",
          summary: "Como utilizar a empatia com o mascote virtual para ensinar higiene, rotina e cuidados com a saúde física e mental.",
          category: "Ciências & Hábitos", author: "Prof. Fábio Vieitas", activity_url: "/atividades/pou-online",
          image_url: "https://cdn.jogos360.com.br/po/uo/pou-online-d.jpg",
          content: \`<h2>🛁 Autocuidado e Rotina com o Pou</h2><p>Hábitos de higiene e responsabilidade pessoal.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EI03CG04</strong></li><li><strong>EF01CI01</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Hábitos de higiene e nutrição saudável no jogo Pou Online (BNCC: EI03CG04, EF01CI01)."</em></div>\`
        },
        {
          title: "Gartic.io na Sala de Aula: Expressão Artística e Vocabulário Coletivo",
          summary: "Veja como a dinâmica de desenho e adivinhação em tempo real estimula a hipótese de escrita e cooperação em grupo.",
          category: "Artes & Vocabulário", author: "Prof. Fábio Vieitas", activity_url: "/atividades/gartic",
          image_url: "https://gartic.io/static/images/avatar/1.png",
          content: \`<h2>🎨 Desenho e Adivinhação Coletiva</h2><p>Expressão artística e vocabulário colaborativo.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF15AR04</strong></li><li><strong>EF01LP01</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Artes e vocabulário colaborativo no Gartic.io (BNCC: EF15AR04, EF01LP01)."</em></div>\`
        },
        {
          title: "Akinator no Ensino de Lógica: Dedução e Pensamento Computacional",
          summary: "Como o jogo das 20 perguntas desenvolve raciocínio categórico, ordenação de atributos e estruturas lógicas de decisão.",
          category: "Lógica & Pensamento Computacional", author: "Prof. Fábio Vieitas", activity_url: "/atividades/akinator",
          image_url: "https://pt.akinator.com/assets/img/akinator.png",
          content: \`<h2>🧞‍♂️ Lógica e Árvores de Decisão</h2><p>Classificação por atributos e dedução lógica.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF01MA09</strong></li><li><strong>EF35LP05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Pensamento computacional e dedução lógica com o Akinator (BNCC: EF01MA09, EF35LP05)."</em></div>\`
        },
        {
          title: "Laboratório de Circuitos Tinkercad: Simulação Virtual de Eletrônica",
          summary: "Como utilizar simulações virtuais seguras para ensinar componentes elétricos, leds e corrente no Ensino Fundamental II.",
          category: "Ciências & Robótica", author: "Prof. Fábio Vieitas", activity_url: "https://www.tinkercad.com/circuits",
          image_url: "https://cdn-icons-png.flaticon.com/512/3067/3067345.png",
          content: \`<h2>⚡ Simulação Elétrica Segura</h2><p>Simulação virtual de componentes elétricos.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF08CI02</strong></li><li><strong>EF08CI05</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Simulação virtual de circuitos elétricos no Tinkercad (BNCC: EF08CI02, EF08CI05)."</em></div>\`
        },
        {
          title: "LEVEL UP O Jogo da Vida: Educação Financeira, Cidadania e Escolhas",
          summary: "Guia para trabalhar responsabilidade, orçamento pessoal e Projeto de Vida com turmas dos anos finais.",
          category: "Cidadania & Projeto de Vida", author: "Prof. Fábio Vieitas", activity_url: "/games/missao-respeito/index.html",
          image_url: "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
          content: \`<h2>🎮 Projeto de Vida e Tomada de Decisão</h2><p>Educação financeira e escolhas de cidadania.</p><h2>📘 Habilidades BNCC</h2><ul><li><strong>EF06MA32</strong></li><li><strong>EF09MA20</strong></li></ul><h2>📝 Registro para o Diário de Classe</h2><div style="background: #f1f5f9; padding: 20px; border-radius: 16px;"><em>"Educação financeira e tomada de decisões com o jogo LEVEL UP (BNCC: EF06MA32, EF09MA20)."</em></div>\`
        }
      ];

      for (const art of fullArticles) {
        try {
          const searchTitle = art.title.replace('⭐ ', '').split(':')[0].trim();
          const existing = await queryGet("SELECT id FROM news WHERE title LIKE ? LIMIT 1", [\`%\${searchTitle}%\`]);
          if (existing) {
            await queryRun(
              "UPDATE news SET title = ?, summary = ?, content = ?, image_url = ?, category = ?, author = ?, activity_url = ?, created_at = CURRENT_TIMESTAMP, published_at = CURRENT_TIMESTAMP WHERE id = ?",
              [art.title, art.summary, art.content, art.image_url, art.category, art.author, art.activity_url, existing.id]
            );
          } else {
            await queryRun(
              "INSERT INTO news (title, summary, content, image_url, category, author, activity_url, created_at, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)",
              [art.title, art.summary, art.content, art.image_url, art.category, art.author, art.activity_url]
            );
          }
        } catch(e) {}
      }
`;

// Insert fullSeederCode into initTables before closing catch
const endOfInitTables = "    } catch(e) {\n      console.error('[DB Engine Seed Error]:', e.message);\n    }\n}";
if (dbCode.includes(endOfInitTables)) {
  dbCode = dbCode.replace(endOfInitTables, fullSeederCode + "\n    } catch(e) {\n      console.error('[DB Engine Seed Error]:', e.message);\n    }\n}");
  fs.writeFileSync(dbPath, dbCode, 'utf8');
  console.log('✅ db.js initTables patched with FULL 15 activities and 15 articles seeder!');
} else {
  console.error('Could not find endOfInitTables string in db.js!');
}
