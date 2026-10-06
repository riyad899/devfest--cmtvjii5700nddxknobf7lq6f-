"use client";

import { useRef, type ChangeEvent } from "react";

/**
 * Hidden <input type="file"> wiring shared by every requirements picker.
 * Resets the input value so re-selecting the same (now fixed) file still fires.
 */
export function useJsonFilePicker(onFile: (file: File) => void) {
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => inputRef.current?.click();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onFile(file);
  };

  const inputProps = {
    ref: inputRef,
    type: "file" as const,
    accept: ".json,application/json",
    className: "sr-only",
    tabIndex: -1,
    onChange,
  };

  return { open, inputProps };
}
