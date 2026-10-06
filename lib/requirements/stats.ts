import type { Requirement, RequirementStats } from "@/types";

export function getRequirementStats(requirements: Requirement[]): RequirementStats {
  const mandatory = requirements.filter((r) => r.mandatory).length;
  return {
    total: requirements.length,
    mandatory,
    optional: requirements.length - mandatory,
    withExpiry: requirements.filter((r) => r.has_expiry).length,
  };
}
