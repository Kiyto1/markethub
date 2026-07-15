import { Loader2 } from "lucide-react";

export default function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-muted animate-fade-in">
      <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      <span className="text-sm font-medium">{label}…</span>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden p-0">
          <div className="skeleton aspect-square w-full" />
          <div className="space-y-2 p-4">
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-2/3" />
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-9 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card divide-y divide-line">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="skeleton h-4 flex-1" />
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-4 w-16" />
        </div>
      ))}
    </div>
  );
}
