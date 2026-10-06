/**
 * Triggers a native browser download for a Blob object.
 */
export function downloadPdfBlob(blob: Blob, fileName: string): void {
  if (typeof window === "undefined") return;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();

  // Cleanup object URL after a short tick
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}
