/**
 * Browser-side and Web Crypto API file hashing.
 * Uses SHA-256 to hash raw file content.
 * Independent of file names, timestamps, or system paths.
 */

/**
 * Computes a hex SHA-256 hash of a Blob/File, ArrayBuffer, or ArrayBufferView.
 */
export async function computeSha256(
  data: Blob | ArrayBuffer | ArrayBufferView,
): Promise<string> {
  let source: BufferSource;

  if (typeof Blob !== "undefined" && data instanceof Blob) {
    source = await data.arrayBuffer();
  } else if (ArrayBuffer.isView(data)) {
    // Construct Uint8Array explicitly with proper byteOffset and byteLength
    source = new Uint8Array(
      data.buffer as ArrayBuffer,
      data.byteOffset,
      data.byteLength,
    );
  } else if (data instanceof ArrayBuffer) {
    source = data;
  } else {
    throw new TypeError("Unsupported data type for hashing");
  }

  // Web Crypto API digest
  const hashBuffer = await crypto.subtle.digest("SHA-256", source);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
