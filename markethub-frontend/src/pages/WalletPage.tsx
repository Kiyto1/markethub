import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { CreditCard, Plus, Shield, Wallet as WalletIcon } from "lucide-react";
import api, { getErrorMessage } from "../api/api";
import type { Wallet } from "../types";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import { Alert } from "../components/ui";

const quickAmounts = [50, 100, 250, 500];

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<Wallet>("/api/wallets/me");
      setWallet(res.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFunds(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await api.post("/api/wallets/me/funds", { amount: Number(amount) });
      setSuccess("Funds added successfully!");
      setAmount("");
      load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading label="Loading wallet" />;

  const whole = Math.floor(wallet?.balance ?? 0);
  const cents = Math.round(((wallet?.balance ?? 0) - whole) * 100);

  return (
    <div className="page-container">
      <PageHeader
        title="Your Wallet"
        subtitle="Manage your balance for fast checkout"
        breadcrumbs={[
          { label: "Markethub", to: "/products" },
          { label: "Your Wallet" },
        ]}
      />

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* Balance card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-nav via-nav-secondary to-nav p-8 text-white shadow-card-hover">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-orange/20 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-orange">
                <WalletIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/60">Available balance</p>
                <p className="text-xs text-white/40">Wallet #{wallet?.walletId}</p>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-1">
              <span className="mt-2 text-lg font-medium">SAR</span>
              <span className="font-display text-5xl font-bold tracking-tight">{whole}</span>
              <span className="mt-2 text-lg font-medium">{String(cents).padStart(2, "0")}</span>
            </div>

            <p className="mt-4 text-sm text-white/50">
              Account: {wallet?.customerUsername}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/products" className="btn-amazon text-sm font-semibold no-underline">
                Shop now
              </Link>
              <Link to="/orders" className="btn-dark text-sm no-underline">
                View orders
              </Link>
            </div>
          </div>
        </div>

        {/* Add funds */}
        <div className="card p-6">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-brand-orange" />
            <h2 className="font-display text-lg font-bold text-ink">Add funds</h2>
          </div>
          <p className="mt-1 text-sm text-muted">Top up your wallet for instant checkout</p>

          <form onSubmit={handleAddFunds} className="mt-5">
            <label className="label" htmlFor="amount">
              Amount (SAR)
            </label>
            <input
              id="amount"
              type="number"
              min={1}
              step="0.01"
              className="input mb-3"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <div className="mb-4 flex flex-wrap gap-2">
              {quickAmounts.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAmount(String(a))}
                  className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink hover:border-brand-orange hover:bg-brand-orange/5"
                >
                  SAR {a}
                </button>
              ))}
            </div>

            <button type="submit" className="btn-amazon w-full font-semibold" disabled={submitting}>
              <Plus className="h-4 w-4" />
              {submitting ? "Adding…" : "Add funds"}
            </button>
          </form>

          <p className="mt-4 flex items-center gap-2 text-xs text-muted">
            <Shield className="h-3.5 w-3.5 text-success" />
            Demo mode — funds are added instantly for testing
          </p>
        </div>
      </div>
    </div>
  );
}
