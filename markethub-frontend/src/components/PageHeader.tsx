import type { ReactNode } from "react";
import { Breadcrumb } from "./ui";

interface Stat {
  value: string | number;
  label: string;
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
  stats,
  action,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; to?: string }[];
  stats?: Stat[];
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 animate-fade-in">
      {breadcrumbs && <Breadcrumb items={breadcrumbs} />}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {stats && stats.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-6 rounded-lg border border-line bg-white px-5 py-4 shadow-card">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-display text-lg font-bold text-ink">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
