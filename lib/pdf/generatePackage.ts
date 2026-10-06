import { PDFDocument } from "pdf-lib";
import type { TenderMetadata, Requirement } from "@/types";
import { evaluateAllRequirements } from "@/lib/validation";
import { drawCoverPage, type IncludedDocumentInfo } from "./coverPage";
import { stampPackageFooters } from "./footer";

export interface PackageInputDocument {
  id: string;
  fileName: string;
  file?: Blob | File | ArrayBuffer | Uint8Array;
  bytes?: ArrayBuffer | Uint8Array;
  pageCount?: number | null;
}

export interface GeneratePackageOptions {
  tender: TenderMetadata;
  requirements: Requirement[];
  matches: Record<string, string>;
  documents: PackageInputDocument[];
  expiryDates?: Record<string, string>;
  createdAt?: Date;
}

export interface GeneratedPackageResult {
  blob: Blob;
  fileName: string;
  pageCount: number;
  byteSize: number;
  includedCount: number;
  includedDocuments: IncludedDocumentInfo[];
}

/**
 * Normalizes input document file/bytes to an ArrayBuffer.
 */
async function getDocumentBytes(doc: PackageInputDocument): Promise<ArrayBuffer> {
  if (doc.bytes) {
    if (doc.bytes instanceof ArrayBuffer) return doc.bytes;
    return doc.bytes.buffer.slice(
      doc.bytes.byteOffset,
      doc.bytes.byteOffset + doc.bytes.byteLength,
    ) as ArrayBuffer;
  }
  if (doc.file) {
    if (doc.file instanceof ArrayBuffer) return doc.file;
    if (doc.file instanceof Uint8Array) {
      return doc.file.buffer.slice(
        doc.file.byteOffset,
        doc.file.byteOffset + doc.file.byteLength,
      ) as ArrayBuffer;
    }
    if (typeof (doc.file as Blob).arrayBuffer === "function") {
      return await (doc.file as Blob).arrayBuffer();
    }
  }
  throw new Error(`Document "${doc.fileName}" (${doc.id}) has no valid file content.`);
}

/**
 * Builds the safe filename for the generated tender package.
 * Format: <tender_id>_Package.pdf
 * e.g. "IFT-2026-0042_Package.pdf" or "T-2026-0417_Package.pdf"
 */
export function buildPackageFileName(tenderId: string): string {
  const safeId = (tenderId || "Tender").trim().replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${safeId}_Package.pdf`;
}

/**
 * Generates the complete Tender Submission PDF package:
 * - Validates that no blocking status exists (throws if blocked)
 * - Page 1: English Cover Page with metadata & ordered included documents list
 * - Appends matched PDFs according to requirement.order
 * - Preserves all pages and original page order for each document
 * - Skips optional requirements without matched files
 * - Stamps footer on every page (including cover): "<tender_id> | Page X of Y"
 * - Returns a downloadable PDF Blob with filename "<tender_id>_Package.pdf"
 */
export async function generatePdfPackage(
  options: GeneratePackageOptions,
): Promise<GeneratedPackageResult> {
  const {
    tender,
    requirements,
    matches,
    documents,
    expiryDates = {},
    createdAt = new Date(),
  } = options;

  // 1. Strict status validation — only allow generation when no blocking status exists
  const { summary } = evaluateAllRequirements(
    requirements,
    matches,
    expiryDates,
    tender.submission_deadline,
  );

  if (!summary.canGenerate) {
    const blockers: string[] = [];
    if (summary.missing > 0) blockers.push(`${summary.missing} mandatory requirement(s) missing`);
    if (summary.expiryNeeded > 0) blockers.push(`${summary.expiryNeeded} document(s) requiring expiry date`);
    if (summary.expired > 0) blockers.push(`${summary.expired} expired document(s)`);
    if (summary.ok === 0) blockers.push("no documents matched");

    throw new Error(
      `Cannot generate package while blocking statuses exist: ${blockers.join(", ")}.`,
    );
  }

  // 2. Sort requirements by requirement.order
  const sortedRequirements = [...requirements].sort((a, b) => a.order - b.order);

  // 3. Document lookup
  const docMap = new Map<string, PackageInputDocument>();
  for (const doc of documents) {
    docMap.set(doc.id, doc);
  }

  // 4. Filter matched requirements (skip optional without files) & prepare loaded PDF docs
  interface MatchedItem {
    req: Requirement;
    docInfo: PackageInputDocument;
    pdfDoc: PDFDocument;
    pageCount: number;
    expiryDate?: string;
  }

  const matchedItems: MatchedItem[] = [];
  const includedDocInfos: IncludedDocumentInfo[] = [];

  for (const req of sortedRequirements) {
    const docId = matches[req.id];
    if (!docId) {
      // Unmatched optional requirement: skipped
      continue;
    }

    const docInput = docMap.get(docId);
    if (!docInput) {
      throw new Error(`Matched document with ID "${docId}" was not found.`);
    }

    const rawBytes = await getDocumentBytes(docInput);
    const pdfDoc = await PDFDocument.load(rawBytes, {
      ignoreEncryption: true,
      updateMetadata: false,
      throwOnInvalidObject: false,
    });

    const pageCount = pdfDoc.getPageCount();
    const expiry = expiryDates[req.id];

    matchedItems.push({
      req,
      docInfo: docInput,
      pdfDoc,
      pageCount,
      expiryDate: expiry,
    });

    includedDocInfos.push({
      order: req.order,
      requirementId: req.id,
      requirementTitleEn: req.title_en,
      fileName: docInput.fileName,
      pageCount,
      expiryDate: expiry,
      mandatory: req.mandatory,
    });
  }

  // 5. Create new merged PDF Document
  const mergedDoc = await PDFDocument.create();

  // 6. Draw Page 1: English Cover Page
  await drawCoverPage(mergedDoc, {
    tender,
    includedDocuments: includedDocInfos,
    createdAt,
  });

  // 7. Sequentially append all matched PDFs in requirement.order
  for (const item of matchedItems) {
    const indices = item.pdfDoc.getPageIndices();
    const copiedPages = await mergedDoc.copyPages(item.pdfDoc, indices);
    for (const page of copiedPages) {
      mergedDoc.addPage(page);
    }
  }

  // 8. Stamp pagination footers on EVERY page (including cover): "<tender_id> | Page X of Y"
  const tenderId = (tender.id ?? tender.tender_id ?? "Tender").trim();
  await stampPackageFooters(mergedDoc, {
    tenderId,
    fontSize: 8.5,
    bottomOffset: 18,
  });

  // 9. Save the merged PDF bytes
  const pdfBytes = await mergedDoc.save();
  const arrayBuffer = pdfBytes.buffer.slice(
    pdfBytes.byteOffset,
    pdfBytes.byteOffset + pdfBytes.byteLength,
  ) as ArrayBuffer;
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });
  const fileName = buildPackageFileName(tenderId);

  return {
    blob,
    fileName,
    pageCount: mergedDoc.getPageCount(),
    byteSize: pdfBytes.byteLength,
    includedCount: includedDocInfos.length,
    includedDocuments: includedDocInfos,
  };
}
