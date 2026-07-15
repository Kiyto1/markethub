import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/api";
import { Alert } from "../components/ui";
import AuthLayout from "../components/AuthLayout";

export default function LoginPage() {
  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(usernameOrEmail, password);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h2 className="font-display text-2xl font-bold text-ink">Sign in</h2>
      <p className="mt-1 text-sm text-muted">Welcome back to Markethub</p>

      <form onSubmit={handleSubmit} className="mt-6">
        {error && <Alert type="error" message={error} />}

        <label className="label" htmlFor="usernameOrEmail">
          Email or username
        </label>
        <input
          id="usernameOrEmail"
          className="input mb-4"
          placeholder="Enter your email or username"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          required
          autoComplete="username"
        />

        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="input mb-2"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <p className="mb-6 text-right text-xs text-link">Forgot password?</p>

        <button type="submit" className="btn-amazon w-full font-semibold" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-6 border-t border-line pt-6 text-center text-sm text-muted">
        New to Markethub?{" "}
        <Link to="/register" className="font-semibold text-link no-underline hover:text-brand-orange-dark">
          Create your account
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        By signing in, you agree to Markethub's Conditions of Use.
      </p>
    </AuthLayout>
  );
}
