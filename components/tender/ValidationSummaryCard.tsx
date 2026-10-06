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
      color: "text-emerald-800 bg-emerald-50/80 ring-emerald-200/90 border-emerald-300",
      accent: "text-emerald-700",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-emerald-600" aria-hidden>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: t.validationSummary.missing,
      value: summary.missing,
      color: "text-rose-800 bg-rose-50/80 ring-rose-200/90 border-rose-300",
      accent: "text-rose-700",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-rose-600" aria-hidden>
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: t.validationSummary.expiryNeeded,
      value: summary.expiryNeeded,
      color: "text-amber-800 bg-amber-50/80 ring-amber-200/90 border-amber-300",
      accent: "text-amber-700",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-amber-600" aria-hidden>
          <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: t.validationSummary.expired,
      value: summary.expired,
      color: "text-red-800 bg-red-50/80 ring-red-200/90 border-red-300",
      accent: "text-red-700",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-red-600" aria-hidden>
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      label: t.validationSummary.notProvided,
      value: summary.notProvided,
      color: "text-slate-700 bg-slate-50/80 ring-slate-200/90 border-slate-300",
      accent: "text-slate-600",
      icon: (
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 text-slate-400" aria-hidden>
          <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  return (
    <section
      aria-labelledby="validation-summary-title"
      className="animate-fade-up rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm [animation-delay:180ms]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h2
            id="validation-summary-title"
            className="text-lg font-semibold tracking-tight text-slate-900"
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
            "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold ring-1 shadow-2xs transition",
            summary.canGenerate
              ? "bg-emerald-50 text-emerald-800 ring-emerald-300/80"
              : "bg-amber-50 text-amber-900 ring-amber-300/80",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              summary.canGenerate ? "bg-emerald-500 animate-pulse" : "bg-amber-500",
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
              "rounded-2xl border p-3.5 shadow-2xs ring-1 transition hover:-translate-y-0.5 hover:shadow-xs",
              item.color,
            )}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-semibold truncate" title={item.label}>
                {item.label}
              </span>
              <span className="shrink-0">{item.icon}</span>
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
