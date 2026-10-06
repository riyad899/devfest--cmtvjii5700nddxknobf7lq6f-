"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

/** Visual placeholder only — PDF upload/processing is implemented in a later block. */
export function UploadPlaceholder() {
  const { t } = useLanguage();

  return (
    <section
      aria-labelledby="upload-heading"
      className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm [animation-delay:200ms]"
    >
      <h2 id="upload-heading" className="text-lg font-semibold text-slate-900">
        {t.upload.title}
      </h2>
      <p className="mt-1 text-sm text-slate-500">{t.upload.description}</p>

      <div
        id="upload-dropzone"
        aria-disabled="true"
        className="mt-5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-indigo-200 bg-gradient-to-b from-indigo-50/60 to-white px-6 py-10 text-center"
      >
        <div className="animate-float grid h-14 w-14 place-items-center rounded-2xl bg-white text-indigo-600 shadow-md ring-1 ring-indigo-100">
          <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden>
            <path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-700">{t.upload.dropzone}</p>
        <span className="mt-3 rounded-full bg-indigo-100/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-700">
          {t.upload.comingSoon}
        </span>
      </div>
    </section>
  );
}
