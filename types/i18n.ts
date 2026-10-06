import type { ExpectedType, ValidationErrorCode } from "./validation";
import type { WorkflowStepId, FileRejectionCode } from "./document";

export type Language = "en" | "bn";

export interface Dictionary {
  app: {
    title: string;
    subtitle: string;
  };
  language: {
    label: string;
    en: string;
    bn: string;
  };
  tender: {
    sectionLabel: string;
    tenderId: string;
    procuringEntity: string;
    bidder: string;
    deadline: string;
  };
  stats: {
    total: string;
    mandatory: string;
    optional: string;
    withExpiry: string;
  };
  steps: Record<WorkflowStepId, { title: string; description: string }>;
  requirements: {
    title: string;
    subtitle: string;
    order: string;
    titleEn: string;
    titleBn: string;
    type: string;
    expiry: string;
    mandatory: string;
    optional: string;
    expiryRequired: string;
    expiryNotRequired: string;
    awaiting: string;
  };
  loader: {
    title: string;
    description: string;
    dropzone: string;
    browse: string;
    hint: string;
    loading: string;
    loadedFrom: string;
    replace: string;
    clear: string;
    privacy: string;
  };
  errors: {
    title: string;
    subtitle: string;
    moreErrors: string;
    tryAgain: string;
    codes: Record<ValidationErrorCode, string>;
    expected: Record<ExpectedType, string>;
  };
  upload: {
    title: string;
    description: string;
    dropzone: string;
    browse: string;
    hint: string;
    limits: string;
    processing: string;
    uploadedCount: string;
    totalSize: string;
    clearAll: string;
    remove: string;
    pageCount: string;
    readingPages: string;
    encrypted: string;
    noFilesYet: string;
    rejectionsTitle: string;
    dismiss: string;
    errors: Record<FileRejectionCode, string>;
  };
  package: {
    title: string;
    mandatoryReady: string;
    generate: string;
    hint: string;
  };
  footer: {
    note: string;
  };
}
