// pages/login.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Save token to localStorage or cookie
      localStorage.setItem("token", data.token);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="max-w-md w-full p-6 bg-gray-800 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="flex flex-col gap-4 mb-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 border border-gray-600"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 border border-gray-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 p-2 rounded mt-2"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
