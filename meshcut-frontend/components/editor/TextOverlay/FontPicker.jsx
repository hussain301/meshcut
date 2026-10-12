"use client";

import { useMesh } from "../../../lib/store";

const FONTS = [
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Impact", value: "Impact, sans-serif" },
  { label: "System UI", value: "system-ui, sans-serif" },
];

export default function FontPicker({ overlayId }) {
  const { textOverlays, updateTextOverlay } = useMesh();

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

  const set = (patch) => updateTextOverlay(overlayId, patch);

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div>
        <label
          htmlFor="font-picker-family"
          className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300"
        >
          Font family
        </label>
        <select
          id="font-picker-family"
          value={overlay.fontFamily || FONTS[0].value}
          onChange={(e) => set({ fontFamily: e.target.value })}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
        >
          {FONTS.map((f) => (
            <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label
            htmlFor="font-picker-size"
            className="text-xs font-medium text-gray-600 dark:text-gray-300"
          >
            Font size
          </label>
          <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">
            {overlay.fontSize ?? 32}px
          </span>
        </div>
        <input
          id="font-picker-size"
          type="range"
          min={12}
          max={120}
          value={overlay.fontSize ?? 32}
          onChange={(e) => set({ fontSize: Number(e.target.value) })}
          className="w-full accent-blue-600"
        />
      </div>

      <div>
        <label
          htmlFor="font-picker-color"
          className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300"
        >
          Color
        </label>
        <div className="flex items-center gap-3">
          <input
            id="font-picker-color"
            type="color"
            value={overlay.color || "#ffffff"}
            onChange={(e) => set({ color: e.target.value })}
            className="h-9 w-14 cursor-pointer rounded-md border border-gray-300 bg-transparent p-1 dark:border-gray-700"
          />
          <span className="font-mono text-xs uppercase text-gray-500 dark:text-gray-400">
            {overlay.color || "#ffffff"}
          </span>
        </div>
      </div>

      <div>
        <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-300">
          Style
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => set({ bold: !overlay.bold })}
            aria-pressed={!!overlay.bold}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-bold transition-colors ${
              overlay.bold
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => set({ italic: !overlay.italic })}
            aria-pressed={!!overlay.italic}
            className={`flex-1 rounded-md border px-3 py-2 text-sm italic transition-colors ${
              overlay.italic
                ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-950 dark:text-blue-300"
                : "border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            I
          </button>
        </div>
      </div>
    </div>
  );
}
