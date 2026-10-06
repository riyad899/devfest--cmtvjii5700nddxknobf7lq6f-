"use client";

import { useCallback, useMemo, useState } from "react";
import type { FileRejection, UploadedDocument } from "@/types";
import { PDF_PROCESSING_CONCURRENCY } from "@/lib/constants";
import { validateSelection, markDuplicateDocuments, getEligibleMatchingDocuments } from "@/lib/upload";
import { readPdfInfo } from "@/lib/pdf";
import { computeSha256 } from "@/lib/crypto";
import { runWithConcurrency } from "@/utils/concurrency";

export interface UseUploadedDocumentsReturn {
  documents: UploadedDocument[];
  rejections: FileRejection[];
  isProcessing: boolean;
  totalBytes: number;
  duplicateCount: number;
  eligibleDocuments: UploadedDocument[];
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

  const duplicateCount = useMemo(
    () => documents.filter((d) => d.isDuplicate).length,
    [documents],
  );

  const eligibleDocuments = useMemo(
    () => getEligibleMatchingDocuments(documents),
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

          // Simultaneously parse PDF structure and compute SHA-256 hash using Web Crypto API
          const [readResult, hashResult] = await Promise.all([
            readPdfInfo(file),
            computeSha256(file),
          ]);

          if (readResult.ok) {
            setDocuments((prev) => {
              const updated = prev.map((d) =>
                d.id === docItem.id
                  ? {
                      ...d,
                      pageCount: readResult.pageCount,
                      isEncrypted: readResult.isEncrypted,
                      hash: hashResult,
                      status: "ready" as const,
                    }
                  : d,
              );
              // Re-evaluate duplicates across all documents
              return markDuplicateDocuments(updated);
            });
          } else {
            // Failed to parse or corrupt: remove from documents, add to rejections
            setDocuments((prev) => {
              const remaining = prev.filter((d) => d.id !== docItem.id);
              return markDuplicateDocuments(remaining);
            });
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
    setDocuments((prev) => {
      const remaining = prev.filter((d) => d.id !== id);
      // Re-evaluate duplicates: if a primary was removed, next copy is promoted
      return markDuplicateDocuments(remaining);
    });
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
    duplicateCount,
    eligibleDocuments,
    addFiles,
    removeDocument,
    clearAllDocuments,
    dismissRejections,
    dismissRejection,
  };
}
