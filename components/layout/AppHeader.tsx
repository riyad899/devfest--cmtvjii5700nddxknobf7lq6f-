"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function AppHeader() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
              <path
                d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              {t.app.title}
            </p>
            <p className="hidden truncate text-xs text-slate-500 sm:block">{t.app.subtitle}</p>
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
