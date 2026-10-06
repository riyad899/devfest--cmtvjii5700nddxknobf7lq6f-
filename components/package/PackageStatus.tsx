"use client";

import type { RequirementStats } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatNumber } from "@/utils/format";

interface PackageStatusProps {
  stats: RequirementStats;
  /** Number of mandatory requirements satisfied (0 until matching exists). */
  readyMandatory?: number;
}

export function PackageStatus({ stats, readyMandatory = 0 }: PackageStatusProps) {
  const { t, language } = useLanguage();
  const percent = stats.mandatory ? Math.round((readyMandatory / stats.mandatory) * 100) : 0;

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
        <span className="text-slate-400">/ {formatNumber(stats.mandatory, language)}</span>
        <span className="ml-1 text-sm text-slate-500">{t.package.mandatoryReady}</span>
      </div>

      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <button
        id="generate-package-button"
        type="button"
        disabled
        className="mt-6 w-full cursor-not-allowed rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white opacity-40"
      >
        {t.package.generate}
      </button>
      <p className="mt-2 text-center text-xs text-slate-500">{t.package.hint}</p>
    </section>
  );
}
