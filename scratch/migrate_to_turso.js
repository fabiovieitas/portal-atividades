require('dotenv').config();
const { createClient } = require('@libsql/client');
const Database = require('better-sqlite3');
const path = require('path');

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken || !url.startsWith('libsql://')) {
  console.error("ERRO: TURSO_DATABASE_URL ou TURSO_AUTH_TOKEN não estão configurados no arquivo .env");
  process.exit(1);
}

const cloudClient = createClient({ url, authToken });
const localDb = new Database(path.join(__dirname, '..', 'database.db'));

async function migrate() {
  console.log("🚀 Iniciando migração do banco local para o Turso na nuvem...");

  // Get all table creation DDLs from local SQLite
  const tables = localDb.prepare("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all();

  // Create tables first
  for (const table of tables) {
    if (!table.sql) continue;
    console.log(`📦 Criando estrutura da tabela: ${table.name}`);
    try {
      await cloudClient.execute(table.sql);
    } catch (e) {
      console.log(`  (Aviso ao criar ${table.name}: ${e.message})`);
    }
  }

  // Desabilitar chaves estrangeiras temporariamente para inserção rápida
  try { await cloudClient.execute("PRAGMA foreign_keys = OFF;"); } catch (e) {}

  for (const table of tables) {
    const rows = localDb.prepare(`SELECT * FROM ${table.name}`).all();
    if (rows.length > 0) {
      console.log(`  ➡️ Inserindo ${rows.length} registros em '${table.name}'...`);
      for (const row of rows) {
        const keys = Object.keys(row);
        const placeholders = keys.map(() => '?').join(', ');
        const values = Object.values(row);
        const sql = `INSERT OR REPLACE INTO ${table.name} (${keys.join(', ')}) VALUES (${placeholders})`;
        try {
          await cloudClient.execute({ sql, args: values });
        } catch (e) {
          console.error(`  ❌ Erro ao inserir na tabela ${table.name}:`, e.message);
        }
      }
    }
  }

  try { await cloudClient.execute("PRAGMA foreign_keys = ON;"); } catch (e) {}

  console.log("\n🎉 MIGRAÇÃO PARA O TURSO CONCLUÍDA COM SUCESSO TOTAL!");
}

migrate().catch(console.error);
