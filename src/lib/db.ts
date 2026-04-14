import Database from "better-sqlite3";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface DBInterface {
  exec(sql: string): Promise<void>;
  all<T>(sql: string, params?: any[]): Promise<T[]>;
  get<T>(sql: string, params?: any[]): Promise<T | undefined>;
  run(sql: string, params?: any[]): Promise<{ changes: number }>;
  close(): Promise<void>;
}

class SQLiteDB implements DBInterface {
  private db: any;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
  }

  async exec(sql: string): Promise<void> {
    this.db.exec(sql);
  }

  async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    return this.db.prepare(sql).all(...params) as T[];
  }

  async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    return this.db.prepare(sql).get(...params) as T;
  }

  async run(sql: string, params: any[] = []): Promise<{ changes: number }> {
    const result = this.db.prepare(sql).run(...params);
    return { changes: result.changes };
  }

  async close(): Promise<void> {
    this.db.close();
  }
}

class PostgresDB implements DBInterface {
  private pool: pg.Pool;

  constructor(config: pg.PoolConfig) {
    this.pool = new pg.Pool(config);
  }

  async exec(sql: string): Promise<void> {
    await this.pool.query(sql);
  }

  async all<T>(sql: string, params: any[] = []): Promise<T[]> {
    const res = await this.pool.query(sql, params);
    return res.rows as T[];
  }

  async get<T>(sql: string, params: any[] = []): Promise<T | undefined> {
    const res = await this.pool.query(sql, params);
    return res.rows[0] as T;
  }

  async run(sql: string, params: any[] = []): Promise<{ changes: number }> {
    const res = await this.pool.query(sql, params);
    return { changes: res.rowCount || 0 };
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export async function getDB(): Promise<DBInterface> {
  const usePostgres = process.env.DB_TYPE === "postgres" || (
    process.env.POSTGRES_HOST && 
    process.env.POSTGRES_USER && 
    process.env.POSTGRES_PASSWORD && 
    process.env.POSTGRES_DB
  );

  if (usePostgres) {
    console.log("Using PostgreSQL database");
    const config: pg.PoolConfig = {
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      ssl: process.env.POSTGRES_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    };
    const db = new PostgresDB(config);
    await initSchema(db);
    return db;
  } else {
    console.log("Using SQLite database");
    const dbPath = path.join(process.cwd(), "cms.db");
    const db = new SQLiteDB(dbPath);
    await initSchema(db);
    return db;
  }
}

async function initSchema(db: DBInterface) {
  // SQLite uses AUTOINCREMENT, Postgres uses SERIAL
  const isPostgres = db instanceof PostgresDB;
  
  const pagesTable = `
    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      title TEXT,
      content TEXT,
      meta_title TEXT,
      meta_description TEXT,
      meta_keywords TEXT,
      og_image TEXT
    );
  `;

  const submissionsTable = isPostgres ? `
    CREATE TABLE IF NOT EXISTS submissions (
      id SERIAL PRIMARY KEY,
      name TEXT,
      email TEXT,
      subject TEXT,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  ` : `
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      subject TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const settingsTable = `
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `;

  await db.exec(pagesTable);
  await db.exec(submissionsTable);
  await db.exec(settingsTable);
}

export async function migrateSQLiteToPostgres(pgConfig: pg.PoolConfig) {
  const sqlitePath = path.join(process.cwd(), "cms.db");
  if (!fs.existsSync(sqlitePath)) {
    console.log("No SQLite database found to migrate.");
    return;
  }

  console.log("Starting migration from SQLite to PostgreSQL...");
  const sqlite = new SQLiteDB(sqlitePath);
  const postgres = new PostgresDB(pgConfig);

  await initSchema(postgres);

  // Migrate Pages
  const pages = await sqlite.all<any>("SELECT * FROM pages");
  console.log(`Migrating ${pages.length} pages...`);
  for (const page of pages) {
    await postgres.run(
      "INSERT INTO pages (id, title, content, meta_title, meta_description, meta_keywords, og_image) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content, meta_title = EXCLUDED.meta_title, meta_description = EXCLUDED.meta_description, meta_keywords = EXCLUDED.meta_keywords, og_image = EXCLUDED.og_image",
      [page.id, page.title, page.content, page.meta_title, page.meta_description, page.meta_keywords, page.og_image]
    );
  }

  // Migrate Submissions
  const submissions = await sqlite.all<any>("SELECT * FROM submissions");
  console.log(`Migrating ${submissions.length} submissions...`);
  for (const sub of submissions) {
    await postgres.run(
      "INSERT INTO submissions (name, email, subject, message, created_at) VALUES ($1, $2, $3, $4, $5)",
      [sub.name, sub.email, sub.subject, sub.message, sub.created_at]
    );
  }

  // Migrate Settings
  const settings = await sqlite.all<any>("SELECT * FROM settings");
  console.log(`Migrating ${settings.length} settings...`);
  for (const set of settings) {
    await postgres.run(
      "INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value",
      [set.key, set.value]
    );
  }

  console.log("Migration completed successfully.");
  await sqlite.close();
  await postgres.close();
}
