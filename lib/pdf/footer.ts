import { PDFDocument, rgb, StandardFonts, PDFFont } from "pdf-lib";

export interface StampFootersOptions {
  tenderId: string;
  fontSize?: number;
  bottomOffset?: number;
}

/**
 * Stamps a consistent, readable pagination footer on every page of the document:
 * "<tender_id> | Page X of Y"
 *
 * Rules:
 * - Y must equal the final total page count.
 * - Footer must be readable and legible.
 * - Footer must not cover document content (positioned in the bottom margin).
 * - Included on the cover page (Page 1) and all subsequent document pages.
 * - Preserves all existing source content.
 */
export async function stampPackageFooters(
  doc: PDFDocument,
  options: StampFootersOptions,
): Promise<void> {
  const { tenderId, fontSize = 8.5, bottomOffset = 18 } = options;

  const font: PDFFont = await doc.embedFont(StandardFonts.Helvetica);
  const totalPages = doc.getPageCount();
  const textColor = rgb(0.28, 0.35, 0.45); // refined legible slate

  for (let i = 0; i < totalPages; i++) {
    const page = doc.getPage(i);
    const { width } = page.getSize();
    const pageNum = i + 1;
    const footerText = `${tenderId} | Page ${pageNum} of ${totalPages}`;

    const textWidth = font.widthOfTextAtSize(footerText, fontSize);
    const x = Math.max(12, (width - textWidth) / 2);

    page.drawText(footerText, {
      x,
      y: bottomOffset,
      size: fontSize,
      font,
      color: textColor,
    });
  }
}
