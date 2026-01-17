// pages/api/auth/register.js
import { db } from "../../../lib/db.js";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user exists
    const existing = await db.query("SELECT id FROM users WHERE email=$1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.query(
      `INSERT INTO users (name, email, password, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    return res.status(201).json({ message: "User registered successfully", user: result.rows[0] });
  } catch (err) {
    console.error("❌ Error registering user:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
