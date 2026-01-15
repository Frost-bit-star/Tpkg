// pages/index.js
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>TPKG - Termux Package Manager</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <body className="font-poppins bg-white">
        {/* Header */}
        <header className="border-b border-gray-200">
          {/* Upper header */}
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center space-x-2">
              <img src="/images/black-heart.png" alt="Logo" className="w-5" />
              <span className="font-bold text-xl">TPKG</span>
            </div>
            <nav className="w-[600px]">
              <ul className="flex justify-between">
                <li><a href="#about" className="hover:bg-gray-200 px-2 py-1 rounded font-bold">About</a></li>
                <li><a href="#install" className="hover:bg-gray-200 px-2 py-1 rounded font-bold">Install</a></li>
                <li><a href="#usage" className="hover:bg-gray-200 px-2 py-1 rounded font-bold">Usage</a></li>
                <li><a href="#publish" className="hover:bg-gray-200 px-2 py-1 rounded font-bold">Publish</a></li>
                <li><a href="#features" className="hover:bg-gray-200 px-2 py-1 rounded font-bold">Features</a></li>
                <li><a href="#contact" className="hover:bg-gray-200 px-2 py-1 rounded font-bold">Contact</a></li>
              </ul>
            </nav>
          </div>

          {/* Lower header */}
          <div className="flex justify-between items-center px-6 py-4">
            <img src="/images/npm-logo.png" alt="TPKG Logo" className="w-16" />
            <form className="flex flex-1 mx-6">
              <label htmlFor="search" className="flex items-center bg-gray-100 p-2 cursor-pointer">
                <img src="/images/magnifying-glass.png" alt="Search" className="w-5 h-5" />
              </label>
              <input
                type="search"
                id="search"
                placeholder="Search tools"
                className="flex-1 p-2 border-none focus:outline-none bg-gray-100 font-bold"
              />
              <button className="px-4 bg-red-600 text-white font-bold hover:bg-red-800">Search</button>
            </form>
            <div className="flex space-x-2">
              <a href="#join" className="border border-black px-4 py-2 font-bold hover:bg-gray-200">Join</a>
              <a href="#login" className="bg-black text-white px-4 py-2 font-bold hover:bg-gray-800">Log In</a>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section id="hero" className="bg-red-100 min-h-[600px] flex flex-col items-center justify-center text-center px-6">
          <h1 className="mt-24 text-[70px] font-extrabold">Build amazing Termux tools</h1>
          <p className="mt-6 w-[500px] text-lg font-bold leading-relaxed">
            TPKG is a Termux-focused package manager that allows you to distribute, install, and manage CLI tools efficiently.
          </p>
          <div className="mt-16 flex space-x-4">
            <a href="#install">
              <button className="bg-red-600 text-white font-bold px-10 py-3 shadow-[8px_8px_0_rgba(251,59,73,0.2)] hover:bg-red-700 hover:shadow-[9px_9px_0_rgba(251,59,73,0.3)]">Install Now</button>
            </a>
            <a href="#usage">
              <button className="bg-white text-black font-bold px-10 py-3 hover:bg-gray-300">Usage Guide</button>
            </a>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="bg-white min-h-[400px] flex flex-col items-center justify-center text-center px-6 py-12">
          <h2 className="text-4xl font-bold mb-4">What is TPKG?</h2>
          <p className="w-[700px] text-lg font-bold leading-relaxed">
            TPKG is a Termux Package Manager designed for CLI scripts and tools. It allows developers to easily publish, share, and install tools without complex manual setups.
          </p>
        </section>

        {/* Installation Section */}
        <section id="install" className="bg-gray-50 min-h-[400px] flex flex-col items-center justify-center text-center px-6 py-12">
          <h2 className="text-4xl font-bold mb-4">Installation</h2>
          <p className="w-[700px] text-lg font-bold leading-relaxed mb-6">Install TPKG in Termux with a single command:</p>
          <pre className="bg-gray-200 p-4 rounded font-mono w-[400px] mb-6">apt install tpkg</pre>
        </section>

        {/* Usage Section */}
        <section id="usage" className="bg-white min-h-[500px] flex flex-col items-center justify-center text-center px-6 py-12">
          <h2 className="text-4xl font-bold mb-4">Usage</h2>
          <p className="w-[700px] text-lg font-bold leading-relaxed mb-6">
            Once installed, you can install, search, or publish tools with TPKG:
          </p>
          <div className="w-[700px] text-left font-mono space-y-3">
            <pre>tpkg install toolname   # Install a tool</pre>
            <pre>tpkg search toolname    # Search for a tool</pre>
            <pre>tpkg init               # Generate tpkg.json for your repo</pre>
            <pre>tpkg publish            # Publish your tool (coming soon)</pre>
          </div>
          <p className="w-[700px] text-lg font-bold leading-relaxed mt-6">
            If your script has dependencies, include an <code>install.sh</code> at the root of your repo.
          </p>
        </section>

        {/* Publishing Section */}
        <section id="publish" className="bg-gray-50 min-h-[400px] flex flex-col items-center justify-center text-center px-6 py-12">
          <h2 className="text-4xl font-bold mb-4">Publishing Your Tool</h2>
          <p className="w-[700px] text-lg font-bold leading-relaxed mb-6">
            To publish your tool: create a GitHub repo → run <code>tpkg init</code> → upload your repo URL → others can install it via <code>tpkg install toolname</code>.
          </p>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white min-h-[600px] flex flex-col items-center justify-center text-center px-6 py-12">
          <h2 className="text-4xl font-bold mb-12">Features</h2>
          <div className="flex flex-wrap justify-center gap-6 max-w-6xl">
            <div className="flex-1 min-w-[250px] border p-6 text-left">
              <img src="/images/zero-configuration.svg" className="w-12 mb-4" alt="Zero config" />
              <h3 className="text-red-600 font-bold text-lg mb-2">Zero Configuration</h3>
              <p>Create an org, add your team, and start collaborating. Nothing to configure or manage.</p>
            </div>
            <div className="flex-1 min-w-[250px] border p-6 text-left">
              <img src="/images/team-management.svg" className="w-12 mb-4" alt="Team management" />
              <h3 className="text-red-600 font-bold text-lg mb-2">Team Management</h3>
              <p>Control access to modules using simple team management features.</p>
            </div>
            <div className="flex-1 min-w-[250px] border p-6 text-left">
              <img src="/images/familiar-features.svg" className="w-12 mb-4" alt="Familiar features" />
              <h3 className="text-red-600 font-bold text-lg mb-2">Familiar Features</h3>
              <p>TPKG provides parity with public Termux repo features your developers already use.</p>
            </div>
            <div className="flex-1 min-w-[250px] border p-6 text-left">
              <img src="/images/npm-audit.svg" className="w-12 mb-4" alt="Audit" />
              <h3 className="text-red-600 font-bold text-lg mb-2">TPKG Audit</h3>
              <p>Secure installations with automatic safety checks. Track forks, stars, and usage.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="bg-gray-50 py-12 text-center">
          <a href="#join" className="">
            <button className="bg-black text-white font-bold text-lg px-20 py-4 shadow-[8px_8px_0_rgba(128,83,35,0.2)] hover:bg-gray-800 hover:shadow-[8px_8px_0_rgba(128,83,35,0.3)]">
              Get Started
            </button>
          </a>
        </section>

        {/* Footer */}
        <footer id="contact" className="bg-gray-100 text-center py-6">
          <div className="mb-4 font-bold text-lg">TPKG - Termux Package Manager</div>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#about" className="hover:underline">About</a>
            <a href="#install" className="hover:underline">Install</a>
            <a href="#usage" className="hover:underline">Usage</a>
            <a href="#publish" className="hover:underline">Publish</a>
            <a href="https://github.com/Frost-bit-star/tpkg" className="hover:underline">GitHub</a>
          </div>
          <div className="text-sm text-gray-600">© 2026 termux 0ackages · Email: morganmilstone983@gmail.com</div>
        </footer>
      </body>
    </>
  );
}
