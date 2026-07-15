import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Package, Receipt } from "lucide-react";
import api, { getErrorMessage } from "../api/api";
import type { Order } from "../types";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import { Alert, EmptyState, StatCard, StatusBadge } from "../components/ui";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Order[]>("/api/checkout/orders/me");
        setOrders(res.data);
        if (res.data.length > 0) setExpanded(res.data[0].id);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading label="Loading your orders" />;

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="page-container">
      <PageHeader
        title="Your Orders"
        subtitle="Track, return, or buy things again"
        breadcrumbs={[
          { label: "Markethub", to: "/products" },
          { label: "Your Orders" },
        ]}
      />

      {orders.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard label="Total orders" value={orders.length} icon={Package} />
          <StatCard label="Total spent" value={`SAR ${totalSpent.toFixed(2)}`} icon={Receipt} />
        </div>
      )}

      {error && <Alert type="error" message={error} />}

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          hint="Looks like you haven't placed any orders. When you do, they'll appear here."
          icon={Package}
          action={
            <Link to="/products" className="btn-amazon mt-2 font-semibold no-underline">
              Start shopping
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isOpen = expanded === order.id;
            return (
              <div key={order.id} className="card overflow-hidden animate-fade-in">
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 p-5 text-left hover:bg-paper/50"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-display font-bold text-ink">Order #{order.id}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      Placed on {new Date(order.createdAt).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="price-sm text-brand-orange-dark">
                      SAR {order.totalAmount.toFixed(2)}
                    </p>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-line bg-paper/30 px-5 py-4">
                    <p className="mb-3 text-sm font-semibold text-ink">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} in this order
                    </p>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-white p-4"
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-amber-50 to-orange-100">
                              <span className="font-display text-lg font-bold text-orange-600">
                                {item.productName.slice(0, 2).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-ink">{item.productName}</p>
                              <p className="text-xs text-muted">
                                Sold by {item.sellerUsername} · Qty: {item.quantity}
                              </p>
                              <p className="mt-1 text-xs text-success">Delivered</p>
                            </div>
                          </div>
                          <p className="price-sm">SAR {item.subtotal.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex justify-end border-t border-line pt-4">
                      <div className="text-right">
                        <p className="text-sm text-muted">Order total</p>
                        <p className="price-lg text-brand-orange-dark">
                          SAR {order.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
