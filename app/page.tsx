import { AppShell } from "@/components/AppShell";
import { getRequirementsData, getRequirementStats } from "@/lib/requirements";

export default function Home() {
  const data = getRequirementsData();
  const stats = getRequirementStats(data.requirements);

  return <AppShell data={data} stats={stats} />;
}
