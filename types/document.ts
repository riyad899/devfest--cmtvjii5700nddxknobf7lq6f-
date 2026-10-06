/**
 * Document & matching types.
 * Declared now so later blocks (PDF processing, matching, generation)
 * share a single contract. No logic uses these yet.
 */

export type RequirementStatus =
  | "MISSING"
  | "EXPIRY_NEEDED"
  | "EXPIRED"
  | "NOT_PROVIDED"
  | "OK";

export type DocumentProcessingStatus = "processing" | "ready";

export interface UploadedDocument {
  id: string;
  /** Original browser File — kept in memory only, never sent anywhere. */
  file: File;
  fileName: string;
  /** Size in bytes */
  fileSize: number;
  /** null while the PDF is still being read */
  pageCount: number | null;
  isEncrypted: boolean;
  status: DocumentProcessingStatus;
  /** SHA-256 hash of file contents computed in browser */
  hash?: string;
  /** True if another file with identical content was already uploaded */
  isDuplicate?: boolean;
  /** Original file name that this file duplicates */
  duplicateOf?: string;
  /** Original file ID that this file duplicates */
  duplicateOfId?: string;
  /** epoch ms */
  addedAt: number;
}

export type FileRejectionCode =
  | "not_pdf"
  | "file_empty"
  | "too_many_files"
  | "total_size_exceeded"
  | "invalid_signature"
  | "corrupt_pdf"
  | "no_pages"
  | "read_failed";

export interface FileRejection {
  fileName: string;
  code: FileRejectionCode;
}

export interface RequirementMatch {
  requirementId: string;
  documentId: string | null;
  status: RequirementStatus;
  /** ISO date string, only for requirements with expiry */
  expiryDate?: string | null;
}

export type WorkflowStepId = "requirements" | "upload" | "match" | "review" | "generate";
