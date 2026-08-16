const https = require('https');

const candidates = [
  'mestreprojetos',
  'mestrecentral',
  'mestrelabs',
  'mestreestudio',
  'mestre3d',
  'mestreloja',
  'mestredigital',
  'vieitas',
  'fvlab',
  'fvapps',
  'fvtech',
  'superhub',
  'superlab',
  'superestudio'
];

async function checkDomain(name) {
  const domain = `${name}.com.br`;
  const url = `https://registro.br/v2/ajax/avail/raw/${domain}`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ domain, available: json.status === 0 });
        } catch (e) {
          resolve({ domain, available: false, error: true });
        }
      });
    }).on('error', () => {
      resolve({ domain, available: false, error: true });
    });
  });
}

async function run() {
  for (const d of candidates) {
    const result = await checkDomain(d);
    if (result.available) console.log(`[DISPONÍVEL] http://${result.domain}`);
    else console.log(`[OCUPADO]   http://${result.domain}`);
  }
}
run();
