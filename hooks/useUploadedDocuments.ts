"use client";

import { useCallback, useMemo, useState } from "react";
import type { FileRejection, UploadedDocument } from "@/types";
import { PDF_PROCESSING_CONCURRENCY } from "@/lib/constants";
import { validateSelection } from "@/lib/upload";
import { readPdfInfo } from "@/lib/pdf";
import { runWithConcurrency } from "@/utils/concurrency";

export interface UseUploadedDocumentsReturn {
  documents: UploadedDocument[];
  rejections: FileRejection[];
  isProcessing: boolean;
  totalBytes: number;
  addFiles: (files: FileList | File[]) => Promise<void>;
  removeDocument: (id: string) => void;
  clearAllDocuments: () => void;
  dismissRejections: () => void;
  dismissRejection: (index: number) => void;
}

export function useUploadedDocuments(): UseUploadedDocumentsReturn {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [rejections, setRejections] = useState<FileRejection[]>([]);

  const totalBytes = useMemo(
    () => documents.reduce((sum, doc) => sum + doc.fileSize, 0),
    [documents],
  );

  const isProcessing = useMemo(
    () => documents.some((d) => d.status === "processing"),
    [documents],
  );

  const addFiles = useCallback(
    async (rawFiles: FileList | File[]) => {
      const incoming = Array.from(rawFiles);
      if (incoming.length === 0) return;

      // Current snapshot of count & total bytes
      const currentCount = documents.length;
      const currentBytes = documents.reduce((acc, d) => acc + d.fileSize, 0);

      const { accepted, rejected } = validateSelection(incoming, {
        count: currentCount,
        totalBytes: currentBytes,
      });

      if (rejected.length > 0) {
        setRejections((prev) => [...prev, ...rejected]);
      }

      if (accepted.length === 0) return;

      // Create initial placeholders for accepted files with "processing" status
      const initialDocs: UploadedDocument[] = accepted.map((file) => ({
        id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        file,
        fileName: file.name,
        fileSize: file.size,
        pageCount: null,
        isEncrypted: false,
        status: "processing",
        addedAt: Date.now(),
      }));

      // Map doc id to file for processing
      const docMap = new Map<string, File>();
      initialDocs.forEach((d) => docMap.set(d.id, d.file));

      setDocuments((prev) => [...prev, ...initialDocs]);

      // Process in bounded concurrency in browser
      await runWithConcurrency(
        initialDocs,
        PDF_PROCESSING_CONCURRENCY,
        async (docItem) => {
          const file = docMap.get(docItem.id) ?? docItem.file;
          const readResult = await readPdfInfo(file);

          if (readResult.ok) {
            setDocuments((prev) =>
              prev.map((d) =>
                d.id === docItem.id
                  ? {
                      ...d,
                      pageCount: readResult.pageCount,
                      isEncrypted: readResult.isEncrypted,
                      status: "ready",
                    }
                  : d,
              ),
            );
          } else {
            // Failed to parse or corrupt: remove from documents, add to rejections
            setDocuments((prev) => prev.filter((d) => d.id !== docItem.id));
            setRejections((prev) => [
              ...prev,
              { fileName: docItem.fileName, code: readResult.code },
            ]);
          }
        },
      );
    },
    [documents],
  );

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const clearAllDocuments = useCallback(() => {
    setDocuments([]);
  }, []);

  const dismissRejections = useCallback(() => {
    setRejections([]);
  }, []);

  const dismissRejection = useCallback((index: number) => {
    setRejections((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return {
    documents,
    rejections,
    isProcessing,
    totalBytes,
    addFiles,
    removeDocument,
    clearAllDocuments,
    dismissRejections,
    dismissRejection,
  };
}
