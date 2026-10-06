"use client";

import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/utils/cn";

interface DocumentUploadZoneProps {
  onFilesSelected: (files: FileList | File[]) => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export function DocumentUploadZone({
  onFilesSelected,
  isProcessing,
  disabled = false,
}: DocumentUploadZoneProps) {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = "";
    }
  };

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  return (
    <div
      id="pdf-upload-dropzone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200",
        isDragging
          ? "border-indigo-500 bg-indigo-50/80 scale-[1.01]"
          : "border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/30",
        disabled && "opacity-60 pointer-events-none",
      )}
    >
      <input
        ref={inputRef}
        id="pdf-files-input"
        type="file"
        multiple
        accept=".pdf,application/pdf"
        onChange={handleInputChange}
        className="sr-only"
        aria-label={t.upload.browse}
      />

      <div
        className={cn(
          "grid h-12 w-12 place-items-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200",
          !isProcessing && "animate-float",
        )}
      >
        {isProcessing ? (
          <span
            className="h-6 w-6 animate-spin rounded-full border-[2.5px] border-indigo-200 border-t-indigo-600"
            aria-hidden
          />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden>
            <path
              d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path
              d="M14 3v5h5M12 12v6m-3-3l3-3 3 3"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      <p className="mt-3 text-sm font-medium text-slate-700">
        {isProcessing ? t.upload.processing : t.upload.dropzone}
      </p>

      <button
        id="choose-pdf-files-btn"
        type="button"
        onClick={openPicker}
        disabled={disabled || isProcessing}
        className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden>
          <path
            d="M12 4v16m-8-8h16"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
        {t.upload.browse}
      </button>

      <p className="mt-2 text-[11px] text-slate-400">{t.upload.hint}</p>
    </div>
  );
}
