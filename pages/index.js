// pages/index.js
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const fullText = "Build and share Termux tools";

  // Typewriter animation
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Check login state
  useEffect(() => {
    const token = localStorage.getItem("tpkg_token");
    if (token) {
      setLoggedIn(true);
      router.replace("/dashboard");
    }
  }, []);

  const copyInstall = () => {
    navigator.clipboard.writeText("apt install tpkg");
    alert("Copied: apt install tpkg");
  };

  return (
    <>
      <Head>
        <title>TPKG – Termux Package Manager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="font-[Poppins] bg-white min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b h-[60px] flex items-center px-4">
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/github.svg"
                className="w-6 h-6"
                alt="logo"
              />
              <span className="font-bold text-lg">TPKG</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden md:flex gap-6 text-sm font-semibold">
              <a href="#about" className="hover:text-gray-600">About</a>
              <a href="#install" className="hover:text-gray-600">Install</a>
              <a href="#usage" className="hover:text-gray-600">Usage</a>
              <a href="#features" className="hover:text-gray-600">Features</a>
            </nav>

            {/* Dropdown menu */}
            <div className="relative">
              <button
                className="flex items-center border px-4 py-2 rounded-md text-sm"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Menu
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                  <a href="#about" className="block px-4 py-2 hover:bg-gray-100">About</a>
                  <a href="#install" className="block px-4 py-2 hover:bg-gray-100">Install</a>
                  <a href="#usage" className="block px-4 py-2 hover:bg-gray-100">Usage</a>
                  <a href="#features" className="block px-4 py-2 hover:bg-gray-100">Features</a>
                  <a href="https://github.com/Frost-bit-star/tpkg" className="block px-4 py-2 hover:bg-gray-100">GitHub</a>
                  <a href="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Explore</a>
                  {!loggedIn && <a href="/login" className="block px-4 py-2 hover:bg-gray-100">Login</a>}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="pt-[80px] flex-1">
          {/* HERO */}
          <section className="px-6 py-20 text-center max-w-4xl mx-auto">
            <h1 className="mt-16 text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
              {typedText}
              <span className="border-r-4 border-gray-900 animate-pulse ml-1"></span>
            </h1>
            <p className="mt-6 text-gray-600 text-lg">
              TPKG is a lightweight package index for Termux CLI tools.
              Publish from GitHub. Install with one command.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/dashboard">
                <button className="bg-black text-white px-8 py-3 rounded-md font-semibold hover:bg-gray-800 transition">
                  Explore Packages
                </button>
              </a>
              <button
                onClick={copyInstall}
                className="border px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Copy Install Badge
              </button>
            </div>
          </section>

          {/* ABOUT */}
          <section id="about" className="px-6 py-16 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">What is TPKG?</h2>
            <p className="text-gray-700 leading-relaxed">
              TPKG is a GitHub-powered package manager for Termux.
              Developers publish tools using a simple <code>tpkg.json</code>,
              and users install them instantly without manual setup.
            </p>
          </section>

          {/* INSTALL */}
          <section id="install" className="bg-gray-50 px-6 py-16">
            <div className="max-w-5xl mx-auto flex flex-col items-center gap-4">
              <h2 className="text-3xl font-bold mb-2">Installation</h2>
              <div className="flex flex-col sm:flex-row gap-2 items-center w-full sm:w-auto">
                <pre className="bg-white border rounded-md p-4 font-mono text-sm overflow-x-auto">
apt install tpkg
                </pre>
                <button
                  onClick={copyInstall}
                  className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition"
                >
                  Copy
                </button>
              </div>
            </div>
          </section>

          {/* USAGE */}
          <section id="usage" className="px-6 py-16 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Usage</h2>
            <div className="bg-gray-50 border rounded-md p-4 overflow-x-auto">
              <pre className="font-mono text-sm">
{`# Initialize your repo
tpkg init  # creates a tpkg.json file

# Example tpkg.json
cat tpkg.json
{
  "name": "stackedge",
  "version": "0.1.0",
  "description": "stackedge tool allows Termux users to host websites on dark web without server",
  "author": "Frost-bit-star",
  "repo": "git@github.com:Frost-bit-star/tpkg-web.git",
  "install": "npm install -g stackedge",
  "installType": "command"
}

# Search and install tools
tpkg search toolname
tpkg install toolname`}
              </pre>
            </div>
          </section>

          {/* HOW TO ADD TOOLS */}
          <section id="add-tool" className="px-6 py-16 max-w-5xl mx-auto bg-white border rounded-md">
            <h2 className="text-3xl font-bold mb-4">Add Your Tool</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Developers can add their tools to TPKG by logging in, uploading the GitHub URL of the project, 
              and ensuring it contains a <code>tpkg.json</code>. Once submitted, our system will fetch the repo, 
              index it, and make it installable via <code>tpkg install toolname</code>. 
              Currently, we manage only **public GitHub repositories**.
            </p>
            <a href="/login">
              <button className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-800 transition">
                Login to Add Tool
              </button>
            </a>
          </section>

          {/* FEATURES */}
          <section id="features" className="bg-gray-50 px-6 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                ["Zero config", "Publish directly from GitHub"],
                ["Fast installs", "Minimal Termux overhead"],
                ["Verified repos", "tpkg.json validation"],
                ["Open index", "Public package discovery"],
              ].map(([title, desc]) => (
                <div key={title} className="border bg-white p-6 rounded-md">
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* FOOTER */}
        <footer className="border-t bg-white px-6 py-6 text-sm text-gray-600 mt-auto flex flex-col md:flex-row justify-between items-center">
          <span>© {new Date().getFullYear()} TPKG. All rights reserved.</span>
          <a
            href="https://opencollective.com/tpkg-projects"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 md:mt-0 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition"
          >
            Donate
          </a>
        </footer>
      </div>
    </>
  );
}
