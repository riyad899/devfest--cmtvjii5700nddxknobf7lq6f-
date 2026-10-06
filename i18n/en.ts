import type { Dictionary } from "@/types";

export const en: Dictionary = {
  app: {
    title: "Tender Document Package Builder",
    subtitle: "Assemble a complete, ordered bid submission package",
  },
  language: {
    label: "Language",
    en: "EN",
    bn: "বাং",
  },
  tender: {
    sectionLabel: "Active Tender",
    tenderId: "Tender ID",
    procuringEntity: "Procuring Entity",
    bidder: "Bidder",
    deadline: "Submission Deadline",
  },
  stats: {
    total: "Required Documents",
    mandatory: "Mandatory",
    optional: "Optional",
    withExpiry: "Expiry Tracked",
  },
  steps: {
    upload: { title: "Upload", description: "Add your PDF documents" },
    match: { title: "Match", description: "Map files to requirements" },
    review: { title: "Review", description: "Check gaps & expiry dates" },
    generate: { title: "Generate", description: "Build the final package" },
  },
  requirements: {
    title: "Requirement Checklist",
    subtitle: "Documents listed in the order required by the tender",
    mandatory: "Mandatory",
    optional: "Optional",
    hasExpiry: "Has expiry",
    awaiting: "Awaiting document",
  },
  upload: {
    title: "Document Upload",
    description: "Upload scanned or digital PDF documents for this tender.",
    dropzone: "Drag & drop PDF files here",
    comingSoon: "Coming in the next step",
  },
  package: {
    title: "Package Status",
    mandatoryReady: "mandatory documents ready",
    generate: "Generate Package",
    hint: "Available once all mandatory documents are matched.",
  },
  footer: {
    note: "All processing happens locally in your browser.",
  },
};
