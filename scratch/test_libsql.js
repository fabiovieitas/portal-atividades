const { createClient } = require('@libsql/client');
const path = require('path');

const client = createClient({
  url: `file:${path.join(__dirname, '..', 'database.db')}`
});

async function test() {
  console.log('Testing @libsql/client locally...');
  const res = await client.execute("SELECT * FROM activities WHERE status = 'public'");
  console.log('Activities returned:', res.rows.length);
  console.log('Sample title:', res.rows[0].title);
}

test();
