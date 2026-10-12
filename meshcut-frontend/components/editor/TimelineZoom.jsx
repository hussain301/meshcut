"use client";

import { useMesh } from "../../lib/store";

const MIN_ZOOM = 20;
const MAX_ZOOM = 200;
const DEFAULT_ZOOM = 80;
const STEP = 10;

function clamp(v) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v));
}

export default function TimelineZoom() {
  const { timeline, setZoom } = useMesh();
  const zoom = timeline?.zoom ?? DEFAULT_ZOOM;

  const zoomIn = () => setZoom(clamp(zoom + STEP));
  const zoomOut = () => setZoom(clamp(zoom - STEP));
  const reset = () => setZoom(DEFAULT_ZOOM);

  const iconBtn =
    "flex h-7 w-7 items-center justify-center rounded-md border border-neutral-300 bg-white text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 active:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div
      className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 dark:border-neutral-800 dark:bg-neutral-900"
      role="group"
      aria-label="Timeline zoom"
    >
      <button
        type="button"
        className={iconBtn}
        onClick={zoomOut}
        disabled={zoom <= MIN_ZOOM}
        aria-label="Zoom out"
        title="Zoom out"
      >
        &minus;
      </button>

      <input
        type="range"
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={STEP}
        value={zoom}
        onChange={(e) => setZoom(clamp(Number(e.target.value)))}
        className="h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-neutral-300 accent-sky-500 dark:bg-neutral-700"
        aria-label="Timeline zoom level (pixels per second)"
        title={`Zoom: ${zoom} px/s`}
      />

      <button
        type="button"
        className={iconBtn}
        onClick={zoomIn}
        disabled={zoom >= MAX_ZOOM}
        aria-label="Zoom in"
        title="Zoom in"
      >
        +
      </button>

      <span
        className="min-w-[3.5rem] text-center font-mono text-[11px] text-neutral-500 dark:text-neutral-400"
        aria-live="polite"
      >
        {zoom}px/s
      </span>

      <button
        type="button"
        onClick={reset}
        disabled={zoom === DEFAULT_ZOOM}
        className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-[11px] font-medium text-neutral-600 transition hover:bg-neutral-100 active:bg-neutral-200 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:active:bg-neutral-600 disabled:cursor-not-allowed disabled:opacity-40"
        title="Reset zoom to 80 px/s"
      >
        Reset
      </button>
    </div>
  );
}
