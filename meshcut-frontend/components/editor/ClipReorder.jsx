"use client";

import { useState } from "react";
import { useMesh } from "../../lib/store";

/**
 * ClipReorder — drag-and-drop reorder of the merge clip list.
 *
 * Each row is HTML5-draggable (with ↑/↓ buttons as a fallback), and the
 * drop target commits the move via the shared store's reorderClips(from, to).
 */
export default function ClipReorder() {
  const { clips, reorderClips } = useMesh();
  const [dragFrom, setDragFrom] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const onDragStart = (e, idx) => {
    setDragFrom(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
  };

  const onDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (idx !== dragFrom) setDropTarget(idx);
  };

  const onDrop = (e, idx) => {
    e.preventDefault();
    const from =
      dragFrom !== null ? dragFrom : parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (!Number.isNaN(from) && from !== idx) {
      reorderClips(from, idx);
    }
    setDragFrom(null);
    setDropTarget(null);
  };

  const onDragEnd = () => {
    setDragFrom(null);
    setDropTarget(null);
  };

  const moveBy = (idx, dir) => {
    const to = idx + dir;
    if (to < 0 || to >= clips.length) return;
    reorderClips(idx, to);
  };

  if (!clips || clips.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Clip order
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          No clips in the merge list yet.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Clip order <span className="text-zinc-500 dark:text-zinc-400 font-normal">({clips.length})</span>
      </h2>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        Drag a row to reorder, or use the arrow buttons.
      </p>

      <ul className="mt-3 space-y-2">
        {clips.map((clip, idx) => (
          <li
            key={clip.id ?? idx}
            draggable
            onDragStart={(e) => onDragStart(e, idx)}
            onDragOver={(e) => onDragOver(e, idx)}
            onDrop={(e) => onDrop(e, idx)}
            onDragEnd={onDragEnd}
            className={[
              "flex items-center gap-3 rounded-md border px-3 py-2 cursor-grab active:cursor-grabbing transition-colors",
              dropTarget === idx
                ? "border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-950/60"
                : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950",
              dragFrom === idx ? "opacity-40" : "",
            ].join(" ")}
            aria-grabbed={dragFrom === idx}
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              {idx + 1}
            </span>

            <span className="flex-1 min-w-0">
              <span className="block truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {clip.name ?? clip.title ?? `Clip ${idx + 1}`}
              </span>
              <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">
                {clip.duration ? `${clip.duration}` : ""}{" "}
                {clip.src ? clip.src : ""}
              </span>
            </span>

            <span
              className="shrink-0 text-zinc-400 dark:text-zinc-500 select-none"
              aria-hidden="true"
              title="Drag to reorder"
            >
              ⋮⋮
            </span>

            <div className="flex shrink-0 flex-col gap-0.5">
              <button
                type="button"
                onClick={() => moveBy(idx, -1)}
                disabled={idx === 0}
                aria-label={`Move clip ${idx + 1} up`}
                className="rounded p-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveBy(idx, 1)}
                disabled={idx === clips.length - 1}
                aria-label={`Move clip ${idx + 1} down`}
                className="rounded p-1 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
