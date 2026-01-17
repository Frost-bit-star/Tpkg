import { db } from "./db.js";

export async function initSchema() {
  try {
    // --- Users table ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        avatar VARCHAR(512),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add password column safely
    await db.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password VARCHAR(255);
    `);

    // --- Repos table ---
    await db.query(`
      CREATE TABLE IF NOT EXISTS repos (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        url VARCHAR(512) NOT NULL,
        description TEXT,
        owner_id INT REFERENCES users(id),
        tpkg_json JSONB NOT NULL,
        readme TEXT,
        verified BOOLEAN DEFAULT TRUE,
        stars INT DEFAULT 0,
        forks INT DEFAULT 0,
        owner_login VARCHAR(255),
        owner_url VARCHAR(512),
        owner_avatar VARCHAR(512),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Database schema initialized or updated successfully");
    await db.end(); // close connection
  } catch (err) {
    console.error("❌ Failed to initialize/update schema:", err);
  }
}

// Run the schema initializer
initSchema();
