// Executa um arquivo .sql diretamente no Postgres do projeto Supabase.
//
//   node --env-file=.env.local scripts/run-migration.mjs supabase/migrations/0001_init.sql
//
// Requer SUPABASE_DB_HOST, SUPABASE_DB_PORT, SUPABASE_DB_USER e
// SUPABASE_DB_PASSWORD no ambiente (Project Settings > Database > Connect).

import { readFileSync } from "node:fs";
import { Client } from "pg";

const file = process.argv[2];
if (!file) {
  console.error("Uso: node scripts/run-migration.mjs <arquivo.sql>");
  process.exit(1);
}

const host = process.env.SUPABASE_DB_HOST;
const port = Number(process.env.SUPABASE_DB_PORT ?? 5432);
const user = process.env.SUPABASE_DB_USER;
const password = process.env.SUPABASE_DB_PASSWORD;

if (!host || !user || !password) {
  console.error(
    "Faltam SUPABASE_DB_HOST / SUPABASE_DB_USER / SUPABASE_DB_PASSWORD no ambiente.",
  );
  process.exit(1);
}

const sql = readFileSync(file, "utf8");

const client = new Client({
  host,
  port,
  database: "postgres",
  user,
  password,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  await client.connect();
  console.log(`Conectado. Rodando ${file}...`);
  await client.query(sql);
  console.log("Concluído com sucesso.");
  await client.end();
}

main().catch(async (err) => {
  console.error("Erro ao rodar a migration:", err.message);
  await client.end();
  process.exit(1);
});
