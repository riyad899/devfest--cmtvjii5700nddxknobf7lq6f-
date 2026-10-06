"use client";

import { useLanguage } from "@/i18n/LanguageProvider";
import { LANGUAGES } from "@/i18n";
import { cn } from "@/utils/cn";

export function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div
      role="radiogroup"
      aria-label={t.language.label}
      className="relative flex items-center rounded-full border border-slate-200 bg-slate-100/80 p-1 shadow-inner"
    >
      {/* Sliding indicator */}
      <span
        aria-hidden
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white shadow-sm ring-1 ring-slate-200 transition-transform duration-300 ease-out",
          language === "bn" ? "translate-x-full" : "translate-x-0",
        )}
      />
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          id={`lang-switch-${lang}`}
          type="button"
          role="radio"
          aria-checked={language === lang}
          onClick={() => setLanguage(lang)}
          className={cn(
            "relative z-10 min-w-12 rounded-full px-3 py-1 text-sm font-semibold transition-colors",
            language === lang ? "text-indigo-700" : "text-slate-500 hover:text-slate-800",
          )}
        >
          {t.language[lang]}
        </button>
      ))}
    </div>
  );
}
