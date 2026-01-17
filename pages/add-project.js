// pages/add-project.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AddProject() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  // Check login state on client
  useEffect(() => {
    const token = localStorage.getItem("token"); // <-- use the same key as login.js
    const email = localStorage.getItem("email"); // optional, save email at login
    if (!token) router.replace("/login");
    else setUserEmail(email || "User");
  }, []);

  async function submit() {
    if (!url) return alert("Please enter a GitHub repo URL");
    setLoading(true);
    try {
      const res = await fetch("/api/repos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // <-- use login key
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) router.push("/dashboard");
      else alert(data.error || "Failed to index project");
    } catch (err) {
      setLoading(false);
      alert(err.message || "Error indexing project");
    }
  }

  const logout = () => {
    localStorage.removeItem("token"); // <-- remove login token
    localStorage.removeItem("email"); // <-- remove email if stored
    router.push("/login");
  };

  return (
    <>
      <script src="https://cdn.tailwindcss.com"></script>

      <div className="min-h-screen flex bg-gray-100">
        {/* SIDEBAR - Desktop */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r p-4">
          <div className="text-2xl font-bold mb-8">TPKG</div>
          <nav className="flex flex-col gap-3">
            <a href="/dashboard" className="px-3 py-2 rounded-md hover:bg-gray-200">
              Explore
            </a>
            <a href="/add-project" className="px-3 py-2 rounded-md bg-gray-200 font-semibold">
              Add Project
            </a>
            <a href="/dashboard/account" className="px-3 py-2 rounded-md hover:bg-gray-200">
              Account
            </a>
            <a href="/dashboard/settings" className="px-3 py-2 rounded-md hover:bg-gray-200">
              Settings
            </a>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* HEADER */}
          <header className="flex items-center justify-between px-6 py-4 border-b bg-white">
            <div className="text-lg font-bold">Add Project</div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Logged in as {userEmail}</span>
              <a
                href="/dashboard"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Dashboard
              </a>
              <button
                onClick={logout}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </header>

          {/* FORM */}
          <main className="flex-1 p-6 flex justify-center items-start">
            <div className="bg-white border border-gray-300 rounded-xl p-6 w-full max-w-md shadow-sm">
              <h1 className="text-xl font-semibold mb-4">Add GitHub Project</h1>

              <input
                className="w-full border border-gray-300 rounded-md p-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://github.com/user/repo"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />

              <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-md text-sm font-medium text-white"
              >
                {loading ? "Indexing..." : "Index Project"}
              </button>

              <p className="text-xs text-gray-500 mt-3">
                Repository must contain <code>tpkg.json</code>. Our system will fetch and index your project. Currently, we only manage **public GitHub repositories**.
                <br />
                To add your tool:
                <ol className="list-decimal ml-4 mt-1">
                  <li>Login to TPKG</li>
                  <li>Create a GitHub repository</li>
                  <li>Add a <code>tpkg.json</code> file (run <code>tpkg init</code> or create your own)</li>
                  <li>Paste your repo URL above and click "Index Project"</li>
                </ol>
              </p>
            </div>
          </main>

          {/* FOOTER */}
          <footer className="border-t bg-white px-6 py-4 text-sm text-gray-600 flex flex-col md:flex-row justify-between items-center">
            <span>© {new Date().getFullYear()} TPKG. All rights reserved.</span>
            <div className="mt-2 md:mt-0">
              <a
                href="https://opencollective.com/tpkg-projects"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black text-white px-3 py-1 rounded-md text-sm hover:bg-gray-800"
              >
                Donate
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
