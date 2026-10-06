"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { useJsonFilePicker } from "@/hooks/useJsonFilePicker";

interface LoadedFileBarProps {
  fileName: string;
  onFile: (file: File) => void;
  onClear: () => void;
}

/** Compact bar shown once a requirements file is loaded. */
export function LoadedFileBar({ fileName, onFile, onClear }: LoadedFileBarProps) {
  const { t } = useLanguage();
  const { open, inputProps } = useJsonFilePicker(onFile);

  return (
    <div className="animate-fade-up flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500 text-white shadow-sm">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden>
            <path d="m5 12 5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="min-w-0 truncate text-sm text-emerald-900">
          <span className="text-emerald-700">{t.loader.loadedFrom}: </span>
          <span id="loaded-file-name" className="font-mono font-medium">{fileName}</span>
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <input {...inputProps} id="requirements-replace-input" aria-label={t.loader.replace} />
        <button
          id="requirements-replace-button"
          type="button"
          onClick={open}
          className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
        >
          {t.loader.replace}
        </button>
        <button
          id="requirements-clear-button"
          type="button"
          onClick={onClear}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900"
        >
          {t.loader.clear}
        </button>
      </div>
    </div>
  );
}
