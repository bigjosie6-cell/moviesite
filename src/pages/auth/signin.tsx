import { signIn } from "next-auth/react";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Head>
        <title>Sign In – Client Works</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="glass-card w-full max-w-md p-8 animate-fade-in">
          <h2 className="text-3xl font-display text-primary mb-6 text-center">Welcome Back</h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-surface-200 text-sm mb-1 text-gray-300">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-surface-200 text-sm mb-1 text-gray-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-accent text-white font-medium py-2 px-4 rounded-lg transition-colors mt-4 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
