"use client";

import type { RequirementStats } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatNumber, formatFileSize } from "@/utils/format";
import { cn } from "@/utils/cn";

interface PackageStatusProps {
  stats: RequirementStats;
  readyMandatory?: number;
  canGenerate?: boolean;
  isGenerating?: boolean;
  onGenerate?: () => void;
  lastGenerated?: {
    fileName: string;
    pageCount: number;
    byteSize: number;
    onDownload: () => void;
  } | null;
  error?: string | null;
}

export function PackageStatus({
  stats,
  readyMandatory = 0,
  canGenerate = false,
  isGenerating = false,
  onGenerate,
  lastGenerated,
  error,
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

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <p className="font-semibold">Generation Failed</p>
          <p className="mt-0.5">{error}</p>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        id="generate-package-button"
        type="button"
        disabled={!canGenerate || isGenerating}
        onClick={onGenerate}
        className={cn(
          "mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition shadow-sm",
          canGenerate && !isGenerating
            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20 active:scale-98 cursor-pointer"
            : "bg-slate-900 text-white opacity-40 cursor-not-allowed",
        )}
      >
        {isGenerating ? (
          <>
            <svg
              className="h-4 w-4 animate-spin text-white"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>{t.package.generating}</span>
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              aria-hidden
            >
              <path
                d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{t.package.generate}</span>
          </>
        )}
      </button>

      <p className="mt-2 text-center text-xs text-slate-500">
        {canGenerate
          ? t.package.readyNotice
          : t.package.hint}
      </p>

      {/* Generated Success Card & Re-download */}
      {lastGenerated && (
        <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 text-emerald-600"
              aria-hidden
            >
              <path
                d="M20 6L9 17l-5-5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{t.package.generatedSuccess}</span>
          </div>

          <p className="mt-1 font-mono text-[11px] text-slate-700 truncate font-semibold" title={lastGenerated.fileName}>
            {lastGenerated.fileName}
          </p>
          <p className="mt-0.5 text-slate-500">
            {t.package.generatedDetails
              .replace("{pages}", formatNumber(lastGenerated.pageCount, language))
              .replace("{size}", formatFileSize(lastGenerated.byteSize, language))}
          </p>

          <button
            type="button"
            onClick={lastGenerated.onDownload}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-800 shadow-2xs hover:bg-emerald-100/60 transition cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-3.5 w-3.5"
              aria-hidden
            >
              <path
                d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{t.package.downloadAgain}</span>
          </button>
        </div>
      )}
    </section>
  );
}
