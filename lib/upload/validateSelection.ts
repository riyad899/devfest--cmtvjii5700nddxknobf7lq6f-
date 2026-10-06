import type { FileRejection } from "@/types";
import { MAX_UPLOAD_FILES, MAX_UPLOAD_TOTAL_BYTES } from "@/lib/constants";

export interface SelectionLimits {
  maxFiles: number;
  maxTotalBytes: number;
}

export const DEFAULT_LIMITS: SelectionLimits = {
  maxFiles: MAX_UPLOAD_FILES,
  maxTotalBytes: MAX_UPLOAD_TOTAL_BYTES,
};

export interface SelectionResult<F> {
  accepted: F[];
  rejected: FileRejection[];
}

/** Minimal shape so this stays testable without a DOM `File`. */
interface FileLike {
  name: string;
  size: number;
  type: string;
}

/** Fast, synchronous PDF check by extension/MIME. Content is verified later in lib/pdf. */
export function isPdfCandidate(file: FileLike): boolean {
  return file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
}

/**
 * Decide which newly selected files can be added, given what's already uploaded.
 * Files are considered in selection order; each accepted file consumes a slot and
 * size budget so the 30-file / 50 MB limits are never exceeded.
 */
export function validateSelection<F extends FileLike>(
  incoming: F[],
  existing: { count: number; totalBytes: number },
  limits: SelectionLimits = DEFAULT_LIMITS,
): SelectionResult<F> {
  const accepted: F[] = [];
  const rejected: FileRejection[] = [];
  let count = existing.count;
  let totalBytes = existing.totalBytes;

  for (const file of incoming) {
    if (!isPdfCandidate(file)) {
      rejected.push({ fileName: file.name, code: "not_pdf" });
    } else if (file.size === 0) {
      rejected.push({ fileName: file.name, code: "file_empty" });
    } else if (count >= limits.maxFiles) {
      rejected.push({ fileName: file.name, code: "too_many_files" });
    } else if (totalBytes + file.size > limits.maxTotalBytes) {
      rejected.push({ fileName: file.name, code: "total_size_exceeded" });
    } else {
      accepted.push(file);
      count += 1;
      totalBytes += file.size;
    }
  }

  return { accepted, rejected };
}
