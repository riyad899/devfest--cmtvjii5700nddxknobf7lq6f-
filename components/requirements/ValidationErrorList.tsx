"use client";

import type { ValidationError } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatValidationError, interpolate } from "@/i18n/errors";
import { formatNumber } from "@/utils/format";

const MAX_VISIBLE_ERRORS = 12;

interface ValidationErrorListProps {
  errors: ValidationError[];
  fileName: string | null;
}

export function ValidationErrorList({ errors, fileName }: ValidationErrorListProps) {
  const { t, language } = useLanguage();
  const visible = errors.slice(0, MAX_VISIBLE_ERRORS);
  const hidden = errors.length - visible.length;

  return (
    <div
      id="requirements-errors"
      role="alert"
      className="animate-fade-up rounded-2xl border border-rose-200 bg-rose-50/70 p-5 text-left"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-100 text-rose-600">
          <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
            <path d="M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-rose-900">{t.errors.title}</p>
          <p className="mt-0.5 text-sm text-rose-700">
            {fileName && <span className="font-mono">{fileName}</span>}
            {fileName && " · "}
            {t.errors.subtitle}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5 text-sm text-rose-900">
        {visible.map((error, i) => (
          <li key={`${error.code}-${error.path ?? ""}-${i}`} className="flex gap-2">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" aria-hidden />
            <span className="break-words">{formatValidationError(error, t)}</span>
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <p className="mt-2 pl-3.5 text-sm text-rose-700">
          {interpolate(t.errors.moreErrors, { count: formatNumber(hidden, language) })}
        </p>
      )}
    </div>
  );
}
