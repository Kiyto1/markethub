import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Store } from "lucide-react";
import api, { getErrorMessage } from "../api/api";
import { Alert } from "../components/ui";
import type { Role } from "../types";
import AuthLayout from "../components/AuthLayout";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/register", { username, email, password, role });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h2 className="font-display text-2xl font-bold text-ink">Create account</h2>
      <p className="mt-1 text-sm text-muted">Join Markethub as a buyer or seller</p>

      <form onSubmit={handleSubmit} className="mt-6">
        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message="Account created! Redirecting to sign in…" />}

        <label className="label" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          className="input mb-4"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="input mb-4"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="input mb-4"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="label">I want to</label>
        <div className="mb-6 grid grid-cols-2 gap-3">
          {(["CUSTOMER", "SELLER"] as Role[]).map((r) => {
            const Icon = r === "CUSTOMER" ? ShoppingBag : Store;
            const selected = role === r;
            return (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`flex flex-col items-center gap-2 rounded-lg border-2 px-3 py-4 text-center transition-all ${
                  selected
                    ? "border-brand-orange bg-brand-orange/5 shadow-sm"
                    : "border-line hover:border-brand-orange/40"
                }`}
              >
                <Icon className={`h-6 w-6 ${selected ? "text-brand-orange" : "text-muted"}`} />
                <span className={`text-sm font-semibold ${selected ? "text-ink" : "text-muted"}`}>
                  {r === "CUSTOMER" ? "Shop" : "Sell"}
                </span>
                <span className="text-xs text-muted">
                  {r === "CUSTOMER" ? "Browse & buy" : "List products"}
                </span>
              </button>
            );
          })}
        </div>

        <button type="submit" className="btn-amazon w-full font-semibold" disabled={loading}>
          {loading ? "Creating account…" : "Create your Markethub account"}
        </button>
      </form>

      <div className="mt-6 border-t border-line pt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-link no-underline hover:text-brand-orange-dark">
          Sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
