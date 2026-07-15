import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Minus, Plus, ShieldCheck, ShoppingCart, Trash2 } from "lucide-react";
import api, { getErrorMessage } from "../api/api";
import type { CartItem } from "../types";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import { Alert, EmptyState } from "../components/ui";

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<CartItem[]>("/api/cart/me");
      setItems(res.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(id: number, quantity: number) {
    if (quantity < 1) return;
    setError("");
    try {
      await api.put(`/api/cart/items/${id}`, { quantity });
      load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }

  async function removeItem(id: number) {
    setError("");
    try {
      await api.delete(`/api/cart/items/${id}`);
      load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }

  async function clearCart() {
    setError("");
    try {
      await api.delete("/api/cart/me");
      load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }

  async function checkout() {
    setCheckingOut(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/checkout");
      setSuccess("Order placed successfully!");
      await load();
      setTimeout(() => navigate("/orders"), 1500);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setCheckingOut(false);
    }
  }

  const total = items.reduce((sum, i) => sum + i.subtotal, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (loading) return <Loading label="Loading your cart" />;

  return (
    <div className="page-container">
      <PageHeader
        title="Shopping Cart"
        subtitle={itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? "s" : ""} in your cart` : undefined}
        breadcrumbs={[
          { label: "Markethub", to: "/products" },
          { label: "Shopping Cart" },
        ]}
      />

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {items.length === 0 ? (
        <EmptyState
          title="Your Markethub Cart is empty"
          hint="Your shopping cart is waiting. Give it purpose — fill it with products you love."
          icon={ShoppingCart}
          action={
            <Link to="/products" className="btn-amazon mt-2 font-semibold no-underline">
              Shop today's deals
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Items */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">
                Price ({itemCount} item{itemCount !== 1 ? "s" : ""})
              </h2>
              <button onClick={clearCart} className="text-sm text-link hover:text-brand-orange-dark">
                Deselect all items
              </button>
            </div>

            <div className="card divide-y divide-line">
              {items.map((item) => (
                <div key={item.id} className="flex flex-wrap items-start gap-4 p-5 sm:flex-nowrap">
                  <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 to-blue-200">
                    <span className="font-display text-2xl font-bold text-blue-600">
                      {item.productName.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink hover:text-brand-orange-dark">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-xs text-success">In Stock</p>
                    <p className="mt-1 text-xs text-muted">Ships from Markethub</p>

                    <div className="mt-3 flex flex-wrap items-center gap-4">
                      <div className="flex items-center rounded-lg border border-line">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center hover:bg-paper"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center hover:bg-paper"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1 text-sm text-link hover:text-danger"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="price-sm">SAR {item.subtotal.toFixed(2)}</p>
                    {item.quantity > 1 && (
                      <p className="mt-0.5 text-xs text-muted">
                        SAR {item.unitPrice.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-right text-2xl font-display font-bold text-ink">
              Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""}):{" "}
              <span className="text-brand-orange-dark">SAR {total.toFixed(2)}</span>
            </p>
          </div>

          {/* Order summary */}
          <div className="lg:sticky lg:top-36 lg:self-start">
            <div className="card p-5">
              <p className="text-lg text-ink">
                Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""}):
              </p>
              <p className="mt-1 price-lg text-brand-orange-dark">SAR {total.toFixed(2)}</p>

              <button
                onClick={checkout}
                disabled={checkingOut}
                className="btn-amazon mt-4 w-full font-semibold"
              >
                {checkingOut ? "Processing…" : "Proceed to checkout"}
              </button>

              <div className="mt-4 space-y-2 border-t border-line pt-4">
                <p className="flex items-center gap-2 text-xs text-muted">
                  <Lock className="h-3.5 w-3.5 text-success" />
                  Secure transaction
                </p>
                <p className="flex items-center gap-2 text-xs text-muted">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Paid from your wallet balance
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
