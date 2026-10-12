"use client";

import { useMesh } from "../../lib/store";

/**
 * Grid of uploaded-video thumbnails.
 * Clicking a thumbnail marks it as the current clip in the shared store
 * and notifies the parent via onSelect.
 */
export default function ThumbnailPreview({ onSelect }) {
  const { uploads, setCurrentClip } = useMesh();

  const playable = (uploads || []).filter(
    (u) => u && u.status === "done" && u.url
  );

  const handleSelect = (upload) => {
    setCurrentClip({
      clip_id: upload.clip_id || upload.id,
      url: upload.url,
      name: upload.name,
      duration: upload.duration || 0,
    });
    if (typeof onSelect === "function") onSelect(upload);
  };

  if (playable.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900/60 px-4 py-8 text-center">
        <p className="text-sm text-neutral-400">
          No uploads yet — drop a video above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {playable.map((u) => (
        <button
          key={u.clip_id || u.id}
          type="button"
          onClick={() => handleSelect(u)}
          className="group overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 text-left transition hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <video
            preload="metadata"
            muted
            src={u.url}
            className="h-24 w-full object-cover transition group-hover:opacity-90"
          />
          <p
            title={u.name}
            className="truncate px-2 py-1.5 text-xs text-neutral-300 group-hover:text-white"
          >
            {u.name || "Untitled clip"}
          </p>
        </button>
      ))}
    </div>
  );
}
