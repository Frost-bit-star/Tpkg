// pages/api/repos.js
import { db } from "../../lib/db.js";
import fetch from "node-fetch";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tpkg_secret";

// Helper to fetch GitHub repo + tpkg.json + README, try main then master
async function fetchGitHubRepo(url) {
  const [user, repo] = url.replace("https://github.com/", "").split("/");
  if (!user || !repo) throw new Error("Invalid GitHub URL");

  // GitHub API metadata
  const apiBase = `https://api.github.com/repos/${user}/${repo}`;
  const repoRes = await fetch(apiBase);
  if (!repoRes.ok) throw new Error("GitHub repo not found");
  const repoData = await repoRes.json();

  const branches = ["main", "master"];
  let tpkgJson = null;
  let branchFound = null;

  for (const branch of branches) {
    const rawBase = `https://raw.githubusercontent.com/${user}/${repo}/${branch}`;
    try {
      const tpkgRes = await fetch(`${rawBase}/tpkg.json`);
      if (tpkgRes.ok) {
        tpkgJson = await tpkgRes.json();
        branchFound = branch;
        break;
      }
    } catch (err) {
      // ignore JSON parse errors for now
    }
  }

  if (!tpkgJson) {
    return { error: "tpkg.json not found on main or master branch. Add a tpkg.json in your repo root." };
  }

  // README.md
  const readmeRes = await fetch(`https://raw.githubusercontent.com/${user}/${repo}/${branchFound}/README.md`);
  const readme = readmeRes.ok ? await readmeRes.text() : "";

  return {
    tpkgJson,
    readme,
    githubMeta: {
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      watchers: repoData.watchers_count,
      owner: {
        login: repoData.owner.login,
        url: repoData.owner.html_url,
        avatar: repoData.owner.avatar_url,
      },
    },
  };
}

export default async function handler(req, res) {
  // --- AUTH ---
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  let userEmail;
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    userEmail = payload.email;
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  // --- POST: Add a repo ---
  if (req.method === "POST") {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Repo URL required" });

    try {
      const userResult = await db.query("SELECT id FROM users WHERE email=$1", [userEmail]);
      if (!userResult.rows.length) return res.status(401).json({ error: "User not found" });
      const owner_id = userResult.rows[0].id;

      const fetchResult = await fetchGitHubRepo(url);
      if (fetchResult.error) return res.status(400).json({ error: fetchResult.error });

      const { tpkgJson, readme, githubMeta } = fetchResult;

      const name = tpkgJson.name || url.split("/").pop();
      const description = tpkgJson.description || "";

      const insert = await db.query(
        `INSERT INTO repos
         (name,url,description,owner_id,tpkg_json,readme,stars,forks,owner_login,owner_url,owner_avatar)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING *`,
        [
          name,
          url,
          description,
          owner_id,
          tpkgJson,
          readme,
          githubMeta.stars,
          githubMeta.forks,
          githubMeta.owner.login,
          githubMeta.owner.url,
          githubMeta.owner.avatar,
        ]
      );

      return res.json(insert.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  // --- GET: List verified repos ---
  if (req.method === "GET") {
    try {
      const result = await db.query("SELECT * FROM repos WHERE verified=true ORDER BY created_at DESC");
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
