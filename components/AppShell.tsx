"use client";

import type { RequirementsData, RequirementStats } from "@/types";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { AppHeader } from "./layout/AppHeader";
import { AppFooter } from "./layout/AppFooter";
import { TenderOverview } from "./tender/TenderOverview";
import { RequirementsChecklist } from "./tender/RequirementsChecklist";
import { WorkflowSteps } from "./workflow/WorkflowSteps";
import { UploadPlaceholder } from "./upload/UploadPlaceholder";
import { PackageStatus } from "./package/PackageStatus";

interface AppShellProps {
  data: RequirementsData;
  stats: RequirementStats;
}

/** Top-level client shell: wires providers and lays out feature sections. */
export function AppShell({ data, stats }: AppShellProps) {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <TenderOverview tender={data.tender} stats={stats} />
          <WorkflowSteps activeStep="upload" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RequirementsChecklist requirements={data.requirements} />
            </div>
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <UploadPlaceholder />
              <PackageStatus stats={stats} />
            </aside>
          </div>
        </main>
        <AppFooter />
      </div>
    </LanguageProvider>
  );
}
