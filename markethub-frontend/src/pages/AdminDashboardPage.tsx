import { useEffect, useState } from "react";
import { Package, Shield, Trash2, Users } from "lucide-react";
import api, { getErrorMessage } from "../api/api";
import type { Product, User } from "../types";
import { TableSkeleton } from "../components/Loading";
import PageHeader from "../components/PageHeader";
import { Alert, EmptyState, RoleBadge, StatCard } from "../components/ui";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"users" | "products">("users");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [usersRes, productsRes] = await Promise.all([
        api.get<User[]>("/api/admin/users"),
        api.get<Product[]>("/api/admin/products"),
      ]);
      setUsers(usersRes.data);
      setProducts(productsRes.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(user: User) {
    setError("");
    try {
      const action = user.active ? "deactivate" : "activate";
      await api.put(`/api/admin/users/${user.id}/${action}`);
      load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }

  async function deleteProduct(id: number) {
    setError("");
    try {
      await api.delete(`/api/admin/products/${id}`);
      load();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    }
  }

  const activeUsers = users.filter((u) => u.active).length;

  return (
    <div className="page-container">
      <PageHeader
        title="Admin Panel"
        subtitle="Manage users and products across Markethub"
        breadcrumbs={[
          { label: "Markethub", to: "/products" },
          { label: "Admin Panel" },
        ]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={users.length} icon={Users} />
        <StatCard label="Active users" value={activeUsers} icon={Shield} />
        <StatCard label="Total products" value={products.length} icon={Package} />
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="mb-4 flex gap-1 rounded-lg border border-line bg-white p-1 shadow-card">
        {(["users", "products"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-4 py-2.5 text-sm font-semibold capitalize transition-colors ${
              tab === t
                ? "bg-nav text-white shadow-sm"
                : "text-muted hover:bg-paper hover:text-ink"
            }`}
          >
            {t} ({t === "users" ? users.length : products.length})
          </button>
        ))}
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : tab === "users" ? (
        users.length === 0 ? (
          <EmptyState title="No users found" icon={Users} />
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper/50 text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-5 py-3">Username</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-paper/30">
                    <td className="px-5 py-3 font-medium text-ink">{u.username}</td>
                    <td className="px-5 py-3 text-muted">{u.email}</td>
                    <td className="px-5 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          u.active ? "bg-emerald-100 text-success" : "bg-red-100 text-danger"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${u.active ? "bg-success" : "bg-danger"}`} />
                        {u.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => toggleActive(u)}
                        className={u.active ? "btn-danger text-xs" : "btn-primary text-xs"}
                      >
                        {u.active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : products.length === 0 ? (
        <EmptyState title="No products found" icon={Package} />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-paper/50 text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Seller</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-paper/30">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded bg-gradient-to-br from-sky-100 to-blue-200">
                        <span className="text-xs font-bold text-blue-600">
                          {p.name.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-semibold text-brand-orange-dark">
                    SAR {p.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">{p.quantity}</td>
                  <td className="px-5 py-3 text-muted">{p.sellerUsername}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => deleteProduct(p.id)} className="btn-danger text-xs">
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
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
