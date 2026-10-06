"use client";

import type { RequirementStats } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";

interface PackageStatusProps {
  stats: RequirementStats;
  /** Number of mandatory requirements satisfied (0 until matching exists). */
  readyMandatory?: number;
  canGenerate?: boolean;
}

export function PackageStatus({
  stats,
  readyMandatory = 0,
  canGenerate = false,
}: PackageStatusProps) {
  const { t, language } = useLanguage();
  const percent = stats.mandatory
    ? Math.min(100, Math.round((readyMandatory / stats.mandatory) * 100))
    : 0;

  return (
    <section
      aria-labelledby="package-heading"
      className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm [animation-delay:260ms]"
    >
      <h2 id="package-heading" className="text-lg font-semibold text-slate-900">
        {t.package.title}
      </h2>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900">
          {formatNumber(readyMandatory, language)}
        </span>
        <span className="text-slate-400">
          / {formatNumber(stats.mandatory, language)}
        </span>
        <span className="ml-1 text-sm text-slate-500">
          {t.package.mandatoryReady}
        </span>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            canGenerate
              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
              : "bg-gradient-to-r from-indigo-500 to-violet-500",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      <button
        id="generate-package-button"
        type="button"
        disabled={!canGenerate}
        className={cn(
          "mt-6 w-full rounded-xl px-4 py-3 text-sm font-semibold transition shadow-sm",
          canGenerate
            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20 active:scale-98 cursor-pointer"
            : "bg-slate-900 text-white opacity-40 cursor-not-allowed",
        )}
      >
        {t.package.generate}
      </button>

      <p className="mt-2 text-center text-xs text-slate-500">
        {canGenerate
          ? t.validationSummary.readyToGenerate
          : t.package.hint}
      </p>
    </section>
  );
}
