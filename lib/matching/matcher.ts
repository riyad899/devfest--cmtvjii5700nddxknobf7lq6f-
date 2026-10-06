import type { UploadedDocument } from "@/types";

export type MatchesMap = Record<string, string>; // requirementId -> documentId

/**
 * Assigns a document to a requirement while strictly adhering to:
 * 1. One requirement can have at most one file.
 * 2. One file can match at most one requirement.
 * 3. Duplicate files cannot be assigned.
 */
export function assignFileToRequirement(
  currentMatches: MatchesMap,
  requirementId: string,
  documentId: string,
  eligibleDocs: UploadedDocument[],
): MatchesMap {
  // Verify document is eligible (ready & not a duplicate)
  const isEligible = eligibleDocs.some(
    (d) => d.id === documentId && d.status === "ready" && !d.isDuplicate,
  );
  if (!isEligible) {
    return currentMatches;
  }

  const nextMatches: MatchesMap = {};

  // Copy over matches, unassigning the file from any other requirement
  // to ensure 1 file matches at most 1 requirement.
  for (const [rId, dId] of Object.entries(currentMatches)) {
    if (rId !== requirementId && dId !== documentId) {
      nextMatches[rId] = dId;
    }
  }

  // Assign to the target requirement (replaces any previous file for this requirement)
  nextMatches[requirementId] = documentId;

  return nextMatches;
}

/**
 * Unassigns / removes a matched file from a requirement.
 */
export function unassignFileFromRequirement(
  currentMatches: MatchesMap,
  requirementId: string,
): MatchesMap {
  const nextMatches: MatchesMap = { ...currentMatches };
  delete nextMatches[requirementId];
  return nextMatches;
}

/**
 * Prunes matches for documents that have been deleted or flagged as duplicate.
 */
export function reconcileMatches(
  currentMatches: MatchesMap,
  eligibleDocs: UploadedDocument[],
): MatchesMap {
  const eligibleIds = new Set(
    eligibleDocs
      .filter((d) => d.status === "ready" && !d.isDuplicate)
      .map((d) => d.id),
  );

  const nextMatches: MatchesMap = {};
  for (const [rId, dId] of Object.entries(currentMatches)) {
    if (eligibleIds.has(dId)) {
      nextMatches[rId] = dId;
    }
  }
  return nextMatches;
}
