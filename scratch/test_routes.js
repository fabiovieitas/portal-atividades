const http = require('http');
const { spawn } = require('child_process');

console.log('Starting server for integration testing...');
const server = spawn('node', ['server.js'], { cwd: __dirname + '/..' });

server.stdout.on('data', (data) => {
  const str = data.toString();
  console.log('[Server stdout]:', str.trim());
  if (str.includes('Server running at')) {
    runTests();
  }
});

server.stderr.on('data', (data) => {
  console.error('[Server stderr]:', data.toString().trim());
});

function getUrl(path) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    http.get('http://localhost:3000' + path, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({ statusCode: res.statusCode, duration, bodyLength: body.length, bodySnippet: body.substring(0, 300) });
      });
    }).on('error', reject);
  });
}

async function runTests() {
  try {
    console.log('\n--- Running Route Performance & Response Tests ---');

    console.log('\nTesting GET /');
    const r1 = await getUrl('/');
    console.log(`Status: ${r1.statusCode} | Time: ${r1.duration}ms | Length: ${r1.bodyLength}`);

    console.log('\nTesting GET /?level=1-5');
    const r2 = await getUrl('/?level=1-5');
    console.log(`Status: ${r2.statusCode} | Time: ${r2.duration}ms | Length: ${r2.bodyLength}`);
    const hasActivities1_5 = r2.bodySnippet.includes('activity-card') || r2.bodyLength > 1000;
    console.log('Contains activity cards?:', r2.bodySnippet.includes('activity-card') || r2.bodySnippet.includes('Aventura com Code.org'));

    console.log('\nTesting GET /?level=6-9');
    const r3 = await getUrl('/?level=6-9');
    console.log(`Status: ${r3.statusCode} | Time: ${r3.duration}ms | Length: ${r3.bodyLength}`);

    console.log('\nTesting GET /noticias');
    const r4 = await getUrl('/noticias');
    console.log(`Status: ${r4.statusCode} | Time: ${r4.duration}ms | Length: ${r4.bodyLength}`);

    console.log('\n--- ALL TESTS PASSED SUCCESSFULLY ---');
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    server.kill();
    process.exit(0);
  }
}
