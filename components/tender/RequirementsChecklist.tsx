"use client";

import type { Requirement, UploadedDocument, RequirementStatus } from "@/types";
import type { MatchesMap } from "@/lib/matching";
import type { RequirementEvaluation } from "@/lib/validation";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatFileSize, formatNumber, formatDate } from "@/utils/format";
import { cn } from "@/utils/cn";

interface RequirementsChecklistProps {
  /** Must already be sorted by `order` (done in lib/requirements). */
  requirements: Requirement[];
  matches?: MatchesMap;
  eligibleDocs?: UploadedDocument[];
  evaluations?: Record<string, RequirementEvaluation>;
  expiryDates?: Record<string, string>;
  submissionDeadline?: string;
  onAssign?: (requirementId: string, documentId: string) => void;
  onUnassign?: (requirementId: string) => void;
  onExpiryChange?: (requirementId: string, date: string) => void;
}

function TypeBadge({
  mandatory,
  labels,
}: {
  mandatory: boolean;
  labels: { mandatory: string; optional: string };
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold ring-1",
        mandatory
          ? "bg-rose-50 text-rose-700 ring-rose-200"
          : "bg-sky-50 text-sky-700 ring-sky-200",
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          mandatory ? "bg-rose-500" : "bg-sky-500",
        )}
        aria-hidden
      />
      {mandatory ? labels.mandatory : labels.optional}
    </span>
  );
}

function StatusBadge({
  status,
  label,
}: {
  status: RequirementStatus;
  label: string;
}) {
  const configs: Record<
    RequirementStatus,
    { bg: string; text: string; ring: string; dot: string }
  > = {
    OK: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      ring: "ring-emerald-300",
      dot: "bg-emerald-500",
    },
    MISSING: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
      dot: "bg-rose-500",
    },
    EXPIRY_NEEDED: {
      bg: "bg-amber-50",
      text: "text-amber-800",
      ring: "ring-amber-300",
      dot: "bg-amber-500",
    },
    EXPIRED: {
      bg: "bg-red-50",
      text: "text-red-700",
      ring: "ring-red-300",
      dot: "bg-red-600",
    },
    NOT_PROVIDED: {
      bg: "bg-slate-50",
      text: "text-slate-600",
      ring: "ring-slate-200",
      dot: "bg-slate-400",
    },
  };

  const c = configs[status] ?? configs.MISSING;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-bold ring-1 tracking-wide",
        c.bg,
        c.text,
        c.ring,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} aria-hidden />
      {label}
    </span>
  );
}

export function RequirementsChecklist({
  requirements,
  matches = {},
  eligibleDocs = [],
  evaluations = {},
  expiryDates = {},
  submissionDeadline,
  onAssign,
  onUnassign,
  onExpiryChange,
}: RequirementsChecklistProps) {
  const { t, language } = useLanguage();
  const typeLabels = {
    mandatory: t.requirements.mandatory,
    optional: t.requirements.optional,
  };

  const matchedCount = Object.keys(matches).length;

  return (
    <section
      aria-labelledby="requirements-heading"
      className="animate-fade-up overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm [animation-delay:140ms]"
    >
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-100 px-6 py-5">
        <div>
          <h2
            id="requirements-heading"
            className="text-lg font-semibold text-slate-900"
          >
            {t.requirements.title}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {t.requirements.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            {t.requirements.matchedDoc}:
          </span>
          <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200">
            {formatNumber(matchedCount, language)} /{" "}
            {formatNumber(requirements.length, language)}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          id="requirements-table"
          className="w-full min-w-[880px] text-left text-sm"
        >
          <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th scope="col" className="w-12 px-4 py-3 font-semibold">
                {t.requirements.order}
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                {t.requirements.titleEn}
              </th>
              <th scope="col" className="px-3 py-3 font-semibold">
                {t.requirements.titleBn}
              </th>
              <th scope="col" className="px-2 py-3 font-semibold">
                {t.requirements.type}
              </th>
              <th scope="col" className="w-44 px-3 py-3 font-semibold">
                {t.requirements.expiry}
              </th>
              <th scope="col" className="w-64 px-3 py-3 font-semibold">
                {t.requirements.matchedDoc}
              </th>
              <th scope="col" className="w-32 px-4 py-3 font-semibold">
                {t.requirements.statusLabel}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requirements.map((req) => {
              const matchedDocId = matches[req.id];
              const matchedDoc = matchedDocId
                ? eligibleDocs.find((d) => d.id === matchedDocId)
                : undefined;

              const evaluation = evaluations[req.id];
              const currentStatus: RequirementStatus =
                evaluation?.status ??
                (req.mandatory ? "MISSING" : "NOT_PROVIDED");

              const currentExpiry = expiryDates[req.id] ?? "";

              return (
                <tr
                  key={req.id}
                  id={`requirement-${req.id}`}
                  className={cn(
                    "group transition-colors border-l-4",
                    currentStatus === "OK" && "border-l-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/25",
                    currentStatus === "MISSING" && "border-l-rose-400 bg-rose-50/10 hover:bg-rose-50/25",
                    currentStatus === "EXPIRY_NEEDED" && "border-l-amber-400 bg-amber-50/15 hover:bg-amber-50/30",
                    currentStatus === "EXPIRED" && "border-l-red-500 bg-red-50/15 hover:bg-red-50/30",
                    currentStatus === "NOT_PROVIDED" && "border-l-slate-200 hover:bg-slate-50/70",
                  )}
                >
                  <td className="px-4 py-4 align-top">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-sm font-semibold text-slate-700 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-700">
                      {formatNumber(req.order, language)}
                    </span>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <p
                      lang="en"
                      className={cn(
                        language === "en"
                          ? "font-semibold text-slate-900"
                          : "font-medium text-slate-600",
                      )}
                    >
                      {req.title_en}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                      {req.id}
                    </p>
                  </td>
                  <td className="px-3 py-4 align-top">
                    <p
                      lang="bn"
                      className={cn(
                        language === "bn"
                          ? "font-semibold text-slate-900"
                          : "font-medium text-slate-600",
                      )}
                    >
                      {req.title_bn}
                    </p>
                  </td>
                  <td className="px-2 py-4 align-top">
                    <TypeBadge mandatory={req.mandatory} labels={typeLabels} />
                  </td>

                  {/* Expiry cell: badge + date input if tracking expiry */}
                  <td className="px-3 py-4 align-top">
                    {req.has_expiry ? (
                      <div className="space-y-1.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3 w-3"
                            fill="none"
                            aria-hidden
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              d="M12 7v5l3 2"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          {t.requirements.expiryRequired}
                        </span>

                        {matchedDoc && (
                          <div>
                            <input
                              id={`expiry-input-${req.id}`}
                              type="date"
                              value={currentExpiry}
                              onChange={(e) =>
                                onExpiryChange?.(req.id, e.target.value)
                              }
                              className={cn(
                                "w-full rounded-lg border px-2 py-1 text-xs font-mono text-slate-700 transition shadow-2xs focus:bg-white focus:outline-hidden",
                                !currentExpiry
                                  ? "border-amber-300 bg-amber-50/60 focus:border-amber-500"
                                  : currentStatus === "EXPIRED"
                                    ? "border-red-300 bg-red-50/60 focus:border-red-500 text-red-800"
                                    : "border-slate-200 bg-white focus:border-indigo-500",
                              )}
                              title={t.requirements.expiryDateLabel}
                            />
                            {submissionDeadline && (
                              <p className="mt-0.5 text-[10px] text-slate-500 font-medium">
                                {t.tender.deadline}: {formatDate(submissionDeadline, language)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3 w-3"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M5 12h14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                        {t.requirements.expiryNotRequired}
                      </span>
                    )}
                  </td>

                  {/* Matched Document cell */}
                  <td className="px-3 py-3 align-top">
                    {matchedDoc ? (
                      <div className="flex items-center justify-between gap-2 rounded-xl border border-indigo-200/90 bg-white p-2.5 shadow-2xs">
                        <div className="flex min-w-0 items-center gap-2 flex-1">
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/60">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-4 w-4"
                              aria-hidden
                            >
                              <path
                                d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M14 3v5h5M10 13h4M10 17h2"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className="truncate text-xs font-semibold text-slate-900"
                              title={matchedDoc.fileName}
                            >
                              {matchedDoc.fileName}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {formatNumber(
                                matchedDoc.pageCount ?? 0,
                                language,
                              )}{" "}
                              {t.requirements.pageLabel} ·{" "}
                              {formatFileSize(matchedDoc.fileSize, language)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {/* Quick change dropdown */}
                          <select
                            id={`change-match-${req.id}`}
                            value={matchedDoc.id}
                            onChange={(e) => {
                              if (e.target.value === "") {
                                onUnassign?.(req.id);
                              } else {
                                onAssign?.(req.id, e.target.value);
                              }
                            }}
                            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-white"
                            title={t.requirements.changeFile}
                            aria-label={t.requirements.changeFile}
                          >
                            <option value={matchedDoc.id}>
                              {t.requirements.changeFile}
                            </option>
                            <option value="">
                              {t.requirements.unassignFile}
                            </option>
                            {eligibleDocs
                              .filter((d) => d.id !== matchedDoc.id)
                              .map((d) => {
                                const otherReqId = Object.entries(
                                  matches,
                                ).find(
                                  ([rId, dId]) =>
                                    dId === d.id && rId !== req.id,
                                )?.[0];
                                const otherReq = otherReqId
                                  ? requirements.find((r) => r.id === otherReqId)
                                  : undefined;
                                const otherTitle = otherReq
                                  ? language === "bn"
                                    ? otherReq.title_bn
                                    : otherReq.title_en
                                  : otherReqId;
                                return (
                                  <option key={d.id} value={d.id}>
                                    {d.fileName} ({formatNumber(d.pageCount ?? 0, language)} {t.requirements.pageLabel})
                                    {otherTitle
                                      ? ` [${t.requirements.alreadyAssignedTo.replace("{id}", otherTitle)}]`
                                      : ""}
                                  </option>
                                );
                              })}
                          </select>

                          <button
                            type="button"
                            onClick={() => onUnassign?.(req.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                            title={t.requirements.unassignFile}
                            aria-label={`${t.requirements.unassignFile} ${matchedDoc.fileName}`}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              className="h-3.5 w-3.5"
                              aria-hidden
                            >
                              <path
                                d="M18 6L6 18M6 6l12 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <select
                        id={`assign-match-${req.id}`}
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            onAssign?.(req.id, e.target.value);
                          }
                        }}
                        disabled={!eligibleDocs || eligibleDocs.length === 0}
                        className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-400 hover:bg-indigo-50/40 focus:border-indigo-500 focus:bg-white focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="">
                          {eligibleDocs && eligibleDocs.length > 0
                            ? t.requirements.assignFile
                            : t.requirements.noEligibleFiles}
                        </option>
                        {eligibleDocs?.map((d) => {
                          const otherReqId = Object.entries(matches).find(
                            ([rId, dId]) => dId === d.id && rId !== req.id,
                          )?.[0];
                          const otherReq = otherReqId
                            ? requirements.find((r) => r.id === otherReqId)
                            : undefined;
                          const otherTitle = otherReq
                            ? language === "bn"
                              ? otherReq.title_bn
                              : otherReq.title_en
                            : otherReqId;
                          return (
                            <option key={d.id} value={d.id}>
                              {d.fileName} ({formatNumber(d.pageCount ?? 0, language)} {t.requirements.pageLabel})
                              {otherTitle
                                ? ` [${t.requirements.alreadyAssignedTo.replace("{id}", otherTitle)}]`
                                : ""}
                            </option>
                          );
                        })}
                      </select>
                    )}
                  </td>

                  {/* Status Cell */}
                  <td className="px-4 py-4 align-top">
                    <StatusBadge
                      status={currentStatus}
                      label={t.status[currentStatus] ?? currentStatus}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
