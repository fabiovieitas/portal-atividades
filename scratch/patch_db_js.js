const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.js');
let dbCode = fs.readFileSync(dbPath, 'utf8');

// Replace fallback array
const newFallbackArray = `    if (!rows || rows.length === 0) {
      rows = [
        {
          id: 1,
          title: "⭐ Leitura Divertida no Datashow [JOGO AUTORAL]",
          description: "⚡ JOGO AUTORAL LAB KIDS! Ferramenta pedagógica interativa para projeção de palavras, sílabas e leitura guiada em datashow ou tela cheia.",
          activity_url: "/atividades/leitura-datashow",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3429/3429433.png",
          level: "1-5", category: "Alfabetização Autoral", subject: "Português", bncc_code: "EF01LP01, EF01LP08, EF02LP04", status: "public", visits: 850
        },
        {
          id: 2,
          title: "Brincando com Ariê 1",
          description: "Jogo educativo para auxílio à alfabetização, reconhecimento de cores, frutas e associação de palavras.",
          activity_url: "/atividades/brincando-com-arie-1",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081884.png",
          level: "1-5", category: "Alfabetização", subject: "Português", bncc_code: "EI02EF04, EI02ET06, EF01LP10", status: "public", visits: 500
        },
        {
          id: 3,
          title: "Brincando com Ariê 2",
          description: "Segunda edição da série pedagógica Ariê! Desafios de sílabas, contagem de objetos, memória e associação.",
          activity_url: "/atividades/brincando-com-arie-2",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
          level: "1-5", category: "Alfabetização", subject: "Português", bncc_code: "EI03EF04, EF01LP10, EF01MA01", status: "public", visits: 580
        },
        {
          id: 4,
          title: "Brincando com Ariê 3",
          description: "Terceiro capítulo com exercícios desafiadores de ortografia, associação de frases, adição e raciocínio.",
          activity_url: "/atividades/brincando-com-arie-3",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3081/3081987.png",
          level: "1-5", category: "Alfabetização Avançada", subject: "Português", bncc_code: "EF01LP12, EF02LP01, EF02MA05", status: "public", visits: 620
        },
        {
          id: 5,
          title: "Chapeuzinho e o Enigma",
          description: "Ajude Chapeuzinho Vermelho a atravessar a floresta resolvendo quebra-cabeças de palavras e atenção!",
          activity_url: "/atividades/chapeuzinho-enigma",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
          level: "1-5", category: "Alfabetização & Raciocínio", subject: "Português", bncc_code: "EF01LP02, EF01LP05, EF15AR04", status: "public", visits: 430
        },
        {
          id: 6,
          title: "Capitão Alberto e o Faraó",
          description: "Uma aventura histórica pelo Egito Antigo! Desvende mistérios, hieróglifos e desafios de história.",
          activity_url: "/atividades/capitao-alberto-farao",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2617/2617876.png",
          level: "1-5", category: "História & Aventura", subject: "História", bncc_code: "EF01HI01, EF02HI02, EF03HI01", status: "public", visits: 390
        },
        {
          id: 7,
          title: "Ariê Colorir",
          description: "Atividade artística interativa! Explore a paleta de cores e desenvolva a coordenação motora.",
          activity_url: "/atividades/arie-colorir",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
          level: "1-5", category: "Artes Visuais", subject: "Artes", bncc_code: "EF15AR04, EF15AR02, EI02CG05", status: "public", visits: 510
        },
        {
          id: 8,
          title: "Tabuada - O Chão é Lava!",
          description: "Jogo dinâmico de matemática! Calcule a tabuada rapidamente para salvar os personagens.",
          activity_url: "/atividades/tabuada-chao-e-lava",
          icon_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
          level: "1-5", category: "Matemática Divertida", subject: "Matemática", bncc_code: "EF02MA05, EF03MA03, EF04MA04", status: "public", visits: 670
        },
        {
          id: 9,
          title: "Caça-Palavras Temático",
          description: "Desafio de leitura e ortografia! Encontre palavras escondidas por categorias temáticas.",
          activity_url: "/atividades/caca-palavras-temas",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
          level: "1-5", category: "Vocabulário & Leitura", subject: "Português", bncc_code: "EF01LP02, EF02LP04, EF35LP05", status: "public", visits: 480
        },
        {
          id: 10,
          title: "Tux Math - Matemática Divertida",
          description: "Jogo educativo arcade onde você ajuda o pinguim Tux a defender a cidade resolvendo equações!",
          activity_url: "/atividades/tux-math",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2165/2165683.png",
          level: "1-5", category: "Matemática", subject: "Matemática", bncc_code: "EF01MA06, EF02MA05, EF03MA03", status: "public", visits: 420
        },
        {
          id: 11,
          title: "Pou Online - Mascote Virtual & Rotinas",
          description: "Jogo educativo de responsabilidade, cuidados e rotinas! Alimente e cuide do seu bichinho virtual.",
          activity_url: "/atividades/pou-online",
          icon_url: "https://cdn.jogos360.com.br/po/uo/pou-online-d.jpg",
          level: "1-5", category: "Cuidados & Hábitos", subject: "Ciências", bncc_code: "EI03CG04, EI03EO02, EF01CI01", status: "public", visits: 480
        },
        {
          id: 12,
          title: "Gartic.io - Desenho & Vocabulário",
          description: "Jogo de desenho e adivinhação! Desenhe a palavra sorteada e adivinhe os traços dos outros jogadores.",
          activity_url: "/atividades/gartic",
          icon_url: "https://gartic.io/static/images/avatar/1.png",
          level: "1-5", category: "Artes & Vocabulário", subject: "Artes", bncc_code: "EF15AR04, EF15AR02, EF01LP01", status: "public", visits: 520
        },
        {
          id: 13,
          title: "Akinator - O Gênio da Lógica",
          description: "Jogo de lógica, classificação e dedução! Pense em um personagem e responda às perguntas do gênio.",
          activity_url: "/atividades/akinator",
          icon_url: "https://pt.akinator.com/assets/img/akinator.png",
          level: "1-5", category: "Lógica & Dedução", subject: "Matemática", bncc_code: "EF01MA09, EF02MA18, EF35LP05", status: "public", visits: 610
        },
        {
          id: 14,
          title: "Laboratório de Circuitos (Tinkercad)",
          description: "Monte e simule circuitos elétricos, baterias e leds em um ambiente virtual interativo.",
          activity_url: "https://www.tinkercad.com/circuits",
          icon_url: "https://cdn-icons-png.flaticon.com/512/3067/3067345.png",
          level: "6-9", category: "Eletrônica & Robótica", subject: "Ciências", bncc_code: "EF08CI02, EF08CI05", status: "public", visits: 210
        },
        {
          id: 15,
          title: "LEVEL UP: O Jogo da Vida não tem Botão de Reset",
          description: "Simulador de escolhas, projeto de vida e tomada de decisão sobre finanças e cidadania.",
          activity_url: "/games/missao-respeito/index.html",
          icon_url: "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
          level: "6-9", category: "Projeto de Vida", subject: "Geral", bncc_code: "EF06MA32, EF09MA20", status: "public", visits: 380
        }
      ];
    }`;

const regexFallback = /if \(!rows \|\| rows\.length === 0\) \{[\s\S]*?\n    \}/;
dbCode = dbCode.replace(regexFallback, newFallbackArray);

fs.writeFileSync(dbPath, dbCode, 'utf8');
console.log('✅ db.js patched with clean fallback icons!');
