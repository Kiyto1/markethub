import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, TrendingUp } from "lucide-react";
import api, { getErrorMessage } from "../api/api";
import type { SellerOrderItem } from "../types";
import Loading from "../components/Loading";
import PageHeader from "../components/PageHeader";
import { Alert, EmptyState, StatCard } from "../components/ui";

export default function SellerSoldItemsPage() {
  const [items, setItems] = useState<SellerOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<SellerOrderItem[]>("/api/seller/orders/sold-items");
        setItems(res.data);
      } catch (err: unknown) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Loading label="Loading sales history" />;

  const revenue = items.reduce((sum, i) => sum + i.subtotal, 0);
  const uniqueOrders = new Set(items.map((i) => i.orderId)).size;

  return (
    <div className="page-container">
      <PageHeader
        title="Sold Items"
        subtitle="Track every sale across your listings"
        breadcrumbs={[
          { label: "Markethub", to: "/products" },
          { label: "Seller Dashboard", to: "/seller" },
          { label: "Sold Items" },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Items sold" value={items.length} icon={ShoppingBag} />
        <StatCard label="Total orders" value={uniqueOrders} icon={TrendingUp} />
        <StatCard label="Total revenue" value={`SAR ${revenue.toFixed(2)}`} icon={DollarSign} />
      </div>

      {error && <Alert type="error" message={error} />}

      {items.length === 0 ? (
        <EmptyState
          title="No sales yet"
          hint="When customers purchase your products, sales will appear here."
          icon={ShoppingBag}
        />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-paper/50 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Unit price</th>
                <th className="px-5 py-3">Qty</th>
                <th className="px-5 py-3">Subtotal</th>
                <th className="px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-paper/30">
                  <td className="px-5 py-3">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-ink">
                      #{item.orderId}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink">{item.customerUsername}</td>
                  <td className="px-5 py-3 font-medium text-ink">{item.productName}</td>
                  <td className="px-5 py-3">SAR {item.unitPrice.toFixed(2)}</td>
                  <td className="px-5 py-3">{item.quantity}</td>
                  <td className="px-5 py-3 font-semibold text-brand-orange-dark">
                    SAR {item.subtotal.toFixed(2)}
                  </td>
                  <td className="px-5 py-3 text-xs text-muted">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
