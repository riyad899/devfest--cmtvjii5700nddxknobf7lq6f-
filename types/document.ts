/**
 * Document & matching types.
 * Declared now so later blocks (PDF processing, matching, generation)
 * share a single contract. No logic uses these yet.
 */

export type RequirementStatus =
  | "pending"
  | "matched"
  | "missing"
  | "expired"
  | "needs_review";

export interface UploadedDocument {
  id: string;
  fileName: string;
  /** Size in bytes */
  fileSize: number;
  pageCount?: number;
  /** ISO timestamp */
  uploadedAt: string;
}

export interface RequirementMatch {
  requirementId: string;
  documentId: string | null;
  status: RequirementStatus;
  /** ISO date string, only for requirements with expiry */
  expiryDate?: string | null;
}

export type WorkflowStepId = "upload" | "match" | "review" | "generate";
