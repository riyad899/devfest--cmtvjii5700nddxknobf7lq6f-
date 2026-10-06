import type {
  ExpectedType,
  Requirement,
  RequirementsData,
  TenderInfo,
  ValidationError,
  ValidationResult,
} from "@/types";

/**
 * Pure, framework-free validation for requirements.json content.
 * Collects *all* problems instead of failing on the first one so the
 * user can fix the file in a single pass.
 */

type UnknownRecord = Record<string, unknown>;

const TENDER_STRING_FIELDS = [
  "tender_id",
  "title",
  "procuring_entity",
  "bidder",
  "submission_deadline",
] as const satisfies ReadonlyArray<keyof TenderInfo>;

const REQUIREMENT_STRING_FIELDS = ["id", "title_en", "title_bn"] as const satisfies ReadonlyArray<
  keyof Requirement
>;

const REQUIREMENT_BOOLEAN_FIELDS = ["mandatory", "has_expiry"] as const satisfies ReadonlyArray<
  keyof Requirement
>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Strict YYYY-MM-DD that is also a real calendar date (rejects 2026-02-30). */
export function isValidIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, y, m, d] = match.map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

function typeError(path: string, expected: ExpectedType): ValidationError {
  return { code: "invalid_type", path, expected };
}

/** Validate a required non-empty string field; returns trimmed value or null. */
function readString(
  obj: UnknownRecord,
  key: string,
  path: string,
  errors: ValidationError[],
): string | null {
  if (!(key in obj) || obj[key] === undefined || obj[key] === null) {
    errors.push({ code: "missing_field", path, expected: "string" });
    return null;
  }
  const value = obj[key];
  if (typeof value !== "string") {
    errors.push(typeError(path, "string"));
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    errors.push({ code: "empty_string", path });
    return null;
  }
  return trimmed;
}

function readBoolean(
  obj: UnknownRecord,
  key: string,
  path: string,
  errors: ValidationError[],
): boolean | null {
  if (!(key in obj) || obj[key] === undefined || obj[key] === null) {
    errors.push({ code: "missing_field", path, expected: "boolean" });
    return null;
  }
  const value = obj[key];
  if (typeof value !== "boolean") {
    errors.push(typeError(path, "boolean"));
    return null;
  }
  return value;
}

function readPositiveInteger(
  obj: UnknownRecord,
  key: string,
  path: string,
  errors: ValidationError[],
): number | null {
  if (!(key in obj) || obj[key] === undefined || obj[key] === null) {
    errors.push({ code: "missing_field", path, expected: "positive_integer" });
    return null;
  }
  const value = obj[key];
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    errors.push(typeError(path, "positive_integer"));
    return null;
  }
  return value;
}

function validateTender(raw: unknown, errors: ValidationError[]): TenderInfo | null {
  if (raw === undefined || raw === null) {
    errors.push({ code: "missing_field", path: "tender", expected: "object" });
    return null;
  }
  if (!isRecord(raw)) {
    errors.push(typeError("tender", "object"));
    return null;
  }

  const startCount = errors.length;
  const values = {} as Record<(typeof TENDER_STRING_FIELDS)[number], string>;
  for (const field of TENDER_STRING_FIELDS) {
    const v = readString(raw, field, `tender.${field}`, errors);
    if (v !== null) values[field] = v;
  }

  if (values.submission_deadline && !isValidIsoDate(values.submission_deadline)) {
    errors.push({
      code: "invalid_date",
      path: "tender.submission_deadline",
      detail: values.submission_deadline,
    });
  }

  return errors.length === startCount ? values : null;
}

function validateRequirement(
  raw: unknown,
  index: number,
  errors: ValidationError[],
): Requirement | null {
  const base = `requirements[${index}]`;
  if (!isRecord(raw)) {
    errors.push(typeError(base, "object"));
    return null;
  }

  const startCount = errors.length;
  const strings = {} as Record<(typeof REQUIREMENT_STRING_FIELDS)[number], string>;
  for (const field of REQUIREMENT_STRING_FIELDS) {
    const v = readString(raw, field, `${base}.${field}`, errors);
    if (v !== null) strings[field] = v;
  }
  const order = readPositiveInteger(raw, "order", `${base}.order`, errors);
  const bools = {} as Record<(typeof REQUIREMENT_BOOLEAN_FIELDS)[number], boolean>;
  for (const field of REQUIREMENT_BOOLEAN_FIELDS) {
    const v = readBoolean(raw, field, `${base}.${field}`, errors);
    if (v !== null) bools[field] = v;
  }

  if (errors.length !== startCount || order === null) return null;
  return { ...strings, order, ...bools };
}

function validateRequirements(raw: unknown, errors: ValidationError[]): Requirement[] | null {
  if (raw === undefined || raw === null) {
    errors.push({ code: "missing_field", path: "requirements", expected: "array" });
    return null;
  }
  if (!Array.isArray(raw)) {
    errors.push(typeError("requirements", "array"));
    return null;
  }
  if (raw.length === 0) {
    errors.push({ code: "empty_requirements", path: "requirements" });
    return null;
  }

  const startCount = errors.length;
  const items = raw.map((item, i) => validateRequirement(item, i, errors));

  // Uniqueness checks on the items that parsed successfully.
  const seenIds = new Map<string, number>();
  const seenOrders = new Map<number, number>();
  items.forEach((req, i) => {
    if (!req) return;
    const idKey = req.id.toLowerCase();
    if (seenIds.has(idKey)) {
      errors.push({ code: "duplicate_id", path: `requirements[${i}].id`, detail: req.id });
    } else {
      seenIds.set(idKey, i);
    }
    if (seenOrders.has(req.order)) {
      errors.push({
        code: "duplicate_order",
        path: `requirements[${i}].order`,
        detail: String(req.order),
      });
    } else {
      seenOrders.set(req.order, i);
    }
  });

  if (errors.length !== startCount) return null;
  return items as Requirement[];
}

/** Validate already-parsed JSON. Requirements are returned sorted by `order`. */
export function validateRequirementsData(input: unknown): ValidationResult<RequirementsData> {
  if (!isRecord(input)) {
    return { ok: false, errors: [{ code: "root_not_object", expected: "object" }] };
  }

  const errors: ValidationError[] = [];
  const tender = validateTender(input.tender, errors);
  const requirements = validateRequirements(input.requirements, errors);

  if (errors.length > 0 || !tender || !requirements) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    data: {
      tender,
      requirements: [...requirements].sort((a, b) => a.order - b.order),
    },
  };
}
