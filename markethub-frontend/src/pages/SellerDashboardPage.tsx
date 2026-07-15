import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Box, DollarSign, Package, Pencil, Plus, Trash2 } from "lucide-react";
import api, { getErrorMessage } from "../api/api";
import type { Product } from "../types";
import { TableSkeleton } from "../components/Loading";
import PageHeader from "../components/PageHeader";
import { Alert, EmptyState, StatCard, StockBadge } from "../components/ui";

interface FormState {
  name: string;
  price: string;
  quantity: string;
}

const emptyForm: FormState = { name: "", price: "", quantity: "" };

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<Product[]>("/api/products/mine");
      setProducts(res.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), quantity: String(p.quantity) });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    const body = { name: form.name, price: Number(form.price), quantity: Number(form.quantity) };
    try {
      if (editingId) {
        await api.put(`/api/products/${editingId}`, body);
        setSuccess("Product updated successfully.");
      } else {
        await api.post("/api/products", body);
        setSuccess("Product listed successfully!");
      }
      cancelEdit();
      load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    setError("");
    try {
      await api.delete(`/api/products/${id}`);
      load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }

  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const inventoryValue = products.reduce((sum, p) => sum + p.quantity * p.price, 0);

  return (
    <div className="page-container">
      <PageHeader
        title="Seller Dashboard"
        subtitle="Manage your product listings and inventory"
        breadcrumbs={[
          { label: "Markethub", to: "/products" },
          { label: "Seller Dashboard" },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Active listings" value={products.length} icon={Package} />
        <StatCard label="Units in stock" value={totalStock} icon={Box} />
        <StatCard label="Inventory value" value={`SAR ${inventoryValue.toFixed(0)}`} icon={DollarSign} />
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
        <form onSubmit={handleSubmit} className="card h-fit p-6">
          <div className="flex items-center gap-2">
            {editingId ? (
              <Pencil className="h-5 w-5 text-brand-orange" />
            ) : (
              <Plus className="h-5 w-5 text-brand-orange" />
            )}
            <h2 className="font-display text-lg font-bold text-ink">
              {editingId ? `Edit product #${editingId}` : "Add new product"}
            </h2>
          </div>

          <label className="label mt-5">Product name</label>
          <input
            className="input mb-4"
            placeholder="e.g. Wireless Headphones"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <label className="label">Price (SAR)</label>
          <input
            type="number"
            min={0}
            step="0.01"
            className="input mb-4"
            placeholder="0.00"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <label className="label">Stock quantity</label>
          <input
            type="number"
            min={0}
            className="input mb-6"
            placeholder="0"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            required
          />

          <div className="flex gap-2">
            <button type="submit" className="btn-amazon flex-1 font-semibold" disabled={submitting}>
              {submitting ? "Saving…" : editingId ? "Save changes" : "List product"}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>

        <div>
          {loading ? (
            <TableSkeleton rows={4} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products listed yet"
              hint="Use the form to create your first listing and start selling."
              icon={Package}
            />
          ) : (
            <div className="card overflow-hidden">
              <div className="border-b border-line bg-paper/50 px-5 py-3">
                <h3 className="font-display font-bold text-ink">Your listings</h3>
              </div>
              <div className="divide-y divide-line">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 hover:bg-paper/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-violet-50 to-purple-100">
                        <span className="font-display font-bold text-purple-600">
                          {p.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-ink">{p.name}</p>
                        <p className="price-sm text-brand-orange-dark">SAR {p.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <StockBadge quantity={p.quantity} />
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(p)} className="btn-secondary text-xs">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="btn-danger text-xs">
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
