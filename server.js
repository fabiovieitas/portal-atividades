require('dotenv').config();
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const QRCode = require('qrcode');
const fs = require('fs');

const dbHelper = require('./db');
const supabase = dbHelper.supabase;

const app = express();

// Enable Gzip/Brotli compression
app.use(compression());

// Middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true
}));
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'public', 'img', 'robot-icon-512.png')));
app.get('/download/labkids.apk', (req, res) => {
  const apkPath = path.join(__dirname, 'public', 'downloads', 'labkids.apk');
  if (fs.existsSync(apkPath)) {
    return res.download(apkPath, 'LabKids_v1.0.apk');
  }
  res.render('apk_installer');
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser());

// Admin check helper
async function isAdmin(req) {
  const session = req.cookies.admin_session || (req.body && req.body.sessionId);
  return session === 'super_secret_admin_session';
}

// Admin Password (Forced for troubleshooting)
const ADMIN_PASSWORD = 'Fabio@369258!';

// Auth Middleware
async function requireAdmin(req, res, next) {
  if (await isAdmin(req)) {
    next();
  } else {
    res.redirect('/admin');
  }
}

// In-memory Cache for categories and subjects
let cachedCategories = null;
let cachedSubjects = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes cache

async function getUniqueCategoriesAndSubjects() {
  const now = Date.now();
  if (cachedCategories && cachedSubjects && (now - cacheTimestamp < CACHE_DURATION)) {
    return { categories: cachedCategories, subjects: cachedSubjects };
  }
  
  try {
    const { data: categoriesData } = await supabase.from('activities').select('category');
    const { data: subjectsData } = await supabase.from('activities').select('subject').not('subject', 'eq', 'Geral');
    
    cachedCategories = [...new Set((categoriesData || []).map(c => c.category))];
    cachedSubjects = [...new Set((subjectsData || []).map(s => s.subject))].filter(s => s);
    cacheTimestamp = now;
    
    return { categories: cachedCategories, subjects: cachedSubjects };
  } catch (err) {
    console.error('Cache categories/subjects error:', err);
    return { categories: [], subjects: [] };
  }
}

function clearActivitiesCache() {
  cachedCategories = null;
  cachedSubjects = null;
}

// Health check / Keep-Alive route (evita hibernação no Render)
app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// DiceBear Avatar Native Engine
const { createAvatar } = require('@dicebear/core');
const collection = require('@dicebear/collection');

const dicebearStyleMap = {
  'bottts': collection.bottts,
  'adventurer': collection.adventurer,
  'pixel-art': collection.pixelArt,
  'pixelArt': collection.pixelArt,
  'lorelei': collection.lorelei,
  'big-smile': collection.bigSmile,
  'bigSmile': collection.bigSmile,
  'fun-emoji': collection.funEmoji,
  'funEmoji': collection.funEmoji,
  'voxel-art': collection.bottts,
  'avataaars': collection.avataaars,
  'openPeeps': collection.openPeeps,
  'personas': collection.personas
};

const handleAvatarRequest = (req, res) => {
  try {
    const rawStyle = req.query.style || 'bottts';
    const style = dicebearStyleMap[rawStyle] || collection.bottts;
    const seed = req.query.seed || 'Student';
    const bg = (req.query.backgroundColor || req.query.bg || 'b6e3f4').replace('#', '');

    const options = {
      seed: seed
    };

    if (bg && bg !== 'transparent') {
      options.backgroundColor = [bg];
    }

    const avatar = createAvatar(style, options);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    return res.send(avatar.toString());
  } catch (err) {
    console.error('Avatar error:', err);
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.send('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#ff4757"/></svg>');
  }
};

app.get('/api/avatar', handleAvatarRequest);
app.get('/api/avatar-proxy', handleAvatarRequest);

// Teacher Dashboard Dynamic Stats API
app.get('/api/teacher/stats', async (req, res) => {
  try {
    const teacher = await getTeacher(req);
    if (!teacher) return res.status(401).json({ error: 'Não autorizado' });

    const activities = await dbHelper.getPublicActivities();
    const teacherActs = (activities || []).filter(a => a.teacher_id === teacher.id);

    res.json({
      totalActivities: teacherActs.length,
      activities: teacherActs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// In-memory Cache for teacher sessions
const sessionCache = new Map(); // sessionId -> { teacher, expires }

// Teacher check helper
async function getTeacher(req) {
  const sessionId = req.cookies.teacher_session;
  if (!sessionId) return null;
  
  const now = Date.now();
  const cached = sessionCache.get(sessionId);
  if (cached && cached.expires > now) {
    return cached.teacher;
  }
  
  const teacher = await dbHelper.getTeacherBySession(sessionId);
  if (!teacher) return null;

  const expiresAt = now + 5 * 60 * 1000;
  sessionCache.set(sessionId, { teacher, expires: expiresAt });
  return teacher;
}

// Teacher Auth Middleware
async function requireTeacher(req, res, next) {
  const teacher = await getTeacher(req);
  if (teacher) {
    req.teacher = teacher;
    next();
  } else {
    res.redirect('/professor/login');
  }
}

// Teacher level helper
async function getTeacherLevel(id) {
  const activities = await dbHelper.getActivities({ adminMode: true });
  const teacherActs = activities.filter(a => a.teacher_id === id && a.status === 'public');
  const count = teacherActs.length;
  if (count >= 20) return { title: 'Mestre das Missões 🏆', color: '#7c3aed' };
  if (count >= 10) return { title: 'Explorador Sênior 🌟', color: '#2563eb' };
  if (count >= 5) return { title: 'Mentor Ativo 🚀', color: '#10b981' };
  return { title: 'Explorador Novato 🌱', color: '#64748b' };
}

// Routes
app.get('/', async (req, res) => {
  const { level, search, category, bncc, subject } = req.query;
  let activities = [];

  if (level || search || (category && category !== 'Todas') || bncc || (subject && subject !== 'Todas')) {
    activities = await dbHelper.getActivities({ level, search, category, bncc, subject });
  }

  const teacher = await getTeacher(req);
  if (teacher && activities.length > 0) {
    const online = await dbHelper.isOnline();
    let favIds = [];
    if (online) {
      try {
        const { data: favorites } = await supabase.from('teacher_favorites').select('activity_id').eq('teacher_id', teacher.id);
        favIds = (favorites || []).map(f => f.activity_id);
      } catch (e) {}
    } else {
      try {
        const favorites = dbHelper.sqlite.prepare("SELECT activity_id FROM teacher_favorites WHERE teacher_id = ?").all(teacher.id);
        favIds = favorites.map(f => f.activity_id);
      } catch (e) {}
    }
    activities = activities.map(a => ({ ...a, is_favorite: favIds.includes(a.id) }));
  }

  const comments = await dbHelper.getApprovedComments(15);
  const { categories, subjects } = await dbHelper.getCategoriesAndSubjects();
  const projects = await dbHelper.getProjects(12);
  const showcaseActivities = await dbHelper.getActivities({});

  res.render('index', { 
    activities, showcaseActivities, selectedLevel: level, comments: comments || [], categories: categories || [], subjects: subjects || [], search, 
    selectedCategory: category, selectedSubject: subject, bncc, projects: projects || [], teacher
  });
});

app.get('/professor/certificado', (req, res) => {
  res.render('certificate_generator');
});

// Guia BNCC Indexável para SEO no Google
app.get('/bncc', async (req, res) => {
  const activities = await dbHelper.getActivities({});
  res.render('bncc_guide', { bnccCode: null, activities });
});

app.get('/bncc/:code', async (req, res) => {
  const code = req.params.code.toUpperCase();
  const activities = await dbHelper.getActivities({ bncc: code });
  res.render('bncc_guide', { bnccCode: code, activities });
});

// Presentation routes for new top-demand games
app.get('/atividades/habitos-de-higiene', (req, res) => res.render('habitos_higiene_presentation'));
app.get('/atividades/level-up', (req, res) => res.render('levelup_presentation'));

// SEO Routes: robots.txt & dynamic sitemap.xml
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: https://${req.headers.host || 'labkids.site'}/sitemap.xml`);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const host = req.headers.host || 'labkids.site';
    const baseUrl = `https://${host}`;
    const news = await dbHelper.getNews();
    const activities = await dbHelper.getActivities({});

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const mainPages = ['', '/noticias', '/aluno', '/professor/login', '/contato', '/privacidade', '/professor/certificado'];
    mainPages.forEach(page => {
      xml += `  <url><loc>${baseUrl}${page}</loc><changefreq>daily</changefreq><priority>1.0</priority></url>\n`;
    });

    (activities || []).forEach(act => {
      if (act.activity_url && act.activity_url.startsWith('/')) {
        xml += `  <url><loc>${baseUrl}${act.activity_url}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
      }
    });

    (news || []).forEach(art => {
      xml += `  <url><loc>${baseUrl}/noticia/${art.id}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

app.get('/atividades/brincando-com-arie-1', async (req, res) => {
  res.render('arie_presentation');
});

app.get('/atividades/tux-math', async (req, res) => {
  res.render('tuxmath_presentation');
});

app.get('/atividades/leitura-datashow', async (req, res) => {
  res.render('leitura_datashow_presentation');
});

app.get('/atividades/pou-online', async (req, res) => {
  res.render('pou_online_presentation');
});

app.get('/atividades/gartic', async (req, res) => {
  res.render('gartic_presentation');
});

app.get('/atividades/akinator', async (req, res) => {
  res.render('akinator_presentation');
});

app.get('/atividades/chapeuzinho-enigma', async (req, res) => {
  res.render('chapeuzinho_enigma_presentation');
});

app.get('/atividades/capitao-alberto-farao', async (req, res) => {
  res.render('capitao_alberto_presentation');
});

app.get('/atividades/arie-colorir', async (req, res) => {
  res.render('arie_colorir_presentation');
});

app.get('/atividades/tabuada-chao-e-lava', async (req, res) => {
  res.render('tabuada_lava_presentation');
});

app.get('/atividades/caca-palavras-temas', async (req, res) => {
  res.render('caca_palavras_presentation');
});

app.get('/atividades/brincando-com-arie-2', async (req, res) => {
  res.render('arie2_presentation');
});

app.get('/atividades/brincando-com-arie-3', async (req, res) => {
  res.render('arie3_presentation');
});

// Simulados Digitais Campos dos Goytacazes (1º ao 5º Ano)
app.get('/atividades/simulado-campos-1ano', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_1ano', { schools });
  } catch(e) {
    res.render('simulado_campos_1ano', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-2ano', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_2ano', { schools });
  } catch(e) {
    res.render('simulado_campos_2ano', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-3ano', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_3ano', { schools });
  } catch(e) {
    res.render('simulado_campos_3ano', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-4ano', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_4ano', { schools });
  } catch(e) {
    res.render('simulado_campos_4ano', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-5ano', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_5ano', { schools });
  } catch(e) {
    res.render('simulado_campos_5ano', { schools: [] });
  }
});

app.post('/api/simulado/submit', async (req, res) => {
  try {
    const { simulado_id, student_name, school_name, class_name, shift, answers_json, score, max_score, essay_text } = req.body;
    await dbHelper.saveSimuladoSubmission({
      simulado_id: simulado_id || 'campos-4ano-agosto-2026',
      student_name,
      school_name,
      class_name,
      shift: shift || 'Manhã',
      answers_json,
      score,
      max_score,
      essay_text
    });
    res.json({ success: true, message: 'Simulado enviado e salvo no servidor com sucesso!' });
  } catch (err) {
    console.error('[Simulado API Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export Backup JSON
app.get('/api/admin/simulado/backup/export', async (req, res) => {
  try {
    const submissions = await dbHelper.getSimuladoSubmissions('ALL');
    const backupData = {
      exported_at: new Date().toISOString(),
      system: 'Portal de Atividades - Campos dos Goytacazes',
      total_records: submissions.length,
      submissions: submissions
    };
    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="simulado_backup_${dateStr}.json"`);
    res.send(JSON.stringify(backupData, null, 2));
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Import Backup JSON
app.post('/api/admin/simulado/backup/import', async (req, res) => {
  try {
    const { backup_data } = req.body;
    let submissionsToRestore = [];
    if (typeof backup_data === 'string') {
      const parsed = JSON.parse(backup_data);
      submissionsToRestore = parsed.submissions || parsed;
    } else if (backup_data && backup_data.submissions) {
      submissionsToRestore = backup_data.submissions;
    } else if (Array.isArray(backup_data)) {
      submissionsToRestore = backup_data;
    }
    const result = await dbHelper.restoreSimuladoBackup(submissionsToRestore);
    res.json({ success: true, restored: result.count, message: `Backup restaurado com sucesso! ${result.count} registros recolocados.` });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Editar registro de aluno no simulado
app.put('/api/admin/simulado/submission/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { student_name, school_name, class_name, shift } = req.body;
    await dbHelper.updateSimuladoSubmission(id, { student_name, school_name, class_name, shift });
    res.json({ success: true, message: 'Registro do estudante atualizado com sucesso!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Apagar registro de aluno no simulado
app.delete('/api/admin/simulado/submission/:id', async (req, res) => {
  return res.status(403).json({ success: false, error: 'A exclusão de registros de estudantes está permanentemente bloqueada por diretriz de segurança pedagógica.' });
});

// Ação em Lote: Apagar múltiplos alunos (Bloqueado por segurança)
app.post('/api/admin/simulado/submissions/bulk-delete', async (req, res) => {
  return res.status(403).json({ success: false, error: 'A exclusão em lote de registros de estudantes está permanentemente bloqueada por diretriz de segurança pedagógica.' });
});

// Ação em Lote: Mover/Alterar múltiplos alunos (Turma / Turno / Simulado)
app.post('/api/admin/simulado/submissions/bulk-move', async (req, res) => {
  try {
    const { ids, class_name, shift, simulado_id } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Nenhum ID fornecido.' });
    }
    await dbHelper.bulkMoveSimuladoSubmissions(ids, { class_name, shift, simulado_id });
    res.json({ success: true, message: `${ids.length} registros atualizados com sucesso!` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/admin/simulado/resultados', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const simuladoId = req.query.simulado_id || 'ALL';
    const submissions = await dbHelper.getSimuladoSubmissions(simuladoId);
    const stats = await dbHelper.getSimuladoStats(simuladoId);
    
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, stats, submissions });
    }

    res.render('simulado_resultados', { submissions, stats, simuladoId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/admin/simulado/relatorio-op', async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const simuladoId = req.query.simulado_id || 'ALL';
    const submissions = await dbHelper.getSimuladoSubmissions(simuladoId);
    const schools = await dbHelper.getSchools();
    
    // Agrupamento consolidado por Turma, Escola e Turno
    const turmaMap = {};
    const schoolMap = {};
    const shiftMap = { 'Manhã': { count: 0, sumScore: 0 }, 'Tarde': { count: 0, sumScore: 0 } };

    submissions.forEach(s => {
      const school = s.school_name || 'E.M. Profª Eleonora da Silva Pinto';
      const className = s.class_name || 'Turma Não Identificada';
      const shift = (s.shift || 'Manhã').includes('Tarde') ? 'Tarde' : 'Manhã';
      const score = Number(s.score) || 0;
      const maxScore = Number(s.max_score) || (s.simulado_id === 'campos-1ano-agosto-2026' ? 10 : 9);
      const scoreNormalized10 = (score / maxScore) * 10;
      
      const turmaKey = `${school}___${className}___${shift}`;
      if (!turmaMap[turmaKey]) {
        turmaMap[turmaKey] = {
          school,
          className,
          shift,
          count: 0,
          totalScore: 0,
          totalScoreNorm: 0,
          levelLow: 0,  // <= 4
          levelMed: 0,  // 5 a 7
          levelHigh: 0, // 8 a 10
          students: []
        };
      }
      turmaMap[turmaKey].count++;
      turmaMap[turmaKey].totalScore += score;
      turmaMap[turmaKey].totalScoreNorm += scoreNormalized10;
      turmaMap[turmaKey].students.push(s);

      // Formatação condicional: <= 4 Vermelho | 5 a 7 Amarelo | 8 a 10 Azul
      if (scoreNormalized10 <= 4.9) {
        turmaMap[turmaKey].levelLow++;
      } else if (scoreNormalized10 <= 7.4) {
        turmaMap[turmaKey].levelMed++;
      } else {
        turmaMap[turmaKey].levelHigh++;
      }

      // Escola
      if (!schoolMap[school]) {
        schoolMap[school] = { name: school, count: 0, sumScoreNorm: 0, levelLow: 0, levelMed: 0, levelHigh: 0 };
      }
      schoolMap[school].count++;
      schoolMap[school].sumScoreNorm += scoreNormalized10;
      if (scoreNormalized10 <= 4.9) schoolMap[school].levelLow++;
      else if (scoreNormalized10 <= 7.4) schoolMap[school].levelMed++;
      else schoolMap[school].levelHigh++;

      // Turno
      if (!shiftMap[shift]) shiftMap[shift] = { count: 0, sumScore: 0 };
      shiftMap[shift].count++;
      shiftMap[shift].sumScore += scoreNormalized10;
    });

    const turmaStats = Object.values(turmaMap).map(t => ({
      ...t,
      avgScore: t.count > 0 ? (t.totalScore / t.count).toFixed(1) : '0.0',
      avgScoreNorm: t.count > 0 ? (t.totalScoreNorm / t.count).toFixed(1) : '0.0',
      pctLow: t.count > 0 ? ((t.levelLow / t.count) * 100).toFixed(1) : '0.0',
      pctMed: t.count > 0 ? ((t.levelMed / t.count) * 100).toFixed(1) : '0.0',
      pctHigh: t.count > 0 ? ((t.levelHigh / t.count) * 100).toFixed(1) : '0.0'
    }));

    const schoolStats = Object.values(schoolMap).map(sc => ({
      ...sc,
      avgScoreNorm: sc.count > 0 ? (sc.sumScoreNorm / sc.count).toFixed(1) : '0.0'
    }));

    const totalStudents = submissions.length;
    const avgGlobalScoreNorm = totalStudents > 0 ? (submissions.reduce((acc, s) => {
      const maxScore = Number(s.max_score) || (s.simulado_id === 'campos-1ano-agosto-2026' ? 10 : 9);
      return acc + ((Number(s.score) || 0) / maxScore) * 10;
    }, 0) / totalStudents).toFixed(1) : '0.0';

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json({ success: true, turmaStats, schoolStats, totalStudents, avgGlobalScoreNorm });
    }

    res.render('simulado_relatorio_op', {
      submissions,
      turmaStats,
      schoolStats,
      shiftMap,
      totalStudents,
      avgGlobalScoreNorm,
      schools: schools || [],
      simuladoId
    });
  } catch (err) {
    res.status(500).send('Erro ao carregar Relatório OP: ' + err.message);
  }
});

app.get('/atividade/:id', async (req, res) => {
  try {
    const activityId = req.params.id;
    const activities = await dbHelper.getActivities({ adminMode: true });
    let activity = activities.find(a => String(a.id) === String(activityId));

    if (!activity) {
      activity = {
        id: activityId,
        title: "Atividade Educacional",
        description: "Aprenda e divirta-se com este desafio interativo!",
        activity_url: "https://code.org/minecraft",
        icon_url: "https://cdn-icons-png.flaticon.com/512/616/616430.png"
      };
    }

    try { await dbHelper.recordVisit(activityId); } catch(e){}

    const isExternal = activity.activity_url.includes('http://') || activity.activity_url.includes('https://');

    res.render('activity_redirect', { activity, isExternal });
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/admin', async (req, res) => {
  try {
    const sessionId = req.cookies.admin_session || (req.body && req.body.sessionId) || '';
    if (await isAdmin(req)) {
      const activities = await dbHelper.getActivities({ adminMode: true });
      let pendingComments = [];
      let teachers = [];
      let news = [];

      teachers = await dbHelper.getTeachers();
      news = await dbHelper.getNews();
      try {
        if (supabase) {
          const { data: pc } = await supabase.from('comments').select('*').eq('approved', 0);
          if (pc) pendingComments = pc;
        }
        if (!pendingComments || pendingComments.length === 0) {
          pendingComments = await dbHelper.queryAll("SELECT * FROM comments WHERE approved = 0");
        }
      } catch (e) {}

      const schools = await dbHelper.getSchools();
      const classes = await dbHelper.getAllClasses();

      res.render('admin_panel', { 
        activities: activities || [], 
        pendingComments: pendingComments || [], 
        approvedComments: [], 
        stats: { totalVisits: 0, totalRatings: 0, pendingCount: (pendingComments || []).length }, 
        projects: [], 
        teachers: teachers || [], 
        news: news || [],
        schools: schools || [],
        classes: classes || [],
        sessionId: sessionId || ''
      });
    } else {
      res.render('admin', { error: null });
    }
  } catch (error) {
    console.error('ADMIN ERROR:', error);
    res.status(500).send('Erro ao carregar o painel: ' + error.message);
  }
});

const crypto = require('crypto');

app.post('/admin/login', async (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.cookie('admin_session', 'super_secret_admin_session', { maxAge: 24 * 60 * 60 * 1000, path: '/', httpOnly: true });
    res.redirect('/admin');
  } else {
    res.render('admin', { error: 'Senha incorreta!' });
  }
});

app.get('/admin/logout', async (req, res) => {
  const sessionId = req.cookies.admin_session;
  if (sessionId) {
    await supabase.from('sessions').delete().eq('id', sessionId);
  }
  res.clearCookie('admin_session');
  res.redirect('/admin');
});

// Admin Schools & Classes Routes
app.post('/admin/schools/add', requireAdmin, async (req, res) => {
  try {
    const { name, code, city } = req.body;
    if (name) {
      await dbHelper.addSchool(name, code, city);
    }
    res.redirect('/admin?tab=schools');
  } catch (err) {
    res.status(500).send('Erro ao adicionar escola: ' + err.message);
  }
});

app.post('/admin/schools/delete/:id', requireAdmin, async (req, res) => {
  try {
    await dbHelper.deleteSchool(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/admin/classes/add', requireAdmin, async (req, res) => {
  try {
    const { school_id, name, grade_level, class_pin } = req.body;
    if (school_id && name) {
      await dbHelper.addClass({ school_id, name, grade_level, class_pin: class_pin || '1234' });
    }
    res.redirect('/admin?tab=schools');
  } catch (err) {
    res.status(500).send('Erro ao adicionar turma: ' + err.message);
  }
});

app.post('/admin/classes/delete/:id', requireAdmin, async (req, res) => {
  try {
    await dbHelper.deleteClass(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API Routes for Student / Tablet Login & Avatars
app.get('/api/schools', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/schools/:schoolId/classes', async (req, res) => {
  try {
    const classes = await dbHelper.getClassesBySchool(req.params.schoolId);
    res.json(classes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/classes/verify-pin', async (req, res) => {
  try {
    const { class_id, pin } = req.body;
    const isValid = await dbHelper.verifyClassPin(class_id, pin);
    res.json({ success: isValid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/classes/:classId/students', async (req, res) => {
  try {
    const students = await dbHelper.getStudentsByClass(req.params.classId);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students', async (req, res) => {
  try {
    const { class_id, name, avatar_config, school_name, class_name, student_pin } = req.body;
    if (!class_id || !name) return res.status(400).json({ error: 'Faltam dados obrigatórios.' });
    await dbHelper.addStudent({ class_id, name, avatar_config, school_name, class_name, student_pin });
    const students = await dbHelper.getStudentsByClass(class_id);
    const created = students.find(s => s.name === name);
    if (created) {
      if (school_name && !created.school_name) created.school_name = school_name;
      if (class_name && !created.class_name) created.class_name = class_name;
    }
    res.json({ success: true, student: created });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students/:id/avatar', async (req, res) => {
  try {
    const { name, avatar_config, student_pin, school_name, class_name } = req.body;
    if (name || avatar_config || student_pin !== undefined) {
      await dbHelper.updateStudentProfile(req.params.id, { name, avatar_config, student_pin, school_name, class_name });
    } else {
      await dbHelper.updateStudentAvatar(req.params.id, avatar_config);
    }
    const updated = await dbHelper.getStudentById(req.params.id);
    res.json({ success: true, student: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/students/verify-pin', async (req, res) => {
  try {
    const { student_id, pin } = req.body;
    const student = await dbHelper.getStudentById(student_id);
    if (!student) return res.status(404).json({ success: false, error: 'Aluno não encontrado' });
    const savedPin = String(student.student_pin || '').trim();
    const inputPin = String(pin || '').trim();
    if (!savedPin || savedPin === inputPin) {
      return res.json({ success: true, student });
    }
    return res.json({ success: false, error: 'Senha incorreta do aluno' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/aluno', async (req, res) => {
  res.render('student_portal');
});

app.post('/api/students/:id/activity-complete', async (req, res) => {
  try {
    const { activity_id, score } = req.body;
    const result = await dbHelper.recordStudentActivity(req.params.id, activity_id || 0, score || 10);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Teacher Authentication
app.get('/professor/login', async (req, res) => {
  if (await getTeacher(req)) return res.redirect('/professor/dashboard');
  res.render('teacher_login', { error: null });
});

app.post('/professor/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const cleanEmail = String(email || '').trim().toLowerCase();

    // Check if email exists in Supabase or DB Engine
    let existing = null;
    if (supabase) {
      try {
        const { data } = await supabase.from('teachers').select('id').eq('email', cleanEmail).maybeSingle();
        if (data) existing = data;
      } catch(e){}
    }
    if (!existing) {
      existing = await dbHelper.queryGet("SELECT id FROM teachers WHERE email = ?", [cleanEmail]);
    }

    if (existing) {
      return res.render('teacher_login', { error: 'E-mail já cadastrado.' });
    }

    const hash = await bcrypt.hash(password, 10);

    // Save in Supabase if available
    if (supabase) {
      try {
        await supabase.from('teachers').insert({ name, email: cleanEmail, password_hash: hash });
      } catch(e){}
    }

    // Save in Turso Cloud / SQLite DB Engine
    try {
      await dbHelper.queryRun("INSERT INTO teachers (name, email, password_hash) VALUES (?, ?, ?)", [name, cleanEmail, hash]);
    } catch(e){}

    res.render('teacher_login', { error: 'Cadastro realizado com sucesso! Faça login.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.render('teacher_login', { error: `Erro ao registrar: ${err.message || err}` });
  }
});

app.post('/professor/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const cleanEmail = String(email || '').trim().toLowerCase();
    let teacher = null;

    // Search in Supabase if available
    if (supabase) {
      try {
        const { data } = await supabase.from('teachers').select('*').eq('email', cleanEmail).maybeSingle();
        if (data) teacher = data;
      } catch(e){}
    }

    // Fallback to Turso / SQLite DB Engine
    if (!teacher) {
      teacher = await dbHelper.queryGet("SELECT * FROM teachers WHERE email = ?", [cleanEmail]);
    }

    if (teacher && await bcrypt.compare(password, teacher.password_hash)) {
      const sessionId = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      // Store session in Supabase if available
      if (supabase) {
        try {
          await supabase.from('teacher_sessions').insert({ id: sessionId, teacher_id: teacher.id, expires });
          await supabase.from('teachers').update({ 
            login_count: (teacher.login_count || 0) + 1, 
            last_login: new Date().toISOString() 
          }).eq('id', teacher.id);
          await supabase.from('teacher_logins').insert({ teacher_id: teacher.id });
        } catch(e){}
      }

      // Store session in Turso Cloud / SQLite DB Engine
      try {
        await dbHelper.queryRun("INSERT INTO teacher_sessions (id, teacher_id, expires) VALUES (?, ?, ?)", [sessionId, teacher.id, expires]);
        await dbHelper.queryRun("UPDATE teachers SET login_count = COALESCE(login_count, 0) + 1, last_login = CURRENT_TIMESTAMP WHERE id = ?", [teacher.id]);
        await dbHelper.queryRun("INSERT INTO teacher_logins (teacher_id) VALUES (?)", [teacher.id]);
      } catch(e){}

      res.cookie('teacher_session', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000, path: '/' });
      res.redirect('/professor/dashboard');
    } else {
      res.render('teacher_login', { error: 'E-mail ou senha incorretos!' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.render('teacher_login', { error: `Erro ao fazer login: ${err.message || err}` });
  }
});

app.get('/professor/logout', async (req, res) => {
  const sessionId = req.cookies.teacher_session;
  if (sessionId) {
    await supabase.from('teacher_sessions').delete().eq('id', sessionId);
  }
  res.clearCookie('teacher_session');
  res.redirect('/professor/login');
});

// Teacher Dashboard
app.get('/professor/dashboard', requireTeacher, async (req, res) => {
  const { data: activities } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
  const { data: favoritesData } = await supabase.from('teacher_favorites').select('activity_id').eq('teacher_id', req.teacher.id);
  const favorites = (favoritesData || []).map(f => f.activity_id);
  
  const { data: exams } = await supabase.from('exams').select('*').eq('teacher_id', req.teacher.id).order('created_at', { ascending: false });
  const { data: classes } = await supabase.from('teacher_classes').select('*').eq('teacher_id', req.teacher.id).order('created_at', { ascending: false });
  const { data: globalExams } = await supabase.from('global_exams').select('*').order('created_at', { ascending: false });
  
  const examIds = (exams || []).map(e => e.id);
  let examSubmissions = [];
  if (examIds.length > 0) {
    const { data: subs } = await supabase.from('exam_submissions').select('*, exams(title, access_code, num_questions)').in('exam_id', examIds).order('created_at', { ascending: false });
    examSubmissions = subs || [];
  }

  const { data: collections } = await supabase.from('teacher_collections').select('*').eq('teacher_id', req.teacher.id);
  const { data: planning } = await supabase.from('teacher_planning').select('*, activities(title)').eq('teacher_id', req.teacher.id);
  
  res.render('teacher_dashboard', { 
    teacher: { ...req.teacher, level: await getTeacherLevel(req.teacher.id) },
    activities: activities || [],
    favorites,
    exams: exams || [],
    classes: classes || [],
    globalExams: globalExams || [],
    collections: collections || [],
    planning: planning || [],
    examSubmissions
  });
});

// Teacher API Routes
app.post('/api/teacher/password', requireTeacher, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const match = await bcrypt.compare(currentPassword, req.teacher.password_hash);
  if (!match) return res.json({ success: false, message: 'Senha atual incorreta' });
  const hash = await bcrypt.hash(newPassword, 10);
  await supabase.from('teachers').update({ password_hash: hash }).eq('id', req.teacher.id);
  res.json({ success: true });
});

app.post('/api/teacher/activities/add', requireTeacher, async (req, res) => {
  const { title, description, activity_url, category, bncc_code, subject, level } = req.body;
  await supabase.from('activities').insert({
    title, description, activity_url, 
    category: category || 'Geral', 
    bncc_code: bncc_code || '', 
    subject: subject || 'Geral', 
    level: level || '1-5', 
    teacher_id: req.teacher.id, 
    status: 'private'
  });
  clearActivitiesCache();
  res.json({ success: true });
});

app.post('/api/teacher/classes/add', requireTeacher, async (req, res) => {
  const { school_name, class_name } = req.body;
  if (!school_name || !class_name) return res.json({ success: false });
  await supabase.from('teacher_classes').insert({
    teacher_id: req.teacher.id, school_name, class_name
  });
  res.json({ success: true });
});

app.post('/api/teacher/activities/request-public/:id', requireTeacher, async (req, res) => {
  await supabase.from('activities').update({ status: 'pending' }).eq('id', req.params.id).eq('teacher_id', req.teacher.id);
  res.json({ success: true });
});

app.post('/api/teacher/classes/delete/:id', requireTeacher, async (req, res) => {
  await supabase.from('teacher_classes').delete().eq('id', req.params.id).eq('teacher_id', req.teacher.id);
  res.json({ success: true });
});

app.post('/api/teacher/exams/add', requireTeacher, async (req, res) => {
  try {
    const { title, num_questions, pdf_source, pdf_url, pdf_base64, pdf_name } = req.body;
    let final_pdf_url = pdf_url;

    // Generate random 5-character access code
    let access_code;
    let codeExists = true;
    while (codeExists) {
      access_code = Math.random().toString(36).substring(2, 7).toUpperCase();
      const { data: existing } = await supabase.from('exams').select('id').eq('access_code', access_code).maybeSingle();
      if (!existing) codeExists = false;
    }

    if (pdf_source === 'upload' && pdf_base64) {
      const uploadDir = path.join(__dirname, 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const uniqueFileName = `${Date.now()}-${pdf_name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      fs.writeFileSync(filePath, Buffer.from(pdf_base64, 'base64'));
      final_pdf_url = `/uploads/${uniqueFileName}`;
    }

    const insertData = {
      title,
      pdf_url: final_pdf_url,
      access_code,
      num_questions: parseInt(num_questions) || 10,
      teacher_id: req.teacher.id
    };

    let { data: newExam, error } = await supabase.from('exams').insert(insertData).select().single();

    if (error && error.message && error.message.includes('num_questions')) {
      console.warn("Database is missing 'num_questions' column. Falling back to insert without it.");
      delete insertData.num_questions;
      const retryResult = await supabase.from('exams').insert(insertData).select().single();
      newExam = retryResult.data;
      error = retryResult.error;
    }

    if (error) throw error;

    res.json({ success: true, exam: newExam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/exams/delete/:id', requireTeacher, async (req, res) => {
  try {
    // Delete files if uploaded locally
    const { data: exam } = await supabase.from('exams').select('pdf_url').eq('id', req.params.id).eq('teacher_id', req.teacher.id).single();
    if (exam && exam.pdf_url && exam.pdf_url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, 'public', exam.pdf_url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const { error } = await supabase.from('exams').delete().eq('id', req.params.id).eq('teacher_id', req.teacher.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/submissions/delete/:id', requireTeacher, async (req, res) => {
  try {
    // Make sure this submission belongs to one of this teacher's exams
    const { data: sub } = await supabase.from('exam_submissions').select('*, exams(teacher_id)').eq('id', req.params.id).single();
    if (!sub || sub.exams.teacher_id !== req.teacher.id) {
      return res.status(403).json({ success: false, error: 'Acesso negado' });
    }

    const { error } = await supabase.from('exam_submissions').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Collections API
app.get('/api/teacher/collections', requireTeacher, async (req, res) => {
  const { data: collections } = await supabase.from('teacher_collections').select('*, collection_items(activities(*))').eq('teacher_id', req.teacher.id);
  res.json(collections || []);
});

app.post('/api/teacher/collections/add', requireTeacher, async (req, res) => {
  const { name } = req.body;
  await supabase.from('teacher_collections').insert({ teacher_id: req.teacher.id, name });
  res.json({ success: true });
});

app.post('/api/teacher/collections/add-item', requireTeacher, async (req, res) => {
  const { collection_id, activity_id } = req.body;
  await supabase.from('collection_items').upsert({ collection_id, activity_id });
  res.json({ success: true });
});

// Planning API
app.get('/api/teacher/planning', requireTeacher, async (req, res) => {
  const { data: planning } = await supabase.from('teacher_planning').select('*, activities(title)').eq('teacher_id', req.teacher.id);
  res.json(planning || []);
});

app.post('/api/teacher/planning/add', requireTeacher, async (req, res) => {
  const { activity_id, planned_date } = req.body;
  await supabase.from('teacher_planning').insert({ teacher_id: req.teacher.id, activity_id, planned_date });
  res.json({ success: true });
});

app.get('/api/teacher/export', requireTeacher, async (req, res) => {
  const { data: favs } = await supabase.from('teacher_favorites').select('activities(title, subject, bncc_code)').eq('teacher_id', req.teacher.id);
  
  let csv = 'Titulo,Disciplina,BNCC\\n';
  (favs || []).forEach(row => {
    const a = row.activities;
    csv += `"${a.title}","${a.subject}","${a.bncc_code}"\\n`;
  });
  
  res.header('Content-Type', 'text/csv');
  res.attachment('meu_relatorio.csv');
  res.send(csv);
});

app.post('/admin/settings', requireAdmin, async (req, res) => {
  const { newPassword, newEmail } = req.body;
  // Implementation for updating admin settings in Supabase if needed
  res.json({ success: true });
});

app.get('/api/admin/teacher-stats/:id', requireAdmin, async (req, res) => {
  const teacherId = req.params.id;
  // Simplified weekly stats for Supabase
  const { data: logins } = await supabase.from('teacher_logins').select('timestamp').eq('teacher_id', teacherId).order('timestamp', { ascending: false }).limit(50);
  const { data: scans } = await supabase.from('activity_scans').select('activity_id, activities(title)').eq('teacher_id', teacherId).limit(20);

  res.json({ logins: logins || [], scans: scans || [] });
});

app.post('/admin/activity/approve/:id', requireAdmin, async (req, res) => {
  try {
    await supabase.from('activities').update({ status: 'public' }).eq('id', req.params.id);
    if (typeof clearActivitiesCache === 'function') clearActivitiesCache();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/admin/teacher/delete/:id', requireAdmin, async (req, res) => {
  try {
    const teacherId = req.params.id;
    await supabase.from('teacher_sessions').delete().eq('teacher_id', teacherId);
    await supabase.from('teacher_classes').delete().eq('teacher_id', teacherId);
    await supabase.from('teacher_favorites').delete().eq('teacher_id', teacherId);
    await supabase.from('teachers').delete().eq('id', teacherId);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/admin/teacher/reset-password/:id', requireAdmin, async (req, res) => {
  try {
    const teacherId = req.params.id;
    const newPassword = 'mudar123'; // Temporary default password
    const hash = await bcrypt.hash(newPassword, 10);
    await supabase.from('teachers').update({ password_hash: hash }).eq('id', teacherId);
    res.json({ success: true, newPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/admin/add', requireAdmin, async (req, res) => {
  const { title, description, activity_url, icon_url, category, bncc_code, subject } = req.body;
  let { level } = req.body;
  if (Array.isArray(level)) level = level.join(',');

  await supabase.from('activities').insert({
    title, description, activity_url, icon_url, level: level || '1-5', category: category || 'Geral', bncc_code: bncc_code || '', subject: subject || 'Geral'
  });
  clearActivitiesCache();
  res.redirect('/admin');
});

app.post('/admin/duplicate/:id', requireAdmin, async (req, res) => {
  const { data: activity } = await supabase.from('activities').select('*').eq('id', req.params.id).single();
  if (activity) {
    const { id, ...newData } = activity;
    newData.title = `${newData.title} (Cópia)`;
    await supabase.from('activities').insert(newData);
    clearActivitiesCache();
  }
  res.redirect('/admin');
});

app.post('/admin/delete/:id', requireAdmin, async (req, res) => {
  await supabase.from('activities').delete().eq('id', req.params.id);
  clearActivitiesCache();
  res.redirect('/admin');
});

app.post('/admin/edit/:id', requireAdmin, async (req, res) => {
  const { title, description, activity_url, icon_url, category, bncc_code, subject } = req.body;
  let { level } = req.body;
  if (Array.isArray(level)) level = level.join(',');

  await supabase.from('activities').update({
    title, description, activity_url, icon_url, level: level || '1-5', category: category || 'Geral', bncc_code: bncc_code || '', subject: subject || 'Geral'
  }).eq('id', req.params.id);
  clearActivitiesCache();
  res.redirect('/admin');
});

// Comment Moderation
app.post('/admin/comments/approve/:id', requireAdmin, async (req, res) => {
  await supabase.from('comments').update({ approved: 1 }).eq('id', req.params.id);
  res.json({ success: true });
});

app.post('/admin/comments/delete/:id', requireAdmin, async (req, res) => {
  await supabase.from('comments').delete().eq('id', req.params.id);
  res.json({ success: true });
});

app.post('/admin/comments/edit/:id', requireAdmin, async (req, res) => {
  const { comment_text } = req.body;
  await supabase.from('comments').update({ comment_text }).eq('id', req.params.id);
  res.redirect('/admin');
});

// Project Management
app.post('/admin/projects/add', requireAdmin, async (req, res) => {
  const { title, description, image_url, school_name, class_name } = req.body;
  await supabase.from('projects').insert({ title, description, image_url, school_name: school_name || '', class_name: class_name || '' });
  res.redirect('/admin');
});

app.post('/admin/projects/delete/:id', requireAdmin, async (req, res) => {
  await supabase.from('projects').delete().eq('id', req.params.id);
  res.redirect('/admin');
});

// Admin News Management
app.post('/admin/news/add', requireAdmin, async (req, res) => {
  const { title, summary, content, image_url, category, author, published_at } = req.body;
  const { error } = await supabase.from('news').insert({
    title, summary, content, image_url, category, author,
    published_at: published_at || new Date().toISOString()
  });
  if (error) console.error('Error adding news:', error);
  res.redirect('/admin#news');
});

app.post('/admin/news/delete/:id', requireAdmin, async (req, res) => {
  await supabase.from('news').delete().eq('id', req.params.id);
  res.redirect('/admin');
});

// Institutional Pages
app.get('/privacidade', (req, res) => {
  res.render('privacy');
});

app.get('/contato', (req, res) => {
  res.render('contact');
});

// Blog / News Routes
app.get('/noticias', async (req, res) => {
  try {
    const news = await dbHelper.getNews();
    res.render('news_list', { news: news || [] });
  } catch (error) {
    console.error('BLOG ERROR:', error);
    res.render('news_list', { news: [] });
  }
});

app.get('/noticia/:id', async (req, res) => {
  const article = await dbHelper.getSingleNews(req.params.id);
  if (!article) return res.status(404).send('Notícia não encontrada');
  res.render('news_view', { article });
});

// QR Code Redirection (AdSense Landing)
app.get('/qr/:id', async (req, res) => {
  const { data: activity } = await supabase.from('activities').select('*').eq('id', req.params.id).single();
  if (!activity) return res.status(404).send('Atividade não encontrada');
  
  const teacherId = req.query.t || null;
  await supabase.from('activities').update({ qr_scans: (activity.qr_scans || 0) + 1 }).eq('id', req.params.id);
  if (teacherId) {
    await supabase.from('activity_scans').insert({ activity_id: req.params.id, teacher_id: teacherId });
  }
  
  res.render('qr_redirect', { activity });
});

// Student Exams System
app.get('/prova', (req, res) => {
  res.render('exam_login', { error: null });
});

app.post('/prova/login', async (req, res) => {
  const { access_code, student_name } = req.body;
  const { data: exam } = await supabase.from('exams').select('*').eq('access_code', access_code).single();
  
  if (!exam) {
    return res.render('exam_login', { error: 'Código de acesso inválido.' });
  }

  let { data: submission } = await supabase.from('exam_submissions').select('*').eq('exam_id', exam.id).eq('student_name', student_name).single();
  if (!submission) {
    const { data: newSub } = await supabase.from('exam_submissions').insert({ exam_id: exam.id, student_name }).select().single();
    submission = newSub;
  }

  res.cookie('exam_session', JSON.stringify({ submission_id: submission.id, exam_id: exam.id }), { maxAge: 4 * 60 * 60 * 1000 }); // 4 hours
  res.redirect(`/prova/sala`);
});

app.get('/prova/sala', async (req, res) => {
  const sessionCookie = req.cookies.exam_session;
  if (!sessionCookie) return res.redirect('/prova');
  
  const session = JSON.parse(sessionCookie);
  const { data: exam } = await supabase.from('exams').select('*').eq('id', session.exam_id).single();
  const { data: submission } = await supabase.from('exam_submissions').select('*').eq('id', session.submission_id).single();

  if (!exam || !submission) return res.redirect('/prova');

  res.render('exam_room', { exam, submission });
});

// API Routes
app.post('/api/exam/submit-answer', async (req, res) => {
  const sessionCookie = req.cookies.exam_session;
  if (!sessionCookie) return res.status(401).json({ error: 'Unauthorized' });
  
  const session = JSON.parse(sessionCookie);
  const { answers } = req.body;
  
  await supabase.from('exam_submissions').update({ answers_json: answers, updated_at: new Date().toISOString() }).eq('id', session.submission_id);
  res.json({ success: true });
});

// Teacher API: Favorites
app.post('/api/teacher/favorite/:id', requireTeacher, async (req, res) => {
  const activity_id = parseInt(req.params.id);
  const teacherId = req.teacher.id;
  const { data: existing } = await supabase.from('teacher_favorites').select('*').eq('teacher_id', teacherId).eq('activity_id', activity_id).single();
  
  if (existing) {
    await supabase.from('teacher_favorites').delete().eq('teacher_id', teacherId).eq('activity_id', activity_id);
    res.json({ success: true, status: 'removed' });
  } else {
    try {
      await supabase.from('teacher_favorites').insert({ teacher_id: teacherId, activity_id });
      res.json({ success: true, status: 'added' });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
});

app.post('/api/rate/:id', async (req, res) => {
  const { rating } = req.body;
  const stars = parseInt(rating);
  if (stars >= 1 && stars <= 5) {
    const { data: activity } = await supabase.from('activities').select('rating_sum, rating_count').eq('id', req.params.id).single();
    await supabase.from('activities').update({ 
      rating_sum: (activity.rating_sum || 0) + stars, 
      rating_count: (activity.rating_count || 0) + 1 
    }).eq('id', req.params.id);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid rating' });
  }
});

app.post('/api/visit/:id', async (req, res) => {
  const { data: activity } = await supabase.from('activities').select('visits').eq('id', req.params.id).single();
  await supabase.from('activities').update({ visits: (activity.visits || 0) + 1 }).eq('id', req.params.id);
  res.json({ success: true });
});

app.post('/api/comment', async (req, res) => {
  const { activity_id, student_name, school_name, class_name, comment_text, avatar } = req.body;
  if (!activity_id || !student_name || !comment_text) return res.status(400).json({ error: 'Missing fields' });

  const lastCommentTime = req.cookies.last_comment_time;
  const now = Date.now();
  if (lastCommentTime && (now - lastCommentTime < 60000)) return res.status(429).json({ error: 'flood' });

  // Simplified duplicate check
  const { data: duplicate } = await supabase.from('comments').select('id').eq('activity_id', activity_id).eq('student_name', student_name).eq('comment_text', comment_text).gt('created_at', new Date(now - 300000).toISOString()).single();
  if (duplicate) return res.status(429).json({ error: 'duplicate' });

  await supabase.from('comments').insert({ activity_id, student_name, school_name: school_name || '', class_name: class_name || '', avatar: avatar || '🤖', comment_text });
  res.cookie('last_comment_time', now, { maxAge: 60000 });
  res.json({ success: true });
});

app.get('/api/stats', async (req, res) => {
  const { data: topActivities } = await supabase.from('activities').select('title, visits').order('visits', { ascending: false }).limit(5);
  res.json(topActivities || []);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
