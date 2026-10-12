"use client";

import { useMesh } from "../../../lib/store";
import { filterCSS } from "../../../lib/api";

/**
 * LiveFilterPreview — side-by-side before/after preview of the
 * current filter stack applied to the currently selected clip.
 */
export default function LiveFilterPreview() {
  const { currentClip, filters } = useMesh();

  if (!currentClip) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-6 text-center dark:border-neutral-700 dark:bg-neutral-950/60">
        <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">
          Select a clip to see the live filter preview
        </p>
      </div>
    );
  }

  const src = currentClip.src || currentClip.url || currentClip.previewUrl;

  const pane = (label, filter) => (
    <div className="relative overflow-hidden rounded-lg border border-neutral-800 bg-black dark:border-neutral-700">
      <video
        key={src}
        src={src}
        muted
        playsInline
        loop
        autoPlay
        className="aspect-video w-full object-cover"
        style={filter ? { filter } : undefined}
      />
      <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
        {label}
      </span>
    </div>
  );

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 dark:border-neutral-700 dark:bg-neutral-950/60">
      <h3 className="mb-3 text-sm font-semibold text-neutral-200 dark:text-neutral-300">
        Live Preview
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {pane("Original")}
        {pane("Filtered", filterCSS(filters))}
      </div>
    </div>
  );
}
