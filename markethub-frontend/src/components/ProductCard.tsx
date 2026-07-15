import { useState } from "react";
import { Minus, Plus, ShoppingCart, Truck, Zap } from "lucide-react";
import type { Product } from "../types";
import { StarRating, StockBadge } from "./ui";

interface Props {
  product: Product;
  isCustomer: boolean;
  onAddToCart: (productId: number, quantity: number) => void;
  adding?: boolean;
}

const GRADIENTS = [
  "from-sky-100 to-blue-200",
  "from-amber-50 to-orange-100",
  "from-emerald-50 to-teal-100",
  "from-violet-50 to-purple-100",
  "from-rose-50 to-pink-100",
  "from-cyan-50 to-sky-100",
];

const ICON_COLORS = [
  "text-blue-600",
  "text-orange-600",
  "text-teal-600",
  "text-purple-600",
  "text-rose-600",
  "text-cyan-600",
];

const PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1498045725627-812f8b7b4f8d?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85",
];

function getProductImage(product: Product) {
  if (product.imageUrl) return product.imageUrl;

  const name = product.name.toLowerCase();
  if (/phone|laptop|camera|headphone|watch|electronic|computer/.test(name)) return PRODUCT_IMAGES[0];
  if (/shoe|fashion|shirt|dress|jacket|bag|wear/.test(name)) return PRODUCT_IMAGES[2];
  if (/book|novel|journal/.test(name)) return PRODUCT_IMAGES[3];
  if (/home|chair|table|lamp|kitchen|decor/.test(name)) return PRODUCT_IMAGES[5];
  return PRODUCT_IMAGES[product.id % PRODUCT_IMAGES.length];
}

function fakeRating(id: number) {
  return 3.5 + (id % 15) / 10;
}

function fakeReviews(id: number) {
  return 12 + (id * 37) % 2400;
}

export default function ProductCard({ product, isCustomer, onAddToCart, adding }: Props) {
  const [qty, setQty] = useState(1);
  const [imageFailed, setImageFailed] = useState(false);
  const outOfStock = product.quantity <= 0;
  const gradient = GRADIENTS[product.id % GRADIENTS.length];
  const iconColor = ICON_COLORS[product.id % ICON_COLORS.length];
  const initials = product.name.slice(0, 2).toUpperCase();
  const imageUrl = getProductImage(product);
  const rating = fakeRating(product.id);
  const reviews = fakeReviews(product.id);
  const whole = Math.floor(product.price);
  const cents = Math.round((product.price - whole) * 100);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card p-3 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-link/30 hover:shadow-card-hover">
      <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${gradient}`}>
        {!imageFailed ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span className={`font-display text-4xl font-extrabold tracking-tight ${iconColor} opacity-80`}>{initials}</span>
        )}
        {product.quantity > 0 && product.quantity <= 10 && (
          <span className="absolute left-2 top-2 rounded-full bg-brand-orange px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            BEST SELLER
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1.5">
        <h3 className="line-clamp-2 text-sm leading-snug text-ink group-hover:text-brand-orange-dark">
          {product.name}
        </h3>

        <StarRating rating={rating} count={reviews} />

        <div className="flex items-start gap-0.5">
          <span className="text-xs font-medium text-ink align-top">SAR</span>
          <span className="price-lg leading-none">{whole}</span>
          <span className="text-xs font-medium text-ink align-top">{String(cents).padStart(2, "0")}</span>
        </div>

        {!outOfStock && (
          <p className="flex items-center gap-1 text-xs text-muted">
            <Truck className="h-3 w-3 text-success" />
            FREE delivery
          </p>
        )}

        <p className="text-xs text-muted">
          Sold by <span className="text-link">{product.sellerUsername}</span>
        </p>

        <div className="mt-1">
          <StockBadge quantity={product.quantity} />
        </div>

        {isCustomer && (
          <div className="mt-auto space-y-2 pt-2">
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={outOfStock}
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="flex h-8 w-8 items-center justify-center rounded border border-line bg-paper hover:bg-line-light disabled:opacity-40"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-medium">{qty}</span>
              <button
                type="button"
                disabled={outOfStock || qty >= product.quantity}
                onClick={() => setQty(Math.min(product.quantity, qty + 1))}
                className="flex h-8 w-8 items-center justify-center rounded border border-line bg-paper hover:bg-line-light disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              className="btn-primary w-full text-xs font-semibold"
              disabled={outOfStock || adding}
              onClick={() => onAddToCart(product.id, qty)}
            >
              <ShoppingCart className="h-4 w-4" />
              {outOfStock ? "Unavailable" : adding ? "Adding…" : "Add to Cart"}
            </button>
          </div>
        )}

        {!isCustomer && !outOfStock && (
          <p className="mt-2 flex items-center gap-1 text-xs text-success">
            <Zap className="h-3 w-3" />
            Available now
          </p>
        )}
      </div>
    </div>
  );
}
