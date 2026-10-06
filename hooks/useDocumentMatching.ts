"use client";

import { useCallback, useMemo, useState } from "react";
import type { UploadedDocument } from "@/types";
import {
  assignFileToRequirement,
  unassignFileFromRequirement,
  reconcileMatches,
  type MatchesMap,
} from "@/lib/matching";

export interface UseDocumentMatchingReturn {
  matches: MatchesMap;
  assign: (requirementId: string, documentId: string) => void;
  unassign: (requirementId: string) => void;
  clearAll: () => void;
}

export function useDocumentMatching(
  eligibleDocs: UploadedDocument[],
): UseDocumentMatchingReturn {
  const [rawMatches, setRawMatches] = useState<MatchesMap>({});

  // Derive reconciled matches directly during render without extra setState effects
  const matches = useMemo(
    () => reconcileMatches(rawMatches, eligibleDocs),
    [rawMatches, eligibleDocs],
  );

  const assign = useCallback(
    (requirementId: string, documentId: string) => {
      setRawMatches((prev) =>
        assignFileToRequirement(prev, requirementId, documentId, eligibleDocs),
      );
    },
    [eligibleDocs],
  );

  const unassign = useCallback((requirementId: string) => {
    setRawMatches((prev) => unassignFileFromRequirement(prev, requirementId));
  }, []);

  const clearAll = useCallback(() => {
    setRawMatches({});
  }, []);

  return {
    matches,
    assign,
    unassign,
    clearAll,
  };
}
