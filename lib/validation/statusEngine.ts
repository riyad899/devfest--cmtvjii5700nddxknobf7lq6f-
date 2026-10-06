import type { Requirement, RequirementStatus } from "@/types";

export interface RequirementEvaluation {
  requirementId: string;
  status: RequirementStatus;
  isMandatory: boolean;
  hasExpiry: boolean;
  hasDocument: boolean;
  documentId?: string;
  expiryDate?: string | null;
}

export interface ValidationSummary {
  total: number;
  ok: number;
  missing: number;
  expiryNeeded: number;
  expired: number;
  notProvided: number;
  canGenerate: boolean;
}

/**
 * Evaluates the status of a single requirement based on tender rules:
 * - Required + no file = MISSING
 * - Optional + no file = NOT_PROVIDED
 * - has_expiry + matched file + no expiry = EXPIRY_NEEDED
 * - expiry before submission deadline = EXPIRED
 * - expiry equal to submission deadline = OK
 * - expiry after submission deadline = OK
 * - matched non-expiring document = OK
 */
export function evaluateRequirementStatus(
  requirement: Requirement,
  matchedDocumentId: string | undefined | null,
  expiryDate: string | undefined | null,
  submissionDeadline: string,
): RequirementStatus {
  const hasFile = Boolean(matchedDocumentId);

  // 1. No document assigned
  if (!hasFile) {
    return requirement.mandatory ? "MISSING" : "NOT_PROVIDED";
  }

  // 2. Document assigned, but this requirement does NOT require an expiry date
  if (!requirement.has_expiry) {
    return "OK";
  }

  // 3. Document assigned, expiry required, but no expiry date provided
  const trimmedExpiry = expiryDate?.trim();
  if (!trimmedExpiry) {
    return "EXPIRY_NEEDED";
  }

  // 4. Expiry comparison with submission deadline (YYYY-MM-DD)
  // - Expiry before submission deadline = EXPIRED
  // - Expiry equal to submission deadline = OK
  // - Expiry after submission deadline = OK
  if (trimmedExpiry < submissionDeadline) {
    return "EXPIRED";
  }

  return "OK";
}

/**
 * Evaluates all requirements for a tender and produces a full breakdown summary.
 * Returns individual requirement evaluations and the overall validation summary.
 */
export function evaluateAllRequirements(
  requirements: Requirement[],
  matches: Record<string, string>,
  expiryDates: Record<string, string>,
  submissionDeadline: string,
): {
  evaluations: Record<string, RequirementEvaluation>;
  summary: ValidationSummary;
} {
  const evaluations: Record<string, RequirementEvaluation> = {};
  let ok = 0;
  let missing = 0;
  let expiryNeeded = 0;
  let expired = 0;
  let notProvided = 0;

  for (const req of requirements) {
    const docId = matches[req.id];
    const expiry = expiryDates[req.id];
    const status = evaluateRequirementStatus(
      req,
      docId,
      expiry,
      submissionDeadline,
    );

    evaluations[req.id] = {
      requirementId: req.id,
      status,
      isMandatory: req.mandatory,
      hasExpiry: req.has_expiry,
      hasDocument: Boolean(docId),
      documentId: docId,
      expiryDate: expiry,
    };

    switch (status) {
      case "OK":
        ok++;
        break;
      case "MISSING":
        missing++;
        break;
      case "EXPIRY_NEEDED":
        expiryNeeded++;
        break;
      case "EXPIRED":
        expired++;
        break;
      case "NOT_PROVIDED":
        notProvided++;
        break;
    }
  }

  // Generate must remain disabled if any blocking status exists.
  // Blocking statuses: MISSING (mandatory without file), EXPIRY_NEEDED, or EXPIRED.
  // NOT_PROVIDED is for optional documents and is non-blocking.
  const hasBlocking = missing > 0 || expiryNeeded > 0 || expired > 0;
  const canGenerate = !hasBlocking && ok > 0;

  const summary: ValidationSummary = {
    total: requirements.length,
    ok,
    missing,
    expiryNeeded,
    expired,
    notProvided,
    canGenerate,
  };

  return { evaluations, summary };
}
