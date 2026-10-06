import type { FileRejectionCode } from "@/types";
import { hasPdfSignature, PDF_HEADER_SCAN_BYTES } from "./signature";

export type PdfReadResult =
  | { ok: true; pageCount: number; isEncrypted: boolean }
  | { ok: false; code: Extract<FileRejectionCode, "invalid_signature" | "corrupt_pdf" | "no_pages" | "read_failed"> };

/**
 * Read a PDF entirely in the browser and return its page count.
 * pdf-lib is loaded lazily so it only ships when the user actually adds PDFs.
 */
export async function readPdfInfo(file: Blob): Promise<PdfReadResult> {
  // Cheap header check first — avoids loading a large non-PDF into memory.
  try {
    const head = new Uint8Array(await file.slice(0, PDF_HEADER_SCAN_BYTES).arrayBuffer());
    if (!hasPdfSignature(head)) return { ok: false, code: "invalid_signature" };
  } catch {
    return { ok: false, code: "read_failed" };
  }

  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    return { ok: false, code: "read_failed" };
  }

  try {
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(bytes, {
      // Encrypted PDFs still expose their page tree; we flag them instead of failing.
      ignoreEncryption: true,
      updateMetadata: false,
      throwOnInvalidObject: false,
    });
    const pageCount = doc.getPageCount();
    if (pageCount < 1) return { ok: false, code: "no_pages" };
    return { ok: true, pageCount, isEncrypted: doc.isEncrypted };
  } catch {
    return { ok: false, code: "corrupt_pdf" };
  }
}
