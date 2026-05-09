require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const QRCode = require('qrcode');

const app = express();

// Supabase Configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Database initialization (Now handled via Supabase Dashboard/SQL)

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
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

// Teacher check helper
async function getTeacher(req) {
  const sessionId = req.cookies.teacher_session;
  if (!sessionId) return null;
  const { data: session } = await supabase.from('teacher_sessions').select('teacher_id').eq('id', sessionId).gt('expires', new Date().toISOString()).single();
  if (!session) return null;
  const { data: teacher } = await supabase.from('teachers').select('id, name, email, password_hash').eq('id', session.teacher_id).single();
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
  const { count } = await supabase.from('activities').select('*', { count: 'exact', head: true }).eq('teacher_id', id).eq('status', 'public');
  if (count >= 20) return { title: 'Mestre das Missões 🏆', color: '#7c3aed' };
  if (count >= 10) return { title: 'Explorador Sênior 🌟', color: '#2563eb' };
  if (count >= 5) return { title: 'Mentor Ativo 🚀', color: '#10b981' };
  return { title: 'Explorador Novato 🌱', color: '#64748b' };
}

// Routes
app.get('/', async (req, res) => {
  const { level, search, category, bncc, subject } = req.query;
  let activities = [];
  
  let query = supabase.from('activities').select('*').eq('status', 'public');
  
  if (level) query = query.ilike('level', `%${level}%`);
  if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,bncc_code.ilike.%${search}%`);
  if (category && category !== 'Todas') query = query.eq('category', category);
  if (bncc) query = query.ilike('bncc_code', `%${bncc}%`);
  if (subject && subject !== 'Todas') query = query.eq('subject', subject);

  if (level || search || (category && category !== 'Todas') || bncc || (subject && subject !== 'Todas')) {
    const { data } = await query.order('visits', { ascending: false });
    activities = data || [];
  }

  const teacher = await getTeacher(req);
  if (teacher && activities.length > 0) {
    const { data: favorites } = await supabase.from('teacher_favorites').select('activity_id').eq('teacher_id', teacher.id);
    const favIds = (favorites || []).map(f => f.activity_id);
    activities = activities.map(a => ({ ...a, is_favorite: favIds.includes(a.id) }));
  }

  const { data: comments } = await supabase.from('comments').select('*, activities(title)').eq('approved', 1).order('created_at', { ascending: false }).limit(15);
  const { data: categoriesData } = await supabase.from('activities').select('category');
  const { data: subjectsData } = await supabase.from('activities').select('subject').not('subject', 'eq', 'Geral');
  const { data: projects } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(12);

  const categories = [...new Set((categoriesData || []).map(c => c.category))];
  const subjects = [...new Set((subjectsData || []).map(s => s.subject))].filter(s => s);

  res.render('index', { 
    activities, selectedLevel: level, comments: comments || [], categories, subjects, search, 
    selectedCategory: category, selectedSubject: subject, bncc, projects: projects || [], teacher
  });
});

app.get('/admin', async (req, res) => {
  try {
    const sessionId = req.cookies.admin_session || (req.body && req.body.sessionId) || '';
    if (await isAdmin(req)) {
      // Basic fetch without complex joins
      const { data: activities } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
      const { data: pendingComments } = await supabase.from('comments').select('*').eq('approved', 0);
      const { data: teachers } = await supabase.from('teachers').select('*');
      const { data: news } = await supabase.from('news').select('*').order('created_at', { ascending: false });

      res.render('admin_panel', { 
        activities: activities || [], 
        pendingComments: pendingComments || [], 
        approvedComments: [], 
        stats: { totalVisits: 0, totalRatings: 0, pendingCount: (pendingComments || []).length }, 
        projects: [], 
        teachers: teachers || [], 
        news: news || [],
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

// Teacher Authentication
app.get('/professor/login', async (req, res) => {
  if (await getTeacher(req)) return res.redirect('/professor/dashboard');
  res.render('teacher_login', { error: null });
});

app.post('/professor/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const { data: existing } = await supabase.from('teachers').select('id').eq('email', email).single();
    if (existing) {
      return res.render('teacher_login', { error: 'E-mail já cadastrado.' });
    }
    const hash = await bcrypt.hash(password, 10);
    await supabase.from('teachers').insert({ name, email, password_hash: hash });
    res.render('teacher_login', { error: 'Cadastro realizado com sucesso! Faça login.' });
  } catch (err) {
    res.render('teacher_login', { error: 'Erro ao registrar.' });
  }
});

app.post('/professor/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: teacher } = await supabase.from('teachers').select('*').eq('email', email).single();
  if (teacher && await bcrypt.compare(password, teacher.password_hash)) {
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('teacher_sessions').insert({ id: sessionId, teacher_id: teacher.id, expires });
    await supabase.from('teachers').update({ 
      login_count: (teacher.login_count || 0) + 1, 
      last_login: new Date().toISOString() 
    }).eq('id', teacher.id);
    await supabase.from('teacher_logins').insert({ teacher_id: teacher.id });
    res.cookie('teacher_session', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000, path: '/' });
    res.redirect('/professor/dashboard');
  } else {
    res.render('teacher_login', { error: 'E-mail ou senha incorretos!' });
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
    planning: planning || []
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

app.post('/admin/activity/approve/:id', requireAdmin, (req, res) => {
  db.prepare("UPDATE activities SET status = 'public' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.post('/admin/teacher/delete/:id', requireAdmin, (req, res) => {
  const teacherId = req.params.id;
  db.prepare('DELETE FROM teacher_sessions WHERE teacher_id = ?').run(teacherId);
  db.prepare('DELETE FROM teacher_classes WHERE teacher_id = ?').run(teacherId);
  db.prepare('DELETE FROM teacher_favorites WHERE teacher_id = ?').run(teacherId);
  db.prepare('DELETE FROM teachers WHERE id = ?').run(teacherId);
  res.json({ success: true });
});

app.post('/admin/teacher/reset-password/:id', requireAdmin, async (req, res) => {
  const teacherId = req.params.id;
  const newPassword = 'mudar123'; // Temporary default password
  const hash = await bcrypt.hash(newPassword, 10);
  db.prepare('UPDATE teachers SET password_hash = ? WHERE id = ?').run(hash, teacherId);
  res.json({ success: true, newPassword });
});

app.post('/admin/add', requireAdmin, async (req, res) => {
  const { title, description, activity_url, icon_url, category, bncc_code, subject } = req.body;
  let { level } = req.body;
  if (Array.isArray(level)) level = level.join(',');

  await supabase.from('activities').insert({
    title, description, activity_url, icon_url, level: level || '1-5', category: category || 'Geral', bncc_code: bncc_code || '', subject: subject || 'Geral'
  });
  res.redirect('/admin');
});

app.post('/admin/duplicate/:id', requireAdmin, async (req, res) => {
  const { data: activity } = await supabase.from('activities').select('*').eq('id', req.params.id).single();
  if (activity) {
    const { id, ...newData } = activity;
    newData.title = `${newData.title} (Cópia)`;
    await supabase.from('activities').insert(newData);
  }
  res.redirect('/admin');
});

app.post('/admin/delete/:id', requireAdmin, async (req, res) => {
  await supabase.from('activities').delete().eq('id', req.params.id);
  res.redirect('/admin');
});

app.post('/admin/edit/:id', requireAdmin, async (req, res) => {
  const { title, description, activity_url, icon_url, category, bncc_code, subject } = req.body;
  let { level } = req.body;
  if (Array.isArray(level)) level = level.join(',');

  await supabase.from('activities').update({
    title, description, activity_url, icon_url, level: level || '1-5', category: category || 'Geral', bncc_code: bncc_code || '', subject: subject || 'Geral'
  }).eq('id', req.params.id);
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
    const now = new Date().toISOString();
    const { data: news } = await supabase
      .from('news')
      .select('*')
      .lte('published_at', now) // Apenas notícias com data menor ou igual a agora
      .order('published_at', { ascending: false });
      
    res.render('news_list', { news: news || [] });
  } catch (error) {
    console.error('BLOG ERROR:', error);
    res.render('news_list', { news: [] });
  }
});

app.get('/noticia/:id', async (req, res) => {
  const { data: article } = await supabase.from('news').select('*').eq('id', req.params.id).single();
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
