"use client";

import { useMesh } from "../../../lib/store";

const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}.${Math.floor((s % 1) * 10)}`;

export default function TextTimeline({ overlayId }) {
  const { textOverlays, updateTextOverlay, currentClip } = useMesh();

  if (!overlayId) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        Select a text overlay first
      </div>
    );
  }

  const overlay = textOverlays.find((o) => o.id === overlayId);

  if (!overlay) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400">
        Overlay not found
      </div>
    );
  }

  const duration = Math.max(0.1, currentClip?.duration ?? 0);
  const clamp = (v) => Math.min(Math.max(v, 0), duration);
  const start = clamp(overlay.start ?? 0);
  const end = clamp(overlay.end ?? duration);

  const setStart = (raw) => {
    const v = clamp(raw);
    updateTextOverlay(overlayId, { start: Math.min(v, end) });
  };

  const setEnd = (raw) => {
    const v = clamp(raw);
    updateTextOverlay(overlayId, { end: Math.max(v, start) });
  };

  const startPct = (start / duration) * 100;
  const spanPct = ((end - start) / duration) * 100;

  const sliderCls =
    "w-full accent-blue-600 dark:accent-blue-500";
  const inputCls =
    "w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 tabular-nums dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Timeline Placement
        </h3>
        <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
          {fmt(start)} – {fmt(end)} / {fmt(duration)}
        </span>
      </div>

      {/* Mini bar visualization */}
      <div className="relative h-8 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
        <div
          className="absolute top-0 h-full bg-blue-500/60 dark:bg-blue-400/50"
          style={{ left: `${startPct}%`, width: `${spanPct}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-blue-600 dark:bg-blue-300"
          style={{ left: `${startPct}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-blue-600 dark:bg-blue-300"
          style={{ left: `${startPct + spanPct}%` }}
        />
      </div>

      {/* Start slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="text-overlay-start"
            className="text-xs font-medium text-gray-700 dark:text-gray-300"
          >
            Start
          </label>
          <input
            type="number"
            min={0}
            max={duration}
            step={0.1}
            value={Number(start.toFixed(2))}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!Number.isNaN(v)) setStart(v);
            }}
            className={inputCls}
            aria-label="Start time in seconds"
          />
        </div>
        <input
          id="text-overlay-start"
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={start}
          onChange={(e) => setStart(parseFloat(e.target.value))}
          className={sliderCls}
        />
      </div>

      {/* End slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor="text-overlay-end"
            className="text-xs font-medium text-gray-700 dark:text-gray-300"
          >
            End
          </label>
          <input
            type="number"
            min={0}
            max={duration}
            step={0.1}
            value={Number(end.toFixed(2))}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              if (!Number.isNaN(v)) setEnd(v);
            }}
            className={inputCls}
            aria-label="End time in seconds"
          />
        </div>
        <input
          id="text-overlay-end"
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={end}
          onChange={(e) => setEnd(parseFloat(e.target.value))}
          className={sliderCls}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        The overlay shows from {fmt(start)} to {fmt(end)}. Start is kept at or
        before end automatically.
      </p>
    </div>
  );
}
