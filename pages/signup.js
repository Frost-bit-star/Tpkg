// pages/signup.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1️⃣ Register user
      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(registerData.error || "Signup failed");
        return;
      }

      // 2️⃣ Auto-login after successful signup
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setError(loginData.error || "Login after signup failed");
        return;
      }

      // 3️⃣ Store JWT
      localStorage.setItem("token", loginData.token);

      // 4️⃣ Redirect
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
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="p-2 rounded bg-gray-700 border border-gray-600"
          />

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
            className="bg-green-600 hover:bg-green-700 p-2 rounded"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
