/**
 * Banco de Dados de Palavras v4.0 - Ampliado para 20+ palavras por subnível em todos os 10 Níveis
 * Separação silábica rigorosamente revisada de acordo com as normas da Língua Portuguesa.
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
          { text: "E I O", syllables: ["E", "I", "O"], image: "🔤", hint: "Vogais amigas" },
          { text: "A E I", syllables: ["A", "E", "I"], image: "🔤", hint: "Primeiras vogais" },
          { text: "O U A", syllables: ["O", "U", "A"], image: "🔤", hint: "Sons fortes" },
          { text: "E U I", syllables: ["E", "U", "I"], image: "🔤", hint: "Vogais da leitura" },
          { text: "A U O", syllables: ["A", "U", "O"], image: "🔤", hint: "Grupo de vogais" },
          { text: "I E A", syllables: ["I", "E", "A"], image: "🔤", hint: "Sons abertos" },
          { text: "O I U", syllables: ["O", "I", "U"], image: "🔤", hint: "Vogais do dia" },
          { text: "A I E O U", syllables: ["A", "I", "E", "O", "U"], image: "🌈", hint: "Todas as vogais juntas" },
          { text: "E A O", syllables: ["E", "A", "O"], image: "🔤", hint: "Vogais combinadas" },
          { text: "U I A", syllables: ["U", "I", "A"], image: "🔤", hint: "Três vogais" },
          { text: "A E O", syllables: ["A", "E", "O"], image: "🔤", hint: "Vogais da turminha" },
          { text: "I O U", syllables: ["I", "O", "U"], image: "🔤", hint: "Sequência de vogais" },
          { text: "O A E", syllables: ["O", "A", "E"], image: "🔤", hint: "Vogais da lousa" },
          { text: "U E I", syllables: ["U", "E", "I"], image: "🔤", hint: "Brincando com vogais" }
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
          { text: "EU", syllables: ["E", "U"], image: "🪞", hint: "Eu mesmo!" },
          { text: "OU", syllables: ["O", "U"], image: "🪙", hint: "Ouro / Ou isso ou aquilo" },
          { text: "AO", syllables: ["A", "O"], image: "💬", hint: "Vogais unidas" },
          { text: "UE", syllables: ["U", "E"], image: "😮", hint: "Ué! O que houve?" },
          { text: "EO", syllables: ["E", "O"], image: "🗣️", hint: "Encontro vocal" },
          { text: "OE", syllables: ["O", "E"], image: "🔤", hint: "Sons juntos" },
          { text: "IE", syllables: ["I", "E"], image: "🔤", hint: "Som do i com e" },
          { text: "AI AI", syllables: ["A", "I"], image: "🩹", hint: "Ai ai ai!" },
          { text: "OI OI", syllables: ["O", "I"], image: "🙋‍♂️", hint: "Oi oi, amiguinho!" },
          { text: "AU AU", syllables: ["A", "U"], image: "🐕", hint: "Latido do cão" },
          { text: "EI EI", syllables: ["E", "I"], image: "🗣️", hint: "Chamando alguém" },
          { text: "UI UI", syllables: ["U", "I"], image: "🥶", hint: "Ui que frio!" },
          { text: "EU EU", syllables: ["E", "U"], image: "🙋‍♀️", hint: "Eu eu eu!" }
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
          { text: "IO", syllables: ["I", "O"], image: "🪀", hint: "Ioiô" },
          { text: "EUA", syllables: ["E", "U", "A"], image: "🌎", hint: "País distante" },
          { text: "UA UAU", syllables: ["U", "A"], image: "🐶", hint: "Cachorrinho feliz" },
          { text: "AI AI AI", syllables: ["A", "I"], image: "😅", hint: "Ui ui ui!" },
          { text: "EI EI EI", syllables: ["E", "I"], image: "📣", hint: "Grito de torcida" },
          { text: "OI OI OI", syllables: ["O", "I"], image: "🎉", hint: "Cumprimento festivo" },
          { text: "UE UAU", syllables: ["U", "E"], image: "😯", hint: "Que surpresa!" },
          { text: "IA IA", syllables: ["I", "A"], image: "🎶", hint: "Canto alegre" },
          { text: "EO EO", syllables: ["E", "O"], image: "🔤", hint: "Repetindo vogais" },
          { text: "UAI", syllables: ["U", "A", "I"], image: "🤠", hint: "Expressão mineira!" },
          { text: "IAU", syllables: ["I", "A", "U"], image: "🐱", hint: "Miau do gatinho" },
          { text: "EIO", syllables: ["E", "I", "O"], image: "🌊", hint: "Passeio" },
          { text: "OIE", syllables: ["O", "I", "E"], image: "👋", hint: "Oie! Tudo bom?" },
          { text: "AIA", syllables: ["A", "I", "A"], image: "👸", hint: "Aia do castelo" }
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
          { text: "BOBO", syllables: ["BO", "BO"], image: "🤡", hint: "Engraçado" },
          { text: "BABA", syllables: ["BA", "BA"], image: "🤤", hint: "Babador de bebê" },
          { text: "BEBE", syllables: ["BE", "BE"], image: "👶", hint: "Criança pequenina" },
          { text: "BICO", syllables: ["BI", "CO"], image: "🍼", hint: "Chupeta ou mamadeira" },
          { text: "CABO", syllables: ["CA", "BO"], image: "🔌", hint: "Fio elétrico" },
          { text: "CUCA", syllables: ["CU", "CA"], image: "🐊", hint: "Personagem folclórico" },
          { text: "DADO", syllables: ["DA", "DO"], image: "🎲", hint: "Peça de jogo" },
          { text: "DUDU", syllables: ["DU", "DU"], image: "👦", hint: "Apelido amigável" },
          { text: "DICA", syllables: ["DI", "CA"], image: "💡", hint: "Ajuda no jogo" }
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
          { text: "PU", syllables: ["PU"], image: "🦘", hint: "Pulo" },
          { text: "MAPA", syllables: ["MA", "PA"], image: "🗺️", hint: "Mostra o caminho" },
          { text: "PAPA", syllables: ["PA", "PA"], image: "🥣", hint: "Comidinha de bebê" },
          { text: "FOFO", syllables: ["FO", "FO"], image: "🧸", hint: "Ursinho macio" },
          { text: "FICA", syllables: ["FI", "CA"], image: "🏠", hint: "Permanecer" },
          { text: "MAMA", syllables: ["MA", "MA"], image: "👩", hint: "Mamãe carinhosa" },
          { text: "MICO", syllables: ["MI", "CO"], image: "🐒", hint: "Macaquinho sapeca" },
          { text: "PUMA", syllables: ["PU", "MA"], image: "🐆", hint: "Felino selvagem" }
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
          { text: "NO", syllables: ["NO"], image: "☁️", hint: "Nuvem" },
          { text: "TATA", syllables: ["TA", "TA"], image: "🐢", hint: "Tartaruguinha" },
          { text: "VIVO", syllables: ["VI", "VO"], image: "🌱", hint: "Cheio de vida" },
          { text: "LALA", syllables: ["LA", "LA"], image: "🎶", hint: "Cantarolar" },
          { text: "NANA", syllables: ["NA", "NA"], image: "🛌", hint: "Dormir / Nanar" }
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
          { text: "BICO", syllables: ["BI", "CO"], image: "🍼", hint: "Chupeta ou mamadeira" },
          { text: "VELA", syllables: ["VE", "LA"], image: "🕯️", hint: "Ilumina no escuro" },
          { text: "ROUPA", syllables: ["ROU", "PA"], image: "👕", hint: "Vestimenta do dia" },
          { text: "MESA", syllables: ["ME", "SA"], image: "🪑", hint: "Móvel para apoiar objetos" },
          { text: "SOFÁ", syllables: ["SO", "FÁ"], image: "🛋️", hint: "Para sentar e relaxar" },
          { text: "REDE", syllables: ["RE", "DE"], image: "🛋️", hint: "Para descansar" },
          { text: "PIPA", syllables: ["PI", "PA"], image: "🪁", hint: "Voa no céu com o vento" },
          { text: "CHAVE", syllables: ["CHA", "VE"], image: "🔑", hint: "Abre a porta" },
          { text: "MOLA", syllables: ["MO", "LA"], image: "🌀", hint: "Brinquedo que pula" },
          { text: "TAPE", syllables: ["TA", "PE"], image: "🛋️", hint: "Tapete pequeno" },
          { text: "VASO", syllables: ["VA", "SO"], image: "🏺", hint: "Guarda flores bonitas" }
        ]
      },
      "3.2": {
        title: "Subnível 3.2: Animais da Fazenda e Floresta",
        items: [
          { text: "GATO", syllables: ["GA", "TO"], image: "🐱", hint: "Gosta de miau" },
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
          { text: "PUMA", syllables: ["PU", "MA"], image: "🐆", hint: "Felino rápido" },
          { text: "MICO", syllables: ["MI", "CO"], image: "🐒", hint: "Macaquinho sapeca" },
          { text: "RATO", syllables: ["RA", "TO"], image: "🐭", hint: "Roedor espertinho" },
          { text: "ONÇA", syllables: ["ON", "ÇA"], image: "🐆", hint: "Animal felino pintado" },
          { text: "ÉGUA", syllables: ["É", "GUA"], image: "🐴", hint: "Fêmea do cavalo" },
          { text: "PEIXE", syllables: ["PEI", "XE"], image: "🐟", hint: "Vive a nadar na água" },
          { text: "PUMBA", syllables: ["PUM", "BA"], image: "🐗", hint: "Javali amigo" },
          { text: "COBRA", syllables: ["CO", "BRA"], image: "🐍", hint: "Rasteja pelo chão" },
          { text: "ZEBRA", syllables: ["ZE", "BRA"], image: "🦓", hint: "Animal listrado" },
          { text: "BODE", syllables: ["BO", "DE"], image: "🐐", hint: "Animal da fazenda" },
          { text: "FROGA", syllables: ["FRO", "GA"], image: "🐸", hint: "Sapinho verde" }
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
          { text: "FIGO", syllables: ["FI", "GO"], image: "🫐", hint: "Fruta roxinha" },
          { text: "MAÇÃ", syllables: ["MA", "ÇÃ"], image: "🍎", hint: "Vermelha e docinha" },
          { text: "SOJA", syllables: ["SO", "JA"], image: "🌱", hint: "Grão saudável" },
          { text: "LAMA", syllables: ["LA", "MA"], image: "🧱", hint: "Terra com água" },
          { text: "ROSA", syllables: ["RO", "SA"], image: "🌹", hint: "Flor cheirosa" },
          { text: "CANA", syllables: ["CA", "NA"], image: "🌾", hint: "Planta do açúcar" },
          { text: "COCO", syllables: ["CO", "CO"], image: "🥥", hint: "Água refrescante" },
          { text: "UVA", syllables: ["U", "VA"], image: "🍇", hint: "Cacho roxo ou verde" },
          { text: "LIMA", syllables: ["LI", "MA"], image: "🍋", hint: "Fruta cítrica" },
          { text: "SOPA", syllables: ["SO", "PA"], image: "🍲", hint: "Prato quente saboroso" },
          { text: "PÃO", syllables: ["PÃO"], image: "🍞", hint: "Gostoso no café da manhã" },
          { text: "MILHO", syllables: ["MI", "LHO"], image: "🌽", hint: "Pipoca e pamonha" },
          { text: "FLOR", syllables: ["FLOR"], image: "🌻", hint: "Perfuma o jardim" },
          { text: "MAR", syllables: ["MAR"], image: "🌊", hint: "Água salgada gigante" },
          { text: "NEVE", syllables: ["NE", "VE"], image: "❄️", hint: "Gelo caindo do céu" },
          { text: "RAMO", syllables: ["RA", "MO"], image: "🌿", hint: "Galho com folhas" },
          { text: "DOCE", syllables: ["DO", "CE"], image: "🍬", hint: "Guloseima saborosa" }
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
          { text: "MELANCIA", syllables: ["ME", "LAN", "CI", "A"], image: "🍉", hint: "Doce e cheia de água" },
          { text: "MORANGO", syllables: ["MO", "RAN", "GO"], image: "🍓", hint: "Fruta vermelhinha" },
          { text: "LARANJA", syllables: ["LA", "RAN", "JA"], image: "🍊", hint: "Suco vitaminado" },
          { text: "GELATINA", syllables: ["GE", "LA", "TI", "NA"], image: "🍧", hint: "Sobremesa colorida" },
          { text: "CHOCOLATE", syllables: ["CHO", "CO", "LA", "TE"], image: "🍫", hint: "Doce favorito" },
          { text: "SORVETE", syllables: ["SOR", "VE", "TE"], image: "🍦", hint: "Geladinho no verão" },
          { text: "CENOURA", syllables: ["CE", "NOU", "RA"], image: "🥕", hint: "Laranja e crocante" },
          { text: "BATATA", syllables: ["BA", "TA", "TA"], image: "🥔", hint: "Frita ou assada" },
          { text: "MACARRÃO", syllables: ["MA", "CAR", "RÃO"], image: "🍝", hint: "Massa com molho" },
          { text: "TANGERINA", syllables: ["TAN", "GE", "RI", "NA"], image: "🍊", hint: "Fruta de gomos" },
          { text: "BOLACHA", syllables: ["BO", "LA", "CHA"], image: "🍪", hint: "Biscoito crocante" },
          { text: "PITANGA", syllables: ["PI", "TAN", "GA"], image: "🍒", hint: "Frutinha vermelha" },
          { text: "LIMONADA", syllables: ["LI", "MO", "NA", "DA"], image: "🍹", hint: "Suco de limão" }
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
          { text: "TUBARÃO", syllables: ["TU", "BA", "RÃO"], image: "🦈", hint: "Nadador do mar" },
          { text: "ELEFANTE", syllables: ["E", "LE", "FAN", "TE"], image: "🐘", hint: "Tem uma tromba grande" },
          { text: "TARTARUGA", syllables: ["TAR", "TA", "RU", "GA"], image: "🐢", hint: "Anda bem devagar" },
          { text: "HIPOPÓTAMO", syllables: ["HI", "PO", "PÓ", "TA", "MO"], image: "🦛", hint: "Gosta de tomar banho de lama" },
          { text: "BORBOLETA", syllables: ["BOR", "BO", "LE", "TA"], image: "🦋", hint: "Voa entre as flores" },
          { text: "CAPIVARA", syllables: ["CA", "PI", "VA", "RA"], image: "🦫", hint: "Maior roedor do mundo" },
          { text: "PAPAGAIO", syllables: ["PA", "PA", "GAI", "O"], image: "🦜", hint: "Ave que aprende a falar" },
          { text: "LEOPARDO", syllables: ["LE", "O", "PAR", "DO"], image: "🐆", hint: "Felino veloz" },
          { text: "CANGURU", syllables: ["CAN", "GU", "RU"], image: "🦘", hint: "Pula alto com bolsa" },
          { text: "PANTERA", syllables: ["PAN", "TE", "RA"], image: "🐆", hint: "Felino elegante" },
          { text: "GOLFINHO", syllables: ["GOL", "FIN", "HO"], image: "🐬", hint: "Amigo inteligente do mar" },
          { text: "TUCANO", syllables: ["TU", "CA", "NO"], image: "🦜", hint: "Bico grande e colorido" },
          { text: "PINGUIM", syllables: ["PIN", "GUIM"], image: "🐧", hint: "Vive no gelo" }
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
          { text: "MOCHILA", syllables: ["MO", "CHI", "LA"], image: "🎒", hint: "Leva o material escolar" },
          { text: "CAMISETA", syllables: ["CA", "MI", "SE", "TA"], image: "👕", hint: "Roupa confortável" },
          { text: "RELÓGIO", syllables: ["RE", "LÓ", "GIO"], image: "⌚", hint: "Mostra as horas" },
          { text: "APONTADOR", syllables: ["A", "PON", "TA", "DOR"], image: "✏️", hint: "Faz ponta no lápis" },
          { text: "BORRACHA", syllables: ["BOR", "RA", "CHA"], image: "🧼", hint: "Apaga o lápis" },
          { text: "TESOURA", syllables: ["TE", "SOU", "RA"], image: "✂️", hint: "Recorta papéis" },
          { text: "UNIFORME", syllables: ["U", "NI", "FOR", "ME"], image: "👔", hint: "Roupa da escola" },
          { text: "JAQUETA", syllables: ["JA", "QUE", "TA"], image: "🧥", hint: "Casaco para o frio" },
          { text: "PANTUFA", syllables: ["PAN", "TU", "FA"], image: "🥿", hint: "Calçado macio de casa" },
          { text: "VESTIDO", syllables: ["VES", "TI", "DO"], image: "👗", hint: "Roupa elegante" },
          { text: "RÉGUA", syllables: ["RÉ", "GUA"], image: "📐", hint: "Mede traços retos" },
          { text: "ESTOJO", syllables: ["ES", "TO", "JO"], image: "👝", hint: "Guarda lápis e canetas" },
          { text: "PIJAMA", syllables: ["PI", "JA", "MA"], image: "👔", hint: "Roupa de dormir" },
          { text: "CHINELO", syllables: ["CHI", "NE", "LO"], image: "🩴", hint: "Calçado leve" },
          { text: "BONÉ", syllables: ["BO", "NÉ"], image: "🧢", hint: "Protege do sol" }
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
          { text: "TOALHA", syllables: ["TO", "A", "LHA"], image: "🧴", hint: "Usamos para nos enxugar" },
          { text: "CHAPÉU", syllables: ["CHA", "PÉU"], image: "🎩", hint: "Acessório para a cabeça" },
          { text: "CHINELO", syllables: ["CHI", "NE", "LO"], image: "🩴", hint: "Calçado de descanso" },
          { text: "CHOCOLATE", syllables: ["CHO", "CO", "LA", "TE"], image: "🍫", hint: "Guloseima deliciosa" },
          { text: "FOLHA", syllables: ["FO", "LHA"], image: "🍃", hint: "Parte verde da árvore" },
          { text: "AGULHA", syllables: ["A", "GU", "LHA"], image: "🪡", hint: "Usa para costurar" },
          { text: "GALHO", syllables: ["GA", "LHO"], image: "🪵", hint: "Parte da árvore" },
          { text: "ESPELHO", syllables: ["ES", "PE", "LHO"], image: "🪞", hint: "Reflete nossa imagem" },
          { text: "CHUPETA", syllables: ["CHU", "PE", "TA"], image: "🍼", hint: "Objeto de bebê" },
          { text: "REPOLHO", syllables: ["RE", "PO", "LHO"], image: "🥬", hint: "Hortaliça saudável" },
          { text: "CHAMINÉ", syllables: ["CHA", "MI", "NÉ"], image: "🏠", hint: "Sai a fumaça da lareira" },
          { text: "BILHETE", syllables: ["BI", "LHE", "TE"], image: "🎟️", hint: "Recado por escrito" },
          { text: "OLHO", syllables: ["O", "LHO"], image: "👁️", hint: "Órgão da visão" }
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
          { text: "COZINHA", syllables: ["CO", "ZI", "NHA"], image: "🍳", hint: "Onde preparamos a comida" },
          { text: "DESENHO", syllables: ["DE", "SE", "NHO"], image: "🎨", hint: "Arte no papel" },
          { text: "UNHA", syllables: ["U", "NHA"], image: "💅", hint: "Fica nos dedos" },
          { text: "CAMINHO", syllables: ["CA", "MI", "NHO"], image: "🛣️", hint: "Trilha para andar" },
          { text: "FARINHA", syllables: ["FA", "RI", "NHA"], image: "🌾", hint: "Ingrediente do bolo" },
          { text: "MINHOCA", syllables: ["MI", "NHO", "CA"], image: "🪱", hint: "Vive na terra molhada" },
          { text: "LENHA", syllables: ["LE", "NHA"], image: "🪵", hint: "Madeira para a fogueira" },
          { text: "BOLINHA", syllables: ["BO", "LI", "NHA"], image: "🟢", hint: "Bola pequena" },
          { text: "CARINHO", syllables: ["CA", "RI", "NHO"], image: "🤗", hint: "Gestos de afeto" },
          { text: "SOBRINHO", syllables: ["SO", "BRI", "NHO"], image: "👦", hint: "Filho do irmão" },
          { text: "CEGONHA", syllables: ["CE", "GO", "NHA"], image: "🦩", hint: "Ave da lenda" },
          { text: "PONTINHA", syllables: ["PON", "TI", "NHA"], image: "✏️", hint: "Extremidade fina" },
          { text: "MONTANHA", syllables: ["MON", "TA", "NHA"], image: "🏔️", hint: "Elevação de terra bem alta" }
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
          { text: "MASSA", syllables: ["MAS", "SA"], image: "🍝", hint: "Macarrão saboroso" },
          { text: "CORRIDA", syllables: ["COR", "RI", "DA"], image: "🏃", hint: "Esporte de velocidade" },
          { text: "SOCORRO", syllables: ["SO", "COR", "RO"], image: "🛟", hint: "Pedido de ajuda" },
          { text: "GARRAFA", syllables: ["GAR", "RA", "FA"], image: "🍾", hint: "Recipiente de líquido" },
          { text: "BARRIGA", syllables: ["BAR", "RI", "GA"], image: "🤰", hint: "Parte do corpo" },
          { text: "DESERTO", syllables: ["DE", "SER", "TO"], image: "🏜️", hint: "Lugar de muita areia" },
          { text: "CARRINHO", syllables: ["CAR", "RIN", "HO"], image: "🏎️", hint: "Brinquedo de roda" },
          { text: "VASSOURA", syllables: ["VAS", "SOU", "RA"], image: "🧹", hint: "Usa para varrer o chão" },
          { text: "TESOURO", syllables: ["TE", "SOU", "RO"], image: "💎", hint: "Baú de moedas" },
          { text: "PÊSSEGO", syllables: ["PÊS", "SE", "GO"], image: "🍑", hint: "Fruta aveludada" },
          { text: "CARROÇA", syllables: ["CAR", "RO", "ÇA"], image: "🛞", hint: "Puxada por cavalos" },
          { text: "GIRASSOL", syllables: ["GI", "RAS", "SOL"], image: "🌻", hint: "Flor amarela que segue o sol" },
          { text: "VASSASSINO", syllables: ["VAS", "SAS", "SI", "NO"], image: "🎭", hint: "Disfarce de festa" }
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
          { text: "CRAVO", syllables: ["CRA", "VO"], image: "🌸", hint: "Flor bonita e cheirosa" },
          { text: "PRÍNCIPE", syllables: ["PRÍN", "CI", "PE"], image: "🤴", hint: "Nobre do reino" },
          { text: "BRANCO", syllables: ["BRAN", "CO"], image: "⚪", hint: "Cor das nuvens" },
          { text: "TROFÉU", syllables: ["TRO", "FÉU"], image: "🏆", hint: "Prêmio de campeão" },
          { text: "PROVA", syllables: ["PRO", "VA"], image: "📝", hint: "Avaliação da escola" },
          { text: "TRABALHO", syllables: ["TRA", "BA", "LHO"], image: "💼", hint: "Atividade diária" },
          { text: "BRAÇO", syllables: ["BRA", "ÇO"], image: "💪", hint: "Membro do corpo" },
          { text: "BRISA", syllables: ["BRI", "SA"], image: "🌬️", hint: "Vento suave" },
          { text: "PRESERVA", syllables: ["PRE", "SER", "VA"], image: "🌳", hint: "Proteger a natureza" },
          { text: "TRILHA", syllables: ["TRI", "LHA"], image: "🥾", hint: "Caminho na mata" },
          { text: "PRESENTE", syllables: ["PRE", "SEN", "TE"], image: "🎁", hint: "Ganhar na festa" },
          { text: "CRIANÇA", syllables: ["CRI", "AN", "ÇA"], image: "🧒", hint: "Estudante alegre" },
          { text: "TROMBONE", syllables: ["TROM", "BO", "NE"], image: "🎺", hint: "Instrumento musical de sopro" }
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
          { text: "ATLETA", syllables: ["A", "TLE", "TA"], image: "🏃", hint: "Pratica esportes com dedicação" },
          { text: "CLUBE", syllables: ["CLU", "BE"], image: "🏊", hint: "Lugar de lazer e piscina" },
          { text: "BLOCO", syllables: ["BLO", "CO"], image: "🧱", hint: "Peça de montar" },
          { text: "PLANETA", syllables: ["PLA", "NE", "TA"], image: "🪐", hint: "Corpo celeste no espaço" },
          { text: "FLAMINGO", syllables: ["FLA", "MIN", "GO"], image: "🦩", hint: "Ave rosa de pernas longas" },
          { text: "PLUMA", syllables: ["PLU", "MA"], image: "🪶", hint: "Pena leve de pássaro" },
          { text: "GLACIAL", syllables: ["GLA", "CI", "AL"], image: "🧊", hint: "Frio congelante" },
          { text: "CLIMA", syllables: ["CLI", "MA"], image: "☀️", hint: "Tempo atmosférico" },
          { text: "PLÁSTICO", syllables: ["PLÁS", "TI", "CO"], image: "🥤", hint: "Material reciclável" },
          { text: "FLEXÍVEL", syllables: ["FLE", "XÍ", "VEL"], image: "🤸", hint: "Que se dobra com facilidade" },
          { text: "GLICERINA", syllables: ["GLI", "CE", "RI", "NA"], image: "🧼", hint: "Ingrediente do sabonete" },
          { text: "CLARINETE", syllables: ["CLA", "RI", "NE", "TE"], image: "🎷", hint: "Instrumento de sopro" },
          { text: "FLORICULTURA", syllables: ["FLO", "RI", "CUL", "TU", "RA"], image: "💐", hint: "Loja de flores" }
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
          { text: "IGREJA", syllables: ["I", "GRE", "JA"], image: "⛪", hint: "Construção com torre" },
          { text: "MADRINHA", syllables: ["MA", "DRI", "NHA"], image: "👩", hint: "Pessoa querida da família" },
          { text: "XADREZ", syllables: ["XA", "DREZ"], image: "♟️", hint: "Jogo de estratégia de tabuleiro" },
          { text: "CANTORA", syllables: ["CAN", "TO", "RA"], image: "🎤", hint: "Canta músicas lindas" },
          { text: "PRODUÇÃO", syllables: ["PRO", "DU", "ÇÃO"], image: "🏭", hint: "Fabricação de itens" },
          { text: "CRISTAL", syllables: ["CRIS", "TAL"], image: "🔮", hint: "Pedra transparente e brilhante" },
          { text: "GRUTA", syllables: ["GRU", "TA"], image: "🏔️", hint: "Caverna natural" },
          { text: "FRUTA", syllables: ["FRU", "TA"], image: "🍎", hint: "Alimento saudável" },
          { text: "GRILO", syllables: ["GRI", "LO"], image: "🦗", hint: "Inseto que canta à noite" },
          { text: "GRAVATA", syllables: ["GRA", "VA", "TA"], image: "👔", hint: "Acessório de roupa elegante" },
          { text: "CREME", syllables: ["CRE", "ME"], image: "🍦", hint: "Doce cremoso" },
          { text: "GRADE", syllables: ["GRA", "DE"], image: "🪟", hint: "Proteção de ferro" },
          { text: "TREM", syllables: ["TREM"], image: "🚂", hint: "Veículo sobre trilhos" }
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
          { text: "O LEÃO É O REI.", syllables: ["O", "LE-ÃO", "É", "O", "REI"], image: "🦁", hint: "Frase do leão" },
          { text: "O PEIXE NADA NO RIO.", syllables: ["O PEIXE...", "NADA NO RIO."], image: "🐟", hint: "Peixinho na água" },
          { text: "O PATO PULA NA LAGOÂ.", syllables: ["O PATO...", "PULA NA LAGOÂ."], image: "🦆", hint: "Patinho na lagoa" },
          { text: "O COELHO COME CENOURA.", syllables: ["O COELHO...", "COME CENOURA."], image: "🐰", hint: "Alimentação do coelhinho" },
          { text: "A ABELHA FAZ MEL.", syllables: ["A ABELHA...", "FAZ MEL."], image: "🐝", hint: "Produção da abelha" },
          { text: "A GALINHA BOTA OVO.", syllables: ["A GALINHA...", "BOTA OVO."], image: "🐔", hint: "Ninho da galinha" },
          { text: "O URSO GOSTA DE MEL.", syllables: ["O URSO...", "GOSTA DE MEL."], image: "🐻", hint: "Ursinho guloso" },
          { text: "A TARTARUGA É DEVAGAR.", syllables: ["A TARTARUGA...", "É DEVAGAR."], image: "🐢", hint: "Caminho calmo" },
          { text: "O CAVALO CORRE RÁPIDO.", syllables: ["O CAVALO...", "CORRE RÁPIDO."], image: "🐴", hint: "Galope do cavalo" },
          { text: "O MACACO PULA NO GALHO.", syllables: ["O MACACO...", "PULA NO GALHO."], image: "🐒", hint: "Brincadeira no galho" },
          { text: "A BORBOLETA É COLORIDA.", syllables: ["A BORBOLETA...", "É COLORIDA."], image: "🦋", hint: "Cores da borboleta" },
          { text: "O ELEFANTE É GIGANTE.", syllables: ["O ELEFANTE...", "É GIGANTE."], image: "🐘", hint: "Tamanho do elefante" },
          { text: "A ZEBRA TEM LISTRAS.", syllables: ["A ZEBRA...", "TEM LISTRAS."], image: "🦓", hint: "Padrão da zebra" },
          { text: "O PASSARINHO CANTA FELIZ.", syllables: ["O PASSARINHO...", "CANTA FELIZ."], image: "🐦", hint: "Cântico alegre" },
          { text: "A OVELHA TEM LÃ MACIA.", syllables: ["A OVELHA...", "TEM LÃ MACIA."], image: "🐑", hint: "Lã da ovelhinha" }
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
          { text: "MEU BOLO FICOU UMA DELÍCIA.", syllables: ["MEU BOLO...", "FICOU UMA DELÍCIA."], image: "🎂", hint: "Festa saborosa" },
          { text: "VAMOS BRINCAR DE RODA.", syllables: ["VAMOS BRINCAR...", "DE RODA."], image: "🛝", hint: "Brincadeira popular" },
          { text: "O MENINO SOLTA PIPA.", syllables: ["O MENINO...", "SOLTA PIPA."], image: "🪁", hint: "Pipa no ar" },
          { text: "NÓS LEMOS UM LIVRO LINDO.", syllables: ["NÓS LEMOS...", "UM LIVRO LINDO."], image: "📚", hint: "Hora da leitura" },
          { text: "A PROFESSORA É MUITO LEGAL.", syllables: ["A PROFESSORA...", "É MUITO LEGAL."], image: "👩‍🏫", hint: "Carinho pela professora" },
          { text: "O SUCO DE LARANJA É BOM.", syllables: ["O SUCO DE LARANJA...", "É BOM."], image: "🍊", hint: "Bebida vitaminada" },
          { text: "EU LAVEI MINHAS MÃOS.", syllables: ["EU LAVEI...", "MINHAS MÃOS."], image: "🧼", hint: "Higiene diária" },
          { text: "A PIPOCA ESTOUROU NA PANELA.", syllables: ["A PIPOCA...", "ESTOUROU NA PANELA."], image: "🍿", hint: "Lanche na cozinha" },
          { text: "O CADERNO ESTÁ ORGANIZADO.", syllables: ["O CADERNO...", "ESTÁ ORGANIZADO."], image: "📓", hint: "Material caprichado" },
          { text: "A TURMA CANTA JUNTA.", syllables: ["A TURMA...", "CANTA JUNTA."], image: "🎶", hint: "Música na sala" },
          { text: "O RELÓGIO MOSTRA A HORA.", syllables: ["O RELÓGIO...", "MOSTRA A HORA."], image: "⌚", hint: "Aprendendo as horas" },
          { text: "EU ADORO IR À ESCOLA.", syllables: ["EU ADORO...", "IR À ESCOLA."], image: "🏫", hint: "Alegria de estudar" },
          { text: "A FLORESTA É VERDE E LINDA.", syllables: ["A FLORESTA...", "É VERDE E LINDA."], image: "🌲", hint: "Natureza bem cuidada" },
          { text: "O DIA ESTÁ ENSOLARADO.", syllables: ["O DIA ESTÁ...", "ENSOLARADO."], image: "☀️", hint: "Clima bom" },
          { text: "NÓS SOMOS GRANDES AMIGOS.", syllables: ["NÓS SOMOS...", "GRANDES AMIGOS."], image: "🤝", hint: "Amizade sincera" }
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
          { text: "VAMOS JUNTOS APRENDER!", syllables: ["VAMOS JUNTOS APRENDER!"], image: "🎒", hint: "Mensagem da escola" },
          { text: "QUE SORVETE DELICIOSO!", syllables: ["QUE SORVETE...", "DELICIOSO!"], image: "🍦", hint: "Gostosura no verão" },
          { text: "ONDE ESTÁ A MINHA MOCHILA?", syllables: ["ONDE ESTÁ...", "A MINHA MOCHILA?"], image: "🎒", hint: "Procurando o material" },
          { text: "VOCÊ JÁ LEU ESTE LIVRO?", syllables: ["VOCÊ JÁ LEU...", "ESTE LIVRO?"], image: "📖", hint: "Pergunta de leitura" },
          { text: "QUE HISTÓRIA FANTÁSTICA!", syllables: ["QUE HISTÓRIA...", "FANTÁSTICA!"], image: "✨", hint: "Entusiasmo no livro" },
          { text: "VAMOS AO PARQUE HOJE?", syllables: ["VAMOS AO PARQUE...", "HOJE?"], image: "🌳", hint: "Passeio divertido" },
          { text: "COMO VOCÊ ESTÁ SE SENTINDO?", syllables: ["COMO VOCÊ...", "ESTÁ SE SENTINDO?"], image: "😊", hint: "Cuidado e carinho" },
          { text: "UAU, QUE DESENHO INCRÍVEL!", syllables: ["UAU, QUE DESENHO...", "INCRÍVEL!"], image: "🖼️", hint: "Elogio de arte" },
          { text: "VOCÊ SABE QUANTAS HORAS SÃO?", syllables: ["VOCÊ SABE...", "QUANTAS HORAS SÃO?"], image: "⌚", hint: "Consultando o relógio" },
          { text: "VIVA! CONSEGUIMOS APRENDER!", syllables: ["VIVA! CONSEGUIMOS...", "APRENDER!"], image: "🎉", hint: "Vitória do aprendizado" },
          { text: "QUE MÚSICA ALEGRE!", syllables: ["QUE MÚSICA...", "ALEGRE!"], image: "🎵", hint: "Ritmo contagiante" },
          { text: "QUEM QUER OUVIR UMA HISTÓRIA?", syllables: ["QUEM QUER OUVIR...", "UMA HISTÓRIA?"], image: "📖", hint: "Hora da contação" },
          { text: "A NOSSA SALA ESTÁ LINDA!", syllables: ["A NOSSA SALA...", "ESTÁ LINDA!"], image: "🏫", hint: "Ambiente escolar" },
          { text: "VOCÊ GOSTA DE PIPOCA?", syllables: ["VOCÊ GOSTA...", "DE PIPOCA?"], image: "🍿", hint: "Pergunta saborosa" },
          { text: "HOJE É UM DIA MUITO ESPECIAL!", syllables: ["HOJE É UM DIA...", "MUITO ESPECIAL!"], image: "🌟", hint: "Comemoração alegre" }
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
          { text: "A CORUJA VOA DE NOITE. ELA TEM OLHOS ATENTOS.", syllables: ["A CORUJA VOA DE NOITE.", "ELA TEM OLHOS ATENTOS."], image: "🦉", hint: "Noite na floresta" },
          { text: "O SOL NASCEU BEM CEDINHO. OS PASSARINHOS COMEÇARAM A CANTAR.", syllables: ["O SOL NASCEU CEDINHO.", "OS PASSARINHOS CANTARAM."], image: "🌅", hint: "Manhã radiante" },
          { text: "A BORBOLETA POUSOU NA FLOR. ELA ERA AZUL E BRILHANTE.", syllables: ["A BORBOLETA POUSOU.", "ELA ERA AZUL E BRILHANTE."], image: "🦋", hint: "Beleza no jardim" },
          { text: "O MENINO GUARDOU SEUS BRINQUEDOS. A SALA FICOU MUITO ORGANIZADA.", syllables: ["O MENINO GUARDOU TUDO.", "A SALA FICOU LIMPINHA."], image: "🧸", hint: "Organização e capricho" },
          { text: "A PROFESSORA ABRIU O LIVRO. TODOS OS ALUNOS PRESTARAM ATENÇÃO.", syllables: ["A PROFESSORA ABRIU O LIVRO.", "TODOS PRESTARAM ATENÇÃO."], image: "📖", hint: "Momento da história" },
          { text: "O GATO SUBIU NO TELHADO. ELE OLHOU AS ESTRELAS NO CÉU.", syllables: ["O GATO SUBIU NO TELHADO.", "OLHOU AS ESTRELAS."], image: "🐱", hint: "Noite do gatinho" },
          { text: "O TREM APITOU NA ESTAÇÃO. OS PASSAGEIROS ACENARAM FELIZES.", syllables: ["O TREM APITOU NA ESTAÇÃO.", "TODOS ACENARAM FELIZES."], image: "🚂", hint: "Viagem de trem" },
          { text: "A CHUVA MOLHOU AS PLANTAS. O JARDIM FICOU VERDE E CHEIROSO.", syllables: ["A CHUVA MOLHOU AS PLANTAS.", "O JARDIM FICOU LINDO."], image: "🌧️", hint: "Vida na natureza" },
          { text: "A MENINA FEZ UM DESENHO COLORIDO. ELA GANHOU UM ELOGIO DA MÃE.", syllables: ["FEZ UM DESENHO LINDO.", "GANHOU UM GRANDE ELOGIO."], image: "🎨", hint: "Orgulho da arte" },
          { text: "O PEIXINHO NADA RÁPIDO NO AQUÁRIO. ELE GOSTA DE DAR PIRUETAS.", syllables: ["O PEIXINHO NADA RÁPIDO.", "ELE DÁ PIRUETAS NA ÁGUA."], image: "🐠", hint: "Alegria aquática" },
          { text: "A PIPOCA ESTOUROU NA PANELA. TODOS COMERAM COM MUITA ALEGRIA.", syllables: ["A PIPOCA ESTOUROU.", "COMERAM COM ALEGRIA."], image: "🍿", hint: "Lanche em família" },
          { text: "O COELHINHO COMEU A CENOURA. DEPOIS ELE SAIU PULANDO PELO HORTÃO.", syllables: ["COMEU A CENOURA TODA.", "SAIU PULANDO PELO HORTÃO."], image: "🐰", hint: "Dia do coelho" },
          { text: "O SAPO CANTOU NA LAGOA. A NOITE FICOU MUITO ANIMADA.", syllables: ["O SAPO CANTOU NA LAGOA.", "A NOITE FICOU ANIMADA."], image: "🐸", hint: "Festa no lago" },
          { text: "A LUA BRILHOU NO CÉU ESCURO. AS CRIANÇAS DORMIRAM EM PAZ.", syllables: ["A LUA BRILHOU NO CÉU.", "CRIANÇAS DORMIRAM EM PAZ."], image: "🌙", hint: "Bons sonhos" },
          { text: "O ROBÔ ANDOU PELA SALA. ELE EMITIU LUZES COLORIDAS E SONS.", syllables: ["O ROBÔ ANDOU PELA SALA.", "EMITIU LUZES COLORIDAS."], image: "🤖", hint: "Tecnologia divertida" },
          { text: "O BARCO NAVEGOU NO MAR AZUL. OS MARINHEIROS CANTARAM JUNTOS.", syllables: ["O BARCO NAVEGOU NO MAR.", "TODOS CANTARAM JUNTOS."], image: "⛵", hint: "Aventura no oceano" },
          { text: "A TURMA COMPLETOU A LEITURA. A PROFESSORA DEU PARABÉNS A TODOS!", syllables: ["TURMA COMPLETOU A LEITURA.", "PARABÉNS A TODOS OS ALUNOS!"], image: "🏆", hint: "Sucesso escolar" }
        ]
      },
      "8.2": {
        title: "Subnível 8.2: Frases com Adjetivos e Cores",
        items: [
          { text: "O GATO AMARELO DORME NO SOFÁ MACIO.", syllables: ["O GATO AMARELO...", "DORME NO SOFÁ MACIO."], image: "🐱", hint: "Soneca do gato" },
          { text: "A BICI VERMELHA ANDA RÁPIDO NO PARQUE.", syllables: ["A BICI VERMELHA...", "ANDA RÁPIDO NO PARQUE."], image: "🚲", hint: "Passeio de bicicleta" },
          { text: "A BORBOLETA AZUL POUSOU NA FLOR CHEIROSA.", syllables: ["A BORBOLETA AZUL...", "POUSOU NA FLOR."], image: "🦋", hint: "Jardim colorido" },
          { text: "O ESTUDANTE DEDICADO LÊ UM LIVRO INTERESSANTE.", syllables: ["O ESTUDANTE DEDICADO...", "LÊ UM LIVRO."], image: "📖", hint: "Hora da leitura" },
          { text: "O CÃO BRANCO PULA NA GRAMA VERDE.", syllables: ["O CÃO BRANCO...", "PULA NA GRAMA VERDE."], image: "🐶", hint: "Brincadeira no gramado" },
          { text: "A MAÇÃ VERMELHA É DOCE E SUCULENTA.", syllables: ["A MAÇÃ VERMELHA...", "É DOCE E SUCULENTA."], image: "🍎", hint: "Fruta saborosa" },
          { text: "O CÉU AZUL TEM NUVENS MACIAS E BRANCAS.", syllables: ["O CÉU AZUL...", "TEM NUVENS MACIAS."], image: "☁️", hint: "Dia ensolarado" },
          { text: "A BONECA DE PANO TEM UM VESTIDO ROSA LINDO.", syllables: ["A BONECA DE PANO...", "TEM VESTIDO ROSA."], image: "🪆", hint: "Brinquedo artesanal" },
          { text: "O PÁSSARO VERDE CANTA UMA LINDA MELODIA.", syllables: ["O PÁSSARO VERDE...", "CANTA UMA MELODIA."], image: "🦜", hint: "Natureza viva" },
          { text: "O CARRO VERMELHO CORREU NA PISTA LARGA.", syllables: ["O CARRO VERMELHO...", "CORREU NA PISTA."], image: "🏎️", hint: "Velocidade na pista" },
          { text: "A BANANA AMARELA ESTÁ MADURA E GOSTOSA.", syllables: ["A BANANA AMARELA...", "ESTÁ MADURA E GOSTOSA."], image: "🍌", hint: "Fruta nutritiva" },
          { text: "O SAPATO PRETO FICOU MUITO CONFORTÁVEL.", syllables: ["O SAPATO PRETO...", "FICOU CONFORTÁVEL."], image: "👞", hint: "Calçado novo" },
          { text: "A MOCHILA AZUL GUARDA CADERNOS ORGANIZADOS.", syllables: ["A MOCHILA AZUL...", "GUARDA CADERNOS."], image: "🎒", hint: "Material de estudo" },
          { text: "O URSO MARROM COMEU O MEL ADOCICADO.", syllables: ["O URSO MARROM...", "COMEU O MEL ADOCICADO."], image: "🐻", hint: "Ursinho na floresta" },
          { text: "A PEIXINHO DOURADO NADA NA ÁGUA CRISTALINA.", syllables: ["PEIXINHO DOURADO...", "NADA NA ÁGUA CRISTALINA."], image: "🐠", hint: "Vida aquática" },
          { text: "A ROSA VERMELHA ENFEITA O JARDIM FLORIDO.", syllables: ["A ROSA VERMELHA...", "ENFEITA O JARDIM."], image: "🌹", hint: "Jardim perfumado" },
          { text: "O BALÃO AMARELO VOOU BEM ALTO NO CÉU.", syllables: ["O BALÃO AMARELO...", "VOOU BEM ALTO."], image: "🎈", hint: "Festa no céu" },
          { text: "O LÁPIS VERDE DESENHA UMA ÁRVORE GRANDE.", syllables: ["O LÁPIS VERDE...", "DESENHA UMA ÁRVORE."], image: "✏️", hint: "Arte escolar" },
          { text: "A CAMISETA BRANCA ESTÁ LIMPINHA E CHEIROSA.", syllables: ["CAMISETA BRANCA...", "LIMPINHA E CHEIROSA."], image: "👕", hint: "Uniforme impecável" },
          { text: "O SOL DOURADO ILUMINA O NOSSO PLANETA.", syllables: ["O SOL DOURADO...", "ILUMINA O PLANETA."], image: "☀️", hint: "Luz da vida" }
        ]
      },
      "8.3": {
        title: "Subnível 8.3: Perguntas e Diálogos Curtos",
        items: [
          { text: "VOCÊ SABE ONDE FICA O PARQUE? FICA LOGO ALI!", syllables: ["VOCÊ SABE ONDE FICA?", "FICA LOGO ALI!"], image: "🛝", hint: "Diálogo amigável" },
          { text: "QUEM QUER COMER UMA MAÇÃ DOCINHA E FRESCA?", syllables: ["QUEM QUER COMER...", "UMA MAÇÃ DOCINHA?"], image: "🍎", hint: "Oferta de fruta" },
          { text: "O PASSARINHO CANTOU NA JANELA. ELE ESTAVA FELIZ!", syllables: ["O PASSARINHO CANTOU...", "ELE ESTAVA FELIZ!"], image: "🐦", hint: "Cântico matinal" },
          { text: "TODOS OS ALUNOS LERAM A LIÇÃO COM MUITA ATENÇÃO.", syllables: ["TODOS OS ALUNOS...", "LERAM A LIÇÃO!"], image: "🏫", hint: "Orgulho na sala de aula" },
          { text: "QUAL É O SEU ANIMAL FAVORITO? EU ADORO O GATINHO!", syllables: ["QUAL SEU ANIMAL FAVORITO?", "EU ADORO O GATINHO!"], image: "🐱", hint: "Conversa sobre animais" },
          { text: "VAMOS JOGAR BOLA HOJE NO CAMPO? SIM, VAMOS!", syllables: ["VAMOS JOGAR BOLA?", "SIM, VAMOS JUNTOS!"], image: "⚽", hint: "Convite para esporte" },
          { text: "VOCÊ JÁ TERMINOU A SUA TAREFA? JÁ SIM, PROFESSORA!", syllables: ["JÁ TERMINOU A TAREFA?", "JÁ SIM, PROFESSORA!"], image: "📝", hint: "Dever de casa" },
          { text: "QUE HORA É O NOSSO RECREIO? É AGORA MESMO!", syllables: ["QUE HORA É O RECREIO?", "É AGORA MESMO!"], image: "🔔", hint: "Momento do lanche" },
          { text: "VOCÊ QUER DIVIDIR O SEU LANCHE COMIGO? CLARO QUE SIM!", syllables: ["QUER DIVIDIR O LANCHE?", "CLARO QUE SIM!"], image: "🥪", hint: "Generosidade e amizade" },
          { text: "ONDE VOCÊ GUARDOU O SEU CADERNO? GUARDEI NA MOCHILA!", syllables: ["ONDE GUARDOU O CADERNO?", "GUARDEI NA MOCHILA!"], image: "🎒", hint: "Organização escolar" },
          { text: "COMO FOI O SEU FIM DE SEMANA? FOI MUITO DIVERTIDO!", syllables: ["COMO FOI O FIM DE SEMANA?", "FOI MUITO DIVERTIDO!"], image: "🥳", hint: "Partilhando vivências" },
          { text: "VOCÊ GOSTA DE DESENHAR E PINTAR? É MINHA ATIVIDADE FAVORITA!", syllables: ["GOSTA DE DESENHAR?", "É MINHA FAVORITA!"], image: "🎨", hint: "Paixão pela arte" },
          { text: "QUEM CONSEGUIU LER A PALAVRA TODA? EU CONSEGUI!", syllables: ["QUEM CONSEGUIU LER?", "EU CONSEGUI!"], image: "🙋‍♂️", hint: "Conquista da leitura" },
          { text: "QUAL É A MÚSICA QUE VAMOS CANTAR? A MÚSICA DA ALEGRIA!", syllables: ["QUAL MÚSICA VAMOS CANTAR?", "MÚSICA DA ALEGRIA!"], image: "🎵", hint: "Canto coletivo" },
          { text: "VOCÊ SABE NAVEGAR NA INTERNET? APRENDO NA ESCOLA!", syllables: ["SABE NAVEGAR NA INTERNET?", "APRENDO NA ESCOLA!"], image: "💻", hint: "Informática educativa" },
          { text: "QUER AJUDA PARA GUARDAR O MATERIAL? QUERO SIM, OBRIGADO!", syllables: ["QUER AJUDA COM O MATERIAL?", "QUERO SIM, OBRIGADO!"], image: "🤝", hint: "Cooperação na sala" },
          { text: "QUAL É O SEU LIVRO PREFERIDO? O DA CORUJA SABIDA!", syllables: ["QUAL SEU LIVRO PREFERIDO?", "DA CORUJA SABIDA!"], image: "🦉", hint: "Leitura estimada" },
          { text: "VAMOS FAZER UMA RODA DE HISTÓRIAS? VAMOS SIM!", syllables: ["FAZER RODA DE HISTÓRIAS?", "VAMOS SIM!"], image: "📖", hint: "Contação de histórias" },
          { text: "QUEM QUER GANHAR UMA ESTRELINHA DOURADA? EU QUERO!", syllables: ["QUEM QUER GANHAR ESTRELA?", "EU QUERO MUITO!"], image: "⭐", hint: "Recompensa motivacional" },
          { text: "ESTÃO PRONTOS PARA O PRÓXIMO DESAFIO? ESTAMOS PRONTÍSSIMOS!", syllables: ["PRONTOS PARA O DESAFIO?", "ESTAMOS PRONTÍSSIMOS!"], image: "🚀", hint: "Entusiasmo escolar" }
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
          },
          { 
            text: "DEPOIS DE BRINCAR, BETO E O COELHO FORAM DESCANSAR DEBAIXO DA GRANDE ÁRVORE. ELES OLHARAM AS NUVENS NO CÉU.", 
            syllables: ["FORAM DESCANSAR NA ÁRVORE.", "OLHARAM AS NUVENS NO CÉU."], 
            image: "🌳", 
            hint: "Descanso dos amigos" 
          },
          { 
            text: "A NOITE CHEGOU E AS ESTRELAS COMECARAM A BRILHAR. BETO DEU UM ABRAÇO NO AMIGO E FOI DORMIR NA SUA TOCA MACIA.", 
            syllables: ["AS ESTRELAS BRILHARAM.", "BETO ABRAÇOU O AMIGO.", "FOI DORMIR NA TOCA."], 
            image: "🌙", 
            hint: "Hora de dormir" 
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
          },
          { 
            text: "LIA APRENDEU A PEDALAR SEM AS RODINHAS DE APOIO. ELA SE SENTIU MUITO ORGULHOSA DA SUA CONQUISTA!", 
            syllables: ["PEDALOU SEM RODINHAS.", "FICOU MUITO ORGULHOSA!"], 
            image: "🚲", 
            hint: "Superação da menina" 
          },
          { 
            text: "NO FIM DA TARDE, LIA E SUA MÃE TOMARAM UM SUCO DE LARANJA GELADINHO. FOI UM DIA INESQUECÍVEL!", 
            syllables: ["TOMARAM SUCO GELADINHO.", "FOI UM DIA INESQUECÍVEL!"], 
            image: "🍹", 
            hint: "Comemoração especial" 
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
          },
          { 
            text: "CADA ALUNO MONTOU UM PRATO COLORIDO E SAUDÁVEL. ELES APRENDERAM A IMPORTÂNCIA DAS VITAMINAS PARA A SAÚDE.", 
            syllables: ["PRATO COLORIDO E SAUDÁVEL.", "APRENDERAM SOBRE VITAMINAS."], 
            image: "🥗", 
            hint: "Alimentação saudável" 
          },
          { 
            text: "NO FINAL DA AULA, A TURMA DESENHOU AS FRUTAS NO CADERNO. TODOS LEVARAM UMA ESTRELINHA PARA CASA!", 
            syllables: ["DESENHARAM AS FRUTAS.", "LEVARAM UMA ESTRELINHA!"], 
            image: "⭐", 
            hint: "Encerramento feliz" 
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
          { text: "O RATO ROEU A ROUPA DO REI DE ROMA.", syllables: ["O RATO ROEU", "A ROUPA DO REI", "DE ROMA!"], image: "🐀", hint: "Trava-línguas do rato" },
          { text: "O SAPO DENTRO DO SACO, O SACO COM SAPO DENTRO.", syllables: ["SAPO NO SACO,", "SACO COM SAPO DENTRO!"], image: "🐸", hint: "Trava-línguas do sapo" },
          { text: "A CHAVE DO CHEFE CHAVEOU A FECHADURA.", syllables: ["A CHAVE DO CHEFE", "CHAVEOU A FECHADURA."], image: "🔑", hint: "Trava-línguas da chave" },
          { text: "GATO ESCONDIDO COM RABO DE FORA É MAIS ESCONDIDO QUE RABO ESCONDIDO COM GATO DE FORA.", syllables: ["GATO ESCONDIDO...", "RABO DE FORA!"], image: "🐱", hint: "Desafio do gatinho" },
          { text: "A ABELHA ABELHUDOU A OUTRA ABELHA NO NINHO.", syllables: ["A ABELHA ABELHUDOU", "A OUTRA NO NINHO."], image: "🐝", hint: "Trava-línguas da abelha" },
          { text: "O PERU PERAMBULOU NA PERNA DO PAVÃO.", syllables: ["O PERU PERAMBULOU", "NA PERNA DO PAVÃO."], image: "🦃", hint: "Trava-línguas das aves" },
          { text: "A ZEBRA ZEBRADA ZANZOU PELO ZOO.", syllables: ["A ZEBRA ZEBRADA", "ZANZOU PELO ZOO."], image: "🦓", hint: "Trava-línguas da zebra" },
          { text: "TRÊS PRATOS DE TRIGO PARA TRÊS TIGRES TRISTES.", syllables: ["TRÊS PRATOS DE TRIGO", "PARA TRÊS TIGRES!"], image: "🐯", hint: "Desafio do trigo" }
        ]
      },
      "10.2": {
        title: "Subnível 10.2: Trava-Línguas de Objetos e Sons",
        items: [
          { text: "O PEDRO PREGOU UM PREGO NA PORTA DA PREFEITURA.", syllables: ["PEDRO PREGOU UM PREGO", "NA PORTA DA PREFEITURA"], image: "🔨", hint: "Trava-línguas do prego" },
          { text: "OLHA O SAPO DENTRO DO SACO, O SACO COM O SAPO DENTRO!", syllables: ["SAPO NO SACO", "SACO COM O SAPO!"], image: "🐸", hint: "Trava-línguas do sapo no saco" },
          { text: "CAIXA DE GRAXA DA SEXTA-FEIRA É CAIXA DE GRAXA!", syllables: ["CAIXA DE GRAXA", "DA SEXTA-FEIRA"], image: "📦", hint: "Trava-línguas da caixa" },
          { text: "O PINTO PIA, A PIA PINGA. QUANTO MAIS A PIA PINGA, MAIS O PINTO PIA!", syllables: ["PINTO PIA, PIA PINGA!", "QUANTO MAIS PINGA, MAIS PIA!"], image: "🐥", hint: "Trava-línguas do pinto e da pia" },
          { text: "FIFI FIOU SEIS FIOS DE FITA DE MANHÃ.", syllables: ["FIFI FIOU SEIS FIOS", "DE FITA DE MANHÃ."], image: "🎀", hint: "Trava-línguas da fita" },
          { text: "O ARCEBISPO DE CONSTANTINOPLA É UM DESARCEBISPO CONSTANTINOPOLIZADOR.", syllables: ["O ARCEBISPO...", "DESARCEBISPOIZADOR!"], image: "🏰", hint: "Super desafio de palavra gigante" },
          { text: "NENHUM NINHO DE MAFINHO TEM MAFINHOS COMO ESTE NINHO DE MAFINHO.", syllables: ["NENHUM NINHO TEM MAFINHOS", "COMO ESTE NINHO!"], image: "🪹", hint: "Trava-línguas do ninho" },
          { text: "A BOCA DO BODE COMEU O BOLO DA BIA.", syllables: ["A BOCA DO BODE", "COMEU O BOLO DA BIA!"], image: "🐐", hint: "Trava-línguas do bode" },
          { text: "O TEMPO PERGUNTOU AO TEMPO QUANTO TEMPO O TEMPO TEM.", syllables: ["O TEMPO PERGUNTOU AO TEMPO", "QUANTO TEMPO O TEMPO TEM!"], image: "⏳", hint: "Trava-línguas do tempo" },
          { text: "O DOCE PERGUNTOU AO DOCE QUAL É O DOCE MAIS DOCE.", syllables: ["O DOCE PERGUNTOU AO DOCE", "QUAL É O DOCE MAIS DOCE!"], image: "🍬", hint: "Trava-línguas do doce" }
        ]
      },
      "10.3": {
        title: "Subnível 10.3: Grande Desafio Final de Fluência",
        items: [
          { text: "QUEM ACONSELHA UM AMIGO, UM BOM TESOURO ENCONTRA!", syllables: ["QUEM ACONSELHA UM AMIGO", "TESOURO ENCONTRA!"], image: "💎", hint: "Provérbio de sabedoria" },
          { text: "A AGILIDADE DA LEITURA TRANSFORMA NOSSOS SONHOS EM CONHECIMENTO!", syllables: ["A LEITURA TRANSFORMA", "NOSSOS SONHOS!"], image: "🚀", hint: "Mensagem inspiradora" },
          { text: "PARABÉNS! VOCÊS AGORA SÃO LEITORES OFICIAIS DA NOSSA ESCOLA!", syllables: ["VOCÊS SÃO LEITORES!", "CAMPEÕES DA ALFABETIZAÇÃO!"], image: "🏆", hint: "Conquista máxima!" },
          { text: "LER É VIAJAR PARA MUNDOS MÁGICOS SEM SAIR DA SALA DE AULA!", syllables: ["LER É VIAJAR...", "PARA MUNDOS MÁGICOS!"], image: "✨", hint: "Incentivo à leitura" },
          { text: "A CADA PALAVRA LIDA, UMA NOVA PORTA DO SABER SE ABRE!", syllables: ["A CADA PALAVRA LIDA,", "UMA PORTA SE ABRE!"], image: "🚪", hint: "Sabedoria escolar" },
          { text: "JUNTOS SOMOS MAIS FORTES E APRENDEMOS CADA VEZ MAIS!", syllables: ["JUNTOS SOMOS MAIS FORTES", "E APRENDEMOS MAIS!"], image: "🌟", hint: "União da turma" },
          { text: "O CONHECIMENTO É O MAIOR TESOURO QUE NINGUÉM PODE NOS TIRAR!", syllables: ["O CONHECIMENTO É O TESOURO", "QUE NINGUÉM PODE TIRAR!"], image: "👑", hint: "Valor da educação" },
          { text: "A PRÁTICA DIÁRIA DA LEITURA FAZ VOCÊ VOAR CADA VEZ MAIS ALTO!", syllables: ["A LEITURA DIÁRIA FAZ", "VOCÊ VOAR BEM ALTO!"], image: "🦅", hint: "Crescimento contínuo" },
          { text: "PARABÉNS A TODOS OS ESTUDANTES E PROFESSORES PELO DEDICADO TRABALHO!", syllables: ["PARABÉNS A TODOS OS ALUNOS", "E PROFESSORES!"], image: "👏", hint: "Homenagem final" },
          { text: "CONTINUEM LENDO E BRILHANDO COMO GRANDES ESTRELAS DA ESCOLA!", syllables: ["CONTINUEM LENDO E BRILHANDO", "COMO GRANDES ESTRELAS!"], image: "🌌", hint: "Despedida motivacional" }
        ]
      }
    }
  }
};
