// pages/api/repos.js
import { getSession } from "next-auth/react";
import { db } from "../../lib/db.js";
import fetch from "node-fetch";

async function fetchGitHubRepo(url) {
  const [user, repo] = url.replace("https://github.com/", "").split("/");
  const apiBase = `https://api.github.com/repos/${user}/${repo}`;
  const repoRes = await fetch(apiBase);
  if (!repoRes.ok) throw new Error("GitHub repo not found");
  const repoData = await repoRes.json();

  const rawBase = `https://raw.githubusercontent.com/${user}/${repo}/main`;
  const tpkgRes = await fetch(`${rawBase}/tpkg.json`);
  if (!tpkgRes.ok) throw new Error("tpkg.json not found");
  const tpkgJson = await tpkgRes.json();

  const readmeRes = await fetch(`${rawBase}/README.md`);
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
  const session = await getSession({ req });
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const userEmail = session.user.email;

  if (req.method === "POST") {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Repo URL required" });

    try {
      // get owner_id
      const userResult = await db.query("SELECT id FROM users WHERE email=$1", [userEmail]);
      const owner_id = userResult.rows[0].id;

      const { tpkgJson, readme, githubMeta } = await fetchGitHubRepo(url);

      const name = tpkgJson.name || url.split("/").pop();
      const description = tpkgJson.description || "";

      const insert = await db.query(
        `INSERT INTO repos 
         (name,url,description,owner_id,tpkg_json,readme,stars,forks,owner_login,owner_url,owner_avatar)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING *`,
        [
          name, url, description, owner_id,
          tpkgJson, readme,
          githubMeta.stars, githubMeta.forks,
          githubMeta.owner.login,
          githubMeta.owner.url,
          githubMeta.owner.avatar
        ]
      );

      return res.json(insert.rows[0]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === "GET") {
    try {
      const result = await db.query("SELECT * FROM repos WHERE verified=true ORDER BY created_at DESC");
      return res.json(result.rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
