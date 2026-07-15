import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Package, Star } from "lucide-react";

export function Alert({ type, message }: { type: "error" | "success"; message: string }) {
  const styles =
    type === "error"
      ? "bg-red-50 border-danger/40 text-danger"
      : "bg-emerald-50 border-success/40 text-success";
  const Icon = type === "error" ? AlertCircle : CheckCircle2;

  return (
    <div className={`mb-4 flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${styles}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function StockBadge({ quantity }: { quantity: number }) {
  if (quantity <= 0) {
    return <span className="badge bg-red-100 text-danger">Currently unavailable</span>;
  }
  if (quantity <= 5) {
    return <span className="badge bg-amber-100 text-amber-800">Only {quantity} left in stock</span>;
  }
  return <span className="badge bg-emerald-100 text-success">In Stock</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-emerald-100 text-success",
    PENDING: "bg-amber-100 text-amber-800",
    CANCELLED: "bg-red-100 text-danger",
  };
  return <span className={`badge ${map[status] || "bg-gray-100 text-muted"}`}>{status}</span>;
}

export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    ADMIN: "bg-nav text-white",
    SELLER: "bg-brand-orange/15 text-brand-orange-dark",
    CUSTOMER: "bg-gray-100 text-ink",
  };
  return <span className={`badge ${map[role] || "bg-gray-100 text-muted"}`}>{role}</span>;
}

export function StarRating({ rating, count }: { rating: number; count?: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-3.5 w-3.5 ${
              i < full
                ? "fill-brand-orange text-brand-orange"
                : i === full && hasHalf
                  ? "fill-brand-orange/50 text-brand-orange"
                  : "fill-line text-line"
            }`}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-link hover:text-brand-orange-dark">{count.toLocaleString()}</span>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  icon: Icon = Package,
  action,
}: {
  title: string;
  hint?: string;
  icon?: ComponentType<{ className?: string }>;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-20 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-paper">
        <Icon className="h-8 w-8 text-muted" />
      </div>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {hint && <p className="max-w-sm text-sm text-muted">{hint}</p>}
      {action}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="text-line">›</span>}
          {item.to ? (
            <Link to={item.to} className="hover:text-brand-orange-dark no-underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon?: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="card flex items-center gap-4 p-5">
      {Icon && (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
          <Icon className="h-5 w-5 text-brand-orange" />
        </div>
      )}
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 font-display text-xl font-bold text-ink">{value}</p>
      </div>
    </div>
  );
}
