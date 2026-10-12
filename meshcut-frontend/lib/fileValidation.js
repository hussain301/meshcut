/**
 * MeshCut — client-side video file validation helper.
 *
 * Pure JS, no dependencies. Works in the browser against File/Blob objects.
 */

export const MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB

export const ALLOWED_EXTENSIONS = ['mp4', 'webm', 'mov', 'mkv'];

const ALLOWED_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
]);

function getExtension(name) {
  if (typeof name !== 'string' || name.indexOf('.') === -1) return '';
  return name.slice(name.lastIndexOf('.') + 1).toLowerCase();
}

/**
 * Validate a video file before upload.
 *
 * @param {File} file - the File object from an <input> or drag-and-drop
 * @returns {{ ok: boolean, error: string|null }}
 */
export function validateFile(file) {
  if (!file) {
    return { ok: false, error: 'No file selected' };
  }

  if (file.size <= 0) {
    return { ok: false, error: 'File is empty' };
  }

  if (file.size > MAX_SIZE) {
    return { ok: false, error: 'File too large (max 2 GB)' };
  }

  const mimeOk = !!file.type && ALLOWED_MIME_TYPES.has(file.type.toLowerCase());
  const extOk = ALLOWED_EXTENSIONS.indexOf(getExtension(file.name)) !== -1;

  // Accept by extension as fallback: some OS/browsers report an empty or
  // generic MIME type for .mkv / .mov files.
  if (!mimeOk && !extOk) {
    return {
      ok: false,
      error: 'Unsupported format — use MP4, WebM, MOV or MKV',
    };
  }

  return { ok: true, error: null };
}
