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
const mailService = require('./mailService');
// Supabase fully decommissioned. All operations run via Turso Cloud (libsql).
const supabase = null;

const app = express();

// Enable Gzip/Brotli compression
app.use(compression());

// Redirecionamento canônico 301 para domínio raiz (elimina duplicação www vs non-www no AdSense)
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host.startsWith('www.')) {
    return res.redirect(301, `https://${host.replace(/^www\./, '')}${req.originalUrl}`);
  }
  next();
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true, limit: '15mb' }));
app.use(express.json({ limit: '15mb' }));
app.get('/sw.js', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'sw.js'));
});
app.get('/ads.txt', (req, res) => {
  const rawPubId = process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531';
  const pubId = rawPubId.replace(/^ca-/, '');
  res.type('text/plain');
  res.send(`google.com, ${pubId}, DIRECT, f08c47fec0942fa0\n`);
});
app.get('/robots.txt', (req, res) => {

  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});
app.get('/manifest.json', (req, res) => {
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

app.get('/sw.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(__dirname, 'public', 'sw.js'));
});

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('manifest.json') || filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
  },
  etag: false
}));

// ============================================================================
// MÓDULO PESQUISA & MONITOR DE PREÇOS (pesquisa.labkids.online & /pesquisa)
// ============================================================================
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host.startsWith('pesquisa.') && req.path === '/') {
    return res.render('pesquisa');
  }
  next();
});

app.get('/pesquisa/admin', (req, res) => {
  res.render('pesquisa_admin');
});


app.get('/pesquisa/go', (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) return res.redirect('/pesquisa');

  let meliTool = '34127116';
  let meliWord = 'fabiovmarques';
  let shopeeTag = '';

  try {
    if (fs.existsSync(AFFILIATE_FILE_PATH)) {
      const aff = JSON.parse(fs.readFileSync(AFFILIATE_FILE_PATH, 'utf-8'));
      if (aff.meli_tool) meliTool = aff.meli_tool;
      if (aff.meli_word) meliWord = aff.meli_word;
      if (aff.shopee_tag) shopeeTag = aff.shopee_tag;
    }
  } catch (e) {}

  try {
    const u = new URL(targetUrl);
    const isMeli = u.hostname.includes('mercadolivre.com') || u.hostname.includes('mercadolibre.com');
    const isShopee = u.hostname.includes('shopee.com');

    if (isMeli) {
      u.searchParams.set('matt_tool', meliTool);
      u.searchParams.set('matt_word', meliWord);
      u.searchParams.set('tracking_id', meliTool);
      u.searchParams.set('forceInApp', 'true');
      return res.redirect(302, u.toString());
    }
    if (isShopee && shopeeTag) {
      u.searchParams.set('af_siteid', shopeeTag);
      u.searchParams.set('af_sub_siteid', 'labkids');
      return res.redirect(302, u.toString());
    }
    return res.redirect(302, targetUrl);
  } catch (e) {
    return res.redirect(302, targetUrl);
  }
});

app.get('/pesquisa', (req, res) => {
  res.render('pesquisa');
});

// APIs para o painel web de preços
const PESQUISA_DIR = path.join(__dirname, 'pesquisa_bot');
const CONFIG_FILE_PATH = path.join(PESQUISA_DIR, 'config.json');
const HISTORICO_FILE_PATH = path.join(PESQUISA_DIR, 'historico_precos.csv');

const AFFILIATE_FILE_PATH = path.join(PESQUISA_DIR, 'affiliate_config.json');

app.get('/api/pesquisa/afiliados', (req, res) => {
  try {
    if (fs.existsSync(AFFILIATE_FILE_PATH)) {
      return res.json(JSON.parse(fs.readFileSync(AFFILIATE_FILE_PATH, 'utf-8')));
    }
    res.json({ meli_tool: '34127116', meli_word: 'fabiovmarques', meli_tag: '34127116', shopee_tag: '' });
  } catch (e) {
    res.json({ meli_tool: '34127116', meli_word: 'fabiovmarques', meli_tag: '34127116', shopee_tag: '' });
  }
});

app.post('/api/pesquisa/afiliados', (req, res) => {
  try {
    const { meli_tag, shopee_tag } = req.body;
    const data = { meli_tag: (meli_tag || '').trim(), shopee_tag: (shopee_tag || '').trim() };
    if (!fs.existsSync(PESQUISA_DIR)) fs.mkdirSync(PESQUISA_DIR, { recursive: true });
    fs.writeFileSync(AFFILIATE_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ success: true, ...data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/pesquisa/admin/verificar-pin', (req, res) => {
  const { pin } = req.body;
  const adminPin = process.env.ADMIN_PIN || 'labkids2026';
  if (pin && pin.trim() === adminPin.trim()) {
    return res.json({ success: true, role: 'admin' });
  }
  return res.status(401).json({ success: false, error: 'PIN incorreto' });
});

app.get('/api/pesquisa/config', (req, res) => {
  try {
    const publicPath = path.join(__dirname, 'public', 'pesquisa', 'config.json');
    const target = fs.existsSync(CONFIG_FILE_PATH) ? CONFIG_FILE_PATH : publicPath;
    if (fs.existsSync(target)) {
      return res.json(JSON.parse(fs.readFileSync(target, 'utf-8')));
    }
    res.json({ produtos: [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.post('/api/pesquisa/excluir-alerta', (req, res) => {
  try {
    const { id, nome_produto } = req.body;
    const publicPath = path.join(__dirname, 'public', 'pesquisa', 'config.json');
    const target = fs.existsSync(CONFIG_FILE_PATH) ? CONFIG_FILE_PATH : publicPath;
    
    if (fs.existsSync(target)) {
      let cfg = JSON.parse(fs.readFileSync(target, 'utf-8'));
      const initialCount = (cfg.produtos || []).length;
      cfg.produtos = (cfg.produtos || []).filter(p => {
        if (id && p.id && String(p.id).trim() === String(id).trim()) return false;
        if (nome_produto && p.nome_produto && p.nome_produto.trim().toLowerCase() === nome_produto.trim().toLowerCase()) return false;
        return true;
      });

      if (fs.existsSync(CONFIG_FILE_PATH)) fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(cfg, null, 2), 'utf-8');
      if (fs.existsSync(publicPath)) fs.writeFileSync(publicPath, JSON.stringify(cfg, null, 2), 'utf-8');
      return res.json({ success: true, removed: initialCount - cfg.produtos.length, count: cfg.produtos.length });
    }
    res.json({ success: true, count: 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.post('/api/pesquisa/config', (req, res) => {
  try {
    const dataStr = JSON.stringify(req.body, null, 2);
    if (!fs.existsSync(PESQUISA_DIR)) fs.mkdirSync(PESQUISA_DIR, { recursive: true });
    fs.writeFileSync(CONFIG_FILE_PATH, dataStr, 'utf-8');

    const publicConfig = path.join(__dirname, 'public', 'pesquisa', 'config.json');
    fs.writeFileSync(publicConfig, dataStr, 'utf-8');

    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/pesquisa/obter-preco', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL obrigatória' });

    const isMeli = url.includes('mercadolivre.com') || url.includes('mercadolibre.com');
    const isShopee = url.includes('shopee.com');
    const headers = { 
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      'Accept-Language': 'pt-BR,pt;q=0.9'
    };

    const resp = await fetch(url, { headers });
    if (!resp.ok) return res.json({ sucesso: false });
    const text = await resp.text();

    let titulo = '';
    let preco = null;
    let imagem = '';
    let linkOferta = url;

    if (isMeli) {
      // 1. CAPA REAL: data-zoom (alta definição 2X da foto de capa do anúncio)
      const mZoom = text.match(/data-zoom=["']([^"']+)["']/i);
      if (mZoom && !mZoom[1].includes('frontend-assets')) {
        imagem = mZoom[1];
      }

      // 2. CAPA REAL: ui-pdp-image (foto de capa principal)
      if (!imagem) {
        const mPdp = text.match(/class=["'][^"']*ui-pdp-image[^"']*["'][^>]*src=["']([^"']+)["']/i) ||
                     text.match(/src=["']([^"']+)["'][^>]*class=["'][^"']*ui-pdp-image/i);
        if (mPdp && !mPdp[1].includes('frontend-assets')) {
          imagem = mPdp[1];
        }
      }

      // 3. CAPA REAL: JSON-LD (funciona tanto para anúncio individual quanto lista de pesquisa)
      if (!imagem) {
        const jsonLdMatches = text.match(/<script[^>]*type=['"]application\/ld\+json['"][^>]*>(.*?)<\/script>/gis);
        if (jsonLdMatches) {
          for (const block of jsonLdMatches) {
            try {
              const rawJson = block.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '');
              const parsed = JSON.parse(rawJson);
              const items = Array.isArray(parsed) ? parsed : (parsed['@graph'] || [parsed]);
              for (const it of items) {
                if (it['@type'] === 'Product') {
                  if (!titulo) titulo = (it.name || '').trim();
                  if (it.image) {
                    const imgVal = Array.isArray(it.image) ? it.image[0] : it.image;
                    if (imgVal && typeof imgVal === 'string' && !imgVal.includes('frontend-assets')) {
                      imagem = imgVal;
                    }
                  }
                  if (it.offers) {
                    const pVal = parseFloat(it.offers.price);
                    if (preco === null || pVal < preco) {
                      preco = pVal;
                      if (it.offers.url) linkOferta = it.offers.url;
                    }
                  }
                }
              }
            } catch (e) {}
            if (imagem) break;
          }
        }
      }

      // 4. CAPA REAL: poly-component__picture / ui-search-result (para buscas filtradas)
      if (!imagem) {
        const mPoly = text.match(/class=["'][^"']*(?:poly-component__picture|ui-search-result-image__element)[^"']*["'][^>]*src=["']([^"']+)["']/i) ||
                      text.match(/src=["']([^"']+)["'][^>]*class=["'][^"']*(?:poly-component__picture|ui-search-result-image__element)/i) ||
                      text.match(/data-src=["']([^"']+)["'][^>]*class=["'][^"']*(?:poly-component__picture|ui-search-result-image__element)/i);
        if (mPoly && !mPoly[1].includes('frontend-assets')) {
          imagem = mPoly[1];
        }
      }

      // 5. og:image (ignorando logos genéricos do Mercado Livre)
      if (!imagem) {
        const mImg = text.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                     text.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);
        if (mImg && !mImg[1].includes('logo_homecom') && !mImg[1].includes('frontend-assets')) {
          imagem = mImg[1];
        }
      }

      // 6. Título do Anúncio (og:title / h1)
      if (!titulo) {
        const mTit = text.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
        if (mTit) titulo = mTit[1].split('|')[0].replace(/- R\$\s*\d+.*$/, '').trim();
      }
      if (!titulo) {
        const mH1 = text.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (mH1) titulo = mH1[1].trim();
      }

      // 7. Preço (andes-money-amount)
      if (preco === null) {
        const mFrac = text.match(/class="[^"]*andes-money-amount__fraction[^"]*"[^>]*>([^<]+)<\/span>/);
        const mCents = text.match(/class="[^"]*andes-money-amount__cents[^"]*"[^>]*>([^<]+)<\/span>/);
        if (mFrac) {
          const intP = mFrac[1].replace(/\./g, '').trim();
          const centP = mCents ? mCents[1].trim() : '00';
          preco = parseFloat(`${intP}.${centP}`);
        }
      }
    }

    if (isShopee) {
      const mPrice = text.match(/R\$\s*([\d\.]+),(\d{2})/);
      if (mPrice) preco = parseFloat(mPrice[1].replace(/\./g, '') + '.' + mPrice[2]);
      const mTit = text.match(/<meta property=["']og:title["'] content=["']([^"']+)["']/i);
      if (mTit) titulo = mTit[1].trim();
      const mImg = text.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);
      if (mImg) imagem = mImg[1];
    }

    // Se nenhuma imagem foi encontrada, usa thumbnail SVG elegante
    if (!imagem) {
      imagem = 'https://http2.mlstatic.com/D_NQ_NP_651784-MLA109546785501_032026-F.jpg';
    }

        // 8. DETECÇÃO DE DISPONIBILIDADE E VARIAÇÕES
    let indisponivel = false;
    let motivoIndisponivel = '';
    if (text) {
      if (/indispon[íi]vel/i.test(text) || /escolha outra varia[çc][ãa]o/i.test(text)) {
        indisponivel = true;
        motivoIndisponivel = 'Este produto está indisponível. Por favor, escolha outra variação.';
      } else if (/an[úu]ncio pausado/i.test(text) || /pausado/i.test(text)) {
        indisponivel = true;
        motivoIndisponivel = 'Anúncio pausado no Mercado Livre.';
      } else if (/sem estoque/i.test(text) || /esgotado/i.test(text)) {
        indisponivel = true;
        motivoIndisponivel = 'Produto sem estoque / esgotado no momento.';
      }
    }

    return res.json({ sucesso: true, titulo, preco, imagem, url: linkOferta, indisponivel, motivoIndisponivel });
  } catch (err) {
    res.status(500).json({ sucesso: false, error: err.message });
  }
});

app.post('/api/pesquisa/verificar', async (req, res) => {
  try {
    // 1. Se estiver em ambiente Node local com Python disponível, executa diretamente
    const pythonScript = path.join(PESQUISA_DIR, 'monitor.py');
    if (fs.existsSync(pythonScript) && !process.env.VERCEL) {
      const { spawn } = require('child_process');
      const pyProc = spawn('python', [pythonScript, '--force'], {
        cwd: PESQUISA_DIR,
        detached: true,
        stdio: 'ignore'
      });
      pyProc.unref();
      return res.json({ sucesso: true, mensagem: 'Monitoramento disparado localmente com sucesso!' });
    }

    // 2. Se estiver na nuvem (Vercel) e houver GITHUB_TOKEN em variáveis de ambiente
    const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
    const ghRepo = process.env.GITHUB_REPO || 'fabiovieitas/portal-atividades';
    if (ghToken) {
      const response = await fetch(`https://api.github.com/repos/${ghRepo}/actions/workflows/agendador_precos.yml/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${ghToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'LabKids-Precos'
        },
        body: JSON.stringify({ ref: 'main', inputs: { forcar_execucao: true } })
      });
      if (response.ok || response.status === 204) {
        return res.json({ sucesso: true, mensagem: 'Robô disparado no GitHub Actions com sucesso!' });
      }
    }

    // 3. Fallback para disparo via token fornecido pelo cliente no navegador
    res.json({ sucesso: false, requer_token_cliente: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, error: err.message });
  }
});

app.get('/api/pesquisa/historico', (req, res) => {
  try {
    const publicPath = path.join(__dirname, 'public', 'pesquisa', 'historico_precos.csv');
    const target = fs.existsSync(HISTORICO_FILE_PATH) ? HISTORICO_FILE_PATH : publicPath;
    if (fs.existsSync(target)) {
      res.setHeader('Content-Type', 'text/csv');
      return res.send(fs.readFileSync(target, 'utf-8'));
    }
    res.send('');
  } catch (e) {
    res.status(500).send('');
  }
});
// ============================================================================



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

// Global template locals
app.use((req, res, next) => {
  res.locals.adsensePubId = process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531';
  next();
});


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
    const categoriesData = await dbHelper.queryAll("SELECT DISTINCT category FROM activities WHERE category IS NOT NULL AND category != ''");
    const subjectsData = await dbHelper.queryAll("SELECT DISTINCT subject FROM activities WHERE subject IS NOT NULL AND subject != '' AND subject != 'Geral'");
    
    cachedCategories = [...new Set((categoriesData || []).map(c => c.category))];
    cachedSubjects = [...new Set((subjectsData || []).map(s => s.subject))].filter(Boolean);
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

// DiceBear Avatar Native Engine (Dynamic ESM import for Node/Vercel compatibility)
let createAvatar = null;
let collection = null;
let dicebearStyleMap = {};

async function loadDicebear() {
  if (!createAvatar) {
    try {
      const core = await import('@dicebear/core');
      collection = await import('@dicebear/collection');
      createAvatar = core.createAvatar;
      dicebearStyleMap = {
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
    } catch (e) {
      console.warn('[DiceBear Engine] Failed to load ESM Dicebear:', e.message);
    }
  }
}
loadDicebear().catch(() => {});

const handleAvatarRequest = async (req, res) => {
  try {
    if (!createAvatar) await loadDicebear();
    if (!createAvatar || !collection) {
      res.setHeader('Content-Type', 'image/svg+xml');
      return res.send('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#3b82f6"/><text x="50" y="55" font-size="28" text-anchor="middle" fill="#ffffff" dy=".3em">🤖</text></svg>');
    }

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
  const { search, category, bncc, subject } = req.query;
  const level = '1-5';
  let activities = [];

  if (search || (category && category !== 'Todas') || bncc || (subject && subject !== 'Todas')) {
    activities = await dbHelper.getActivities({ level: '1-5', search, category, bncc, subject });
  } else {
    // Carrega diretamente as atividades de 1º ao 5º Ano
    activities = await dbHelper.getActivities({ level: '1-5' });
  }

  const teacher = await getTeacher(req);
  if (teacher && activities.length > 0) {
    try {
      const favorites = await dbHelper.queryAll("SELECT activity_id FROM teacher_favorites WHERE teacher_id = ?", [teacher.id]);
      const favIds = (favorites || []).map(f => f.activity_id);
      activities = activities.map(a => ({ ...a, is_favorite: favIds.includes(a.id) }));
    } catch (e) {}
  }

  const comments = await dbHelper.getApprovedComments(15);
  const { categories, subjects } = await dbHelper.getCategoriesAndSubjects();
  const projects = await dbHelper.getProjects(12);
  const showcaseActivities = await dbHelper.getActivities({});
  const simuladosSetting = await dbHelper.getSetting('simulados_enabled', 'false');
  const simuladosEnabled = simuladosSetting === 'true' || simuladosSetting === true;
  const allNews = await dbHelper.getNews();
  const featuredNews = (allNews || []).slice(0, 6);

  res.render('index', { 
    activities, showcaseActivities, selectedLevel: level, comments: comments || [], categories: categories || [], subjects: subjects || [], search, 
    selectedCategory: category, selectedSubject: subject, bncc, projects: projects || [], teacher, simuladosEnabled, news: featuredNews
  });
});

app.get('/simulados', async (req, res) => {
  const setting = await dbHelper.getSetting('simulados_enabled', 'false');
  if (setting === 'true' || setting === true || (await isAdmin(req))) {
    return res.redirect('/?level=1-5#simulados');
  }
  res.redirect('/');
});

// Gerador de Certificado Escolar (Item 11)
app.get('/professor/certificado', (req, res) => {
  res.render('certificate_generator');
});
app.get('/certificado', (req, res) => {
  res.redirect(301, '/professor/certificado');
});

// Folha de Registro Pedagógico A4 para Impressão (Item 7)
app.get('/folha-registro', async (req, res) => {
  const { title, bncc, level, subject } = req.query;
  res.render('printable_worksheet', {
    activityTitle: title || 'Atividade Educativa Digital',
    bnccCode: bncc || 'Competência Geral 5 BNCC',
    activityLevel: level || '1 ao 5',
    activitySubject: subject || 'Raciocínio Lógico & Cultura Digital'
  });
});

app.get(['/folha-registro/:id', '/atividade/:id/folha', '/atividades/:id/folha'], async (req, res) => {
  const param = req.params.id;
  const activities = await dbHelper.getActivities({});
  let act = null;
  if (!isNaN(param)) {
    act = (activities || []).find(a => String(a.id) === String(param));
  }
  if (!act) {
    act = (activities || []).find(a => a.activity_url && (a.activity_url.includes(param) || a.activity_url.endsWith(param)));
  }
  res.render('printable_worksheet', {
    activityTitle: act ? act.title : param.replace(/-/g, ' ').toUpperCase(),
    bnccCode: act ? (act.bncc_code || 'Competência Geral 5 BNCC') : 'Competência Geral 5 BNCC',
    activityLevel: act ? (act.level || '1 ao 5') : '1 ao 5',
    activitySubject: act ? (act.subject || 'Raciocínio Lógico & Cultura Digital') : 'Raciocínio Lógico & Cultura Digital'
  });
});

// Guia BNCC Indexável para SEO no Google (Item 4)
app.get(['/bncc', '/guia-bncc'], async (req, res) => {
  const activities = await dbHelper.getActivities({});
  res.render('bncc_guide', { 
    bnccCode: null, 
    activities: activities || [],
    adsensePubId: process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531'
  });
});

app.get(['/bncc/:code', '/guia-bncc/:code'], async (req, res) => {
  const code = (req.params.code || '').trim().toUpperCase();
  const all = await dbHelper.getActivities({});
  const filtered = (all || []).filter(a => a.bncc_code && a.bncc_code.toUpperCase().includes(code));
  res.render('bncc_guide', { 
    bnccCode: code, 
    activities: filtered,
    adsensePubId: process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531'
  });
});

// API de Sugestões de Busca Inteligente (Item 19)
app.get('/api/search-suggest', async (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q || q.length < 2) return res.json({ games: [], articles: [], bncc: [] });

  try {
    const activities = await dbHelper.getActivities({});
    const news = await dbHelper.getNews();

    const normText = (str) => (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const nq = normText(q);

    const games = (activities || [])
      .filter(a => {
        const titleNorm = normText(a.title);
        const subNorm = normText(a.subject);
        const descNorm = normText(a.description);
        const catNorm = normText(a.category);
        return titleNorm.includes(nq) || subNorm.includes(nq) || descNorm.includes(nq) || catNorm.includes(nq);
      })
      .slice(0, 5)
      .map(a => ({
        title: a.title,
        url: a.activity_url || `/atividade/${a.id}`,
        badge: a.subject || 'Jogo',
        icon: a.icon_url || '🎮'
      }));

    const articles = (news || [])
      .filter(n => {
        const titleNorm = normText(n.title);
        const sumNorm = normText(n.summary);
        return titleNorm.includes(nq) || sumNorm.includes(nq);
      })
      .slice(0, 4)
      .map(n => ({
        title: n.title,
        url: `/noticia/${n.id}`,
        badge: 'Plano de Aula / Blog'
      }));

    // Detect if search looks like a BNCC code or keyword
    const bnccSet = new Set();
    (activities || []).forEach(a => {
      if (a.bncc_code) {
        a.bncc_code.split(',').forEach(c => {
          const clean = c.trim().toUpperCase();
          if (clean && (clean.toLowerCase().includes(q) || normText(clean).includes(nq))) {
            bnccSet.add(clean);
          }
        });
      }
    });

    const bncc = Array.from(bnccSet).slice(0, 4).map(code => ({
      code,
      url: `/bncc/${code}`,
      badge: 'Habilidade BNCC'
    }));

    res.json({ games, articles, bncc });
  } catch (err) {
    res.json({ games: [], articles: [], bncc: [] });
  }
});

// Presentation routes for new top-demand games
app.get('/atividades/habitos-de-higiene', (req, res) => res.render('habitos_higiene_presentation'));
app.get('/atividades/level-up', (req, res) => res.render('levelup_presentation'));
app.get('/atividades/segue-o-ritmo', (req, res) => res.render('segue_o_ritmo_presentation', { adsensePubId: process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531' }));
app.get(['/ritmo', '/percussao-corporal'], (req, res) => res.redirect(301, '/atividades/segue-o-ritmo'));

// SEO Routes: dynamic sitemap.xml canônico e limpo
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://labkids.online';
    const news = await dbHelper.getNews();
    const activities = await dbHelper.getActivities({});

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    const mainPages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/noticias', priority: '0.9', changefreq: 'daily' },
      { path: '/guia-bncc', priority: '0.9', changefreq: 'weekly' },
      { path: '/sobre', priority: '0.8', changefreq: 'monthly' },
      { path: '/termos', priority: '0.7', changefreq: 'monthly' },
      { path: '/privacidade', priority: '0.7', changefreq: 'monthly' },
      { path: '/cookies', priority: '0.7', changefreq: 'monthly' },
      { path: '/contato', priority: '0.7', changefreq: 'monthly' }
    ];

    mainPages.forEach(p => {
      xml += `  <url><loc>${baseUrl}${p.path}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>\n`;
    });

    const seenUrls = new Set();
    (activities || []).forEach(act => {
      if (act.activity_url && act.activity_url.startsWith('/atividades/')) {
        if (!seenUrls.has(act.activity_url)) {
          seenUrls.add(act.activity_url);
          xml += `  <url><loc>${baseUrl}${act.activity_url}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
        }
      }
    });

    (news || []).forEach(art => {
      xml += `  <url><loc>${baseUrl}/noticia/${art.id}</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>\n`;
    });

    xml += `</urlset>`;

    try {
      fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), xml, 'utf-8');
    } catch(e) {}

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

app.get('/atividades/labirinto-tabuada', async (req, res) => {
  res.render('labirinto_tabuada_presentation');
});

app.get('/atividades/escape-room-lab', async (req, res) => {
  res.render('escape_room_presentation');
});

app.get('/atividades/carta-enigmatica', async (req, res) => {
  res.render('carta_enigmatica_presentation');
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

app.get('/atividades/habitos-de-higiene', async (req, res) => {
  res.render('habitos_higiene_presentation');
});

app.get('/atividades/detetive-ortografia', async (req, res) => {
  res.render('detetive_ortografia_presentation');
});

app.get('/atividades/fabrica-silabas', (req, res) => res.redirect(301, '/atividades/fabrica-de-silabas'));
app.get('/atividades/fabrica-de-silabas', async (req, res) => {
  res.render('fabrica_silabas_presentation');
});

app.get('/atividades/tabuada-lava', (req, res) => res.redirect(301, '/atividades/tabuada-chao-e-lava'));
app.get('/atividades/capitao-alberto', (req, res) => res.redirect(301, '/atividades/capitao-alberto-farao'));
app.get('/atividades/caca-palavras', (req, res) => res.redirect(301, '/atividades/caca-palavras-temas'));
app.get('/atividades/arie2', (req, res) => res.redirect(301, '/atividades/brincando-com-arie-2'));
app.get('/atividades/arie3', (req, res) => res.redirect(301, '/atividades/brincando-com-arie-3'));
app.get('/atividades/habitos-higiene', (req, res) => res.redirect(301, '/atividades/habitos-de-higiene'));
app.get('/atividades/missao-respeito', (req, res) => res.redirect(301, '/atividades/level-up'));
app.get('/atividades/material-dourado', (req, res) => res.redirect(301, '/'));
app.get('/atividades/desafio-adicao', (req, res) => res.redirect(301, '/'));

app.get('/atividades/level-up', async (req, res) => {
  res.render('levelup_presentation');
});

// Simulados Digitais Campos dos Goytacazes (1º ao 5º Ano)

// --- 1º ANO ---
app.get('/atividades/simulado-campos-1ano-setembro', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_1ano_setembro', { schools });
  } catch(e) {
    res.render('simulado_campos_1ano_setembro', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-1ano-agosto', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_1ano', { schools });
  } catch(e) {
    res.render('simulado_campos_1ano', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-1ano', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    if (req.query.mes === 'agosto' || req.query.month === 'Agosto') {
      return res.render('simulado_campos_1ano', { schools });
    }
    res.render('simulado_campos_1ano_setembro', { schools });
  } catch(e) {
    res.render('simulado_campos_1ano_setembro', { schools: [] });
  }
});

// --- 2º ANO ---
app.get('/atividades/simulado-campos-2ano-setembro', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_2ano_setembro', { schools });
  } catch(e) {
    res.render('simulado_campos_2ano_setembro', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-2ano-agosto', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_2ano', { schools });
  } catch(e) {
    res.render('simulado_campos_2ano', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-2ano', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    if (req.query.mes === 'agosto' || req.query.month === 'Agosto') {
      return res.render('simulado_campos_2ano', { schools });
    }
    res.render('simulado_campos_2ano_setembro', { schools });
  } catch(e) {
    res.render('simulado_campos_2ano_setembro', { schools: [] });
  }
});

// --- 3º ANO ---
app.get('/atividades/simulado-campos-3ano-setembro', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_3ano_setembro', { schools });
  } catch(e) {
    res.render('simulado_campos_3ano_setembro', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-3ano-agosto', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_3ano', { schools });
  } catch(e) {
    res.render('simulado_campos_3ano', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-3ano', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    if (req.query.mes === 'agosto' || req.query.month === 'Agosto') {
      return res.render('simulado_campos_3ano', { schools });
    }
    res.render('simulado_campos_3ano_setembro', { schools });
  } catch(e) {
    res.render('simulado_campos_3ano_setembro', { schools: [] });
  }
});

// --- 4º ANO ---
app.get('/atividades/simulado-campos-4ano-setembro', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_4ano_setembro', { schools });
  } catch(e) {
    res.render('simulado_campos_4ano_setembro', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-4ano-agosto', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_4ano', { schools });
  } catch(e) {
    res.render('simulado_campos_4ano', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-4ano', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    if (req.query.mes === 'agosto' || req.query.month === 'Agosto') {
      return res.render('simulado_campos_4ano', { schools });
    }
    res.render('simulado_campos_4ano_setembro', { schools });
  } catch(e) {
    res.render('simulado_campos_4ano_setembro', { schools: [] });
  }
});

// --- 5º ANO ---
app.get('/atividades/simulado-campos-5ano-setembro', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_5ano_setembro', { schools });
  } catch(e) {
    res.render('simulado_campos_5ano_setembro', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-5ano-agosto', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    res.render('simulado_campos_5ano', { schools });
  } catch(e) {
    res.render('simulado_campos_5ano', { schools: [] });
  }
});

app.get('/atividades/simulado-campos-5ano', async (req, res) => {
  try {
    const schools = await dbHelper.getSchools();
    if (req.query.mes === 'agosto' || req.query.month === 'Agosto') {
      return res.render('simulado_campos_5ano', { schools });
    }
    res.render('simulado_campos_5ano_setembro', { schools });
  } catch(e) {
    res.render('simulado_campos_5ano_setembro', { schools: [] });
  }
});

// Redirects amigáveis para Simulados
app.get('/simulado/1-ano', (req, res) => res.redirect(301, '/atividades/simulado-campos-1ano-setembro'));
app.get('/simulado/1-ano-setembro', (req, res) => res.redirect(301, '/atividades/simulado-campos-1ano-setembro'));
app.get('/simulado/1-ano-agosto', (req, res) => res.redirect(301, '/atividades/simulado-campos-1ano-agosto'));

app.get('/simulado/2-ano', (req, res) => res.redirect(301, '/atividades/simulado-campos-2ano-setembro'));
app.get('/simulado/2-ano-setembro', (req, res) => res.redirect(301, '/atividades/simulado-campos-2ano-setembro'));
app.get('/simulado/2-ano-agosto', (req, res) => res.redirect(301, '/atividades/simulado-campos-2ano-agosto'));

app.get('/simulado/3-ano', (req, res) => res.redirect(301, '/atividades/simulado-campos-3ano-setembro'));
app.get('/simulado/3-ano-setembro', (req, res) => res.redirect(301, '/atividades/simulado-campos-3ano-setembro'));
app.get('/simulado/3-ano-agosto', (req, res) => res.redirect(301, '/atividades/simulado-campos-3ano-agosto'));

app.get('/simulado/4-ano', (req, res) => res.redirect(301, '/atividades/simulado-campos-4ano-setembro'));
app.get('/simulado/4-ano-setembro', (req, res) => res.redirect(301, '/atividades/simulado-campos-4ano-setembro'));
app.get('/simulado/4-ano-agosto', (req, res) => res.redirect(301, '/atividades/simulado-campos-4ano-agosto'));

app.get('/simulado/5-ano', (req, res) => res.redirect(301, '/atividades/simulado-campos-5ano-setembro'));
app.get('/simulado/5-ano-setembro', (req, res) => res.redirect(301, '/atividades/simulado-campos-5ano-setembro'));
// Handler dinâmico universal para qualquer apresentação de atividade (evita 404 em jogos atuais e futuros)
app.get('/atividades/:slug', async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const sanitizedView = slug.replace(/-/g, '_') + '_presentation';
    const viewPath = path.join(__dirname, 'views', sanitizedView + '.ejs');
    if (fs.existsSync(viewPath)) {
      return res.render(sanitizedView, {
        adsensePubId: process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531'
      });
    }

    const activities = await dbHelper.getActivities({ adminMode: true });
    const activity = (activities || []).find(a => 
      a.activity_url && (a.activity_url.endsWith('/' + slug) || a.activity_url.includes(slug))
    );
    if (activity) {
      const isExternal = Boolean(activity.activity_url && (activity.activity_url.includes('http://') || activity.activity_url.includes('https://')));
      return res.render('activity_redirect', {
        activity,
        isExternal,
        adsensePubId: process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531'
      });
    }
    next();
  } catch (err) {
    next();
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

// Export Backup JSON (Geral ou por Turma)
app.get('/api/admin/simulado/backup/export', async (req, res) => {
  try {
    const { class_name, simulado_id } = req.query;
    let submissions = await dbHelper.getSimuladoSubmissions(simulado_id || 'ALL');
    
    if (class_name && class_name !== 'ALL') {
      const targetClassNorm = class_name.trim().toLowerCase();
      submissions = submissions.filter(s => (s.class_name || '').trim().toLowerCase() === targetClassNorm);
    }

    const dateStr = new Date().toISOString().split('T')[0];
    const safeClassSlug = class_name && class_name !== 'ALL' 
      ? '_' + class_name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[ºª]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase().replace(/^_+|_+$/g, '')
      : '';

    const backupData = {
      exported_at: new Date().toISOString(),
      system: 'Portal de Atividades - Campos dos Goytacazes',
      class_filter: class_name && class_name !== 'ALL' ? class_name : 'TODAS_AS_TURMAS',
      total_records: submissions.length,
      submissions: submissions
    };

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="simulado_backup${safeClassSlug}_${dateStr}.json"`);
    res.send(JSON.stringify(backupData, null, 2));
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Export Backup ZIP (Todas as Turmas Separadas)
app.get('/api/admin/simulado/backup/export-zip', async (req, res) => {
  try {
    const submissions = await dbHelper.getSimuladoSubmissions('ALL');
    const byClass = {};

    submissions.forEach(sub => {
      const cls = (sub.class_name || 'Sem_Turma').trim();
      if (!byClass[cls]) byClass[cls] = [];
      byClass[cls].push(sub);
    });

    const dateStr = new Date().toISOString().split('T')[0];
    const archiverModule = require('archiver');
    const ZipArchiveClass = archiverModule.ZipArchive || archiverModule;
    const archive = typeof ZipArchiveClass === 'function' && !ZipArchiveClass.prototype
      ? ZipArchiveClass('zip', { zlib: { level: 9 } })
      : new ZipArchiveClass({ zlib: { level: 9 } });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="simulado_backups_por_turma_${dateStr}.zip"`);

    archive.pipe(res);

    for (const [cls, list] of Object.entries(byClass)) {
      const safeName = cls.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[ºª]/g, '').replace(/[^a-zA-Z0-9]+/g, '_').toLowerCase().replace(/^_+|_+$/g, '');
      const fileData = {
        exported_at: new Date().toISOString(),
        system: 'Portal de Atividades - Campos dos Goytacazes',
        class_name: cls,
        total_records: list.length,
        submissions: list
      };
      archive.append(JSON.stringify(fileData, null, 2), { name: `backup_turma_${safeName}.json` });
    }

    await archive.finalize();
  } catch(err) {
    console.error('Erro ao gerar ZIP de backups:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Import Backup JSON com detecção de duplicatas
app.post('/api/admin/simulado/backup/import', async (req, res) => {
  try {
    const { backup_data } = req.body;
    let submissionsToRestore = [];
    if (typeof backup_data === 'string') {
      const parsed = JSON.parse(backup_data);
      submissionsToRestore = parsed.submissions || (Array.isArray(parsed) ? parsed : []);
    } else if (backup_data && backup_data.submissions) {
      submissionsToRestore = backup_data.submissions;
    } else if (Array.isArray(backup_data)) {
      submissionsToRestore = backup_data;
    }

    const result = await dbHelper.restoreSimuladoBackup(submissionsToRestore);
    res.json({ 
      success: true, 
      count: result.restored, 
      restored: result.restored, 
      skipped: result.skipped,
      total_incoming: submissionsToRestore.length,
      message: `Restauração concluída com sucesso! ${result.restored} novo(s) registro(s) adicionado(s). ${result.skipped} avaliação(ões) já existente(s) foram identificadas e NÃO duplicadas.` 
    });
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

// Apagar registro de aluno no simulado (Individual)
app.delete('/api/admin/simulado/submission/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await dbHelper.deleteSimuladoSubmission(id);
    res.json({ success: true, message: 'Registro do estudante apagado com sucesso!' });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Ação em Lote: Apagar múltiplos alunos
app.post('/api/admin/simulado/submissions/bulk-delete', async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'Nenhum ID fornecido para exclusão.' });
    }
    await dbHelper.bulkDeleteSimuladoSubmissions(ids);
    res.json({ success: true, message: `${ids.length} avaliações apagadas com sucesso!` });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
      const maxScore = Number(s.max_score) || (
        s.simulado_id === 'campos-1ano-setembro-2026' ? 11 :
        s.simulado_id === 'campos-2ano-setembro-2026' ? 10 :
        s.simulado_id === 'campos-3ano-setembro-2026' ? 9 :
        s.simulado_id === 'campos-4ano-setembro-2026' ? 10 :
        s.simulado_id === 'campos-5ano-setembro-2026' ? 9 :
        s.simulado_id === 'campos-1ano-agosto-2026' ? 10 : 9
      );
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
      const maxScore = Number(s.max_score) || (
        s.simulado_id === 'campos-1ano-setembro-2026' ? 11 :
        s.simulado_id === 'campos-2ano-setembro-2026' ? 10 :
        s.simulado_id === 'campos-3ano-setembro-2026' ? 9 :
        s.simulado_id === 'campos-4ano-setembro-2026' ? 10 :
        s.simulado_id === 'campos-5ano-setembro-2026' ? 9 :
        s.simulado_id === 'campos-1ano-agosto-2026' ? 10 : 9
      );
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
      if (String(activityId) === '4' || String(activityId) === '5') return res.redirect(301, '/atividades/level-up');
      if (String(activityId) === '14') return res.redirect(301, '/atividades/chapeuzinho-enigma');
      if (String(activityId) === '3') return res.redirect(301, '/');
      return res.redirect(301, '/');
    }

    try { await dbHelper.recordVisit(activityId); } catch(e){}

    const isPou = String(activity.id) === '11' || (activity.activity_url && activity.activity_url.includes('pou'));
    const isAndroid = req.headers['user-agent'] && /android/i.test(req.headers['user-agent']);

    if (isPou && isAndroid) {
      return res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abrindo Pou no Tablet...</title>
  <style>
    body { background: #0f172a; color: white; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 20px; box-sizing: border-box; }
    .box { background: rgba(30, 41, 59, 0.95); padding: 35px 25px; border-radius: 28px; border: 2px solid #10b981; max-width: 440px; width: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
    .icon { width: 90px; height: 90px; border-radius: 22px; border: 3px solid #10b981; margin-bottom: 15px; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4); }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 1.1rem; margin-top: 15px; box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5); }
    .btn-store { display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #1e293b; color: #38bdf8; border: 1.5px solid #38bdf8; padding: 10px 20px; border-radius: 50px; text-decoration: none; font-weight: 700; font-size: 0.95rem; margin-top: 12px; }
  </style>
  <script>
    function launch() {
      const intentUrl = "intent://#Intent;package=me.pou.app;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dme.pou.app;end";
      window.location.href = intentUrl;
      setTimeout(function() {
        if (!document.hidden) {
          window.location.href = "https://play.google.com/store/apps/details?id=me.pou.app";
        }
      }, 1500);
    }
    window.onload = launch;
  </script>
</head>
<body>
  <div class="box">
    <img src="/games/pou-online/assets/icon.jpeg" alt="Pou" class="icon" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3662/3662817.png'">
    <h2 style="color: #34d399; margin: 0 0 10px 0;">🐾 Abrindo Pou no Tablet...</h2>
    <p style="color: #cbd5e1; font-size: 1rem; line-height: 1.5; margin: 0 0 15px 0;">Iniciando o aplicativo no seu dispositivo Android!</p>
    <a href="intent://#Intent;package=me.pou.app;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;S.browser_fallback_url=https%3A%2F%2Fplay.google.com%2Fstore%2Fapps%2Fdetails%3Fid%3Dme.pou.app;end" class="btn">Toque para Abrir o App 🚀</a>
    <div style="margin-top: 15px;">
      <a href="https://play.google.com/store/apps/details?id=me.pou.app" class="btn-store">🛍️ Baixar na Google Play Store</a>
    </div>
    <div style="margin-top: 18px;">
      <a href="/atividades/pou-online" style="color: #94a3b8; font-size: 0.85rem; text-decoration: underline;">Ver guia pedagógico / Jogar versão web</a>
    </div>
  </div>
</body>
</html>`);
    }

    if (activity.activity_url && activity.activity_url.startsWith('/atividades/')) {
      return res.redirect(301, activity.activity_url);
    }

    const isExternal = Boolean(activity.activity_url && (activity.activity_url.includes('http://') || activity.activity_url.includes('https://')));
    const adsensePubId = process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531';

    res.render('activity_redirect', { activity, isExternal, adsensePubId });
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
      try {
        const allSessions = await dbHelper.queryAll("SELECT teacher_id, expires FROM teacher_sessions");
        const now = new Date();
        const onlineTeacherIds = new Set();
        for (let s of (allSessions || [])) {
          if (s.expires && new Date(s.expires) > now) {
            onlineTeacherIds.add(Number(s.teacher_id));
          }
        }
        for (let t of (teachers || [])) {
          t.is_online = onlineTeacherIds.has(Number(t.id));
        }
      } catch(e) {
        console.error('Error calculating online teachers:', e);
      }
      news = await dbHelper.getNews();
      try {
        pendingComments = await dbHelper.queryAll("SELECT * FROM comments WHERE approved = 0");
      } catch (e) {}

      const schools = await dbHelper.getSchools();
      const classes = await dbHelper.getAllClasses();
      const simuladosSetting = await dbHelper.getSetting('simulados_enabled', 'false');
      const simuladosEnabled = simuladosSetting === 'true' || simuladosSetting === true;

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
        sessionId: sessionId || '',
        simuladosEnabled
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
  if (req.query.reset === '1') {
    return res.render('teacher_login', { error: 'Sua senha foi redefinida com sucesso! Você já pode entrar com sua nova senha.' });
  }
  if (req.query.verified === '1') {
    return res.render('teacher_login', { error: 'Sua conta foi ativada com sucesso! Faça login para acessar o painel.' });
  }
  res.render('teacher_login', { error: null });
});

app.post('/professor/register', async (req, res) => {
  const { name, email, school, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.render('teacher_login', { error: 'Por favor, preencha todos os campos obrigatórios.' });
    }
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanSchool = String(school || '').trim();

    // Check if email already registered in Turso/SQLite
    const existing = await dbHelper.queryGet("SELECT id, status FROM teachers WHERE LOWER(email) = LOWER(?)", [cleanEmail]);
    if (existing) {
      if (existing.status === 'pending_verification') {
        // Teacher registered previously but didn't finish email confirmation: resend code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationToken = crypto.randomBytes(24).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const hash = await bcrypt.hash(password, 10);

        await dbHelper.queryRun(
          "UPDATE teachers SET name = ?, school = ?, password_hash = ?, verification_code = ?, verification_token = ?, verification_expires = ? WHERE id = ?",
          [name.trim(), cleanSchool, hash, verificationCode, verificationToken, verificationExpires, existing.id]
        );

        await mailService.sendTeacherActivationEmail({
          name: name.trim(),
          email: cleanEmail,
          code: verificationCode,
          token: verificationToken
        });

        return res.redirect(`/professor/verificar?email=${encodeURIComponent(cleanEmail)}`);
      }
      return res.render('teacher_login', { error: 'Este e-mail já está cadastrado. Por favor, faça login com sua senha.' });
    }

    // Check institutional email domain for Campos dos Goytacazes
    const isInstitutional = cleanEmail.endsWith('@edu.campos.rj.gov.br') || 
                            cleanEmail.endsWith('@campos.rj.gov.br') || 
                            cleanEmail.endsWith('@prof.campos.rj.gov.br') || 
                            cleanEmail.endsWith('@educacao.campos.rj.gov.br') ||
                            cleanEmail.endsWith('.campos.rj.gov.br');

    const hash = await bcrypt.hash(password, 10);

    if (isInstitutional) {
      // Institutional accounts from Campos Municipal network are auto-approved with immediate login
      await dbHelper.queryRun(
        "INSERT INTO teachers (name, email, school, status, password_hash) VALUES (?, ?, ?, 'approved', ?)",
        [name.trim(), cleanEmail, cleanSchool, hash]
      );
      const newTeacher = await dbHelper.queryGet("SELECT * FROM teachers WHERE LOWER(email) = LOWER(?)", [cleanEmail]);
      if (!newTeacher) throw new Error("Falha ao salvar conta institucional.");

      const sessionId = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const nowIso = new Date().toISOString();
      await dbHelper.queryRun("INSERT INTO teacher_sessions (id, teacher_id, expires) VALUES (?, ?, ?)", [sessionId, newTeacher.id, expires]);
      await dbHelper.queryRun("UPDATE teachers SET login_count = 1, last_login = ? WHERE id = ?", [nowIso, newTeacher.id]);
      await dbHelper.queryRun("INSERT INTO teacher_logins (teacher_id) VALUES (?)", [newTeacher.id]);

      res.cookie('teacher_session', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000, path: '/' });
      return res.redirect('/professor/dashboard?welcome=1');
    } else {
      // General / external email accounts: Generate 6-digit verification code & token via Resend
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const verificationToken = crypto.randomBytes(24).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      await dbHelper.queryRun(
        "INSERT INTO teachers (name, email, school, status, password_hash, verification_code, verification_token, verification_expires) VALUES (?, ?, ?, 'pending_verification', ?, ?, ?, ?)",
        [name.trim(), cleanEmail, cleanSchool, hash, verificationCode, verificationToken, verificationExpires]
      );

      // Verify immediate persistence
      const newTeacher = await dbHelper.queryGet("SELECT * FROM teachers WHERE LOWER(email) = LOWER(?)", [cleanEmail]);
      if (!newTeacher) throw new Error("Não foi possível confirmar o salvamento da conta no banco de dados.");

      // Dispatch activation email via Resend
      await mailService.sendTeacherActivationEmail({
        name: name.trim(),
        email: cleanEmail,
        code: verificationCode,
        token: verificationToken
      });

      return res.redirect(`/professor/verificar?email=${encodeURIComponent(cleanEmail)}`);
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.render('teacher_login', { error: `Erro ao cadastrar: ${err.message || err}` });
  }
});

// A4 QR Code mini cards printable sheet
app.get('/imprimir-qrcodes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'imprimir_qrcodes_a4.html'));
});

// Teacher Email Verification Pages & Actions
app.get('/professor/verificar', async (req, res) => {
  const email = String(req.query.email || '').trim();
  if (!email) return res.redirect('/professor/login');
  res.render('teacher_verify', { email, error: null, success: null });
});

app.post('/professor/verificar', async (req, res) => {
  const { email, code } = req.body;
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanCode = String(code || '').trim();

  try {
    const teacher = await dbHelper.queryGet("SELECT * FROM teachers WHERE LOWER(email) = LOWER(?)", [cleanEmail]);
    if (!teacher) {
      return res.render('teacher_verify', { email: cleanEmail, error: 'Cadastro não encontrado. Por favor, crie sua conta novamente.', success: null });
    }

    if (teacher.status === 'approved') {
      return res.redirect('/professor/login?verified=1');
    }

    if (!teacher.verification_code || teacher.verification_code !== cleanCode) {
      return res.render('teacher_verify', { email: cleanEmail, error: 'Código incorreto. Por favor, confira os 6 dígitos enviados no seu e-mail.', success: null });
    }

    if (teacher.verification_expires && new Date() > new Date(teacher.verification_expires)) {
      return res.render('teacher_verify', { email: cleanEmail, error: 'Este código expirou. Clique em "Reenviar Código" abaixo para receber um novo.', success: null });
    }

    // Activate teacher account
    const nowIso = new Date().toISOString();
    await dbHelper.queryRun("UPDATE teachers SET status = 'approved', verification_code = NULL, verification_token = NULL, login_count = 1, last_login = ? WHERE id = ?", [nowIso, teacher.id]);

    // Create session & log in
    const sessionId = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await dbHelper.queryRun("INSERT INTO teacher_sessions (id, teacher_id, expires) VALUES (?, ?, ?)", [sessionId, teacher.id, expires]);
    await dbHelper.queryRun("INSERT INTO teacher_logins (teacher_id) VALUES (?)", [teacher.id]);

    res.cookie('teacher_session', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000, path: '/' });
    res.redirect('/professor/dashboard?welcome=1');
  } catch (err) {
    console.error('Verification error:', err);
    res.render('teacher_verify', { email: cleanEmail, error: `Erro ao verificar código: ${err.message || err}`, success: null });
  }
});

app.post('/professor/reenviar-codigo', async (req, res) => {
  const cleanEmail = String(req.body.email || '').trim().toLowerCase();
  try {
    const teacher = await dbHelper.queryGet("SELECT * FROM teachers WHERE LOWER(email) = LOWER(?)", [cleanEmail]);
    if (!teacher) {
      return res.redirect('/professor/login?cadastro=1');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationToken = crypto.randomBytes(24).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await dbHelper.queryRun(
      "UPDATE teachers SET verification_code = ?, verification_token = ?, verification_expires = ? WHERE id = ?",
      [verificationCode, verificationToken, verificationExpires, teacher.id]
    );

    await mailService.sendTeacherActivationEmail({
      name: teacher.name,
      email: cleanEmail,
      code: verificationCode,
      token: verificationToken
    });

    res.render('teacher_verify', { email: cleanEmail, error: null, success: 'Novo código enviado com sucesso! Verifique sua caixa de entrada e a pasta de Spam.' });
  } catch (err) {
    console.error('Resend code error:', err);
    res.render('teacher_verify', { email: cleanEmail, error: `Erro ao reenviar código: ${err.message || err}`, success: null });
  }
});

app.get('/professor/ativar', async (req, res) => {
  const { token, email } = req.query;
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanToken = String(token || '').trim();

  try {
    if (!cleanEmail || !cleanToken) {
      return res.redirect('/professor/login');
    }

    const teacher = await dbHelper.queryGet("SELECT * FROM teachers WHERE LOWER(email) = LOWER(?) AND verification_token = ?", [cleanEmail, cleanToken]);
    if (!teacher) {
      return res.render('teacher_login', { error: 'Link de ativação inválido ou já utilizado. Por favor, faça login com sua senha.' });
    }

    if (teacher.verification_expires && new Date() > new Date(teacher.verification_expires)) {
      return res.render('teacher_login', { error: 'Este link de ativação expirou. Solicite um novo código na tela de verificação.' });
    }

    // Activate teacher account
    const nowIso = new Date().toISOString();
    await dbHelper.queryRun("UPDATE teachers SET status = 'approved', verification_code = NULL, verification_token = NULL, login_count = 1, last_login = ? WHERE id = ?", [nowIso, teacher.id]);

    const sessionId = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await dbHelper.queryRun("INSERT INTO teacher_sessions (id, teacher_id, expires) VALUES (?, ?, ?)", [sessionId, teacher.id, expires]);
    await dbHelper.queryRun("INSERT INTO teacher_logins (teacher_id) VALUES (?)", [teacher.id]);

    res.cookie('teacher_session', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000, path: '/' });
    res.redirect('/professor/dashboard?welcome=1');
  } catch (err) {
    console.error('Activation link error:', err);
    res.render('teacher_login', { error: `Erro ao ativar conta: ${err.message || err}` });
  }
});

// Teacher Password Recovery (Forgot Password)
app.get(['/professor/esqueci-senha', '/professor/recuperar-senha'], async (req, res) => {
  if (await getTeacher(req)) return res.redirect('/professor/dashboard');
  res.render('teacher_forgot_password', { error: null, success: null });
});

app.post(['/professor/esqueci-senha', '/professor/recuperar-senha'], async (req, res) => {
  const { email } = req.body;
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!cleanEmail) {
    return res.render('teacher_forgot_password', { error: 'Por favor, informe seu e-mail cadastrado.', success: null });
  }

  try {
    const teacher = await dbHelper.queryGet("SELECT id, name, email FROM teachers WHERE LOWER(email) = LOWER(?)", [cleanEmail]);

    if (teacher) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      await dbHelper.queryRun(
        "UPDATE teachers SET reset_token = ?, reset_expires = ? WHERE id = ?",
        [resetToken, resetExpires, teacher.id]
      );

      await mailService.sendTeacherPasswordResetEmail({
        name: teacher.name,
        email: cleanEmail,
        token: resetToken
      });
    }

    // Standard message to avoid email enumeration
    res.render('teacher_forgot_password', {
      error: null,
      success: 'Se o e-mail informado estiver cadastrado em nossa rede de educadores, você receberá um link de redefinição em instantes. Verifique também sua caixa de Spam.'
    });
  } catch (err) {
    console.error('Password reset request error:', err);
    res.render('teacher_forgot_password', {
      error: `Erro ao processar solicitação: ${err.message || err}`,
      success: null
    });
  }
});

// Teacher Password Reset (New Password Page)
app.get('/professor/redefinir-senha', async (req, res) => {
  const { token, email } = req.query;
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanToken = String(token || '').trim();

  if (!cleanEmail || !cleanToken) {
    return res.redirect('/professor/esqueci-senha');
  }

  try {
    const teacher = await dbHelper.queryGet(
      "SELECT id, name, email, reset_token, reset_expires FROM teachers WHERE LOWER(email) = LOWER(?) AND reset_token = ?",
      [cleanEmail, cleanToken]
    );

    if (!teacher) {
      return res.render('teacher_forgot_password', {
        error: 'Este link de redefinição é inválido ou já foi utilizado. Solicite um novo link abaixo.',
        success: null
      });
    }

    if (teacher.reset_expires && new Date() > new Date(teacher.reset_expires)) {
      return res.render('teacher_forgot_password', {
        error: 'Este link de redefinição expirou (validade de 1 hora). Solicite um novo link abaixo.',
        success: null
      });
    }

    res.render('teacher_reset_password', {
      email: cleanEmail,
      token: cleanToken,
      error: null
    });
  } catch (err) {
    console.error('Password reset view error:', err);
    res.redirect('/professor/login');
  }
});

app.post('/professor/redefinir-senha', async (req, res) => {
  const { token, email, password, confirm_password } = req.body;
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanToken = String(token || '').trim();

  if (!password || password.length < 6) {
    return res.render('teacher_reset_password', {
      email: cleanEmail,
      token: cleanToken,
      error: 'A nova senha deve ter no mínimo 6 caracteres.'
    });
  }

  if (password !== confirm_password) {
    return res.render('teacher_reset_password', {
      email: cleanEmail,
      token: cleanToken,
      error: 'As duas senhas não coincidem. Digite senhas iguais.'
    });
  }

  try {
    const teacher = await dbHelper.queryGet(
      "SELECT id, name, email, reset_token, reset_expires FROM teachers WHERE LOWER(email) = LOWER(?) AND reset_token = ?",
      [cleanEmail, cleanToken]
    );

    if (!teacher) {
      return res.render('teacher_forgot_password', {
        error: 'Este link de redefinição expirou ou já foi utilizado. Solicite um novo link abaixo.',
        success: null
      });
    }

    if (teacher.reset_expires && new Date() > new Date(teacher.reset_expires)) {
      return res.render('teacher_forgot_password', {
        error: 'Este link de redefinição expirou. Solicite um novo link abaixo.',
        success: null
      });
    }

    const hash = await bcrypt.hash(password, 10);
    await dbHelper.queryRun(
      "UPDATE teachers SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
      [hash, teacher.id]
    );

    console.log(`✅ [Password Reset] Senha do professor ${cleanEmail} redefinida com sucesso!`);
    res.redirect('/professor/login?reset=1');
  } catch (err) {
    console.error('Password reset update error:', err);
    res.render('teacher_reset_password', {
      email: cleanEmail,
      token: cleanToken,
      error: `Erro ao redefinir senha: ${err.message || err}`
    });
  }
});

app.post('/professor/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const teacher = await dbHelper.queryGet("SELECT * FROM teachers WHERE LOWER(email) = LOWER(?)", [cleanEmail]);

    if (teacher && await bcrypt.compare(password, teacher.password_hash)) {
      // Pending email verification
      if (teacher.status === 'pending_verification') {
        return res.redirect(`/professor/verificar?email=${encodeURIComponent(cleanEmail)}`);
      }
      if (teacher.status === 'pending') {
        return res.render('teacher_login', { 
          error: 'Sua conta de professor está aguardando aprovação da Coordenação Pedagógica (Prof. Fábio) para conformidade com a LGPD. Em breve seu acesso estará liberado!' 
        });
      }
      if (teacher.status === 'rejected') {
        return res.render('teacher_login', { 
          error: 'Seu cadastro de professor não foi aprovado pela equipe pedagógica. Entre em contato com a coordenação.' 
        });
      }

      const sessionId = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const nowIso = new Date().toISOString();

      await dbHelper.queryRun("INSERT INTO teacher_sessions (id, teacher_id, expires) VALUES (?, ?, ?)", [sessionId, teacher.id, expires]);
      await dbHelper.queryRun("UPDATE teachers SET login_count = COALESCE(login_count, 0) + 1, last_login = ? WHERE id = ?", [nowIso, teacher.id]);
      await dbHelper.queryRun("INSERT INTO teacher_logins (teacher_id) VALUES (?)", [teacher.id]);

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
    try {
      await dbHelper.queryRun("DELETE FROM teacher_sessions WHERE id = ?", [sessionId]);
    } catch(e){}
  }
  res.clearCookie('teacher_session');
  res.redirect('/professor/login');
});

// Teacher Dashboard
app.get('/professor/dashboard', requireTeacher, async (req, res) => {
  try {
    const activities = await dbHelper.queryAll("SELECT * FROM activities ORDER BY created_at DESC");
    const favoritesData = await dbHelper.queryAll("SELECT activity_id FROM teacher_favorites WHERE teacher_id = ?", [req.teacher.id]);
    const favorites = (favoritesData || []).map(f => f.activity_id);
    
    const exams = await dbHelper.queryAll("SELECT * FROM exams WHERE teacher_id = ? ORDER BY created_at DESC", [req.teacher.id]);
    const classes = await dbHelper.queryAll("SELECT * FROM teacher_classes WHERE teacher_id = ? ORDER BY created_at DESC", [req.teacher.id]);
    const globalExams = await dbHelper.queryAll("SELECT * FROM global_exams ORDER BY created_at DESC");
    
    const examIds = (exams || []).map(e => e.id);
    let examSubmissions = [];
    if (examIds.length > 0) {
      const placeholders = examIds.map(() => '?').join(',');
      examSubmissions = await dbHelper.queryAll(
        `SELECT es.*, e.title, e.access_code, e.num_questions 
         FROM exam_submissions es 
         JOIN exams e ON es.exam_id = e.id 
         WHERE es.exam_id IN (${placeholders}) 
         ORDER BY es.created_at DESC`,
        examIds
      );
    }

    const collections = await dbHelper.queryAll("SELECT * FROM teacher_collections WHERE teacher_id = ? ORDER BY created_at DESC", [req.teacher.id]);
    for (const col of (collections || [])) {
      col.items = await dbHelper.queryAll(
        `SELECT ci.activity_id, a.title, a.subject, a.bncc_code, a.activity_url 
         FROM collection_items ci 
         JOIN activities a ON ci.activity_id = a.id 
         WHERE ci.collection_id = ?`,
        [col.id]
      ) || [];
    }
    const planning = await dbHelper.queryAll(
      `SELECT tp.*, a.title 
       FROM teacher_planning tp 
       LEFT JOIN activities a ON tp.activity_id = a.id 
       WHERE tp.teacher_id = ? 
       ORDER BY tp.planned_date DESC`,
      [req.teacher.id]
    );
    
    res.render('teacher_dashboard', { 
      teacher: { ...req.teacher, level: await getTeacherLevel(req.teacher.id) },
      activities: activities || [],
      favorites,
      exams: exams || [],
      classes: classes || [],
      globalExams: globalExams || [],
      collections: collections || [],
      planning: planning || [],
      examSubmissions: examSubmissions || []
    });
  } catch (err) {
    console.error('Teacher dashboard error:', err);
    res.status(500).send('Erro ao abrir Painel do Professor: ' + err.message);
  }
});

// Teacher API Routes
app.post('/api/teacher/password', requireTeacher, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const match = await bcrypt.compare(currentPassword, req.teacher.password_hash);
    if (!match) return res.json({ success: false, message: 'Senha atual incorreta' });
    const hash = await bcrypt.hash(newPassword, 10);
    await dbHelper.queryRun("UPDATE teachers SET password_hash = ? WHERE id = ?", [hash, req.teacher.id]);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/activities/add', requireTeacher, async (req, res) => {
  try {
    const { title, description, activity_url, category, bncc_code, subject, level, icon_url, submit_public } = req.body;
    const initialStatus = (submit_public === true || submit_public === 'true' || submit_public === 'on') ? 'pending' : 'private';
    const authorCredit = req.teacher.name || null;
    await dbHelper.queryRun(
      "INSERT INTO activities (title, description, activity_url, icon_url, category, bncc_code, subject, level, teacher_id, status, author_credit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description || '', activity_url, icon_url || '', category || 'Geral', bncc_code || '', subject || 'Geral', level || '1-5', req.teacher.id, initialStatus, authorCredit]
    );
    if (typeof clearActivitiesCache === 'function') clearActivitiesCache();
    res.json({ success: true, status: initialStatus });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/classes/add', requireTeacher, async (req, res) => {
  try {
    const { school_name, class_name } = req.body;
    if (!school_name || !class_name) return res.json({ success: false });
    await dbHelper.queryRun(
      "INSERT INTO teacher_classes (teacher_id, school_name, class_name) VALUES (?, ?, ?)",
      [req.teacher.id, school_name, class_name]
    );
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/activities/request-public/:id', requireTeacher, async (req, res) => {
  try {
    await dbHelper.queryRun(
      "UPDATE activities SET status = 'pending', author_credit = ? WHERE id = ? AND teacher_id = ?",
      [req.teacher.name || null, req.params.id, req.teacher.id]
    );
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/classes/delete/:id', requireTeacher, async (req, res) => {
  try {
    await dbHelper.queryRun("DELETE FROM teacher_classes WHERE id = ? AND teacher_id = ?", [req.params.id, req.teacher.id]);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/exams/add', requireTeacher, async (req, res) => {
  try {
    const { title, num_questions, pdf_source, pdf_url, pdf_base64, pdf_name } = req.body;
    let final_pdf_url = pdf_url;

    // Generate unique 5-character access code
    let access_code;
    let codeExists = true;
    while (codeExists) {
      access_code = Math.random().toString(36).substring(2, 7).toUpperCase();
      const existing = await dbHelper.queryGet("SELECT id FROM exams WHERE access_code = ?", [access_code]);
      if (!existing) codeExists = false;
    }

    if (pdf_source === 'upload' && pdf_base64) {
      const uploadDir = path.join(__dirname, 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const uniqueFileName = `${Date.now()}-${(pdf_name || 'prova.pdf').replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const filePath = path.join(uploadDir, uniqueFileName);
      fs.writeFileSync(filePath, Buffer.from(pdf_base64, 'base64'));
      final_pdf_url = `/uploads/${uniqueFileName}`;
    }

    await dbHelper.queryRun(
      "INSERT INTO exams (title, pdf_url, access_code, num_questions, teacher_id) VALUES (?, ?, ?, ?, ?)",
      [title, final_pdf_url, access_code, parseInt(num_questions) || 10, req.teacher.id]
    );

    const newExam = await dbHelper.queryGet("SELECT * FROM exams WHERE access_code = ?", [access_code]);
    res.json({ success: true, exam: newExam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/exams/delete/:id', requireTeacher, async (req, res) => {
  try {
    const exam = await dbHelper.queryGet("SELECT pdf_url FROM exams WHERE id = ? AND teacher_id = ?", [req.params.id, req.teacher.id]);
    if (exam && exam.pdf_url && exam.pdf_url.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, 'public', exam.pdf_url);
      if (fs.existsSync(filePath)) {
        try { fs.unlinkSync(filePath); } catch(e){}
      }
    }

    await dbHelper.queryRun("DELETE FROM exam_submissions WHERE exam_id = ?", [req.params.id]);
    await dbHelper.queryRun("DELETE FROM exams WHERE id = ? AND teacher_id = ?", [req.params.id, req.teacher.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/submissions/delete/:id', requireTeacher, async (req, res) => {
  try {
    const sub = await dbHelper.queryGet(
      "SELECT es.*, e.teacher_id FROM exam_submissions es JOIN exams e ON es.exam_id = e.id WHERE es.id = ?",
      [req.params.id]
    );
    if (!sub || sub.teacher_id !== req.teacher.id) {
      return res.status(403).json({ success: false, error: 'Acesso negado' });
    }

    await dbHelper.queryRun("DELETE FROM exam_submissions WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Collections API
app.get('/api/teacher/collections', requireTeacher, async (req, res) => {
  try {
    const collections = await dbHelper.queryAll("SELECT * FROM teacher_collections WHERE teacher_id = ?", [req.teacher.id]);
    for (const col of (collections || [])) {
      col.collection_items = await dbHelper.queryAll(
        "SELECT ci.*, a.* FROM collection_items ci JOIN activities a ON ci.activity_id = a.id WHERE ci.collection_id = ?",
        [col.id]
      );
    }
    res.json(collections || []);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/teacher/collections/add', requireTeacher, async (req, res) => {
  try {
    const { name } = req.body;
    await dbHelper.queryRun("INSERT INTO teacher_collections (teacher_id, name) VALUES (?, ?)", [req.teacher.id, name]);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/collections/add-item', requireTeacher, async (req, res) => {
  try {
    const { collection_id, activity_id } = req.body;
    await dbHelper.queryRun("INSERT OR REPLACE INTO collection_items (collection_id, activity_id) VALUES (?, ?)", [collection_id, activity_id]);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/collections/remove-item', requireTeacher, async (req, res) => {
  try {
    const { collection_id, activity_id } = req.body;
    const col = await dbHelper.queryGet("SELECT id FROM teacher_collections WHERE id = ? AND teacher_id = ?", [collection_id, req.teacher.id]);
    if (!col) return res.status(403).json({ success: false, error: 'Acesso negado' });
    await dbHelper.queryRun("DELETE FROM collection_items WHERE collection_id = ? AND activity_id = ?", [collection_id, activity_id]);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/collections/delete/:id', requireTeacher, async (req, res) => {
  try {
    const colId = req.params.id;
    const col = await dbHelper.queryGet("SELECT id FROM teacher_collections WHERE id = ? AND teacher_id = ?", [colId, req.teacher.id]);
    if (!col) return res.status(403).json({ success: false, error: 'Acesso negado' });
    await dbHelper.queryRun("DELETE FROM collection_items WHERE collection_id = ?", [colId]);
    await dbHelper.queryRun("DELETE FROM teacher_collections WHERE id = ?", [colId]);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Rota pública de playlist de coleção para turmas e alunos
app.get('/colecao/:id', async (req, res) => {
  try {
    const colId = req.params.id;
    const col = await dbHelper.queryGet(
      "SELECT tc.*, t.name as teacher_name FROM teacher_collections tc LEFT JOIN teachers t ON tc.teacher_id = t.id WHERE tc.id = ?",
      [colId]
    );
    if (!col) {
      return res.redirect('/');
    }
    const items = await dbHelper.queryAll(
      `SELECT ci.activity_id, a.title, a.description, a.subject, a.bncc_code, a.activity_url, a.image_url 
       FROM collection_items ci 
       JOIN activities a ON ci.activity_id = a.id 
       WHERE ci.collection_id = ?`,
      [colId]
    );
    res.render('collection_view', {
      collection: col,
      items: items || [],
      title: `${col.name} - Coleção Lab Kids`
    });
  } catch (err) {
    console.error('Error viewing collection:', err);
    res.redirect('/');
  }
});

// Planning API
app.get('/api/teacher/planning', requireTeacher, async (req, res) => {
  try {
    const planning = await dbHelper.queryAll(
      "SELECT tp.*, a.title FROM teacher_planning tp LEFT JOIN activities a ON tp.activity_id = a.id WHERE tp.teacher_id = ?",
      [req.teacher.id]
    );
    res.json(planning || []);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/teacher/planning/add', requireTeacher, async (req, res) => {
  try {
    const { activity_id, planned_date } = req.body;
    await dbHelper.queryRun("INSERT INTO teacher_planning (teacher_id, activity_id, planned_date) VALUES (?, ?, ?)", [req.teacher.id, activity_id, planned_date]);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teacher/planning/delete/:id', requireTeacher, async (req, res) => {
  try {
    await dbHelper.queryRun("DELETE FROM teacher_planning WHERE id = ? AND teacher_id = ?", [req.params.id, req.teacher.id]);
    res.json({ success: true });
  } catch(err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/teacher/export', requireTeacher, async (req, res) => {
  try {
    const favs = await dbHelper.queryAll(
      "SELECT a.title, a.subject, a.bncc_code FROM teacher_favorites tf JOIN activities a ON tf.activity_id = a.id WHERE tf.teacher_id = ?",
      [req.teacher.id]
    );
    let csv = 'Titulo,Disciplina,BNCC\n';
    (favs || []).forEach(row => {
      csv += `"${(row.title || '').replace(/"/g, '""')}","${(row.subject || '').replace(/"/g, '""')}","${(row.bncc_code || '').replace(/"/g, '""')}"\n`;
    });
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('minhas_atividades_favoritas.csv');
    res.send(csv);
  } catch(err) {
    res.status(500).send("Erro ao exportar: " + err.message);
  }
});

app.post('/admin/settings', requireAdmin, async (req, res) => {
  const { newPassword, newEmail } = req.body;
  // Implementation for updating admin settings in Supabase if needed
  res.json({ success: true });
});

app.post('/api/admin/toggle-simulados', requireAdmin, async (req, res) => {
  try {
    const current = await dbHelper.getSetting('simulados_enabled', 'false');
    const newState = (current === 'true' || current === true) ? 'false' : 'true';
    await dbHelper.setSetting('simulados_enabled', newState);
    if (typeof clearActivitiesCache === 'function') clearActivitiesCache();
    res.json({ success: true, enabled: newState === 'true' });
  } catch (err) {
    console.error('[Admin Toggle Simulados Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/teacher-stats/:id', requireAdmin, async (req, res) => {
  try {
    const teacherId = req.params.id;
    const logins = await dbHelper.queryAll("SELECT timestamp FROM teacher_logins WHERE teacher_id = ? ORDER BY timestamp DESC LIMIT 50", [teacherId]);
    const scans = await dbHelper.queryAll(
      "SELECT s.activity_id, a.title FROM activity_scans s LEFT JOIN activities a ON s.activity_id = a.id WHERE s.teacher_id = ? LIMIT 20",
      [teacherId]
    );
    res.json({ logins: logins || [], scans: scans || [] });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/admin/activity/approve/:id', requireAdmin, async (req, res) => {
  try {
    await dbHelper.queryRun("UPDATE activities SET status = 'public' WHERE id = ?", [req.params.id]);
    if (typeof clearActivitiesCache === 'function') clearActivitiesCache();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/admin/teacher/approve/:id', requireAdmin, async (req, res) => {
  try {
    const teacherId = req.params.id;
    await dbHelper.queryRun("UPDATE teachers SET status = 'approved' WHERE id = ?", [teacherId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/admin/teacher/reject/:id', requireAdmin, async (req, res) => {
  try {
    const teacherId = req.params.id;
    await dbHelper.queryRun("UPDATE teachers SET status = 'rejected' WHERE id = ?", [teacherId]);
    await dbHelper.queryRun("DELETE FROM teacher_sessions WHERE teacher_id = ?", [teacherId]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/admin/teacher/delete/:id', requireAdmin, async (req, res) => {
  try {
    const teacherId = req.params.id;
    await dbHelper.queryRun("DELETE FROM teacher_sessions WHERE teacher_id = ?", [teacherId]);
    await dbHelper.queryRun("DELETE FROM teacher_classes WHERE teacher_id = ?", [teacherId]);
    await dbHelper.queryRun("DELETE FROM teacher_favorites WHERE teacher_id = ?", [teacherId]);
    await dbHelper.queryRun("DELETE FROM teachers WHERE id = ?", [teacherId]);
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
    await dbHelper.queryRun("UPDATE teachers SET password_hash = ? WHERE id = ?", [hash, teacherId]);
    res.json({ success: true, newPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Acessar painel diretamente como o professor (Impersonate Admin -> Professor)
app.get('/admin/teacher/impersonate/:id', requireAdmin, async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await dbHelper.queryGet("SELECT * FROM teachers WHERE id = ?", [teacherId]);
    if (!teacher) return res.status(404).send("Professor não encontrado");

    const sessionId = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await dbHelper.queryRun("INSERT INTO teacher_sessions (id, teacher_id, expires) VALUES (?, ?, ?)", [sessionId, teacher.id, expires]);

    res.cookie('teacher_session', sessionId, { maxAge: 24 * 60 * 60 * 1000, path: '/' });
    res.redirect('/professor/dashboard');
  } catch (err) {
    console.error('Impersonate error:', err);
    res.status(500).send("Erro ao acessar conta do professor: " + err.message);
  }
});

// Desconectar todas as sessões ativas de um professor (Forçar Logout)
app.post('/admin/teacher/logout/:id', requireAdmin, async (req, res) => {
  try {
    const teacherId = req.params.id;
    await dbHelper.queryRun("DELETE FROM teacher_sessions WHERE teacher_id = ?", [teacherId]);
    res.json({ success: true });
  } catch (err) {
    console.error('Admin force logout error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/admin/activities/notify/:id', requireAdmin, async (req, res) => {
  try {
    const activityId = req.params.id;
    const activity = await dbHelper.queryGet("SELECT * FROM activities WHERE id = ?", [activityId]);
    if (!activity) {
      return res.status(404).json({ success: false, error: 'Atividade não encontrada.' });
    }

    const teachers = await dbHelper.queryAll(
      "SELECT id, name, email FROM teachers WHERE status = 'approved' AND email IS NOT NULL AND email != ''"
    );

    if (!teachers || teachers.length === 0) {
      return res.json({ success: true, count: 0, message: 'Nenhum professor ativo encontrado para notificar.' });
    }

    const result = await mailService.broadcastNewActivityToTeachers({ activity, teachers });
    res.json({ success: true, count: result.count, simulated: result.simulated });
  } catch (err) {
    console.error('Broadcast notification error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/admin/add', requireAdmin, async (req, res) => {
  const { title, description, activity_url, icon_url, category, bncc_code, subject, month, notify_teachers } = req.body;
  let { level } = req.body;
  if (Array.isArray(level)) level = level.join(',');

  const actMonth = month || 'Setembro';

  try {
    await dbHelper.queryRun(
      "INSERT INTO activities (title, description, activity_url, icon_url, level, category, bncc_code, subject, month) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description, activity_url, icon_url, level || '1-5', category || 'Geral', bncc_code || '', subject || 'Geral', actMonth]
    );

    // If requested, notify all approved teachers about this new launch
    if (notify_teachers === '1') {
      const created = await dbHelper.queryGet("SELECT * FROM activities WHERE title = ? ORDER BY id DESC LIMIT 1", [title]);
      if (created) {
        const teachers = await dbHelper.queryAll(
          "SELECT id, name, email FROM teachers WHERE status = 'approved' AND email IS NOT NULL AND email != ''"
        );
        if (teachers && teachers.length > 0) {
          mailService.broadcastNewActivityToTeachers({ activity: created, teachers }).catch(e => console.error('Auto broadcast error:', e));
        }
      }
    }
  } catch(e) {
    console.warn('[Admin Add] DB queryRun error:', e.message);
  }

  clearActivitiesCache();
  res.redirect('/admin');
});

app.post('/admin/duplicate/:id', requireAdmin, async (req, res) => {
  const activities = await dbHelper.getActivities({ adminMode: true });
  const activity = activities.find(a => String(a.id) === String(req.params.id));
  if (activity) {
    const { id, ...newData } = activity;
    newData.title = `${newData.title} (Cópia)`;
    try {
      await dbHelper.queryRun(
        "INSERT INTO activities (title, description, activity_url, icon_url, level, category, bncc_code, subject, month) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [newData.title, newData.description, newData.activity_url, newData.icon_url, newData.level, newData.category, newData.bncc_code || '', newData.subject || 'Geral', newData.month || 'Setembro']
      );
    } catch(e){}
    clearActivitiesCache();
  }
  res.redirect('/admin');
});

app.post('/admin/delete/:id', requireAdmin, async (req, res) => {
  try {
    await dbHelper.queryRun("DELETE FROM activities WHERE id = ?", [req.params.id]);
  } catch(e){}
  clearActivitiesCache();
  res.redirect('/admin');
});

app.post('/admin/edit/:id', requireAdmin, async (req, res) => {
  const { title, description, activity_url, icon_url, category, bncc_code, subject, month } = req.body;
  let { level } = req.body;
  if (Array.isArray(level)) level = level.join(',');

  const actMonth = month || 'Agosto';

  try {
    await dbHelper.queryRun(
      "UPDATE activities SET title = ?, description = ?, activity_url = ?, icon_url = ?, level = ?, category = ?, bncc_code = ?, subject = ?, month = ? WHERE id = ?",
      [title, description, activity_url, icon_url, level || '1-5', category || 'Geral', bncc_code || '', subject || 'Geral', actMonth, req.params.id]
    );
  } catch(e) {
    console.warn('[Admin Edit] DB queryRun error:', e.message);
  }

  clearActivitiesCache();
  res.redirect('/admin');
});

// Comment Moderation
app.post('/admin/comments/approve/:id', requireAdmin, async (req, res) => {
  await dbHelper.queryRun("UPDATE comments SET approved = 1 WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

app.post('/admin/comments/delete/:id', requireAdmin, async (req, res) => {
  await dbHelper.queryRun("DELETE FROM comments WHERE id = ?", [req.params.id]);
  res.json({ success: true });
});

app.post('/admin/comments/edit/:id', requireAdmin, async (req, res) => {
  const { comment_text } = req.body;
  await dbHelper.queryRun("UPDATE comments SET comment_text = ? WHERE id = ?", [comment_text, req.params.id]);
  res.redirect('/admin');
});

// Project Management
app.post('/admin/projects/add', requireAdmin, async (req, res) => {
  const { title, description, image_url, school_name, class_name } = req.body;
  await dbHelper.queryRun("INSERT INTO projects (title, description, image_url, school_name, class_name) VALUES (?, ?, ?, ?, ?)", [title, description, image_url, school_name || '', class_name || '']);
  res.redirect('/admin');
});

app.post('/admin/projects/delete/:id', requireAdmin, async (req, res) => {
  await dbHelper.queryRun("DELETE FROM projects WHERE id = ?", [req.params.id]);
  res.redirect('/admin');
});

// Admin News Management
app.post('/admin/news/add', requireAdmin, async (req, res) => {
  const { title, summary, content, image_url, category, author, published_at } = req.body;
  try {
    await dbHelper.queryRun(
      "INSERT INTO news (title, summary, content, image_url, category, author, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, summary, content, image_url, category || 'Geral', author || 'Equipe Lab', published_at || new Date().toISOString()]
    );
  } catch (err) {
    console.error('Error adding news:', err);
  }
  res.redirect('/admin#news');
});

app.post('/admin/news/delete/:id', requireAdmin, async (req, res) => {
  await dbHelper.queryRun("DELETE FROM news WHERE id = ?", [req.params.id]);
  res.redirect('/admin');
});

// Institutional Pages
app.get('/sobre', (req, res) => {
  res.render('about');
});

app.get('/quem-somos', (req, res) => {
  res.redirect(301, '/sobre');
});

app.get('/termos', (req, res) => {
  res.render('terms');
});

app.get('/termos-de-uso', (req, res) => {
  res.redirect(301, '/termos');
});

app.get('/cookies', (req, res) => {
  res.render('cookies');
});

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
    res.render('news_list', { 
      news: news || [],
      adsensePubId: process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531'
    });
  } catch (error) {
    console.error('BLOG ERROR:', error);
    res.render('news_list', { 
      news: [],
      adsensePubId: process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531'
    });
  }
});

app.get('/noticia/:id', async (req, res) => {
  try {
    const article = await dbHelper.getSingleNews(req.params.id);
    if (!article) return res.status(404).send('Notícia não encontrada');
    res.render('news_view', { 
      article,
      adsensePubId: process.env.ADSENSE_PUB_ID || 'ca-pub-4730100335805531'
    });
  } catch (err) {
    console.error('ARTICLE ERROR:', err);
    res.status(500).send('Erro ao carregar artigo');
  }
});

// QR Code Redirection (AdSense Landing)
app.get('/qr/:id', async (req, res) => {
  try {
    const activity = await dbHelper.queryGet("SELECT * FROM activities WHERE id = ?", [req.params.id]);
    if (!activity) return res.status(404).send('Atividade não encontrada');
    
    const teacherId = req.query.t || null;
    await dbHelper.queryRun("UPDATE activities SET qr_scans = COALESCE(qr_scans, 0) + 1 WHERE id = ?", [req.params.id]);
    if (teacherId) {
      await dbHelper.queryRun("INSERT INTO activity_scans (activity_id, teacher_id) VALUES (?, ?)", [req.params.id, teacherId]);
    }
    
    res.render('qr_redirect', { activity });
  } catch(e) {
    res.status(500).send('Erro ao redirecionar QR Code');
  }
});

// Student Exams System
app.get('/prova', (req, res) => {
  res.render('exam_login', { error: null });
});

app.post('/prova/login', async (req, res) => {
  try {
    const { access_code, student_name } = req.body;
    const exam = await dbHelper.queryGet("SELECT * FROM exams WHERE access_code = ?", [access_code]);
    
    if (!exam) {
      return res.render('exam_login', { error: 'Código de acesso inválido.' });
    }

    let submission = await dbHelper.queryGet("SELECT * FROM exam_submissions WHERE exam_id = ? AND student_name = ?", [exam.id, student_name]);
    if (!submission) {
      await dbHelper.queryRun("INSERT INTO exam_submissions (exam_id, student_name) VALUES (?, ?)", [exam.id, student_name]);
      submission = await dbHelper.queryGet("SELECT * FROM exam_submissions WHERE exam_id = ? AND student_name = ?", [exam.id, student_name]);
    }

    res.cookie('exam_session', JSON.stringify({ submission_id: submission.id, exam_id: exam.id }), { maxAge: 4 * 60 * 60 * 1000 }); // 4 hours
    res.redirect(`/prova/sala`);
  } catch(e) {
    res.render('exam_login', { error: 'Erro ao entrar na prova: ' + e.message });
  }
});

app.get('/prova/sala', async (req, res) => {
  try {
    const sessionCookie = req.cookies.exam_session;
    if (!sessionCookie) return res.redirect('/prova');
    
    const session = JSON.parse(sessionCookie);
    const exam = await dbHelper.queryGet("SELECT * FROM exams WHERE id = ?", [session.exam_id]);
    const submission = await dbHelper.queryGet("SELECT * FROM exam_submissions WHERE id = ?", [session.submission_id]);

    if (!exam || !submission) return res.redirect('/prova');

    res.render('exam_room', { exam, submission });
  } catch(e) {
    res.redirect('/prova');
  }
});

// API Routes
app.post('/api/exam/submit-answer', async (req, res) => {
  try {
    const sessionCookie = req.cookies.exam_session;
    if (!sessionCookie) return res.status(401).json({ error: 'Unauthorized' });
    
    const session = JSON.parse(sessionCookie);
    const { answers } = req.body;
    
    await dbHelper.queryRun("UPDATE exam_submissions SET answers_json = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [JSON.stringify(answers), session.submission_id]);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Teacher API: Favorites
app.post('/api/teacher/favorite/:id', requireTeacher, async (req, res) => {
  try {
    const activity_id = parseInt(req.params.id);
    const teacherId = req.teacher.id;
    const existing = await dbHelper.queryGet("SELECT * FROM teacher_favorites WHERE teacher_id = ? AND activity_id = ?", [teacherId, activity_id]);
    
    if (existing) {
      await dbHelper.queryRun("DELETE FROM teacher_favorites WHERE teacher_id = ? AND activity_id = ?", [teacherId, activity_id]);
      res.json({ success: true, status: 'removed' });
    } else {
      await dbHelper.queryRun("INSERT INTO teacher_favorites (teacher_id, activity_id) VALUES (?, ?)", [teacherId, activity_id]);
      res.json({ success: true, status: 'added' });
    }
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/api/rate/:id', async (req, res) => {
  try {
    const { rating } = req.body;
    const stars = parseInt(rating);
    if (stars >= 1 && stars <= 5) {
      await dbHelper.queryRun(
        "UPDATE activities SET rating_sum = COALESCE(rating_sum, 0) + ?, rating_count = COALESCE(rating_count, 0) + 1 WHERE id = ?",
        [stars, req.params.id]
      );
      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid rating' });
    }
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/visit/:id', async (req, res) => {
  try {
    await dbHelper.queryRun("UPDATE activities SET visits = COALESCE(visits, 0) + 1 WHERE id = ?", [req.params.id]);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/comment', async (req, res) => {
  try {
    const { activity_id, student_name, school_name, class_name, comment_text, avatar } = req.body;
    if (!activity_id || !student_name || !comment_text) return res.status(400).json({ error: 'Missing fields' });

    const lastCommentTime = req.cookies.last_comment_time;
    const now = Date.now();
    if (lastCommentTime && (now - lastCommentTime < 60000)) return res.status(429).json({ error: 'flood' });

    await dbHelper.createComment({ 
      activity_id: parseInt(activity_id), 
      student_name, 
      school_name: school_name || '', 
      class_name: class_name || '', 
      avatar: avatar || '🤖', 
      comment_text 
    });
    res.cookie('last_comment_time', now, { maxAge: 60000 });
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/stats', async (req, res) => {
  try {
    const topActivities = await dbHelper.queryAll("SELECT title, visits FROM activities ORDER BY visits DESC LIMIT 5");
    res.json(topActivities || []);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
