"use client";

import { useState, type DragEvent } from "react";
import type { LoaderStatus, ValidationError } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useJsonFilePicker } from "@/hooks/useJsonFilePicker";
import { cn } from "@/utils/cn";
import { ValidationErrorList } from "./ValidationErrorList";

interface RequirementsDropzoneProps {
  status: LoaderStatus;
  errors: ValidationError[];
  fileName: string | null;
  onFile: (file: File) => void;
}

/** Empty / loading / error state for selecting requirements.json. */
export function RequirementsDropzone({ status, errors, fileName, onFile }: RequirementsDropzoneProps) {
  const { t } = useLanguage();
  const { open, inputProps } = useJsonFilePicker(onFile);
  const [isDragging, setIsDragging] = useState(false);
  const isLoading = status === "loading";

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && !isLoading) onFile(file);
  };

  return (
    <section
      aria-labelledby="loader-heading"
      className="animate-fade-up relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10"
    >
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-2xl text-center">
        <h1 id="loader-heading" className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {t.loader.title}
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 sm:text-base">{t.loader.description}</p>

        <div
          id="requirements-dropzone"
          onDragOver={(e) => {
            e.preventDefault();
            if (!isLoading) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "mt-8 flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 transition-all duration-200",
            isDragging
              ? "scale-[1.01] border-indigo-500 bg-indigo-50"
              : "border-slate-300 bg-slate-50/60 hover:border-indigo-300 hover:bg-indigo-50/40",
          )}
        >
          <div
            className={cn(
              "grid h-16 w-16 place-items-center rounded-2xl bg-white text-indigo-600 shadow-md ring-1 ring-indigo-100",
              !isLoading && "animate-float",
            )}
          >
            {isLoading ? (
              <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-indigo-200 border-t-indigo-600" aria-hidden />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8" aria-hidden>
                <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M14 3v5h5M10 12.5 8.5 14l1.5 1.5M14 12.5l1.5 1.5-1.5 1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>

          <p className="mt-4 text-sm font-medium text-slate-700" aria-live="polite">
            {isLoading ? t.loader.loading : t.loader.dropzone}
          </p>

          <input {...inputProps} id="requirements-file-input" aria-label={t.loader.browse} />
          <button
            id="requirements-browse-button"
            type="button"
            onClick={open}
            disabled={isLoading}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:pointer-events-none disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
              <path d="M12 16V4m0 0-4 4m4-4 4 4M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {status === "error" ? t.errors.tryAgain : t.loader.browse}
          </button>
          <p className="mt-3 text-xs text-slate-400">{t.loader.hint}</p>
        </div>

        {status === "error" && errors.length > 0 && (
          <div className="mt-6">
            <ValidationErrorList errors={errors} fileName={fileName} />
          </div>
        )}

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-emerald-600" aria-hidden>
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 11V7a4 4 0 1 1 8 0v4" stroke="currentColor" strokeWidth="2" />
          </svg>
          {t.loader.privacy}
        </p>
      </div>
    </section>
  );
}
