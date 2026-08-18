const https = require('https');
const fs = require('fs');
const path = require('path');

const targetUrl = 'https://portal-atividades.onrender.com/manifest.json';
const apkOutputPath = path.join(__dirname, '../public/downloads/labkids.apk');

const postData = JSON.stringify({
  appUrl: 'https://portal-atividades.onrender.com/',
  manifestUrl: 'https://portal-atividades.onrender.com/manifest.json',
  manifest: {
    name: "Lab Kids - Portal de Atividades Educativas",
    short_name: "Lab Kids",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "https://portal-atividades.onrender.com/img/robot-icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },
  packageId: "com.labkids.portal",
  appName: "Lab Kids",
  launcherName: "Lab Kids"
});

console.log('Solicitando APK para PWABuilder Cloud...');

const options = {
  hostname: 'pwabuilder-cloud-apk.azurewebsites.net',
  path: '/api/apk/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  if (res.statusCode === 200 || res.statusCode === 201) {
    const file = fs.createWriteStream(apkOutputPath);
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('✅ APK baixado com sucesso em:', apkOutputPath);
    });
  } else {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log('Response body:', body.substring(0, 300)));
  }
});

req.on('error', (e) => {
  console.error('Erro na requisição:', e.message);
});

req.write(postData);
req.end();
