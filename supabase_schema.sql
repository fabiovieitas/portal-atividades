-- Script para criar as tabelas no Supabase (PostgreSQL)

-- 1. Atividades
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
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
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Sessões Admin (O Vercel/Supabase Auth pode substituir isso, mas manteremos a lógica atual)
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    expires TIMESTAMPTZ
);

-- 3. Professores
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    login_count INTEGER DEFAULT 0,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Sessões de Professores
CREATE TABLE IF NOT EXISTS teacher_sessions (
    id TEXT PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ
);

-- 5. Comentários
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    school_name TEXT,
    class_name TEXT,
    avatar TEXT DEFAULT '🤖',
    comment_text TEXT NOT NULL,
    approved INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Projetos
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    school_name TEXT,
    class_name TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Favoritos dos Professores
CREATE TABLE IF NOT EXISTS teacher_favorites (
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (teacher_id, activity_id)
);

-- 8. Provas (Exams)
CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    access_code TEXT UNIQUE NOT NULL,
    num_questions INTEGER DEFAULT 10,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Submissões de Provas
CREATE TABLE IF NOT EXISTS exam_submissions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    answers_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Turmas dos Professores
CREATE TABLE IF NOT EXISTS teacher_classes (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    school_name TEXT NOT NULL,
    class_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Provas Globais
CREATE TABLE IF NOT EXISTS global_exams (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    pdf_url TEXT NOT NULL,
    subject TEXT DEFAULT 'Geral',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. Logs de Login
CREATE TABLE IF NOT EXISTS teacher_logins (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Scans de Atividades
CREATE TABLE IF NOT EXISTS activity_scans (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. Coleções de Professores
CREATE TABLE IF NOT EXISTS teacher_collections (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. Itens das Coleções
CREATE TABLE IF NOT EXISTS collection_items (
    collection_id INTEGER REFERENCES teacher_collections(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    PRIMARY KEY (collection_id, activity_id)
);

-- 16. Planejamento
CREATE TABLE IF NOT EXISTS teacher_planning (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    planned_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. Submissões do Simulado Digital
CREATE TABLE IF NOT EXISTS simulado_submissions (
    id SERIAL PRIMARY KEY,
    simulado_id TEXT DEFAULT 'campos-4ano-agosto-2026',
    student_name TEXT NOT NULL,
    school_name TEXT,
    class_name TEXT,
    shift TEXT DEFAULT 'Manhã',
    answers_json TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 9,
    essay_text TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

