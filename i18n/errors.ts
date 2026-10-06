import type { Dictionary, ValidationError } from "@/types";

/** Replace `{key}` placeholders in a template string. */
export function interpolate(template: string, params: Record<string, string | number | undefined>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = params[key];
    return value === undefined ? "" : String(value);
  });
}

/** Turn a structured validation error into a localized, human-readable message. */
export function formatValidationError(error: ValidationError, t: Dictionary): string {
  return interpolate(t.errors.codes[error.code], {
    path: error.path,
    detail: error.detail,
    expected: error.expected ? t.errors.expected[error.expected] : undefined,
  });
}
