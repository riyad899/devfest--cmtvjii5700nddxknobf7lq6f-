"use client";

import { useCallback, useRef, useState } from "react";
import type { LoaderStatus, RequirementsData, ValidationError } from "@/types";
import { parseRequirementsFile } from "@/lib/requirements";

export interface RequirementsLoaderState {
  status: LoaderStatus;
  data: RequirementsData | null;
  errors: ValidationError[];
  fileName: string | null;
}

const INITIAL_STATE: RequirementsLoaderState = {
  status: "idle",
  data: null,
  errors: [],
  fileName: null,
};

/** Owns requirements.json loading state; all parsing lives in lib/requirements. */
export function useRequirementsLoader() {
  const [state, setState] = useState<RequirementsLoaderState>(INITIAL_STATE);
  // Ignore stale results if the user picks another file before the first finishes.
  const requestId = useRef(0);

  const loadFile = useCallback(async (file: File) => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, status: "loading", errors: [], fileName: file.name }));

    const result = await parseRequirementsFile(file);
    if (id !== requestId.current) return;

    setState(
      result.ok
        ? { status: "loaded", data: result.data, errors: [], fileName: file.name }
        : { status: "error", data: null, errors: result.errors, fileName: file.name },
    );
  }, []);

  const reset = useCallback(() => {
    requestId.current++;
    setState(INITIAL_STATE);
  }, []);

  return { ...state, loadFile, reset };
}
