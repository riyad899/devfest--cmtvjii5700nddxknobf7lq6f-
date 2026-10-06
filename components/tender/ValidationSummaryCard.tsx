"use client";

import type { ValidationSummary } from "@/lib/validation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";

interface ValidationSummaryCardProps {
  summary: ValidationSummary;
}

export function ValidationSummaryCard({ summary }: ValidationSummaryCardProps) {
  const { t, language } = useLanguage();

  const items = [
    {
      label: t.validationSummary.ok,
      value: summary.ok,
      color: "text-emerald-700 bg-emerald-50 ring-emerald-200 border-emerald-300",
      indicator: "bg-emerald-500",
      accent: "text-emerald-700",
    },
    {
      label: t.validationSummary.missing,
      value: summary.missing,
      color: "text-rose-700 bg-rose-50 ring-rose-200 border-rose-300",
      indicator: "bg-rose-500",
      accent: "text-rose-700",
    },
    {
      label: t.validationSummary.expiryNeeded,
      value: summary.expiryNeeded,
      color: "text-amber-700 bg-amber-50 ring-amber-200 border-amber-300",
      indicator: "bg-amber-500",
      accent: "text-amber-700",
    },
    {
      label: t.validationSummary.expired,
      value: summary.expired,
      color: "text-red-700 bg-red-50 ring-red-200 border-red-300",
      indicator: "bg-red-600",
      accent: "text-red-700",
    },
    {
      label: t.validationSummary.notProvided,
      value: summary.notProvided,
      color: "text-slate-700 bg-slate-50 ring-slate-200 border-slate-300",
      indicator: "bg-slate-400",
      accent: "text-slate-600",
    },
  ];

  return (
    <section
      aria-labelledby="validation-summary-title"
      className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm [animation-delay:180ms]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2
            id="validation-summary-title"
            className="text-lg font-semibold text-slate-900"
          >
            {t.validationSummary.title}
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {t.validationSummary.total}:{" "}
            <span className="font-bold text-slate-800">
              {formatNumber(summary.total, language)}
            </span>
          </p>
        </div>

        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1",
            summary.canGenerate
              ? "bg-emerald-50 text-emerald-700 ring-emerald-300"
              : "bg-amber-50 text-amber-800 ring-amber-300",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              summary.canGenerate ? "bg-emerald-500" : "bg-amber-500",
            )}
            aria-hidden
          />
          {summary.canGenerate
            ? t.validationSummary.readyToGenerate
            : t.validationSummary.blockingWarning}
        </span>
      </div>

      {/* Grid of status counters */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <div
            key={item.label}
            className={cn(
              "rounded-2xl border p-3.5 shadow-2xs ring-1 transition hover:-translate-y-0.5",
              item.color,
            )}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold truncate" title={item.label}>
                {item.label}
              </span>
              <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", item.indicator)}
                aria-hidden
              />
            </div>
            <p className={cn("mt-2 text-2xl font-black tracking-tight", item.accent)}>
              {formatNumber(item.value, language)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
