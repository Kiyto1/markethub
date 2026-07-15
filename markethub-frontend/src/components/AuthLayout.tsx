import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Shield, ShoppingBag, Store, Truck, Zap } from "lucide-react";

const features = [
  { icon: Truck, text: "Fast wallet checkout" },
  { icon: Shield, text: "Secure payments" },
  { icon: Zap, text: "Real-time inventory" },
  { icon: ShoppingBag, text: "Thousands of products" },
];

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-paper lg:flex-row">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-nav lg:flex lg:w-[45%] lg:flex-col lg:justify-between lg:px-12 lg:py-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-brand-orange/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-orange/10 blur-3xl" />

        <Link to="/" className="relative flex items-center gap-2 hover:no-underline">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange">
            <Store className="h-6 w-6 text-white" />
          </div>
          <span className="font-display text-2xl font-extrabold text-white">
            Market<span className="text-brand-orange">hub</span>
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-orange">
            Your marketplace, upgraded
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white">
            Shop smarter. Sell faster. Manage everything.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Browse thousands of products, checkout with your wallet in seconds,
            and manage your store — all in one place.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3">
                <Icon className="h-5 w-5 shrink-0 text-brand-orange" />
                <span className="text-sm text-white/80">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/40">
          Trusted by customers, sellers, and admins worldwide.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-12">
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-brand-orange">
            <Store className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-extrabold text-ink">
            Market<span className="text-brand-orange">hub</span>
          </span>
        </div>
        <div className="mx-auto w-full max-w-md">
          <div className="card p-8 shadow-card-hover">{children}</div>
        </div>
      </div>
    </div>
  );
}
