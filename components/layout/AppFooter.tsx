"use client";

import { useLanguage } from "@/i18n/LanguageProvider";

export function AppFooter() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/60">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
        <p className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
          {t.footer.note}
        </p>
        <p>{t.app.title} · 2026</p>
      </div>
    </footer>
  );
}
