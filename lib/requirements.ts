import rawData from "@/public/requirements.json";
import type {
  Language,
  Requirement,
  RequirementStats,
  RequirementsData,
} from "@/types";

/** Load tender data with requirements sorted by their required order. */
export function getRequirementsData(): RequirementsData {
  const data = rawData as RequirementsData;
  return {
    tender: data.tender,
    requirements: [...data.requirements].sort((a, b) => a.order - b.order),
  };
}

export function getRequirementStats(requirements: Requirement[]): RequirementStats {
  const mandatory = requirements.filter((r) => r.mandatory).length;
  return {
    total: requirements.length,
    mandatory,
    optional: requirements.length - mandatory,
    withExpiry: requirements.filter((r) => r.has_expiry).length,
  };
}

export function getRequirementTitle(req: Requirement, language: Language): string {
  return language === "bn" ? req.title_bn : req.title_en;
}
