"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LoaderStatus, RequirementsData, ValidationError } from "@/types";
import { parseRequirementsFile, parseRequirementsText } from "@/lib/requirements";

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

  const loadDefault = useCallback(async () => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, status: "loading", errors: [], fileName: "requirements.json" }));

    try {
      const res = await fetch("/requirements.json");
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Failed to fetch /requirements.json`);
      }
      const text = await res.text();
      const result = parseRequirementsText(text);
      if (id !== requestId.current) return;

      setState(
        result.ok
          ? { status: "loaded", data: result.data, errors: [], fileName: "requirements.json" }
          : { status: "error", data: null, errors: result.errors, fileName: "requirements.json" },
      );
    } catch (err) {
      if (id !== requestId.current) return;
      setState({
        status: "error",
        data: null,
        errors: [{ code: "file_read", detail: err instanceof Error ? err.message : String(err) }],
        fileName: "requirements.json",
      });
    }
  }, []);

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

  // Automatically load default requirements.json on initial load
  useEffect(() => {
    let cancelled = false;
    async function fetchDefault() {
      try {
        const res = await fetch("/requirements.json");
        if (!res.ok) return;
        const text = await res.text();
        const result = parseRequirementsText(text);
        if (cancelled) return;
        if (result.ok) {
          setState({
            status: "loaded",
            data: result.data,
            errors: [],
            fileName: "requirements.json",
          });
        }
      } catch {
        // Fall back gracefully to user upload dropzone
      }
    }
    fetchDefault();
    return () => {
      cancelled = true;
    };
  }, []);

  const reset = useCallback(() => {
    requestId.current++;
    setState(INITIAL_STATE);
  }, []);

  return { ...state, loadFile, loadDefault, reset };
}

