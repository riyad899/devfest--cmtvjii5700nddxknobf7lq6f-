"use client";

import type { RequirementStats, TenderInfo } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatDate, formatNumber } from "@/utils/format";

interface TenderOverviewProps {
  tender: TenderInfo;
  stats: RequirementStats;
}

export function TenderOverview({ tender, stats }: TenderOverviewProps) {
  const { t, language } = useLanguage();

  const details = [
    { label: t.tender.procuringEntity, value: tender.procuring_entity },
    { label: t.tender.bidder, value: tender.bidder },
    { label: t.tender.deadline, value: formatDate(tender.submission_deadline, language) },
  ];

  const statItems = [
    { label: t.stats.total, value: stats.total, accent: "from-white/90 to-white/60" },
    { label: t.stats.mandatory, value: stats.mandatory, accent: "from-rose-200 to-rose-100" },
    { label: t.stats.optional, value: stats.optional, accent: "from-sky-200 to-sky-100" },
    { label: t.stats.withExpiry, value: stats.withExpiry, accent: "from-amber-200 to-amber-100" },
  ];

  return (
    <section
      aria-labelledby="tender-title"
      className="animate-fade-up relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 p-6 text-white shadow-2xl shadow-indigo-950/20 sm:p-8"
    >
      {/* Decorative glows */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-[0.07]" />

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-400/30">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              {t.tender.sectionLabel}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-indigo-100 ring-1 ring-white/15">
              {t.tender.tenderId}: {tender.tender_id}
            </span>
          </div>
          <h1 id="tender-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {tender.title}
          </h1>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-xs uppercase tracking-wider text-indigo-200/70">{d.label}</dt>
                <dd className="mt-1 text-sm font-medium text-white">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[440px] lg:grid-cols-2">
          {statItems.map((s) => (
            <li
              key={s.label}
              className="rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10"
            >
              <p className={`bg-gradient-to-br ${s.accent} bg-clip-text text-3xl font-bold text-transparent`}>
                {formatNumber(s.value, language)}
              </p>
              <p className="mt-1 text-xs text-indigo-100/80">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
