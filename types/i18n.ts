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
  steps: Record<
    "upload" | "match" | "review" | "generate",
    { title: string; description: string }
  >;
  requirements: {
    title: string;
    subtitle: string;
    mandatory: string;
    optional: string;
    hasExpiry: string;
    awaiting: string;
  };
  upload: {
    title: string;
    description: string;
    dropzone: string;
    comingSoon: string;
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
