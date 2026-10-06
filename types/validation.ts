/**
 * Structured validation errors for requirements.json loading.
 * Errors are codes + params (not strings) so the UI can localize them.
 */

export type ValidationErrorCode =
  | "file_type"
  | "file_empty"
  | "file_too_large"
  | "file_read"
  | "invalid_json"
  | "root_not_object"
  | "missing_field"
  | "invalid_type"
  | "empty_string"
  | "invalid_date"
  | "empty_requirements"
  | "duplicate_id"
  | "duplicate_order";

export type ExpectedType = "object" | "array" | "string" | "boolean" | "positive_integer";

export interface ValidationError {
  code: ValidationErrorCode;
  /** JSON path to the offending value, e.g. `requirements[2].title_bn` */
  path?: string;
  expected?: ExpectedType;
  /** Extra context: parser message, duplicated value, etc. */
  detail?: string;
}

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; errors: ValidationError[] };

export type LoaderStatus = "idle" | "loading" | "loaded" | "error";
