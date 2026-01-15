// lib/schema.js
import { db } from "./db.js";

export async function initSchema() {
  try {
    // Users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        avatar VARCHAR(512),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Repos table
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log(" Database schema initialized");
  } catch (err) {
    console.error(" Failed to initialize schema:", err);
  }
}
