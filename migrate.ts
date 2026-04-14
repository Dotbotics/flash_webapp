import dotenv from "dotenv";
import { migrateSQLiteToPostgres } from "./src/lib/db";
import pg from "pg";

dotenv.config();

async function runMigration() {
  const pgConfig: pg.PoolConfig = {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.POSTGRES_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  };

  if (!pgConfig.host || !pgConfig.user || !pgConfig.password || !pgConfig.database) {
    console.error("PostgreSQL environment variables are missing. Please check your .env file.");
    process.exit(1);
  }

  try {
    await migrateSQLiteToPostgres(pgConfig);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

runMigration();
