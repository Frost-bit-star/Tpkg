// pages/api/auth/login.js
import { db } from "../../../lib/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const result = await db.query("SELECT id, name, email, password FROM users WHERE email=$1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.json({ message: "Login successful", token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error("❌ Error logging in:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
