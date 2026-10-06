"use client";

import type { Requirement } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatNumber } from "@/utils/format";
import { cn } from "@/utils/cn";

interface RequirementsChecklistProps {
  /** Must already be sorted by `order` (done in lib/requirements). */
  requirements: Requirement[];
}

function TypeBadge({ mandatory, labels }: { mandatory: boolean; labels: { mandatory: string; optional: string } }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold ring-1",
        mandatory ? "bg-rose-50 text-rose-700 ring-rose-200" : "bg-sky-50 text-sky-700 ring-sky-200",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", mandatory ? "bg-rose-500" : "bg-sky-500")} aria-hidden />
      {mandatory ? labels.mandatory : labels.optional}
    </span>
  );
}

function ExpiryBadge({ required, labels }: { required: boolean; labels: { yes: string; no: string } }) {
  return required ? (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {labels.yes}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden>
        <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      {labels.no}
    </span>
  );
}

export function RequirementsChecklist({ requirements }: RequirementsChecklistProps) {
  const { t, language } = useLanguage();
  const typeLabels = { mandatory: t.requirements.mandatory, optional: t.requirements.optional };
  const expiryLabels = { yes: t.requirements.expiryRequired, no: t.requirements.expiryNotRequired };

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
        <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
          {formatNumber(requirements.length, language)}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table id="requirements-table" className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="w-16 px-6 py-3 font-semibold">{t.requirements.order}</th>
              <th scope="col" className="px-3 py-3 font-semibold">{t.requirements.titleEn}</th>
              <th scope="col" className="px-3 py-3 font-semibold">{t.requirements.titleBn}</th>
              <th scope="col" className="px-3 py-3 font-semibold">{t.requirements.type}</th>
              <th scope="col" className="px-6 py-3 font-semibold">{t.requirements.expiry}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requirements.map((req) => (
              <tr
                key={req.id}
                id={`requirement-${req.id}`}
                className="group transition-colors hover:bg-indigo-50/30"
              >
                <td className="px-6 py-4 align-top">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700">
                    {formatNumber(req.order, language)}
                  </span>
                </td>
                <td className="px-3 py-4 align-top">
                  <p lang="en" className="font-medium text-slate-900">{req.title_en}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-slate-400">{req.id}</p>
                </td>
                <td className="px-3 py-4 align-top">
                  <p lang="bn" className="font-medium text-slate-800">{req.title_bn}</p>
                </td>
                <td className="px-3 py-4 align-top">
                  <TypeBadge mandatory={req.mandatory} labels={typeLabels} />
                </td>
                <td className="px-6 py-4 align-top">
                  <ExpiryBadge required={req.has_expiry} labels={expiryLabels} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
