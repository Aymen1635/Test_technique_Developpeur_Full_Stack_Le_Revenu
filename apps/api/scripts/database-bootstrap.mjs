import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';

const { Client } = pg;
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const apiRoot = path.resolve(scriptDirectory, '..');
const envPath = path.join(apiRoot, '.env');

if (fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath });
  if (result.error) throw result.error;
}

const availabilityErrors = new Set([
  'ECONNREFUSED',
  'ETIMEDOUT',
  'EHOSTUNREACH',
  'ENETUNREACH',
  'ENOTFOUND',
  'EAI_AGAIN',
]);

async function selectDatabase() {
  const client = process.env.DATABASE_CLIENT || 'postgres';
  if (client === 'sqlite') {
    console.info('[database] Using SQLite (selected by DATABASE_CLIENT).');
    return;
  }
  if (client !== 'postgres') {
    throw new Error(`Unsupported DATABASE_CLIENT "${client}". Use "postgres" or "sqlite".`);
  }

  const port = Number.parseInt(process.env.DATABASE_PORT || '5432', 10);
  const database = process.env.DATABASE_NAME || 'community_lerevenu';
  const ssl = ['true', '1'].includes((process.env.DATABASE_SSL || '').toLowerCase());
  const postgres = new Client({
    host: process.env.DATABASE_HOST || '127.0.0.1',
    port,
    database,
    user: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    ssl,
    connectionTimeoutMillis: 5000,
  });

  try {
    await postgres.connect();
  } catch (error) {
    if (error?.code === '3D000') {
      throw new Error(
        `PostgreSQL is reachable, but database "${database}" does not exist. Create it or set DATABASE_NAME to an existing database.`,
        { cause: error }
      );
    }
    if (!error || !availabilityErrors.has(error.code)) throw error;

    process.env.DATABASE_CLIENT = 'sqlite';
    console.warn(`[database] PostgreSQL is unavailable (${error.code}); falling back to SQLite.`);
    return;
  }

  await postgres.end();
  console.info('[database] PostgreSQL connection confirmed.');
}

await selectDatabase();
