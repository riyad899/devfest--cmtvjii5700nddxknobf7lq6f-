"use client";

import type { FileRejection, UploadedDocument } from "@/types";
import { useLanguage } from "@/i18n/LanguageProvider";
import { DocumentUploadZone } from "./DocumentUploadZone";
import { DocumentList } from "./DocumentList";
import { UploadRejectionList } from "./UploadRejectionList";

interface DocumentUploadSectionProps {
  documents: UploadedDocument[];
  rejections: FileRejection[];
  isProcessing: boolean;
  totalBytes: number;
  onFilesSelected: (files: FileList | File[]) => void;
  onRemoveDocument: (id: string) => void;
  onClearAll: () => void;
  onDismissRejections: () => void;
  onDismissRejection: (index: number) => void;
}

export function DocumentUploadSection({
  documents,
  rejections,
  isProcessing,
  totalBytes,
  onFilesSelected,
  onRemoveDocument,
  onClearAll,
  onDismissRejections,
  onDismissRejection,
}: DocumentUploadSectionProps) {
  const { t } = useLanguage();

  return (
    <section
      aria-labelledby="upload-heading"
      className="animate-fade-up rounded-3xl border border-slate-200 bg-white p-6 shadow-sm [animation-delay:200ms]"
    >
      <div className="mb-4">
        <h2 id="upload-heading" className="text-lg font-semibold text-slate-900">
          {t.upload.title}
        </h2>
        <p className="mt-0.5 text-xs text-slate-500">{t.upload.description}</p>
      </div>

      <div className="space-y-4">
        {rejections.length > 0 && (
          <UploadRejectionList
            rejections={rejections}
            onDismiss={onDismissRejections}
            onDismissOne={onDismissRejection}
          />
        )}

        <DocumentUploadZone
          onFilesSelected={onFilesSelected}
          isProcessing={isProcessing}
        />

        <DocumentList
          documents={documents}
          totalBytes={totalBytes}
          onRemove={onRemoveDocument}
          onClearAll={onClearAll}
        />
      </div>
    </section>
  );
}
