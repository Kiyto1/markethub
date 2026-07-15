import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Filter, SlidersHorizontal, Sparkles, TrendingUp } from "lucide-react";
import api, { getErrorMessage } from "../api/api";
import { useAuth } from "../context/AuthContext";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import { ProductGridSkeleton } from "../components/Loading";
import PageHeader from "../components/PageHeader";
import { Alert, EmptyState } from "../components/ui";
import heroImg from "../assets/hero.png";

type SortOption = "default" | "price-asc" | "price-desc" | "name";

const categories = ["All", "Electronics", "Fashion", "Home", "Sports", "Books"];

export default function ProductsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState<SortOption>("default");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<Product[]>("/api/products");
      setProducts(res.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToCart(productId: number, quantity: number) {
    setAddingId(productId);
    setError("");
    setSuccess("");
    try {
      await api.post("/api/cart/items", { productId, quantity });
      setSuccess("Item added to cart!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setAddingId(null);
    }
  }

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sellerUsername.toLowerCase().includes(query.toLowerCase())
    );

    if (category !== "All") {
      list = list.filter((_, i) => i % categories.length === categories.indexOf(category));
    }

    switch (sort) {
      case "price-asc":
        return [...list].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...list].sort((a, b) => b.price - a.price);
      case "name":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return list;
    }
  }, [products, query, sort, category]);

  const inStockCount = products.filter((p) => p.quantity > 0).length;

  return (
    <div className="page-container">
      {/* Hero banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-nav shadow-card-hover">
        <img
          src={heroImg}
          alt="Shop deals"
          className="h-56 w-full object-cover opacity-45 sm:h-64 lg:h-72"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-nav via-nav/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-12">
          <p className="flex items-center gap-2 text-sm font-semibold text-brand-orange">
            <Sparkles className="h-4 w-4" />
            A better way to browse
          </p>
          <h2 className="mt-2 max-w-md font-display text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Find pieces that feel like you
          </h2>
          <p className="mt-2 max-w-sm text-sm text-white/70">
            {inStockCount} finds are ready from independent sellers. Simple wallet checkout.
          </p>
          {user?.role === "CUSTOMER" && (
            <Link to="/cart" className="btn-amazon mt-4 w-fit text-sm font-semibold no-underline">
              Open your bag
            </Link>
          )}
        </div>
      </div>

      {/* Category pills */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              category === cat
                ? "border-brand-orange bg-brand-orange text-white"
                : "border-line bg-white text-ink hover:border-brand-orange/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <PageHeader
        title={query ? `Results for "${query}"` : "Explore the collection"}
        subtitle={`Showing ${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
        breadcrumbs={[
          { label: "Markethub", to: "/products" },
          { label: query || "All Products" },
        ]}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted">
          <TrendingUp className="h-4 w-4" />
          <span>Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-md border border-line bg-white px-3 py-1.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand-orange"
          >
            <option value="default">Curated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted">
          <SlidersHorizontal className="h-4 w-4" />
          <Filter className="h-4 w-4" />
          {filtered.length} finds
        </div>
      </div>

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {loading ? (
        <ProductGridSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={products.length === 0 ? "No products yet" : "No matches found"}
          hint={
            products.length === 0
              ? "Sellers haven't listed anything yet. Check back soon!"
              : "Try a different search term or browse all categories."
          }
          action={
            query ? (
              <button
                onClick={() => setSearchParams({})}
                className="btn-primary mt-2 text-sm"
              >
                Clear search
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isCustomer={user?.role === "CUSTOMER"}
              onAddToCart={handleAddToCart}
              adding={addingId === p.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
