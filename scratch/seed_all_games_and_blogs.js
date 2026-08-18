const dbHelper = require('../db');

const activitiesList = [
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

const articlesList = [
  {
    title: "⭐ Leitura Divertida no Datashow: Como Usar o Jogo Autoral de Alfabetização",
    summary: "Conheça a ferramenta autoral exclusiva do Lab Kids desenvolvida para projeção em datashow na sala de aula, estimulando a leitura e a hipótese silábica.",
    category: "Jogo Autoral Lab Kids",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/leitura-datashow",
    image_url: "https://cdn-icons-png.flaticon.com/512/3429/3429433.png",
    content: `<h2>⭐ Apresentação do Jogo Autoral Lab Kids</h2>
<p>O <strong>Leitura Divertida no Datashow</strong> é um recurso digital <strong>autoral e exclusivo</strong> desenvolvido pela equipe Lab Kids especificamente para a realidade das salas de aula brasileiras. Projetado para ser exibido em datashow, Smart TV ou tela cheia, o sistema apresenta cards visuais interativos que desafiam os alunos a lerem palavras, sílabas e frases de forma coletiva ou individual.</p>

<p>Com um design limpo e botões de grande dimensão, o jogo promove o engajamento de toda a turma, transformando o momento da leitura em uma brincadeira interativa onde cada acerto é comemorado com efeitos visuais de confete e incentivos sonoros.</p>

<h2>📘 Habilidades da BNCC contempladas</h2>
<ul>
  <li><strong>EF01LP01:</strong> Reconhecer que nomes impressos representam palavras faladas.</li>
  <li><strong>EF01LP08:</strong> Relacionar elementos sonoros das palavras com sua escrita (consciência fonológica).</li>
  <li><strong>EF02LP04:</strong> Ler e escrever palavras com correspondências grafofônicas regulares diretas.</li>
</ul>

<h2>👩‍🏫 Dicas de Aplicação em Sala de Aula</h2>
<ol>
  <li><strong>Leitura em Coro:</strong> Projete a palavra no datashow e peça para toda a turma ler em voz alta de forma sincronizada.</li>
  <li><strong>Desafio do Estudante Misterioso:</strong> Escolha um aluno por vez para subir até a frente da sala e ler o card antes de revelar a imagem.</li>
</ol>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe (Resumo para Copiar e Colar)</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <strong>Modelo de Registro de Aula:</strong><br><br>
  <em>"Utilização do recurso digital autoral Leitura Divertida no Datashow para projeção coletiva de cards de alfabetização, estímulo à fluência leitora e associação grafofônica (Habilidades BNCC: EF01LP01, EF01LP08, EF02LP04)."</em>
</div>`
  },
  {
    title: "Brincando com Ariê 1: Alfabetização e Números na Educação Infantil",
    summary: "Descubra como o jogo Brincando com Ariê 1 desenvolve a consciência fonológica, contagem inicial e formas geométricas de maneira lúdica.",
    category: "Alfabetização",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/brincando-com-arie-1",
    image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081884.png",
    content: `<h2>🦁 Importância do Brincando com Ariê 1</h2>
<p>O jogo <strong>Brincando com Ariê 1</strong> é ideal para crianças da Educação Infantil e 1º Ano do Ensino Fundamental. Com cenários coloridos e animações cativantes, o jogo guia a criança na identificação do alfabeto, vogais, reconhecimento de números iniciais e formas geométricas básicas.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EI02EF04:</strong> Formular e responder perguntas sobre fatos da história narrada.</li>
  <li><strong>EI02ET06:</strong> Relacionar números às suas respectivas quantidades.</li>
  <li><strong>EF01LP10:</strong> Nomear as letras do alfabeto e recitá-lo na ordem das letras.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Uso do jogo digital Brincando com Ariê 1 para reconhecimento do alfabeto, contagem numérica inicial e discriminação visual de formas (BNCC: EI02ET06, EF01LP10)."</em>
</div>`
  },
  {
    title: "Brincando com Ariê 2: Formação de Sílabas e Memória",
    summary: "Saiba como utilizar o segundo volume da série Ariê para consolidar a separação silábica, vocabulário e memória auditiva na alfabetização.",
    category: "Alfabetização",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/brincando-com-arie-2",
    image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081917.png",
    content: `<h2>🧩 Consolidação Silábica com o Ariê 2</h2>
<p>O <strong>Brincando com Ariê 2</strong> amplia os conceitos trabalhados no primeiro volume, focando na junção de sílabas simples (ba, be, bi, bo, bu), contagem de elementos em conjuntos e desafios de memória visual.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EI03EF04:</strong> Selecionar livros e textos de seu interesse para leitura.</li>
  <li><strong>EF01LP10:</strong> Segmentar oralmente palavras em sílabas.</li>
  <li><strong>EF01MA01:</strong> Utilizar números naturais como indicador de quantidade.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Prática pedagógica interativa com o jogo Brincando com Ariê 2 focada na segmentação silábica, raciocínio lógico-matemático e memória (BNCC: EF01LP10, EF01MA01)."</em>
</div>`
  },
  {
    title: "Brincando com Ariê 3: Leitura Avançada e Raciocínio Lógico",
    summary: "Guia pedagógico para trabalhar leitura de palavras complexas, pequenas frases e desafios de adição com a turma do Ariê 3.",
    category: "Alfabetização Avançada",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/brincando-com-arie-3",
    image_url: "https://cdn-icons-png.flaticon.com/512/3081/3081987.png",
    content: `<h2>🚀 Avançando na Leitura com o Ariê 3</h2>
<p>Recomendado para o 1º e 2º Ano, o <strong>Brincando com Ariê 3</strong> introduz o aluno à leitura fluente de pequenas frases, ortografia de palavras com encontros vocálicos e consonantais, além de pequenas somas de adição.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF01LP12:</strong> Reconhecer a organização da frase no texto.</li>
  <li><strong>EF02LP01:</strong> Utilizar grafias corretas de palavras de uso frequente.</li>
  <li><strong>EF02MA05:</strong> Construir fatos básicos da adição.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Aplicação do jogo digital Brincando com Ariê 3 para desenvolvimento de leitura de frases curtas, ortografia e fatos básicos da adição (BNCC: EF01LP12, EF02MA05)."</em>
</div>`
  },
  {
    title: "Chapeuzinho e o Enigma: Ortografia e Raciocínio no Conto de Fadas",
    summary: "Veja como trabalhar a história da Chapeuzinho Vermelho articulando quebra-cabeças ortográficos e raciocínio visual.",
    category: "Alfabetização & Literatura",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/chapeuzinho-enigma",
    image_url: "https://cdn-icons-png.flaticon.com/512/3063/3063822.png",
    content: `<h2>🌲 Raciocínio e Literatura Infantil</h2>
<p>O jogo <strong>Chapeuzinho e o Enigma</strong> utiliza a narrativa consagrada dos contos de fadas para propor enigmas de associação de palavras, sequenciamento lógico de imagens e discriminação auditiva.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF01LP02:</strong> Escrever espontaneamente ou por ditado palavras conhecidas.</li>
  <li><strong>EF01LP05:</strong> Reconhecer o sistema de escrita alfabética.</li>
  <li><strong>EF15AR04:</strong> Experimentar diferentes formas de expressão artística.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Resolução de desafios digitais de ortografia e raciocínio lógico no jogo Chapeuzinho e o Enigma articulado com literatura infantil (BNCC: EF01LP02, EF15AR04)."</em>
</div>`
  },
  {
    title: "Capitão Alberto e o Faraó: Viagem Histórica ao Egito Antigo",
    summary: "Descubra como abordar a civilização egípcia, hieróglifos e mapas históricos com turmas do Ensino Fundamental.",
    category: "História & Geografia",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/capitao-alberto-farao",
    image_url: "https://cdn-icons-png.flaticon.com/512/2617/2617876.png",
    content: `<h2>🏛️ Explorando o Egito Antigo</h2>
<p>No jogo <strong>Capitão Alberto e o Faraó</strong>, os estudantes exploram pirâmides, decifram símbolos de hieróglifos e compreendem aspectos culturais e geográficos do Egito Antigo de forma gamificada.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF01HI01:</strong> Identificar aspectos do seu grupo social e de outras culturas.</li>
  <li><strong>EF02HI02:</strong> Identificar costumes e histórias da antiguidade.</li>
  <li><strong>EF03HI01:</strong> Identificar os grupos populacionais e monumentos históricos.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Estudo gamificado sobre o Egito Antigo, escrita hieroglífica e monumentos históricos com o jogo Capitão Alberto e o Faraó (BNCC: EF02HI02, EF03HI01)."</em>
</div>`
  },
  {
    title: "Ariê Colorir: Artes Visuais, Paleta de Cores e Coordenação Visomotora",
    summary: "Explore a sensibilidade estética e a coordenação motora fina no ambiente digital através da pintura no Ariê Colorir.",
    category: "Artes Visuais",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/arie-colorir",
    image_url: "https://cdn-icons-png.flaticon.com/512/2970/2970785.png",
    content: `<h2>🎨 Expressão Artística Digital</h2>
<p>O <strong>Ariê Colorir</strong> oferece um espaço de criação visual onde os alunos exploram misturas de cores, limites de contorno e coordenação motora usando o mouse ou telas sensíveis ao toque.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF15AR04:</strong> Experimentar formas de expressão nas artes visuais.</li>
  <li><strong>EF15AR02:</strong> Pesquisar e dobrar o uso de elementos da linguagem visual (linha, ponto, cor).</li>
  <li><strong>EI02CG05:</strong> Desenvolver a coordenação motora fina.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Atividade de expressão artística digital e exploração de paleta de cores visando o aprimoramento visomotor no Ariê Colorir (BNCC: EF15AR04, EI02CG05)."</em>
</div>`
  },
  {
    title: "Tabuada - O Chão é Lava!: Cálculo Mental Rápido e Multiplicação",
    summary: "Como transformar a prática da tabuada de multiplicação em um jogo de agilidade e ação sem memorização mecânica.",
    category: "Matemática Divertida",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/tabuada-chao-e-lava",
    image_url: "https://cdn-icons-png.flaticon.com/512/4341/4341134.png",
    content: `<h2>🔥 Agilidade com a Tabuada</h2>
<p>O jogo <strong>Tabuada - O Chão é Lava!</strong> desafia o aluno a selecionar rapidamente o produto correto da multiplicação para evitar que a plataforma afunde na lava. Excelente recurso para consolidação do cálculo mental.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF02MA05:</strong> Construir fatos básicos da adição e multiplicação.</li>
  <li><strong>EF03MA03:</strong> Construir e utilizar fatos básicos da multiplicação para o cálculo mental.</li>
  <li><strong>EF04MA04:</strong> Utilizar estratégias de cálculo mental com produtos conhecidos.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Treino interativo de cálculo mental e agilidade nos fatos básicos da multiplicação com o jogo Tabuada O Chão é Lava (BNCC: EF03MA03, EF04MA04)."</em>
</div>`
  },
  {
    title: "Caça-Palavras Temático: Varredura Visual e Ortografia Divertida",
    summary: "Saiba como o caça-palavras por categorias aprimora o reconhecimento ortográfico e a atenção seletiva das crianças.",
    category: "Vocabulário & Ortografia",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/caca-palavras-temas",
    image_url: "https://cdn-icons-png.flaticon.com/512/2497/2497621.png",
    content: `<h2>🔍 Atenção e Ortografia</h2>
<p>Organizado por categorias como Animais, Frutas, Escola e Meio Ambiente, o <strong>Caça-Palavras Temático</strong> desenvolve a busca visual sistemática e a atenção à grafia correta das palavras.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF01LP02:</strong> Escrever palavras observando a grafia correta.</li>
  <li><strong>EF02LP04:</strong> Ler e identificar palavras em diferentes contextos.</li>
  <li><strong>EF35LP05:</strong> Inferir o sentido de palavras em textos e listas.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Desenvolvimento de varredura visual e fixação de vocabulário ortográfico por meio do jogo Caça-Palavras Temático (BNCC: EF01LP02, EF02LP04)."</em>
</div>`
  },
  {
    title: "Tux Math: Cálculo Mental Divertido e Guia BNCC para Sala de Aula",
    summary: "Descubra como o jogo digital Tux Math estimula o cálculo mental rápido, reduz a ansiedade matemática e confira o texto pronto para o diário.",
    category: "Práticas Pedagógicas",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/tux-math",
    image_url: "https://cdn-icons-png.flaticon.com/512/2165/2165683.png",
    content: `<h2>🎮 O que é o Tux Math?</h2>
<p>O <strong>Tux Math</strong> é um jogo arcade consagrado para o ensino de matemática nos anos iniciais do Ensino Fundamental, onde o aluno defende cidades resolvendo equações matemáticas de cometas que caem em tempo real.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF01MA06:</strong> Construir fatos básicos da adição.</li>
  <li><strong>EF02MA05:</strong> Fatos básicos da adição e subtração.</li>
  <li><strong>EF03MA03:</strong> Fatos básicos da multiplicação e divisão.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Utilização do recurso digital Tux Math para o desenvolvimento do cálculo mental rápido e consolidação dos fatos básicos de adição e subtração (BNCC: EF01MA06, EF02MA05)."</em>
</div>`
  },
  {
    title: "Pou Online na Escola: Hábitos de Saúde, Nutrição e Gestão do Tempo",
    summary: "Como utilizar a empatia com o mascote virtual para ensinar higiene, rotina e cuidados com a saúde física e mental.",
    category: "Ciências & Hábitos",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/pou-online",
    image_url: "https://cdn.jogos360.com.br/po/uo/pou-online-d.jpg",
    content: `<h2>🛁 Autocuidado e Rotina com o Pou</h2>
<p>No <strong>Pou Online</strong>, a criança assume a responsabilidade de alimentar, dar banho, medicar e colocar para dormir seu bichinho virtual, associando ações do jogo aos hábitos de vida saudáveis da sua própria rotina.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EI03CG04:</strong> Adotar hábitos autocuidado e rotinas de higiene.</li>
  <li><strong>EI03EO02:</strong> Demonstrar imagem positiva de si e empatia.</li>
  <li><strong>EF01CI01:</strong> Comparar características de seres vivos e seus cuidados.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Discussão pedagógica e vivência digital sobre hábitos de higiene, nutrição saudável e responsabilidade pessoal com o jogo Pou Online (BNCC: EI03CG04, EF01CI01)."</em>
</div>`
  },
  {
    title: "Gartic.io na Sala de Aula: Expressão Artística e Vocabulário Coletivo",
    summary: "Veja como a dinâmica de desenho e adivinhação em tempo real estimula a hipótese de escrita e cooperação em grupo.",
    category: "Artes & Vocabulário",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/gartic",
    image_url: "https://gartic.io/static/images/avatar/1.png",
    content: `<h2>🎨 Desenho e Adivinhação Coletiva</h2>
<p>O <strong>Gartic.io</strong> permite que alunos desenhem termos sorteados enquanto os colegas adivinham a palavra digitando no chat. Uma ferramenta fantástica para articular artes visuais e síntese de vocabulário.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF15AR04:</strong> Expressão visual de ideias e conceitos.</li>
  <li><strong>EF15AR02:</strong> Produção artística em meios digitais.</li>
  <li><strong>EF01LP01:</strong> Leitura e escrita de palavras sugeridas por imagens.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Atividade de artes e vocabulário colaborativo em tempo real através do jogo Gartic.io (BNCC: EF15AR04, EF01LP01)."</em>
</div>`
  },
  {
    title: "Akinator no Ensino de Lógica: Dedução e Pensamento Computacional",
    summary: "Como o jogo das 20 perguntas desenvolve raciocínio categórico, ordenação de atributos e estruturas lógicas de decisão.",
    category: "Lógica & Pensamento Computacional",
    author: "Prof. Fábio Vieitas",
    activity_url: "/atividades/akinator",
    image_url: "https://pt.akinator.com/assets/img/akinator.png",
    content: `<h2>🧞‍♂️ Lógica e Árvores de Decisão</h2>
<p>No <strong>Akinator</strong>, a inteligência artificial tenta adivinhar o personagem pensado através de perguntas fechadas ("Sim", "Não", "Provavelmente"). Os alunos aprendem a importância do refinamento das perguntas e categorização lógica.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF01MA09:</strong> Organizar e classificar objetos por atributos.</li>
  <li><strong>EF02MA18:</strong> Classificar eventos por probabilidades.</li>
  <li><strong>EF35LP05:</strong> Dedução de sentido e informações implícitas.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Exercício de pensamento computacional, classificação por atributos e dedução lógica com o jogo Akinator (BNCC: EF01MA09, EF35LP05)."</em>
</div>`
  },
  {
    title: "Laboratório de Circuitos Tinkercad: Simulação Virtual de Eletrônica",
    summary: "Como utilizar simulações virtuais seguras para ensinar componentes elétricos, leds e corrente no Ensino Fundamental II.",
    category: "Ciências & Robótica",
    author: "Prof. Fábio Vieitas",
    activity_url: "https://www.tinkercad.com/circuits",
    image_url: "https://cdn-icons-png.flaticon.com/512/3067/3067345.png",
    content: `<h2>⚡ Simulação Elétrica Segura</h2>
<p>O <strong>Laboratório de Circuitos Tinkercad</strong> permite a montagem de protótipos elétricos com leds, resistores e motores sem risco de acidentes, preparando os alunos para projetos práticos de robótica.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF08CI02:</strong> Construir circuitos elétricos simples com componentes básicos.</li>
  <li><strong>EF08CI05:</strong> Propor transformações de energia elétrica em luz e movimento.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Simulação virtual interativa de circuitos elétricos, voltagem e componentes eletrônicos no Tinkercad Circuits (BNCC: EF08CI02, EF08CI05)."</em>
</div>`
  },
  {
    title: "LEVEL UP O Jogo da Vida: Educação Financeira, Cidadania e Escolhas",
    summary: "Guia para trabalhar responsabilidade, orçamento pessoal e Projeto de Vida com turmas dos anos finais.",
    category: "Cidadania & Projeto de Vida",
    author: "Prof. Fábio Vieitas",
    activity_url: "/games/missao-respeito/index.html",
    image_url: "https://cdn-icons-png.flaticon.com/512/2991/2991108.png",
    content: `<h2>🎮 Projeto de Vida e Tomada de Decisão</h2>
<p>O <strong>LEVEL UP: O Jogo da Vida</strong> coloca o estudante diante de dilemas do cotidiano sobre escolhas financeiras, carreira, convivência social e resiliência diante de imprevistos.</p>

<h2>📘 Habilidades da BNCC</h2>
<ul>
  <li><strong>EF06MA32:</strong> Resolver problemas envolvendo educação financeira.</li>
  <li><strong>EF09MA20:</strong> Analisar gráficos e tomada de decisões.</li>
</ul>

<h2 style="color: #4f46e5; background: #e0e7ff; padding: 15px 20px; border-radius: 14px; border-left: 6px solid #4338ca;">📝 Registro para o Diário de Classe</h2>
<div style="background: #f1f5f9; border: 2px dashed #6366f1; border-radius: 16px; padding: 20px; font-family: monospace; font-size: 1.05rem; color: #1e293b; margin: 15px 0;">
  <em>"Vivência gamificada sobre educação financeira, tomada de decisões conscientes e cidadania com o jogo LEVEL UP (BNCC: EF06MA32, EF09MA20)."</em>
</div>`
  }
];

async function run() {
  await new Promise(r => setTimeout(r, 2000));
  console.log('Seeding activities and blog posts...');

  // 1. Clear and re-seed activities
  for (const act of activitiesList) {
    try {
      const existing = await dbHelper.queryGet("SELECT id FROM activities WHERE title LIKE ? LIMIT 1", [`%${act.title.replace('⭐ ', '').split('[')[0].trim()}%`]);
      if (existing) {
        await dbHelper.queryRun(
          "UPDATE activities SET title = ?, description = ?, activity_url = ?, icon_url = ?, level = ?, category = ?, bncc_code = ?, subject = ? WHERE id = ?",
          [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject, existing.id]
        );
        console.log(`✅ Updated activity: ${act.title}`);
      } else {
        await dbHelper.queryRun(
          "INSERT INTO activities (title, description, activity_url, icon_url, level, category, status, bncc_code, subject) VALUES (?, ?, ?, ?, ?, ?, 'public', ?, ?)",
          [act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject]
        );
        console.log(`✨ Inserted activity: ${act.title}`);
      }
    } catch(e) {
      console.error('Error seeding activity:', act.title, e.message);
    }
  }

  // 2. Clear old news and seed all 15 blog articles
  try {
    await dbHelper.queryRun("DELETE FROM news");
  } catch(e){}

  for (const art of articlesList) {
    try {
      await dbHelper.queryRun(
        "INSERT INTO news (title, summary, content, image_url, category, author, activity_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [art.title, art.summary, art.content, art.image_url, art.category, art.author, art.activity_url]
      );
      console.log(`📰 Article created: "${art.title}"`);
    } catch(e) {
      // If activity_url column doesn't exist yet, insert without activity_url or alter table
      try {
        await dbHelper.queryRun(
          "INSERT INTO news (title, summary, content, image_url, category, author) VALUES (?, ?, ?, ?, ?, ?)",
          [art.title, art.summary, art.content, art.image_url, art.category, art.author]
        );
        console.log(`📰 Article created (fallback): "${art.title}"`);
      } catch(err) {
        console.error('Error seeding article:', art.title, err.message);
      }
    }
  }

  console.log('✅ ALL ACTIVITIES AND BLOG ARTICLES SEEDED SUCCESSFULLY!');
}

run().catch(console.error);
