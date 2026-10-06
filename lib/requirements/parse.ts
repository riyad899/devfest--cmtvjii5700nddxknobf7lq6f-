import type { RequirementsData, ValidationResult } from "@/types";
import { validateRequirementsData } from "./validate";

/** Max accepted size for a requirements file (1 MB is far beyond any real file). */
export const MAX_REQUIREMENTS_FILE_BYTES = 1024 * 1024;

/** Parse raw JSON text and validate it. */
export function parseRequirementsText(text: string): ValidationResult<RequirementsData> {
  // Strip UTF-8 BOM some editors (e.g. Windows Notepad) prepend.
  const cleaned = text.replace(/^\uFEFF/, "");
  if (!cleaned.trim()) {
    return { ok: false, errors: [{ code: "file_empty" }] };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    return {
      ok: false,
      errors: [{ code: "invalid_json", detail: err instanceof Error ? err.message : String(err) }],
    };
  }
  return validateRequirementsData(parsed);
}

function looksLikeJsonFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".json") || file.type === "application/json";
}

/** Read a user-selected File in the browser, then parse + validate it. */
export async function parseRequirementsFile(file: File): Promise<ValidationResult<RequirementsData>> {
  if (!looksLikeJsonFile(file)) {
    return { ok: false, errors: [{ code: "file_type", detail: file.name }] };
  }
  if (file.size === 0) {
    return { ok: false, errors: [{ code: "file_empty" }] };
  }
  if (file.size > MAX_REQUIREMENTS_FILE_BYTES) {
    return { ok: false, errors: [{ code: "file_too_large" }] };
  }

  let text: string;
  try {
    text = await file.text();
  } catch (err) {
    return {
      ok: false,
      errors: [{ code: "file_read", detail: err instanceof Error ? err.message : String(err) }],
    };
  }
  return parseRequirementsText(text);
}
