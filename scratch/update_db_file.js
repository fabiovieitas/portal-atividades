const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db.js');

// 15 Activities with clean high-res icons
const activitiesData = [
  {
    title: "⭐ Leitura Divertida no Datashow [JOGO AUTORAL]",
    description: "⚡ JOGO AUTORAL LAB KIDS! Ferramenta pedagógica interativa para projeção de palavras, sílabas e leitura guiada em datashow ou tela cheia.",
    activity_url: "/atividades/leitura-datashow",
    icon_url: "https://cdn-icons-png.flaticon.com/512/3429/3429433.png",
    level: "1-5", category: "Alfabetização Autoral", bncc_code: "EF01LP01, EF01LP08, EF02LP04", subject: "Português", is_autoral: 1
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

console.log('Script pronto!');
