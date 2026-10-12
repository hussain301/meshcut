/**
 * Frame-snapping helper for the MeshCut video editor.
 * Pure JS, no dependencies.
 */

/**
 * Snap a time (seconds) to the nearest frame boundary.
 * @param {number} time - Time in seconds.
 * @param {number} fps - Frames per second (default 30).
 * @returns {number} Nearest frame time, clamped to >= 0.
 */
export function snapToFrame(time, fps = 30) {
  const snapped = Math.round(time * fps) / fps;
  return Math.max(0, snapped);
}

/**
 * Convert a frame count to a time in seconds.
 * @param {number} frames - Number of frames.
 * @param {number} fps - Frames per second (default 30).
 * @returns {number} Time in seconds.
 */
export function framesToTime(frames, fps = 30) {
  return frames / fps;
}
