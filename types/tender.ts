/**
 * Tender domain types — mirror the shape of `public/requirements.json`.
 */

export interface TenderInfo {
  tender_id: string;
  title: string;
  procuring_entity: string;
  bidder: string;
  /** ISO date string (YYYY-MM-DD) */
  submission_deadline: string;
}

export interface Requirement {
  id: string;
  order: number;
  title_en: string;
  title_bn: string;
  mandatory: boolean;
  has_expiry: boolean;
}

export interface RequirementsData {
  tender: TenderInfo;
  requirements: Requirement[];
}

export interface RequirementStats {
  total: number;
  mandatory: number;
  optional: number;
  withExpiry: number;
}
