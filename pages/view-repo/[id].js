import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export default function ViewRepo() {
  const router = useRouter();
  const { id } = router.query;

  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/view-repo?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setRepo(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;
  if (!repo) return null;

  return (
    <>
      {/* Tailwind + GitHub Markdown + Highlight.js */}
      <script src="https://cdn.tailwindcss.com"></script>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.2.0/github-markdown-light.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/github-dark.min.css"
      />

      <div className="min-h-screen flex bg-gray-50">
        {/* SIDEBAR */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r p-4 text-sm gap-2">
          <NavItem label="Explore" icon="homeassistant" onClick={() => router.push("/dashboard")} />
          <NavItem label="Add Project" icon="github" onClick={() => router.push("/add-project")} />
          <NavItem label="Account" icon="user" />
          <NavItem label="Settings" icon="settings" />
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* HEADER */}
          <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
            <div className="text-lg font-bold">{repo.name}</div>
            <div className="flex items-center gap-4 text-sm">
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                GitHub
              </a>
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Back
              </button>
            </div>
          </header>

          {/* REPO DETAILS */}
          <main className="flex-1 p-6 max-w-3xl mx-auto space-y-6">
            {/* Owner + Description */}
            <div className="flex items-center gap-4">
              <img src={repo.owner.avatar} alt="Owner avatar" className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold">{repo.owner.login}</p>
                <p className="text-gray-600">{repo.description || "No description provided"}</p>
              </div>
            </div>

            {/* GitHub Stats */}
            <div className="flex gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/star.svg" className="w-4 h-4" />
                {repo.github.stars}
              </span>
              <span className="flex items-center gap-1">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/fork.svg" className="w-4 h-4" />
                {repo.github.forks}
              </span>
              <span className="flex items-center gap-1">
                <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/eye.svg" className="w-4 h-4" />
                {repo.github.watchers}
              </span>
            </div>

            {/* README */}
            <div className="markdown-body max-w-none bg-white p-6 rounded-md shadow-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {repo.readme}
              </ReactMarkdown>
            </div>
          </main>

          {/* FOOTER */}
          <footer className="border-t bg-white px-6 py-4 text-sm text-gray-600 flex justify-between items-center">
            <span>© {new Date().getFullYear()} TPKG. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Docs</a>
            </div>
          </footer>
        </div>
      </div>

      {/* MOBILE NAV */}
      <div className="fixed bottom-0 left-0 right-0 h-[60px] bg-white border-t flex md:hidden justify-around items-center text-xs">
        <MobileNav label="Explore" icon="homeassistant" onClick={() => router.push("/dashboard")} />
        <MobileNav label="Add" icon="github" onClick={() => router.push("/add-project")} />
        <MobileNav label="Account" icon="user" />
        <MobileNav label="Settings" icon="settings" />
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
      <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${icon}.svg`} className="w-4 h-4" />
      {label}
    </button>
  );
}

function MobileNav({ label, icon, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1">
      <img src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${icon}.svg`} className="w-5 h-5" />
      {label}
    </button>
  );
}
