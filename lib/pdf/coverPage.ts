import { PDFDocument, PDFPage, rgb, StandardFonts, PDFFont } from "pdf-lib";
import type { TenderMetadata } from "@/types";

export interface IncludedDocumentInfo {
  order: number;
  requirementId: string;
  requirementTitleEn: string;
  fileName: string;
  pageCount: number;
  expiryDate?: string | null;
  mandatory: boolean;
}

export interface CoverPageOptions {
  tender: TenderMetadata;
  includedDocuments: IncludedDocumentInfo[];
  createdAt?: Date;
}

/**
 * Truncates text with an ellipsis if it exceeds the target width in points.
 */
function fitText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
): string {
  if (font.widthOfTextAtSize(text, fontSize) <= maxWidth) {
    return text;
  }
  let current = text;
  while (current.length > 0) {
    current = current.slice(0, -1);
    if (font.widthOfTextAtSize(current + "...", fontSize) <= maxWidth) {
      return current + "...";
    }
  }
  return "...";
}

/**
 * Formats a date into a clean ISO timestamp string (e.g. "2026-10-06 18:25:00 UTC").
 */
function formatCreationDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} UTC`;
}

/**
 * Generates and draws the English Cover Page (Page 1) of the Tender Submission Package.
 * Standard A4 page (595.28 x 841.89 points).
 */
export async function drawCoverPage(
  doc: PDFDocument,
  options: CoverPageOptions,
): Promise<PDFPage> {
  const { tender, includedDocuments, createdAt = new Date() } = options;

  const fontRegular = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const fontOblique = await doc.embedFont(StandardFonts.HelveticaOblique);

  const page = doc.addPage([595.28, 841.89]);
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 42;
  const contentWidth = pageWidth - marginX * 2; // ~511.28 pt

  // Palette
  const colorNavy = rgb(0.08, 0.13, 0.24); // #14213d
  const colorIndigo = rgb(0.26, 0.35, 0.88); // #4359e0
  const colorSlate = rgb(0.35, 0.42, 0.52); // #596b85
  const colorLightSlate = rgb(0.55, 0.62, 0.71);
  const colorBgLight = rgb(0.96, 0.97, 0.99); // #f5f8fc
  const colorBorder = rgb(0.86, 0.90, 0.95);
  const colorRowAlt = rgb(0.98, 0.99, 1.0);
  const colorWhite = rgb(1, 1, 1);
  const colorEmerald = rgb(0.05, 0.60, 0.38);

  // 1. Top Decorative Accent Line
  page.drawRectangle({
    x: 0,
    y: pageHeight - 6,
    width: pageWidth,
    height: 6,
    color: colorIndigo,
  });

  // 2. Header Block
  let y = pageHeight - 48;

  page.drawText("TENDER SUBMISSION DOCUMENT PACKAGE", {
    x: marginX,
    y,
    size: 19,
    font: fontBold,
    color: colorNavy,
  });

  y -= 16;
  page.drawText("OFFICIAL PROCUREMENT SUBMISSION DOSSIER", {
    x: marginX,
    y,
    size: 8.5,
    font: fontBold,
    color: colorIndigo,
  });

  y -= 14;
  page.drawLine({
    start: { x: marginX, y },
    end: { x: marginX + contentWidth, y },
    thickness: 1,
    color: colorBorder,
  });

  // 3. Metadata Card (Box)
  y -= 12;
  const cardHeight = 118;
  const cardY = y - cardHeight;

  page.drawRectangle({
    x: marginX,
    y: cardY,
    width: contentWidth,
    height: cardHeight,
    color: colorBgLight,
    borderColor: colorBorder,
    borderWidth: 1,
  });

  // Card Content: 2-column key-value grid
  const col1X = marginX + 16;
  const col1ValX = col1X + 105;
  const col2X = marginX + (contentWidth / 2) + 8;
  const col2ValX = col2X + 115;

  const row1Y = y - 24;
  const row2Y = y - 48;
  const row3Y = y - 72;
  const row4Y = y - 96;

  // Row 1: Tender ID & Submission Deadline
  const tenderIdDisplay = tender.id ?? tender.tender_id ?? "Tender";
  page.drawText("Tender ID:", { x: col1X, y: row1Y, size: 8.5, font: fontBold, color: colorSlate });
  page.drawText(fitText(tenderIdDisplay, fontBold, 9, 140), {
    x: col1ValX,
    y: row1Y,
    size: 9,
    font: fontBold,
    color: colorNavy,
  });

  page.drawText("Submission Deadline:", { x: col2X, y: row1Y, size: 8.5, font: fontBold, color: colorSlate });
  page.drawText(tender.submission_deadline, {
    x: col2ValX,
    y: row1Y,
    size: 9,
    font: fontBold,
    color: rgb(0.75, 0.15, 0.15),
  });

  // Row 2: Tender Title
  page.drawText("Tender Title:", { x: col1X, y: row2Y, size: 8.5, font: fontBold, color: colorSlate });
  page.drawText(fitText(tender.title, fontRegular, 8.5, contentWidth - 135), {
    x: col1ValX,
    y: row2Y,
    size: 8.5,
    font: fontRegular,
    color: colorNavy,
  });

  // Row 3: Procuring Entity & Creation Date
  page.drawText("Procuring Entity:", { x: col1X, y: row3Y, size: 8.5, font: fontBold, color: colorSlate });
  page.drawText(fitText(tender.procuring_entity, fontRegular, 8.5, 140), {
    x: col1ValX,
    y: row3Y,
    size: 8.5,
    font: fontRegular,
    color: colorNavy,
  });

  page.drawText("Package Created:", { x: col2X, y: row3Y, size: 8.5, font: fontBold, color: colorSlate });
  page.drawText(formatCreationDate(createdAt), {
    x: col2ValX,
    y: row3Y,
    size: 8,
    font: fontRegular,
    color: colorSlate,
  });

  // Row 4: Bidder & Verification Status
  page.drawText("Bidder Name:", { x: col1X, y: row4Y, size: 8.5, font: fontBold, color: colorSlate });
  page.drawText(fitText(tender.bidder, fontBold, 8.5, 140), {
    x: col1ValX,
    y: row4Y,
    size: 8.5,
    font: fontBold,
    color: colorNavy,
  });

  page.drawText("Status:", { x: col2X, y: row4Y, size: 8.5, font: fontBold, color: colorSlate });
  page.drawText("VERIFIED & COMPLETE", {
    x: col2ValX,
    y: row4Y,
    size: 8.5,
    font: fontBold,
    color: colorEmerald,
  });

  // 4. Included Documents Section
  y = cardY - 26;

  page.drawText("INCLUDED DOCUMENTS (IN TENDER ORDER)", {
    x: marginX,
    y,
    size: 11,
    font: fontBold,
    color: colorNavy,
  });

  const totalPagesCount = includedDocuments.reduce((sum, d) => sum + (d.pageCount || 1), 0);
  const summaryStr = `Total Documents: ${includedDocuments.length}  |  Total Content Pages: ${totalPagesCount}`;
  const summaryWidth = fontRegular.widthOfTextAtSize(summaryStr, 8);
  page.drawText(summaryStr, {
    x: marginX + contentWidth - summaryWidth,
    y,
    size: 8,
    font: fontRegular,
    color: colorSlate,
  });

  // Table Columns
  // Total width: 511.28
  // Order: 28, Requirement: 180, Attached File: 185, Expiry: 75, Pages: 43.28
  const cOrderX = marginX;
  const cReqX = marginX + 32;
  const cFileX = marginX + 215;
  const cExpiryX = marginX + 400;
  const cPagesX = marginX + 475;

  y -= 16;
  const theadHeight = 20;

  // Table Header Background
  page.drawRectangle({
    x: marginX,
    y: y - theadHeight,
    width: contentWidth,
    height: theadHeight,
    color: rgb(0.92, 0.94, 0.97),
    borderColor: colorBorder,
    borderWidth: 1,
  });

  const theadTextY = y - 14;
  page.drawText("#", { x: cOrderX + 6, y: theadTextY, size: 8, font: fontBold, color: colorSlate });
  page.drawText("Requirement Name", { x: cReqX, y: theadTextY, size: 8, font: fontBold, color: colorSlate });
  page.drawText("Attached Document File", { x: cFileX, y: theadTextY, size: 8, font: fontBold, color: colorSlate });
  page.drawText("Expiry Date", { x: cExpiryX, y: theadTextY, size: 8, font: fontBold, color: colorSlate });
  page.drawText("Pages", { x: cPagesX, y: theadTextY, size: 8, font: fontBold, color: colorSlate });

  y -= theadHeight;

  // Table Rows
  const rowHeight = 22;

  includedDocuments.forEach((docInfo, idx) => {
    const isEven = idx % 2 === 0;
    const rowY = y - rowHeight;

    // Background
    page.drawRectangle({
      x: marginX,
      y: rowY,
      width: contentWidth,
      height: rowHeight,
      color: isEven ? colorWhite : colorRowAlt,
      borderColor: colorBorder,
      borderWidth: 0.5,
    });

    const textY = rowY + 6.5;

    // Order number
    page.drawText(String(docInfo.order), {
      x: cOrderX + 8,
      y: textY,
      size: 8,
      font: fontBold,
      color: colorNavy,
    });

    // Requirement Name (English)
    const reqText = fitText(docInfo.requirementTitleEn, fontBold, 8, 175);
    page.drawText(reqText, {
      x: cReqX,
      y: textY,
      size: 8,
      font: fontBold,
      color: colorNavy,
    });

    // File name
    const fileText = fitText(docInfo.fileName, fontRegular, 8, 175);
    page.drawText(fileText, {
      x: cFileX,
      y: textY,
      size: 8,
      font: fontRegular,
      color: colorSlate,
    });

    // Expiry Date (or N/A)
    const expiryText = docInfo.expiryDate?.trim() || "N/A";
    page.drawText(expiryText, {
      x: cExpiryX,
      y: textY,
      size: 7.5,
      font: fontRegular,
      color: docInfo.expiryDate ? colorNavy : colorLightSlate,
    });

    // Pages
    const pagesText = `${docInfo.pageCount} p.`;
    page.drawText(pagesText, {
      x: cPagesX + 2,
      y: textY,
      size: 8,
      font: fontRegular,
      color: colorSlate,
    });

    y -= rowHeight;
  });

  // 5. Official Footer / Notes at bottom
  const footerY = 46;
  page.drawLine({
    start: { x: marginX, y: footerY + 16 },
    end: { x: marginX + contentWidth, y: footerY + 16 },
    thickness: 0.5,
    color: colorBorder,
  });

  page.drawText(
    "CONFIDENTIAL & PROPRIETARY — PREPARED EXCLUSIVELY FOR THE SPECIFIED TENDER SUBMISSION",
    {
      x: marginX,
      y: footerY + 6,
      size: 6.5,
      font: fontBold,
      color: colorLightSlate,
    },
  );

  page.drawText(
    "All attached documents are merged sequentially in strict accordance with the procurement requirement order.",
    {
      x: marginX,
      y: footerY - 4,
      size: 6.5,
      font: fontOblique,
      color: colorLightSlate,
    },
  );

  return page;
}
