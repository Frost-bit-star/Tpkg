// pages/auth/signin.js
import { getProviders, signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";

export default function SignIn({ providers }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Login using Credentials provider
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        setError(result.error);
      } else {
        // Redirect after login
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl mb-6 font-bold">Sign In</h1>

      {/* Email / Password Login */}
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-md mb-6">
        {error && <p className="text-red-500">{error}</p>}
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
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mb-4">Or sign in with:</p>

      {/* External Providers (Google, etc.) */}
      {providers &&
        Object.values(providers)
          .filter((p) => p.name !== "Credentials")
          .map((provider) => (
            <button
              key={provider.name}
              onClick={() => signIn(provider.id)}
              className="w-full max-w-md bg-blue-600 hover:bg-blue-700 p-2 rounded mb-2"
            >
              Sign in with {provider.name}
            </button>
          ))}
    </div>
  );
}

// Fetch providers at request time
export async function getServerSideProps() {
  const providers = await getProviders();
  return { props: { providers } };
}
