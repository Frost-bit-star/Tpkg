// pages/api/view-repo.js
import { db } from "../../lib/db.js";
import fetch from "node-fetch";

// Helper to fetch GitHub live stats
async function fetchGitHubStats(url) {
  const [user, repo] = url.replace("https://github.com/", "").split("/");
  if (!user || !repo) throw new Error("Invalid GitHub URL");

  const apiBase = `https://api.github.com/repos/${user}/${repo}`;
  const res = await fetch(apiBase);
  if (!res.ok) throw new Error("GitHub repo not found");

  const data = await res.json();
  return {
    stars: data.stargazers_count,
    forks: data.forks_count,
    watchers: data.watchers_count,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: "Repo ID required" });

  try {
    const result = await db.query("SELECT * FROM repos WHERE id=$1", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Repo not found" });

    const repo = result.rows[0];

    // Fetch live stats from GitHub
    let githubStats = {};
    try {
      githubStats = await fetchGitHubStats(repo.url);
    } catch (err) {
      console.warn("Failed to fetch GitHub stats:", err.message);
      githubStats = {
        stars: repo.stars || 0,
        forks: repo.forks || 0,
        watchers: 0,
      };
    }

    return res.json({
      id: repo.id,
      name: repo.name,
      description: repo.description,
      url: repo.url,
      readme: repo.readme || "README not available",
      owner: {
        login: repo.owner_login,
        avatar: repo.owner_avatar,
        url: repo.owner_url,
      },
      github: githubStats,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
