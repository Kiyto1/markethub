import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Search,
  ShoppingCart,
  Store,
  User,
  Wallet,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
import type { CartItem } from "../types";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    if (user?.role !== "CUSTOMER") {
      setCartCount(0);
      return;
    }
    api
      .get<CartItem[]>("/api/cart/me")
      .then((res) => setCartCount(res.data.reduce((s, i) => s + i.quantity, 0)))
      .catch(() => setCartCount(0));
  }, [user?.role, location.pathname]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
  }

  const subLink = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap px-3 py-2 text-sm transition-colors hover:outline hover:outline-1 hover:outline-white/30 ${
      isActive ? "font-semibold text-white" : "text-white/90"
    }`;

  return (
    <header className="sticky top-0 z-50 shadow-nav">
      {/* Main bar */}
      <div className="bg-nav">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2 py-1 hover:no-underline">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-yellow text-nav">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-display text-lg font-extrabold tracking-tight text-white sm:block">
              market<span className="text-brand-yellow">hub</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 text-white sm:flex">
            <MapPin className="h-4 w-4 text-white/70" />
            <div className="text-xs leading-tight">
              <p className="text-white/60">Shopping from</p>
              <p className="font-semibold text-white">Saudi Arabia</p>
            </div>
          </div>

          {isAuthenticated && (
            <form onSubmit={handleSearch} className="mx-1 flex flex-1 items-stretch">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your next find"
                className="flex-1 rounded-l-md border-0 px-4 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-brand-orange"
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-r-xl bg-brand-yellow px-4 text-nav hover:bg-brand-yellow-hover"
              >
                <Search className="h-5 w-5 text-ink" />
              </button>
            </form>
          )}

          <div className="flex items-center gap-1 sm:gap-3">
            {isAuthenticated && user ? (
              <>
                <div className="group relative hidden sm:block">
                  <button className="flex items-center gap-1 rounded px-2 py-1 text-left text-white hover:outline hover:outline-1 hover:outline-white/30">
                    <div>
                      <p className="text-xs text-white/70">Hello, {user.username}</p>
                      <p className="flex items-center gap-0.5 text-sm font-semibold">
                        Account <ChevronDown className="h-3 w-3" />
                      </p>
                    </div>
                  </button>
                  <div className="invisible absolute right-0 top-full z-50 w-52 rounded-md border border-line bg-white py-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                    <div className="border-b border-line px-4 py-2">
                      <p className="text-xs text-muted">Signed in as</p>
                      <p className="text-sm font-semibold text-ink">{user.username}</p>
                      <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-muted">
                        {user.role}
                      </span>
                    </div>
                    {user.role === "CUSTOMER" && (
                      <>
                        <Link to="/orders" className="block px-4 py-2 text-sm text-ink hover:bg-paper no-underline">
                          Your Orders
                        </Link>
                        <Link to="/wallet" className="block px-4 py-2 text-sm text-ink hover:bg-paper no-underline">
                          Your Wallet
                        </Link>
                      </>
                    )}
                    {user.role === "SELLER" && (
                      <Link to="/seller" className="block px-4 py-2 text-sm text-ink hover:bg-paper no-underline">
                        Seller Dashboard
                      </Link>
                    )}
                    {user.role === "ADMIN" && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-ink hover:bg-paper no-underline">
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>

                {user.role === "CUSTOMER" && (
                  <Link
                    to="/cart"
                    className="relative flex items-end gap-1 rounded px-2 py-1 text-white hover:outline hover:outline-1 hover:outline-white/30 no-underline"
                  >
                    <div className="relative">
                      <ShoppingCart className="h-7 w-7" />
                      {cartCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-ink">
                          {cartCount > 99 ? "99+" : cartCount}
                        </span>
                      )}
                    </div>
                    <span className="hidden font-semibold lg:block">Bag</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded px-3 py-1.5 text-sm font-semibold text-white hover:outline hover:outline-1 hover:outline-white/30 no-underline"
                >
                  Sign in
                </Link>
                <Link to="/register" className="btn-amazon hidden text-xs sm:inline-flex">
                  New customer? Start here
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sub nav */}
      {isAuthenticated && (
        <div className="bg-nav-secondary">
          <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5 sm:px-6">
            <NavLink to="/products" className={subLink}>
              <span className="flex items-center gap-1.5">
                <Package className="h-4 w-4" />
                Explore
              </span>
            </NavLink>

            {user?.role === "CUSTOMER" && (
              <>
                <NavLink to="/cart" className={subLink}>Your bag</NavLink>
                <NavLink to="/wallet" className={subLink}>
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-4 w-4" />
                    Wallet
                  </span>
                </NavLink>
                <NavLink to="/orders" className={subLink}>Purchases</NavLink>
              </>
            )}

            {user?.role === "SELLER" && (
              <>
                <NavLink to="/seller" className={subLink}>
                  <span className="flex items-center gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    Seller Dashboard
                  </span>
                </NavLink>
                <NavLink to="/seller/sold-items" className={subLink}>Sold Items</NavLink>
              </>
            )}

            {user?.role === "ADMIN" && (
              <NavLink to="/admin" className={subLink}>
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  Admin Panel
                </span>
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
