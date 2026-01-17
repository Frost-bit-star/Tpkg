import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/trending")
      .then(res => res.json())
      .then(setRepos)
      .catch(err => console.error("Failed to fetch trending repos:", err));
  }, []);

  const filtered = repos.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  // Map of valid icons in case some don't exist
  const validIcons = [
    "homeassistant", "github", "user", "settings", "star", "fork", "eye"
  ];

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="min-h-screen bg-white flex flex-col">
        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 h-[60px] z-50 bg-white border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg"
              className="w-6 h-6"
            />
            <span className="font-semibold text-lg">TPKG</span>
          </div>

          <input
            className="bg-gray-100 rounded-full px-4 py-2 text-sm w-[180px] focus:w-[260px] transition-all outline-none"
            placeholder="Search packages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className="hidden sm:flex items-center gap-4 text-sm">
            <button onClick={() => router.push("/account")}>Account</button>
            <button onClick={() => router.push("/settings")}>Settings</button>
            <button
              onClick={() => router.push("/add-project")}
              className="bg-black text-white px-4 py-2 rounded-md"
            >
              Add Project
            </button>
          </div>
        </header>

        {/* BODY */}
        <div className="flex flex-1 pt-[60px]">
          {/* SIDEBAR (DESKTOP) */}
          <aside className="hidden md:flex w-[240px] border-r bg-white flex-col p-4 gap-2 text-sm">
            <NavItem label="Explore" icon="homeassistant" onClick={() => router.push("/dashboard")} />
            <NavItem label="Add Project" icon="github" onClick={() => router.push("/add-project")} />
            <NavItem label="Account" icon="user" />
            <NavItem label="Settings" icon="settings" />
          </aside>

          {/* MAIN CONTENT */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto p-4 space-y-4">
              {filtered.map(repo => (
                <div
                  key={repo.id}
                  onClick={() => router.push(`/view-repo/${repo.id}`)} // ✅ Correct dynamic route
                  className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={repo.owner_avatar}
                      className="w-10 h-10 rounded-full"
                      alt={`${repo.owner_login} avatar`}
                    />
                    <div>
                      <h3 className="font-semibold">{repo.name}</h3>
                      <p className="text-sm text-gray-600">
                        {repo.description || "No description provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 mt-3 text-sm text-gray-500">
                    <span>Stars {repo.stars}</span>
                    <span>Forks {repo.forks}</span>
                    <span className="flex items-center gap-1">
                      <img
                        src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg"
                        className="w-4 h-4"
                        alt="owner"
                      />
                      {repo.owner_login}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* FOOTER */}
        <footer className="border-t bg-white text-sm text-gray-500 px-4 py-3 flex justify-between items-center">
          <span>© {new Date().getFullYear()} TPKG. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Docs</a>
          </div>
        </footer>

        {/* MOBILE NAV */}
        <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t flex md:hidden justify-around items-center text-xs">
          <MobileNav label="Explore" icon="homeassistant" onClick={() => router.push("/dashboard")} />
          <MobileNav label="Add" icon="github" onClick={() => router.push("/add-project")} />
          <MobileNav label="Account" icon="user" />
          <MobileNav label="Settings" icon="settings" />
        </div>
      </div>
    </>
  );
}

/* ---------- Components ---------- */
function NavItem({ label, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-100"
    >
      <img
        src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${icon}.svg`}
        className="w-4 h-4"
        alt={icon}
        onError={(e) => { e.currentTarget.src = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg"; }}
      />
      {label}
    </button>
  );
}

function MobileNav({ label, icon, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <img
        src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${icon}.svg`}
        className="w-5 h-5"
        alt={icon}
        onError={(e) => { e.currentTarget.src = "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg"; }}
      />
      {label}
    </button>
  );
}
