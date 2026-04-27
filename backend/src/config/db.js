import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import pg from "pg";
import { newDb } from "pg-mem";
import { fileURLToPath } from "node:url";

dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..", "..");
const schemaPath = path.join(projectRoot, "prisma-or-sql", "schema.sql");
const seedPath = path.join(projectRoot, "prisma-or-sql", "seed.sql");

function createInMemoryPool() {
  const db = newDb({
    autoCreateForeignKeyIndices: true,
  });

  db.public.none(fs.readFileSync(schemaPath, "utf8"));
  db.public.none(fs.readFileSync(seedPath, "utf8"));

  return db.adapters.createPg().pool;
}

const shouldUseInMemoryDb =
  process.env.USE_IN_MEMORY_DB === "true" || !process.env.DATABASE_URL;

export const pool = shouldUseInMemoryDb
  ? createInMemoryPool()
  : new Pool({
      connectionString: process.env.DATABASE_URL,
    });

export async function query(text, params = []) {
  return pool.query(text, params);
}
