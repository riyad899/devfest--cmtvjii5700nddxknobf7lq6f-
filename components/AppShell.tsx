"use client";

import { useMemo } from "react";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { useRequirementsLoader } from "@/hooks/useRequirementsLoader";
import { getRequirementStats } from "@/lib/requirements";
import { AppHeader } from "./layout/AppHeader";
import { AppFooter } from "./layout/AppFooter";
import { TenderOverview } from "./tender/TenderOverview";
import { RequirementsChecklist } from "./tender/RequirementsChecklist";
import { WorkflowSteps } from "./workflow/WorkflowSteps";
import { UploadPlaceholder } from "./upload/UploadPlaceholder";
import { PackageStatus } from "./package/PackageStatus";
import { RequirementsDropzone } from "./requirements/RequirementsDropzone";
import { LoadedFileBar } from "./requirements/LoadedFileBar";

/** Top-level client shell: wires providers and lays out feature sections. */
export function AppShell() {
  return (
    <LanguageProvider>
      <div className="flex min-h-screen flex-col">
        <AppHeader />
        <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Workspace />
        </main>
        <AppFooter />
      </div>
    </LanguageProvider>
  );
}

function Workspace() {
  const loader = useRequirementsLoader();
  const { data } = loader;
  const stats = useMemo(() => (data ? getRequirementStats(data.requirements) : null), [data]);

  if (!data || !stats) {
    return (
      <>
        <WorkflowSteps activeStep="requirements" />
        <RequirementsDropzone
          status={loader.status}
          errors={loader.errors}
          fileName={loader.fileName}
          onFile={loader.loadFile}
        />
      </>
    );
  }

  return (
    <>
      <LoadedFileBar fileName={loader.fileName ?? ""} onFile={loader.loadFile} onClear={loader.reset} />
      <TenderOverview tender={data.tender} stats={stats} />
      <WorkflowSteps activeStep="upload" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RequirementsChecklist requirements={data.requirements} />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <UploadPlaceholder />
          <PackageStatus stats={stats} />
        </aside>
      </div>
    </>
  );
}
