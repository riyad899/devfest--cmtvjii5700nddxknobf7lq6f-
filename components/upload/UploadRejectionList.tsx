"use client";

import type { FileRejection } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";

interface UploadRejectionListProps {
  rejections: FileRejection[];
  onDismiss: () => void;
  onDismissOne?: (index: number) => void;
}

export function UploadRejectionList({
  rejections,
  onDismiss,
  onDismissOne,
}: UploadRejectionListProps) {
  const { t } = useLanguage();

  if (rejections.length === 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="animate-fade-up rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-900 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-rose-200/80 text-rose-700">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <p className="font-semibold text-rose-900">{t.upload.rejectionsTitle}</p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-lg px-2.5 py-1 text-xs font-medium text-rose-700 transition hover:bg-rose-200/60"
        >
          {t.upload.dismiss}
        </button>
      </div>

      <ul className="mt-3 space-y-2">
        {rejections.map((rej, idx) => (
          <li
            key={`${rej.fileName}-${rej.code}-${idx}`}
            className="flex items-center justify-between gap-3 rounded-xl bg-white/70 px-3 py-2 ring-1 ring-rose-200/50"
          >
            <div className="min-w-0 flex-1">
              <span className="font-mono text-xs font-semibold text-slate-800 break-all">
                {rej.fileName}
              </span>
              <p className="text-xs text-rose-700">
                {t.upload.errors[rej.code] ?? rej.code}
              </p>
            </div>
            {onDismissOne && (
              <button
                type="button"
                onClick={() => onDismissOne(idx)}
                className="text-slate-400 hover:text-slate-600 p-1"
                aria-label={t.upload.dismiss}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
