"use client";

import { useState } from "react";
import { useMesh } from "../../../lib/store";

const PRESETS = [
  {
    name: "Title",
    label: "Big bold headline",
    style: { font: "Impact", size: 64, color: "#ffffff", bold: true, italic: false },
    previewClass: "text-2xl font-black",
    previewStyle: { fontFamily: "Impact, sans-serif" },
  },
  {
    name: "Subtitle",
    label: "Yellow lower third",
    style: { font: "Arial", size: 32, color: "#ffff00", bold: false, italic: false },
    previewClass: "text-xl font-semibold",
    previewStyle: { fontFamily: "Arial, sans-serif", color: "#facc15" },
  },
  {
    name: "Caption",
    label: "Small italic note",
    style: { font: "Verdana", size: 20, color: "#ffffff", bold: false, italic: true },
    previewClass: "text-base italic",
    previewStyle: { fontFamily: "Verdana, sans-serif" },
  },
];

export default function StylePresets({ overlayId }) {
  const { updateTextOverlay, addTextOverlay } = useMesh();
  const [notice, setNotice] = useState("");

  const flash = (msg) => {
    setNotice(msg);
    window.clearTimeout(flash.t);
    flash.t = window.setTimeout(() => setNotice(""), 1800);
  };

  const applyPreset = (preset) => {
    if (overlayId) {
      updateTextOverlay(overlayId, preset.style);
      flash(`"${preset.name}" applied`);
    } else {
      addTextOverlay({
        id: Date.now().toString(),
        text: "New text",
        x: 50,
        y: 80,
        font: "Arial",
        size: 32,
        color: "#ffffff",
        start: 0,
        end: 5,
        ...preset.style,
      });
      flash(`"${preset.name}" overlay created`);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Style presets</h3>
        {notice && (
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            {notice}
          </span>
        )}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.name}
            type="button"
            onClick={() => applyPreset(preset)}
            title={overlayId ? `Apply ${preset.name} to selected overlay` : `Create new overlay with ${preset.name} style`}
            className="group flex flex-col items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-3 transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-zinc-700 dark:bg-zinc-800/60 dark:hover:border-indigo-500 dark:hover:bg-zinc-800"
          >
            <span
              className={`${preset.previewClass} text-zinc-900 dark:text-zinc-100`}
              style={preset.previewStyle}
            >
              Ag
            </span>
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{preset.name}</span>
            <span className="text-[10px] leading-tight text-zinc-400 dark:text-zinc-500">{preset.label}</span>
          </button>
        ))}
      </div>
      {!overlayId && (
        <p className="mt-2 text-[11px] text-zinc-400 dark:text-zinc-500">
          No overlay selected — a preset creates a new text overlay.
        </p>
      )}
    </div>
  );
}
