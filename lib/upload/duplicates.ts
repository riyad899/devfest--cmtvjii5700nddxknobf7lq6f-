import type { UploadedDocument } from "@/types";

/**
 * Pure function that marks duplicate documents based on their content hash.
 * - The earliest document with a given content hash is treated as the primary file.
 * - Subsequent documents with the identical content hash are marked as duplicates,
 *   referencing the primary file's name and ID.
 * - If a primary file is removed later, re-evaluating the remaining documents will
 *   automatically promote the next remaining copy to primary.
 */
export function markDuplicateDocuments<T extends UploadedDocument>(docs: T[]): T[] {
  const seenHashes = new Map<string, { id: string; fileName: string }>();

  return docs.map((doc) => {
    if (!doc.hash || doc.status === "processing") {
      return {
        ...doc,
        isDuplicate: false,
        duplicateOf: undefined,
        duplicateOfId: undefined,
      };
    }

    const primary = seenHashes.get(doc.hash);
    if (primary) {
      return {
        ...doc,
        isDuplicate: true,
        duplicateOf: primary.fileName,
        duplicateOfId: primary.id,
      };
    }

    seenHashes.set(doc.hash, { id: doc.id, fileName: doc.fileName });
    return {
      ...doc,
      isDuplicate: false,
      duplicateOf: undefined,
      duplicateOfId: undefined,
    };
  });
}

/**
 * Filter out duplicates and unprocessed files for requirement matching.
 */
export function getEligibleMatchingDocuments(docs: UploadedDocument[]): UploadedDocument[] {
  return docs.filter((doc) => doc.status === "ready" && !doc.isDuplicate);
}
