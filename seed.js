const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

console.log('Seeding oficial do Portal Lab Kids no SQLite local...');

db.exec(`
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    activity_url TEXT NOT NULL,
    icon_url TEXT,
    level TEXT DEFAULT '1-5',
    category TEXT DEFAULT 'Geral',
    rating_sum INTEGER DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    visits INTEGER DEFAULT 0,
    bncc_code TEXT DEFAULT '',
    subject TEXT DEFAULT 'Geral',
    qr_scans INTEGER DEFAULT 0,
    teacher_id INTEGER,
    status TEXT DEFAULT 'public',
    author_credit TEXT,
    month TEXT DEFAULT 'Agosto',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const initialActivities = [
  {
    title: "⚔️ Ninja Math: A Espada da Tabuada [JOGO AUTORAL]",
    description: "Corte as frutas com os resultados corretos das operações matemáticas e avance de faixas no dojô ninja!",
    activity_url: "/atividades/ninja-math",
    icon_url: "/games/ninja-math/assets/ninja_mascot.png",
    level: "1-5", category: "Matemática", bncc_code: "EF01MA06, EF02MA05, EF03MA03", subject: "Matemática"
  },
  {
    title: "🕵️ Detetive da Ortografia: A Caça aos Dígrafos [JOGO AUTORAL]",
    description: "Jogo investigativo para desmascarar erros ortográficos e fixar regras de dígrafos (CH, LH, NH, RR, SS, C/Ç).",
    activity_url: "/atividades/detetive-ortografia",
    icon_url: "/favicon.svg",
    level: "1-5", category: "Língua Portuguesa", bncc_code: "EF02LP01, EF03LP01, EF35LP05", subject: "Português"
  },
  {
    title: "🏭 Fábrica de Sílabas & Palavras [JOGO AUTORAL]",
    description: "Combine peças silábicas na esteira rolante para produzir palavras completas associando som e significado.",
    activity_url: "/atividades/fabrica-de-silabas",
    icon_url: "/favicon.svg",
    level: "1-5", category: "Alfabetização", bncc_code: "EF01LP08, EF01LP09, EF02LP04", subject: "Português"
  },
  {
    title: "🕵️ Carta Enigmática & Escape Room [JOGO AUTORAL]",
    description: "Decifre enigmas, pistas lógicas e códigos secretos para escapar dos quartos misteriosos do laboratório!",
    activity_url: "/atividades/carta-enigmatica",
    icon_url: "/img/robot-icon-512.png",
    level: "1-5", category: "Lógica & Desafios", bncc_code: "EF03LP01, EF04LP01", subject: "Português"
  },
  {
    title: "Tux Math - Matemática Divertida",
    description: "Jogo educativo arcade onde você ajuda o pinguim Tux a defender a cidade resolvendo equações de cálculo mental!",
    activity_url: "/atividades/tux-math",
    icon_url: "https://tuxmath.org/images/favicon.png",
    level: "1-5", category: "Matemática", bncc_code: "EF01MA06, EF02MA05, EF03MA03", subject: "Matemática"
  },
  {
    title: "Brincando com Ariê 1",
    description: "Jogo educativo para auxílio à alfabetização, reconhecimento de cores, frutas e associação de palavras.",
    activity_url: "/atividades/brincando-com-arie-1",
    icon_url: "https://arietoy.com.br/assets_games/br/brincando-com-arie-1/screenshots/brincando-com-arie-1-01.jpg",
    level: "1-5", category: "Alfabetização", bncc_code: "EI02EF04, EI02ET06, EF01LP10", subject: "Português"
  }
];

const insert = db.prepare(`
  INSERT INTO activities (title, description, activity_url, icon_url, level, category, bncc_code, subject, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'public')
`);

const existing = db.prepare("SELECT COUNT(*) as count FROM activities").get();
if (existing.count === 0) {
  for (const act of initialActivities) {
    insert.run(act.title, act.description, act.activity_url, act.icon_url, act.level, act.category, act.bncc_code, act.subject);
  }
  console.log(`✓ ${initialActivities.length} atividades oficiais inseridas no SQLite local com sucesso.`);
} else {
  console.log(`Banco local já possui ${existing.count} atividades cadastradas. Nenhuma ação necessária.`);
}

db.close();
