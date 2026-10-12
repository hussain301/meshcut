"use client";

import { useState } from "react";
import { useMesh } from "../../lib/store";
import { trimClip } from "../../lib/api";

/**
 * TrimControls — trim start/end controls for the active clip.
 *
 * videoRef: ref object for the preview <video> element (used for playhead + duration).
 */
export default function TrimControls({ videoRef }) {
  const { trim, setTrim, currentClip } = useMesh();
  const { start, end } = trim;

  const [status, setStatus] = useState("");

  const duration = videoRef?.current?.duration;
  const max = Number.isFinite(duration) && duration > 0 ? duration : 60;

  const clamp = (v) => {
    const n = Number.isFinite(Number(v)) ? Number(v) : 0;
    return Math.min(max, Math.max(0, n));
  };

  const handleStart = (v) => {
    const s = clamp(v);
    setTrim({ start: Math.min(s, end), end });
  };

  const handleEnd = (v) => {
    const e = clamp(v);
    setTrim({ start, end: Math.max(e, start) });
  };

  const setStartAtPlayhead = () => {
    const t = videoRef?.current?.currentTime;
    if (Number.isFinite(t)) handleStart(t);
  };

  const setEndAtPlayhead = () => {
    const t = videoRef?.current?.currentTime;
    if (Number.isFinite(t)) handleEnd(t);
  };

  const applyTrim = async () => {
    const clipId = currentClip?.clip_id;
    if (!clipId) {
      setStatus("No clip selected.");
      return;
    }
    setStatus("Applying…");
    try {
      await trimClip(clipId, start, end);
      setStatus("Trim applied.");
    } catch (err) {
      setStatus(`Failed: ${err?.message || err || "unknown error"}`);
    }
  };

  const fmt = (s) => `${Number(s).toFixed(1)}s`;

  const sliderCls =
    "w-full accent-indigo-500 cursor-pointer";
  const inputCls =
    "w-20 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 " +
    "dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100";
  const btnCls =
    "rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 " +
    "hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700";
  const applyBtnCls =
    "rounded-md bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white " +
    "hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <h2 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
        Trim
      </h2>

      {/* Start */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label
            htmlFor="trim-start"
            className="text-xs font-medium text-gray-600 dark:text-gray-300"
          >
            Start: <span className="font-mono">{fmt(start)}</span>
          </label>
          <button type="button" onClick={setStartAtPlayhead} className={btnCls}>
            Set start at playhead
          </button>
        </div>
        <div className="flex items-center gap-3">
          <input
            id="trim-start"
            type="range"
            min={0}
            max={max}
            step={0.1}
            value={start}
            onChange={(e) => handleStart(e.target.value)}
            className={sliderCls}
          />
          <input
            type="number"
            min={0}
            max={max}
            step={0.1}
            value={start}
            onChange={(e) => handleStart(e.target.value)}
            aria-label="Trim start seconds"
            className={inputCls}
          />
        </div>
      </div>

      {/* End */}
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between">
          <label
            htmlFor="trim-end"
            className="text-xs font-medium text-gray-600 dark:text-gray-300"
          >
            End: <span className="font-mono">{fmt(end)}</span>
          </label>
          <button type="button" onClick={setEndAtPlayhead} className={btnCls}>
            Set end at playhead
          </button>
        </div>
        <div className="flex items-center gap-3">
          <input
            id="trim-end"
            type="range"
            min={0}
            max={max}
            step={0.1}
            value={end}
            onChange={(e) => handleEnd(e.target.value)}
            className={sliderCls}
          />
          <input
            type="number"
            min={0}
            max={max}
            step={0.1}
            value={end}
            onChange={(e) => handleEnd(e.target.value)}
            aria-label="Trim end seconds"
            className={inputCls}
          />
        </div>
      </div>

      {/* Apply */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={applyTrim}
          disabled={status === "Applying…"}
          className={applyBtnCls}
        >
          Apply trim
        </button>
        {status && (
          <p
            role="status"
            className={
              "text-xs " +
              (status.startsWith("Failed") || status === "No clip selected."
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400")
            }
          >
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
