import type { Language } from "@/types";

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert ASCII digits in a value to Bengali digits. */
export function toBengaliDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)]);
}

/** Localize numbers for the active language. */
export function formatNumber(value: number, language: Language): string {
  return language === "bn" ? toBengaliDigits(value) : String(value);
}

/**
 * Format an ISO date (YYYY-MM-DD) for display.
 * Uses UTC to keep server and client output identical (no hydration mismatch).
 */
export function formatDate(isoDate: string, language: Language): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** Format file size in bytes to human-readable string (KB, MB). */
export function formatFileSize(bytes: number, language: Language): string {
  if (bytes < 1024) {
    return `${formatNumber(bytes, language)} B`;
  }
  const kb = bytes / 1024;
  if (kb < 1024) {
    const formatted = kb.toFixed(1).replace(/\.0$/, "");
    return `${language === "bn" ? toBengaliDigits(formatted) : formatted} KB`;
  }
  const mb = kb / 1024;
  const formatted = mb.toFixed(2).replace(/\.?0+$/, "");
  return `${language === "bn" ? toBengaliDigits(formatted) : formatted} MB`;
}
