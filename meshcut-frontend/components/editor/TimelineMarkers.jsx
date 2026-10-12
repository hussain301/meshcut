"use client";

import { useMesh } from "../../lib/store";

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function TimelineMarkers() {
  const { timeline, addMarker, removeMarker } = useMesh();
  const { currentTime, markers } = timeline;

  const handleAdd = () => {
    const count = markers.length + 1;
    addMarker({
      id: `marker-${Date.now()}-${count}`,
      time: currentTime,
      label: `M${count}`,
    });
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          Markers
        </h3>
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 active:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          Add marker at {formatTime(currentTime)}
        </button>
      </div>

      {markers.length === 0 ? (
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          No markers yet. Markers are placed at the current playhead time.
        </p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {markers.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-md border border-neutral-200 px-2.5 py-1.5 text-sm dark:border-neutral-700"
            >
              <div className="flex items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {m.label}
                </span>
                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                  {formatTime(m.time)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeMarker(m.id)}
                aria-label={`Delete ${m.label}`}
                title={`Delete ${m.label}`}
                className="rounded p-1 text-lg leading-none text-neutral-400 hover:bg-neutral-100 hover:text-red-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-red-400"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
