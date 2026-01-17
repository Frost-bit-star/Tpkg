import pkg from "pg";
const { Pool } = pkg;

export const db = new Pool({
  host: "127.0.0.1",
  port: 5432,
  user: "tpkg_user",      // <-- use your dedicated user
  password: "tpkg_pass",  // <-- password you set for tpkg_user
  database: "tpkg",       // <-- new database
});

db.on("connect", () => console.log("✅ PostgreSQL connected"));
db.on("error", (err) => console.error("❌ PostgreSQL error:", err));
