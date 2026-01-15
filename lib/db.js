// lib/db.js
import pkg from "pg";
const { Pool } = pkg;

export const db = new Pool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "tpkg",
});

db.on("connect", () => console.log(" PostgreSQL connected"));
db.on("error", (err) => console.error(" PostgreSQL error:", err));
