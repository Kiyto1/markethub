import { Link } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-6 text-center">
      <div className="animate-fade-in">
        <p className="text-8xl font-display font-extrabold text-brand-orange">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">Page not found</h1>
        <p className="mt-2 max-w-md text-muted">
          Sorry, we couldn't find that page. It might have been removed or the URL is incorrect.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/products" className="btn-amazon font-semibold no-underline">
            <ArrowLeft className="h-4 w-4" />
            Back to shopping
          </Link>
          <Link to="/products" className="btn-secondary no-underline">
            <Search className="h-4 w-4" />
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}
