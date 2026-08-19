/**
 * Banco de Dados de Palavras v3.0 - Sem Acentuação nos Níveis Iniciais (1 e 2)
 */

const WORDS_DATABASE = {
  1: {
    title: "Nível 1: Vogais e Sons Primários",
    description: "Reconhecimento das vogais sem acentos e encontros vocálicos simples.",
    sublevels: {
      "1.1": {
        title: "Subnível 1.1: As Vogais Principais",
        items: [
          { text: "A", syllables: ["A"], image: "🍎", hint: "Abacaxi / Maçã" },
          { text: "E", syllables: ["E"], image: "🐘", hint: "Elefante" },
          { text: "I", syllables: ["I"], image: "🏝️", hint: "Ilha" },
          { text: "O", syllables: ["O"], image: "👁️", hint: "Olho" },
          { text: "U", syllables: ["U"], image: "🍇", hint: "Uva" },
          { text: "A O U", syllables: ["A", "O", "U"], image: "🔤", hint: "Vogais da aula" },
          { text: "E I O", syllables: ["E", "I", "O"], image: "🔤", hint: "Vogais amigas" }
        ]
      },
      "1.2": {
        title: "Subnível 1.2: Encontros Vocálicos Curtos",
        items: [
          { text: "AI", syllables: ["A", "I"], image: "🩹", hint: "Ai! Machucou" },
          { text: "EI", syllables: ["E", "I"], image: "👋", hint: "Ei! Olá" },
          { text: "OI", syllables: ["O", "I"], image: "🙋", hint: "Oi! Tudo bem?" },
          { text: "AU", syllables: ["A", "U"], image: "🐶", hint: "Au Au! Cachorro" },
          { text: "UA", syllables: ["U", "A"], image: "🌙", hint: "Lua" },
          { text: "UI", syllables: ["U", "I"], image: "😱", hint: "Ui! Que susto" },
          { text: "IA", syllables: ["I", "A"], image: "📐", hint: "Ia passear" },
          { text: "EU", syllables: ["E", "U"], image: "🪞", hint: "Eu mesmo!" }
        ]
      },
      "1.3": {
        title: "Subnível 1.3: Palavras de Vogais Combinadas",
        items: [
          { text: "EIA", syllables: ["E", "I", "A"], image: "🐴", hint: "Eia! Cavalo" },
          { text: "UAU", syllables: ["U", "A", "U"], image: "🤩", hint: "Uau! Incrível" },
          { text: "OIA", syllables: ["O", "I", "A"], image: "👀", hint: "Olha lá!" },
          { text: "IOIO", syllables: ["I", "O", "I", "O"], image: "🪀", hint: "Ioiô de brincar" },
          { text: "AUE", syllables: ["A", "U", "E"], image: "🥳", hint: "Festa animada" },
          { text: "IAIA", syllables: ["I", "A", "I", "A"], image: "👧", hint: "Menina carinhosa" },
          { text: "IO", syllables: ["I", "O"], image: "🪀", hint: "Ioiô" }
        ]
      }
    }
  },

  2: {
    title: "Nível 2: Sílabas Simples (B, C, D, F, M, P, T, V, L, N, R, S)",
    description: "Associação consoante + vogal sem acentos.",
    sublevels: {
      "2.1": {
        title: "Subnível 2.1: Famílias do B, C e D",
        items: [
          { text: "BA", syllables: ["BA"], image: "👶", hint: "Bata / Bebê" },
          { text: "BE", syllables: ["BE"], image: "🥤", hint: "Bebida" },
          { text: "BI", syllables: ["BI"], image: "🚲", hint: "Bici" },
          { text: "BO", syllables: ["BO"], image: "⚽", hint: "Bola" },
          { text: "BU", syllables: ["BU"], image: "🫖", hint: "Bule" },
          { text: "CA", syllables: ["CA"], image: "🏠", hint: "Casa" },
          { text: "CO", syllables: ["CO"], image: "🥛", hint: "Copo" },
          { text: "CU", syllables: ["CU"], image: "🪣", hint: "Cubo" },
          { text: "DA", syllables: ["DA"], image: "🎲", hint: "Dado" },
          { text: "DE", syllables: ["DE"], image: "☝️", hint: "Dedo" },
          { text: "DI", syllables: ["DI"], image: "💎", hint: "Dia" },
          { text: "DO", syllables: ["DO"], image: "🍬", hint: "Doce" },
          { text: "DU", syllables: ["DU"], image: "🧚", hint: "Duende" },
          { text: "BIA", syllables: ["BI", "A"], image: "👧", hint: "Nome de menina" },
          { text: "BOBO", syllables: ["BO", "BO"], image: "🤡", hint: "Engraçado" }
        ]
      },
      "2.2": {
        title: "Subnível 2.2: Famílias do F, M e P",
        items: [
          { text: "FA", syllables: ["FA"], image: "🧚", hint: "Fada" },
          { text: "FE", syllables: ["FE"], image: "🧲", hint: "Ferro" },
          { text: "FI", syllables: ["FI"], image: "🧵", hint: "Fio" },
          { text: "FO", syllables: ["FO"], image: "🔥", hint: "Fogo" },
          { text: "FU", syllables: ["FU"], image: "🦨", hint: "Fumaça" },
          { text: "MA", syllables: ["MA"], image: "🐒", hint: "Macaco" },
          { text: "ME", syllables: ["ME"], image: "🍯", hint: "Mel" },
          { text: "MI", syllables: ["MI"], image: "🐱", hint: "Miau" },
          { text: "MO", syllables: ["MO"], image: "🪙", hint: "Moeda" },
          { text: "MU", syllables: ["MU"], image: "🧱", hint: "Muro" },
          { text: "PA", syllables: ["PA"], image: "🦆", hint: "Pato" },
          { text: "PE", syllables: ["PE"], image: "🦶", hint: "Pé" },
          { text: "PI", syllables: ["PI"], image: "🐥", hint: "Piu" },
          { text: "PO", syllables: ["PO"], image: "🍿", hint: "Pipoca" },
          { text: "PU", syllables: ["PU"], image: "🦘", hint: "Pulo" }
        ]
      },
      "2.3": {
        title: "Subnível 2.3: Famílias do T, V, L e N",
        items: [
          { text: "TA", syllables: ["TA"], image: "🪕", hint: "Tatu" },
          { text: "TE", syllables: ["TE"], image: "📺", hint: "Teia / TV" },
          { text: "TI", syllables: ["TI"], image: "🐯", hint: "Tigre" },
          { text: "TO", syllables: ["TO"], image: "🍅", hint: "Tomate" },
          { text: "TU", syllables: ["TU"], image: "🚂", hint: "Tucano" },
          { text: "VA", syllables: ["VA"], image: "🐮", hint: "Vaca" },
          { text: "VE", syllables: ["VE"], image: "🕯️", hint: "Vela" },
          { text: "VI", syllables: ["VI"], image: "🎻", hint: "Violão" },
          { text: "VO", syllables: ["VO"], image: "👵", hint: "Vovo" },
          { text: "VU", syllables: ["VU"], image: "🌋", hint: "Vulcão" },
          { text: "LA", syllables: ["LA"], image: "🥛", hint: "Lata" },
          { text: "LE", syllables: ["LE"], image: "🦁", hint: "Leao" },
          { text: "LI", syllables: ["LI"], image: "🍋", hint: "Limao" },
          { text: "LO", syllables: ["LO"], image: "🐺", hint: "Lobo" },
          { text: "LU", syllables: ["LU"], image: "🌙", hint: "Lua" },
          { text: "NA", syllables: ["NA"], image: "⛵", hint: "Navio" },
          { text: "NE", syllables: ["NE"], image: "❄️", hint: "Neve" },
          { text: "NI", syllables: ["NI"], image: "🪹", hint: "Ninho" },
          { text: "NO", syllables: ["NO"], image: "☁️", hint: "Nuvem" }
        ]
      }
    }
  },

  3: {
    title: "Nível 3: Palavras Bisílabas Simples",
    description: "Palavras curtas formadas por duas sílabas.",
    sublevels: {
      "3.1": {
        title: "Subnível 3.1: Objetos e Brinquedos",
        items: [
          { text: "BOLA", syllables: ["BO", "LA"], image: "⚽", hint: "Brinquedo redondo" },
          { text: "CASA", syllables: ["CA", "SA"], image: "🏠", hint: "Onde moramos" },
          { text: "DADO", syllables: ["DA", "DO"], image: "🎲", hint: "Cubo do jogo" },
          { text: "MALA", syllables: ["MA", "LA"], image: "🧳", hint: "Para viajar" },
          { text: "COPO", syllables: ["CO", "PO"], image: "🥛", hint: "Para tomar água" },
          { text: "BOLO", syllables: ["BO", "LO"], image: "🎂", hint: "Gostoso de aniversário" },
          { text: "LIVRO", syllables: ["LI", "VRO"], image: "📚", hint: "Para ler histórias" },
          { text: "BOTA", syllables: ["BO", "TA"], image: "🥾", hint: "Calçado para chuva" },
          { text: "FACA", syllables: ["FA", "CA"], image: "🔪", hint: "Usa na cozinha" },
          { text: "BOCA", syllables: ["BO", "CA"], image: "👄", hint: "Para falar e comer" },
          { text: "LATA", syllables: ["LA", "TA"], image: "🥫", hint: "Embalagem de metal" },
          { text: "BICO", syllables: ["BI", "CO"], image: "🍼", hint: "Bico de mamadeira ou ave" },
          { text: "VELA", syllables: ["VE", "LA"], image: "🕯️", hint: "Ilumina quando falta luz" },
          { text: "ROPA", syllables: ["RO", "PA"], image: "👕", hint: "Vestimenta do dia" },
          { text: "TAPE", syllables: ["TA", "PE"], image: "🛋️", hint: "Tapete macio" }
        ]
      },
      "3.2": {
        title: "Subnível 3.2: Animais da Fazenda e Floresta",
        items: [
          { text: "GATO", syllables: ["GA", "TO"], image: "🐱", hint: "Gosta de miauu" },
          { text: "SAPO", syllables: ["SA", "PO"], image: "🐸", hint: "Pula na lagoa" },
          { text: "VACA", syllables: ["VA", "CA"], image: "🐮", hint: "Dá leite gostoso" },
          { text: "PATO", syllables: ["PA", "TO"], image: "🦆", hint: "Faz quá quá" },
          { text: "LEÃO", syllables: ["LE", "ÃO"], image: "🦁", hint: "Rei dos animais" },
          { text: "TATU", syllables: ["TA", "TU"], image: "🦔", hint: "Mora na toca" },
          { text: "PERU", syllables: ["PE", "RU"], image: "🦃", hint: "Ave grande" },
          { text: "LOBO", syllables: ["LO", "BO"], image: "🐺", hint: "Uiva para a lua" },
          { text: "FOCA", syllables: ["FO", "CA"], image: "🦭", hint: "Bate palminha no mar" },
          { text: "URSO", syllables: ["UR", "SO"], image: "🐻", hint: "Gosta de mel" },
          { text: "GALO", syllables: ["GA", "LO"], image: "🐓", hint: "Canta de manhã" },
          { text: "PUMA", syllables: ["PU", "MA"], image: "🐆", hint: "Felis rápido" },
          { text: "MICO", syllables: ["MI", "CO"], image: "🐒", hint: "Macaquinho sapeca" },
          { text: "RATO", syllables: ["RA", "TO"], image: "🐭", hint: "Roedor espertinho" }
        ]
      },
      "3.3": {
        title: "Subnível 3.3: Alimentos e Natureza",
        items: [
          { text: "SUCO", syllables: ["SU", "CO"], image: "🧃", hint: "Bebida de frutas" },
          { text: "FOGO", syllables: ["FO", "GO"], image: "🔥", hint: "Quente e ilumina" },
          { text: "LUA", syllables: ["LU", "A"], image: "🌙", hint: "Brilha à noite" },
          { text: "SOL", syllables: ["SOL"], image: "☀️", hint: "Aquece nosso dia" },
          { text: "PERA", syllables: ["PE", "RA"], image: "🍐", hint: "Fruta suculenta" },
          { text: "FIGO", syllables: ["FI", "GO"], image: "🫐", hint: "Fruta rochinha" },
          { text: "MAÇÃ", syllables: ["MA", "ÇÃ"], image: "🍎", hint: "Vermelha e docinha" },
          { text: "SOJA", syllables: ["SO", "JA"], image: "🌱", hint: "Grão saudável" },
          { text: "LAMA", syllables: ["LA", "MA"], image: "🧱", hint: "Terra com água" },
          { text: "ROSA", syllables: ["RO", "SA"], image: "🌹", hint: "Flor cheirosa" },
          { text: "CANA", syllables: ["CA", "NA"], image: "🌾", hint: "Planta do açúcar" },
          { text: "COCO", syllables: ["CO", "CO"], image: "🥥", hint: "Água refrescante" },
          { text: "UVA", syllables: ["U", "VA"], image: "🍇", hint: "Cacho roxo ou verde" },
          { text: "LIMA", syllables: ["LI", "MA"], image: "🍋", hint: "Fruta cítrica" }
        ]
      }
    }
  },

  4: {
    title: "Nível 4: Palavras Trisílabas e Quadrisílabas",
    description: "Palavras de 3 ou 4 sílabas bem estruturadas.",
    sublevels: {
      "4.1": {
        title: "Subnível 4.1: Frutas e Comidas Gostosas",
        items: [
          { text: "BANANA", syllables: ["BA", "NA", "NA"], image: "🍌", hint: "Amarela e saborosa" },
          { text: "PIPOCA", syllables: ["PI", "PO", "CA"], image: "🍿", hint: "Estoura na panela" },
          { text: "TOMATE", syllables: ["TO", "MA", "TE"], image: "🍅", hint: "Vermelho na salada" },
          { text: "ABACAXI", syllables: ["A", "BA", "CA", "XI"], image: "🍍", hint: "Fruta com coroa" },
          { text: "ABACATE", syllables: ["A", "BA", "CA", "TE"], image: "🥑", hint: "Fruta verde e cremosa" },
          { text: "PANELA", syllables: ["PA", "NE", "LA"], image: "🍳", hint: "Usa no fogão" },
          { text: "BACALHAU", syllables: ["BA", "CA", "LHAU"], image: "🐟", hint: "Peixe saboroso" },
          { text: "MELANCIA", syllables: ["ME", "LAN", "CI", "A"], image: "🍉", hint: "Doce e cheia de água" }
        ]
      },
      "4.2": {
        title: "Subnível 4.2: Animais Fascinantes",
        items: [
          { text: "MACACO", syllables: ["MA", "CA", "CO"], image: "🐒", hint: "Pula de galho em galho" },
          { text: "CAVALO", syllables: ["CA", "VA", "LO"], image: "🐴", hint: "Corre muito rápido" },
          { text: "CORUJA", syllables: ["CO", "RU", "JA"], image: "🦉", hint: "Olhos bem grandes" },
          { text: "GIRAFA", syllables: ["GI", "RA", "FA"], image: "🦒", hint: "Pescoço super alto" },
          { text: "CAMELO", syllables: ["CA", "ME", "LO"], image: "🐪", hint: "Anda no deserto" },
          { text: "BALEIA", syllables: ["BA", "LEI", "A"], image: "🐳", hint: "Gigante do oceano" },
          { text: "JACARÉ", syllables: ["JA", "CA", "RÉ"], image: "🐊", hint: "Mora na lagoa" },
          { text: "TUBARÃO", syllables: ["TU", "BA", "RÃO"], image: "🦈", hint: "Nadador do mar" }
        ]
      },
      "4.3": {
        title: "Subnível 4.3: Escola e Roupas",
        items: [
          { text: "CANETA", syllables: ["CA", "NE", "TA"], image: "🖊️", hint: "Escreve no caderno" },
          { text: "SAPATO", syllables: ["SA", "PA", "TO"], image: "👟", hint: "Colocamos nos pés" },
          { text: "BONECA", syllables: ["BO", "NE", "CA"], image: "🪆", hint: "Brinquedo querido" },
          { text: "SACOLA", syllables: ["SA", "CO", "LA"], image: "🛍️", hint: "Para guardar coisas" },
          { text: "CADERNO", syllables: ["CA", "DER", "NO"], image: "📓", hint: "Para desenhar e escrever" },
          { text: "MOCHILA", syllables: ["MO", "CHI", "LA"], image: "🎒", hint: "Leva o material para a escola" },
          { text: "CAMISETA", syllables: ["CA", "MI", "SE", "TA"], image: "👕", hint: "Roupa confortável" },
          { text: "RELÓGIO", syllables: ["RE", "LÓ", "GIO"], image: "⌚", hint: "Mostra as horas" }
        ]
      }
    }
  },

  5: {
    title: "Nível 5: Sílabas Complexas (CH, LH, NH, RR, SS)",
    description: "Sons compostos e dígrafos especiais.",
    sublevels: {
      "5.1": {
        title: "Subnível 5.1: Palavras com CH e LH",
        items: [
          { text: "CHUVA", syllables: ["CHU", "VA"], image: "🌧️", hint: "Água limpa do céu" },
          { text: "CHAVE", syllables: ["CHA", "VE"], image: "🔑", hint: "Abre a fechadura" },
          { text: "OVELHA", syllables: ["O", "VE", "LHA"], image: "🐑", hint: "Tem lã bem macia" },
          { text: "ABELHA", syllables: ["A", "BE", "LHA"], image: "🐝", hint: "Faz o mel doce" },
          { text: "ILHA", syllables: ["I", "LHA"], image: "🏝️", hint: "Cercada de água por todos os lados" },
          { text: "COELHO", syllables: ["CO", "E", "LHO"], image: "🐰", hint: "Adora comer cenoura" },
          { text: "MILHO", syllables: ["MI", "LHO"], image: "🌽", hint: "Amarelinho e gostoso" },
          { text: "TOALHA", syllables: ["TO", "A", "LHA"], image: "🧴", hint: "Usamos para nos enxugar" }
        ]
      },
      "5.2": {
        title: "Subnível 5.2: Palavras com NH",
        items: [
          { text: "GALINHA", syllables: ["GA", "LI", "NHA"], image: "🐔", hint: "Bota ovos no ninho" },
          { text: "NINHO", syllables: ["NI", "NHO"], image: "🪹", hint: "Casa dos passarinhos" },
          { text: "PINHO", syllables: ["PI", "NHO"], image: "🌲", hint: "Árvore de natal" },
          { text: "VIZINHO", syllables: ["VI", "ZI", "NHO"], image: "🏡", hint: "Mora ao nosso lado" },
          { text: "RAINHA", syllables: ["RAI", "NHA"], image: "👑", hint: "Usa coroa brilhante" },
          { text: "SONHO", syllables: ["SO", "NHO"], image: "💭", hint: "Pensamentos ao dormir" },
          { text: "LINHA", syllables: ["LI", "NHA"], image: "🧵", hint: "Usa com a agulha" },
          { text: "COZINHA", syllables: ["CO", "ZI", "NHA"], image: "🍳", hint: "Onde preparamos a comida" }
        ]
      },
      "5.3": {
        title: "Subnível 5.3: Palavras com RR e SS",
        items: [
          { text: "CARRO", syllables: ["CAR", "RO"], image: "🚗", hint: "Anda sobre quatro rodas" },
          { text: "BARRO", syllables: ["BAR", "RO"], image: "🧱", hint: "Terra molhada" },
          { text: "FERRO", syllables: ["FER", "RO"], image: "🧲", hint: "Metal forte" },
          { text: "TORRE", syllables: ["TOR", "RE"], image: "🏰", hint: "Construção bem alta" },
          { text: "PÁSSARO", syllables: ["PÁS", "SA", "RO"], image: "🐦", hint: "Voa livre no céu" },
          { text: "OSSO", syllables: ["OS", "SO"], image: "🦴", hint: "O cachorro adora roer" },
          { text: "PASSEIO", syllables: ["PAS", "SEI", "O"], image: "🌳", hint: "Caminhada divertida" },
          { text: "MASSA", syllables: ["MAS", "SA"], image: "🍝", hint: "Macarrão saboroso" }
        ]
      }
    }
  },

  6: {
    title: "Nível 6: Encontros Consonantais (PR, TR, BR, FL, BL, CL)",
    description: "Consoantes seguidas de R ou L.",
    sublevels: {
      "6.1": {
        title: "Subnível 6.1: Consoante + R (PR, TR, BR)",
        items: [
          { text: "PRATO", syllables: ["PRA", "TO"], image: "🍽️", hint: "Onde servimos o almoço" },
          { text: "TRATOR", syllables: ["TRA", "TOR"], image: "🚜", hint: "Veículo forte da fazenda" },
          { text: "BRASIL", syllables: ["BRA", "SIL"], image: "🇧🇷", hint: "Nosso lindo país" },
          { text: "PRINCESA", syllables: ["PRIN", "CE", "SA"], image: "👸", hint: "Personagem de história" },
          { text: "PREGO", syllables: ["PRE", "GO"], image: "🔨", hint: "Fixa com o martelo" },
          { text: "TREM", syllables: ["TREM"], image: "🚂", hint: "Anda sobre trilhos" },
          { text: "BRINQUEDO", syllables: ["BRIN", "QUE", "DO"], image: "🧸", hint: "Para se divertir" },
          { text: "CRAVO", syllables: ["CRA", "VO"], image: "🌸", hint: "Flor bonita e cheirosa" }
        ]
      },
      "6.2": {
        title: "Subnível 6.2: Consoante + L (FL, BL, CL, GL)",
        items: [
          { text: "FLORESTA", syllables: ["FLO", "RES", "TA"], image: "🌲", hint: "Lugar cheio de árvores" },
          { text: "BLUSA", syllables: ["BLU", "SA"], image: "👕", hint: "Roupa quentinha" },
          { text: "CLARA", syllables: ["CLA", "RA"], image: "🥚", hint: "Parte branca do ovo" },
          { text: "GLOBO", syllables: ["GLO", "BO"], image: "🌐", hint: "Representa a Terra" },
          { text: "FLOR", syllables: ["FLOR"], image: "🌻", hint: "Enfeita os jardins" },
          { text: "FLAUTA", syllables: ["FLAU", "TA"], image: "🪈", hint: "Instrumento de sopro" },
          { text: "PLACA", syllables: ["PLA", "CA"], image: "🪧", hint: "Aviso na rua" },
          { text: "ATLETA", syllables: ["A", "TLE", "TA"], image: "🏃", hint: "Pratica esportes com dedicação" }
        ]
      },
      "6.3": {
        title: "Subnível 6.3: Desafio de Encontros Consonantais",
        items: [
          { text: "DRAGÃO", syllables: ["DRA", "GÃO"], image: "🐉", hint: "Solta fogo pela boca" },
          { text: "PEDRA", syllables: ["PE", "DRA"], image: "🪨", hint: "Dura na natureza" },
          { text: "LIVRO", syllables: ["LI", "VRO"], image: "📚", hint: "Nos ensina muitas coisas" },
          { text: "ESTRELA", syllables: ["ES", "TRE", "LA"], image: "⭐", hint: "Brilha no céu noturno" },
          { text: "ZEBRA", syllables: ["ZE", "BRA"], image: "🦓", hint: "Animal listrado de preto e branco" },
          { text: "QUADRO", syllables: ["QUA", "DRO"], image: "🖼️", hint: "Obra de arte na parede" },
          { text: "COBRA", syllables: ["CO", "BRA"], image: "🐍", hint: "Rasteja pelo chão" },
          { text: "IGREJA", syllables: ["I", "GRE", "JA"], image: "⛪", hint: "Construção com torre" }
        ]
      }
    }
  },

  7: {
    title: "Nível 7: Frases Curtas e Ritmo de Leitura",
    description: "Construção de pequenas frases com pontuação simples.",
    sublevels: {
      "7.1": {
        title: "Subnível 7.1: Frases de Animais",
        items: [
          { text: "O GATO É FOFO.", syllables: ["O", "GA-TO", "É", "FO-FO"], image: "🐱", hint: "Frase do gatinho" },
          { text: "O SAPO PULA ALTO.", syllables: ["O", "SA-PO", "PU-LA", "AL-TO"], image: "🐸", hint: "Frase do sapinho" },
          { text: "A VACA DÁ LEITE.", syllables: ["A", "VA-CA", "DÁ", "LEI-TE"], image: "🐮", hint: "Frase da vaquinha" },
          { text: "O CÃO É AMIGO.", syllables: ["O", "CÃO", "É", "A-MI-GO"], image: "🐶", hint: "Frase do cachorro" },
          { text: "A CORUJA VOA ALTO.", syllables: ["A", "CO-RU-JA", "VOA", "AL-TO"], image: "🦉", hint: "Frase da coruja" },
          { text: "O LEÃO É O REI.", syllables: ["O", "LE-ÃO", "É", "O", "REI"], image: "🦁", hint: "Frase do leão" }
        ]
      },
      "7.2": {
        title: "Subnível 7.2: Frases de Brincadeiras e Ações",
        items: [
          { text: "A BOLA ROLOU NA GRAMA.", syllables: ["A BOLA...", "ROLOU NA GRAMA."], image: "⚽", hint: "Brincadeira no parque" },
          { text: "EU GOSTO DE DESENHAR.", syllables: ["EU GOSTO...", "DE DESENHAR."], image: "🎨", hint: "Momento de arte" },
          { text: "A PIPOCA É GOSTOSA.", syllables: ["A PIPOCA...", "É GOSTOSA."], image: "🍿", hint: "Hora do lanche" },
          { text: "O SOL BRILHA HOJE.", syllables: ["O SOL...", "BRILHA HOJE."], image: "☀️", hint: "Dia bonito" },
          { text: "A MENINA CORRE RÁPIDO.", syllables: ["A MENINA...", "CORRE RÁPIDO."], image: "🏃‍♀️", hint: "Corrida alegre" },
          { text: "MEU BOLO FICOU UMA DELÍCIA.", syllables: ["MEU BOLO...", "FICOU UMA DELÍCIA."], image: "🎂", hint: "Festa saborosa" }
        ]
      },
      "7.3": {
        title: "Subnível 7.3: Frases com Perguntas e Exclamações",
        items: [
          { text: "QUE DIA LINDO!", syllables: ["QUE DIA LINDO!"], image: "🌈", hint: "Exclamação de alegria" },
          { text: "VOCÊ QUER BRINCAR?", syllables: ["VOCÊ QUER BRINCAR?"], image: "🛝", hint: "Convite carinhoso" },
          { text: "OLHA AQUELE PÁSSARO!", syllables: ["OLHA AQUELE PÁSSARO!"], image: "🐦", hint: "Observando a natureza" },
          { text: "QUAL É A SUA COR FAVORITA?", syllables: ["QUAL É...", "A SUA COR FAVORITA?"], image: "🎨", hint: "Pergunta amigável" },
          { text: "PARABÉNS PELO SEU TRABALHO!", syllables: ["PARABÉNS...", "PELO SEU TRABALHO!"], image: "👏", hint: "Elogio motivacional" },
          { text: "VAMOS JUNTOS APRENDER!", syllables: ["VAMOS JUNTOS APRENDER!"], image: "🎒", hint: "Mensagem da escola" }
        ]
      }
    }
  },

  8: {
    title: "Nível 8: Frases Estruturadas e Expressivas",
    description: "Frases mais elaboradas para leitura expressiva.",
    sublevels: {
      "8.1": {
        title: "Subnível 8.1: Histórias de 2 Frases",
        items: [
          { text: "O CÃO LATIU NA PRAÇA! ELE QUERIA BRINCAR COM A BOLA.", syllables: ["O CÃO LATIU NA PRAÇA!", "ELE QUERIA BRINCAR."], image: "🐶", hint: "Aventuras do cãozinho" },
          { text: "A PIPOCA PULOU DA PANELA. QUE CHEIRINHO GOSTOSO!", syllables: ["A PIPOCA PULOU...", "QUE CHEIRINHO GOSTOSO!"], image: "🍿", hint: "Lanche na cozinha" },
          { text: "O TRATOR TRABALHA NA FAZENDA. ELE AJUDA NA COLHEITA.", syllables: ["O TRATOR TRABALHA...", "ELE AJUDA NA COLHEITA."], image: "🚜", hint: "Trabalho no campo" },
          { text: "A CORUJA VOA DE NOITE. ELA TEM OLHOS ATENTOS.", syllables: ["A CORUJA VOA DE NOITE.", "ELA TEM OLHOS ATENTOS."], image: "🦉", hint: "Noite na floresta" }
        ]
      },
      "8.2": {
        title: "Subnível 8.2: Frases com Adjetivos e Cores",
        items: [
          { text: "O GATO AMARELO DORME NO SOFÁ MACIO.", syllables: ["O GATO AMARELO...", "DORME NO SOFÁ MACIO."], image: "🐱", hint: "Soneca do gato" },
          { text: "A BICI VERMELHA ANDA RÁPIDO NO PARQUE.", syllables: ["A BICI VERMELHA...", "ANDA RÁPIDO NO PARQUE."], image: "🚲", hint: "Passeio de bicicleta" },
          { text: "A BORBOLETA AZUL POUSOU NA FLOR CHEIROSA.", syllables: ["A BORBOLETA AZUL...", "POUSOU NA FLOR."], image: "🦋", hint: "Jardim colorido" },
          { text: "O ESTUDANTE DEDICADO LÊ UM LIVRO INTERESSANTE.", syllables: ["O ESTUDANTE DEDICADO...", "LÊ UM LIVRO."], image: "📖", hint: "Hora da leitura" }
        ]
      },
      "8.3": {
        title: "Subnível 8.3: Perguntas e Diálogos Curtos",
        items: [
          { text: "VOCÊ SABE ONDE FICA O PARQUE? FICA LOGO ALI!", syllables: ["VOCÊ SABE ONDE FICA?", "FICA LOGO ALI!"], image: "🛝", hint: "Diálogo amigável" },
          { text: "QUEM QUER COMER UMA MAÇÃ DOCINHA E FRESCA?", syllables: ["QUEM QUER COMER...", "UMA MAÇÃ DOCINHA?"], image: "🍎", hint: "Oferta de fruta" },
          { text: "O PASSARINHO CANTOU NA JANELA. ELE ESTAVA FELIZ!", syllables: ["O PASSARINHO CANTOU...", "ELE ESTAVA FELIZ!"], image: "🐦", hint: "Cântico matinal" },
          { text: "TODOS OS ALUNOS LERAM A LIÇÃO COM MUITA ATENÇÃO.", syllables: ["TODOS OS ALUNOS...", "LERAM A LIÇÃO!"], image: "🏫", hint: "Orgulho na sala de aula" }
        ]
      }
    }
  },

  9: {
    title: "Nível 9: Mini Histórias Ilustradas",
    description: "Leitura fluente de pequenos parágrafos contextualizados.",
    sublevels: {
      "9.1": {
        title: "Subnível 9.1: A História do Urso Beto",
        items: [
          { 
            text: "O URSO BETO ADORA MEL DOCINHO. ELE VIU UMA COLMEIA NA ÁRVORE ALTA. BETO COMEU TUDO E FICOU MUITO FELIZ!", 
            syllables: ["O URSO BETO ADORA MEL.", "ELE VIU UMA COLMEIA.", "BETO COMEU E FICOU FELIZ!"], 
            image: "🐻", 
            hint: "História do Urso Beto" 
          },
          { 
            text: "BETO CHAMOU SEU AMIGO COELHO PARA BRINCAR NO FLUXO DO RIACHO. ELES PASSARAM A TARDE TODA RINDO JUNTOS.", 
            syllables: ["BETO CHAMOU O COELHO.", "BRINCARAM NO RIACHO.", "PASSARAM A TARDE RINDO!"], 
            image: "🐰", 
            hint: "Amizade na floresta" 
          }
        ]
      },
      "9.2": {
        title: "Subnível 9.2: A Bicicleta de Lia",
        items: [
          { 
            text: "LIA GANHOU UMA BICICLETA VERMELHA NO SEU ANIVERSÁRIO. ELA COLOCOU O CAPACETE E FOI AO PARQUE COM SUA MÃE.", 
            syllables: ["LIA GANHOU UMA BICI.", "FOI AO PARQUE COM SUA MÃE."], 
            image: "🚲", 
            hint: "A bicicleta de Lia" 
          },
          { 
            text: "NO PARQUE, LIA ENCONTROU SEUS AMIGOS DA ESCOLA. ELES FIZERAM UMA CORRIDA DIVERTIDA E TODOS GANHARAM MEDALHAS!", 
            syllables: ["ENCONTROU OS AMIGOS.", "FIZERAM UMA CORRIDA!", "TODOS GANHARAM MEDALHAS!"], 
            image: "🏅", 
            hint: "Festa no parque" 
          }
        ]
      },
      "9.3": {
        title: "Subnível 9.3: O Dia de Feira na Escola",
        items: [
          { 
            text: "HOJE É DIA DE FEIRA NA ESCOLA! OS ALUNOS LEVARAM FRUTAS FRESQUINHAS COMO BANANA, MAÇÃ E MELANCIA PARA COMPARTILHAR.", 
            syllables: ["DIA DE FEIRA NA ESCOLA!", "ALUNOS LEVARAM FRUTAS.", "LEITURA E COMPARTILHAMENTO!"], 
            image: "🍉", 
            hint: "Feira de frutas na escola" 
          },
          { 
            text: "A PROFESSORA FICOU MUITO ORGULHOSA DA TURMA. TODOS APRENDERAM O NOME DAS FRUTAS E COMERAM TUDO JUNTOS!", 
            syllables: ["PROFESSORA ORGULHOSA!", "APRENDERAM OS NOMES.", "COMERAM TUDO JUNTOS!"], 
            image: "👩‍🏫", 
            hint: "Turma nota 10" 
          }
        ]
      }
    }
  },

  10: {
    title: "Nível 10: Trava-Línguas e Desafios de Fluência",
    description: "Agilidade de leitura, dicção e pronúncia rápida.",
    sublevels: {
      "10.1": {
        title: "Subnível 10.1: Trava-Línguas dos Animais",
        items: [
          { text: "O PRATO DE TIGRE TEM TRÊS TIGRES TRISTES.", syllables: ["TRÊS TIGRES", "TRISTES COMEM", "NO PRATO DE TIGRE"], image: "🐯", hint: "Trava-línguas dos tigres" },
          { text: "SABIA QUE O SABIÁ SABIA ASSOBIAR?", syllables: ["SABIA QUE O SABIÁ", "SABIA ASSOBIAR?"], image: "🐦", hint: "Trava-línguas do sabiá" },
          { text: "O RATO ROEU A ROUPA DO REI DE ROMA.", syllables: ["O RATO ROEU", "A ROUPA DO REI", "DE ROMA!"], image: "🐀", hint: "Trava-línguas do rato" }
        ]
      },
      "10.2": {
        title: "Subnível 10.2: Trava-Línguas de Objetos e Sons",
        items: [
          { text: "O PEDRO PREGOU UM PREGO NA PORTA DA PREFEITURA.", syllables: ["PEDRO PREGOU UN PREGO", "NA PORTA DA PREFEITURA"], image: "🔨", hint: "Trava-línguas do prego" },
          { text: "OLHA O SAPO DENTRO DO SACO, O SACO COM O SAPO DENTRO!", syllables: ["SAPO NO SACO", "SACO COM O SAPO!"], image: "🐸", hint: "Trava-línguas do sapo no saco" },
          { text: "CAIXA DE GRAXA DA SEXTA-FEIRA É CAIXA DE GRAXA!", syllables: ["CAIXA DE GRAXA", "DA SEXTA-FEIRA"], image: "📦", hint: "Trava-línguas da caixa" }
        ]
      },
      "10.3": {
        title: "Subnível 10.3: Grande Desafio Final de Fluência",
        items: [
          { text: "QUEM ACONSELHA UM AMIGO, UM BOM TESOURO ENCONTRA!", syllables: ["QUEM ACONSELHA UM AMIGO", "TESOURO ENCONTRA!"], image: "💎", hint: "Provérbio de sabedoria" },
          { text: "A AGILIDADE DA LEITURA TRANSFORMA NOSSOS SONHOS EM CONHECIMENTO!", syllables: ["A LEITURA TRANSFORMA", "NOSSOS SONHOS!"], image: "🚀", hint: "Mensagem inspiradora" },
          { text: "PARABÉNS! VOCÊS AGORA SÃO LEITORES OFICIAIS DA NOSSA ESCOLA!", syllables: ["VOCÊS SÃO LEITORES!", "CAMPEÕES DA ALFABETIZAÇÃO!"], image: "🏆", hint: "Conquista máxima!" }
        ]
      }
    }
  }
};
