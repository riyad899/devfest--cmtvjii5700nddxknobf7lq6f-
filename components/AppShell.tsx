"use client";

import { useMemo, useState } from "react";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { useRequirementsLoader } from "@/hooks/useRequirementsLoader";
import { getRequirementStats } from "@/lib/requirements";
import { evaluateAllRequirements } from "@/lib/validation";
import { generatePdfPackage, downloadPdfBlob } from "@/lib/pdf";
import { AppHeader } from "./layout/AppHeader";
import { AppFooter } from "./layout/AppFooter";
import { TenderOverview } from "./tender/TenderOverview";
import { RequirementsChecklist } from "./tender/RequirementsChecklist";
import { ValidationSummaryCard } from "./tender/ValidationSummaryCard";
import { WorkflowSteps } from "./workflow/WorkflowSteps";
import { useUploadedDocuments } from "@/hooks/useUploadedDocuments";
import { useDocumentMatching } from "@/hooks/useDocumentMatching";
import { DocumentUploadSection } from "./upload/DocumentUploadSection";
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
  const upload = useUploadedDocuments();
  const matching = useDocumentMatching(upload.eligibleDocuments);
  const [expiryDates, setExpiryDates] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<{
    fileName: string;
    pageCount: number;
    byteSize: number;
    blob: Blob;
  } | null>(null);

  const { data } = loader;
  const stats = useMemo(() => (data ? getRequirementStats(data.requirements) : null), [data]);

  const { evaluations, summary } = useMemo(() => {
    if (!data) {
      return {
        evaluations: {},
        summary: {
          total: 0,
          ok: 0,
          missing: 0,
          expiryNeeded: 0,
          expired: 0,
          notProvided: 0,
          canGenerate: false,
        },
      };
    }
    return evaluateAllRequirements(
      data.requirements,
      matching.matches,
      expiryDates,
      data.tender.submission_deadline,
    );
  }, [data, matching.matches, expiryDates]);

  const readyMandatory = useMemo(() => {
    if (!data) return 0;
    return data.requirements.filter(
      (r) => r.mandatory && evaluations[r.id]?.status === "OK",
    ).length;
  }, [data, evaluations]);

  const handleExpiryChange = (requirementId: string, date: string) => {
    setExpiryDates((prev) => ({
      ...prev,
      [requirementId]: date,
    }));
  };

  const handleClearTender = () => {
    setExpiryDates({});
    setLastGenerated(null);
    setGenerationError(null);
    matching.clearAll();
    upload.clearAllDocuments();
    upload.dismissRejections();
    loader.reset();
  };

  const handleGeneratePackage = async () => {
    if (!data || !summary.canGenerate) return;
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const result = await generatePdfPackage({
        tender: data.tender,
        requirements: data.requirements,
        matches: matching.matches,
        documents: upload.eligibleDocuments,
        expiryDates,
      });

      setLastGenerated({
        fileName: result.fileName,
        pageCount: result.pageCount,
        byteSize: result.byteSize,
        blob: result.blob,
      });

      // Prompt browser download
      downloadPdfBlob(result.blob, result.fileName);
    } catch (err) {
      setGenerationError(
        err instanceof Error ? err.message : "Failed to generate PDF package.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

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

  const activeStep =
    lastGenerated
      ? "generate"
      : summary.canGenerate
        ? "review"
        : Object.keys(matching.matches).length > 0
          ? "match"
          : "upload";

  return (
    <>
      <LoadedFileBar fileName={loader.fileName ?? ""} onFile={loader.loadFile} onClear={handleClearTender} />
      <TenderOverview tender={data.tender} stats={stats} />
      <WorkflowSteps activeStep={activeStep} />
      <ValidationSummaryCard summary={summary} />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <RequirementsChecklist
            requirements={data.requirements}
            matches={matching.matches}
            eligibleDocs={upload.eligibleDocuments}
            evaluations={evaluations}
            expiryDates={expiryDates}
            submissionDeadline={data.tender.submission_deadline}
            onAssign={matching.assign}
            onUnassign={matching.unassign}
            onExpiryChange={handleExpiryChange}
          />
        </div>
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <DocumentUploadSection
            documents={upload.documents}
            rejections={upload.rejections}
            isProcessing={upload.isProcessing}
            totalBytes={upload.totalBytes}
            onFilesSelected={upload.addFiles}
            onRemoveDocument={upload.removeDocument}
            onClearAll={upload.clearAllDocuments}
            onDismissRejections={upload.dismissRejections}
            onDismissRejection={upload.dismissRejection}
          />
          <PackageStatus
            stats={stats}
            readyMandatory={readyMandatory}
            canGenerate={summary.canGenerate}
            isGenerating={isGenerating}
            onGenerate={handleGeneratePackage}
            lastGenerated={
              lastGenerated
                ? {
                    fileName: lastGenerated.fileName,
                    pageCount: lastGenerated.pageCount,
                    byteSize: lastGenerated.byteSize,
                    onDownload: () =>
                      downloadPdfBlob(lastGenerated.blob, lastGenerated.fileName),
                  }
                : null
            }
            error={generationError}
          />
        </aside>
      </div>
    </>
  );
}
