import type { WorkflowStepId } from "@/types";

export const WORKFLOW_STEPS: WorkflowStepId[] = [
  "requirements",
  "upload",
  "match",
  "review",
  "generate",
];

/** Accepted upload type. */
export const ACCEPTED_FILE_TYPE = "application/pdf";

/** Upload limits (enforced in lib/upload). */
export const MAX_UPLOAD_FILES = 30;
export const MAX_UPLOAD_TOTAL_BYTES = 50 * 1024 * 1024;

/** How many PDFs are parsed in parallel — keeps memory bounded for big scans. */
export const PDF_PROCESSING_CONCURRENCY = 3;
