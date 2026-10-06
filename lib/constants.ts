import type { WorkflowStepId } from "@/types";

export const WORKFLOW_STEPS: WorkflowStepId[] = [
  "requirements",
  "upload",
  "match",
  "review",
  "generate",
];

/** Accepted upload type (used in later blocks). */
export const ACCEPTED_FILE_TYPE = "application/pdf";
