/**
 * PDF signature check. The PDF spec allows the `%PDF-` header to appear
 * anywhere within the first 1024 bytes, so we scan that window rather than
 * only offset 0. This catches files renamed to `.pdf` that aren't PDFs.
 */
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46, 0x2d]; // "%PDF-"
export const PDF_HEADER_SCAN_BYTES = 1024;

export function hasPdfSignature(bytes: Uint8Array): boolean {
  const limit = Math.min(bytes.length, PDF_HEADER_SCAN_BYTES) - PDF_MAGIC.length;
  for (let i = 0; i <= limit; i++) {
    let match = true;
    for (let j = 0; j < PDF_MAGIC.length; j++) {
      if (bytes[i + j] !== PDF_MAGIC[j]) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}
