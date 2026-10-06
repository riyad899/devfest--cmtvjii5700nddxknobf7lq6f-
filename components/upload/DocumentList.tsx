"use client";

import type { UploadedDocument } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { formatFileSize, formatNumber } from "@/utils/format";
import { MAX_UPLOAD_FILES, MAX_UPLOAD_TOTAL_BYTES } from "@/lib/constants";

interface DocumentListProps {
  documents: UploadedDocument[];
  totalBytes: number;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export function DocumentList({
  documents,
  totalBytes,
  onRemove,
  onClearAll,
}: DocumentListProps) {
  const { t, language } = useLanguage();

  if (documents.length === 0) return null;

  return (
    <div className="animate-fade-up mt-4 space-y-3">
      {/* Header with counts and clear button */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {t.upload.uploadedCount}
          </span>
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 ring-1 ring-indigo-200">
            {formatNumber(documents.length, language)} / {formatNumber(MAX_UPLOAD_FILES, language)}
          </span>
          <span className="text-xs text-slate-400">
            ({formatFileSize(totalBytes, language)} / {formatFileSize(MAX_UPLOAD_TOTAL_BYTES, language)})
          </span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-rose-600 hover:text-rose-700 transition"
        >
          {t.upload.clearAll}
        </button>
      </div>

      {/* Document Items */}
      <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {documents.map((doc) => {
          const isProcessing = doc.status === "processing";

          return (
            <li
              key={doc.id}
              id={`uploaded-doc-${doc.id}`}
              className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-xs transition hover:border-indigo-200 hover:bg-slate-50/50"
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-200/60">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
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

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-900 group-hover:text-indigo-950">
                    {doc.fileName}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                    <span>{formatFileSize(doc.fileSize, language)}</span>
                    <span>·</span>
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                        <span className="h-2.5 w-2.5 animate-spin rounded-full border border-indigo-200 border-t-indigo-600" />
                        {t.upload.readingPages}
                      </span>
                    ) : (
                      <span className="font-medium text-slate-700">
                        {formatNumber(doc.pageCount ?? 0, language)} {t.upload.pageCount}
                      </span>
                    )}

                    {doc.isEncrypted && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-0.5 text-amber-600 font-medium">
                          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3" aria-hidden>
                            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          {t.upload.encrypted}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemove(doc.id)}
                className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                aria-label={`${t.upload.remove} ${doc.fileName}`}
                title={t.upload.remove}
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
