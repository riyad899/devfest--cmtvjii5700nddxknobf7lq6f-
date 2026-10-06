"use client";

import type { Requirement } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { getRequirementTitle } from "@/lib/requirements";
import { formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";

interface RequirementsChecklistProps {
  requirements: Requirement[];
}

export function RequirementsChecklist({ requirements }: RequirementsChecklistProps) {
  const { t, language } = useLanguage();
  const secondaryLanguage = language === "en" ? "bn" : "en";

  return (
    <section
      aria-labelledby="requirements-heading"
      className="animate-fade-up overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm [animation-delay:140ms]"
    >
      <div className="flex items-end justify-between gap-4 border-b border-slate-100 px-6 py-5">
        <div>
          <h2 id="requirements-heading" className="text-lg font-semibold text-slate-900">
            {t.requirements.title}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">{t.requirements.subtitle}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {formatNumber(0, language)} / {formatNumber(requirements.length, language)}
        </span>
      </div>

      <ol className="divide-y divide-slate-100">
        {requirements.map((req) => (
          <li
            key={req.id}
            id={`requirement-${req.id}`}
            className="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/80"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-600 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-700">
              {formatNumber(req.order, language)}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-slate-900">{getRequirementTitle(req, language)}</p>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[11px] font-semibold",
                    req.mandatory
                      ? "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                      : "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
                  )}
                >
                  {req.mandatory ? t.requirements.mandatory : t.requirements.optional}
                </span>
                {req.has_expiry && (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden>
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {t.requirements.hasExpiry}
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-slate-400">
                {req.id} · {getRequirementTitle(req, secondaryLanguage)}
              </p>
            </div>

            <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-dashed border-slate-300 px-3 py-1 text-xs text-slate-500 sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden />
              {t.requirements.awaiting}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
