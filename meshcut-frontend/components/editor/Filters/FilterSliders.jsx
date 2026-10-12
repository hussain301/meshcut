"use client";

import { useMesh } from "../../../lib/store";

const SLIDERS = [
  { key: "brightness", label: "Brightness", min: 0, max: 200, def: 100 },
  { key: "contrast", label: "Contrast", min: 0, max: 200, def: 100 },
  { key: "saturation", label: "Saturation", min: 0, max: 200, def: 100 },
];

export default function FilterSliders() {
  const { filters, setFilters } = useMesh();

  const handleChange = (key, value) => {
    setFilters({
      brightness: filters.brightness,
      contrast: filters.contrast,
      saturation: filters.saturation,
      [key]: Number(value),
    });
  };

  const handleReset = () => {
    setFilters({ brightness: 100, contrast: 100, saturation: 100 });
  };

  return (
    <div className="w-full rounded-lg bg-white p-4 shadow dark:bg-zinc-900">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Adjustments
        </h3>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        {SLIDERS.map(({ key, label, min, max }) => (
          <div key={key}>
            <div className="mb-1 flex items-center justify-between">
              <label
                htmlFor={`filter-${key}`}
                className="text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                {label}
              </label>
              <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs tabular-nums text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                {filters[key] ?? 100}
              </span>
            </div>
            <input
              id={`filter-${key}`}
              type="range"
              min={min}
              max={max}
              step={1}
              value={filters[key] ?? 100}
              onChange={(e) => handleChange(key, e.target.value)}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-blue-600 dark:bg-zinc-700"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
