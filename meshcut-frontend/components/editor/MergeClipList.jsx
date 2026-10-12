"use client";

import { useMesh } from "../../lib/store";

export default function MergeClipList() {
  const { clips, addClip, removeClip, uploads } = useMesh();

  const addDoneUploads = () => {
    const inClips = new Set((clips || []).map((c) => c.clip_id));
    (uploads || [])
      .filter((u) => u.status === "done" && !inClips.has(u.clip_id))
      .forEach((u) =>
        addClip({
          clip_id: u.clip_id,
          url: u.url,
          name: u.name,
          duration: u.duration,
          transition: "none",
        })
      );
  };

  const fmt = (d) => {
    const s = Math.max(0, Math.round(Number(d) || 0));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  const doneUploads = (uploads || []).filter((u) => u.status === "done");
  const queuedIds = new Set((clips || []).map((c) => c.clip_id));
  const addable = doneUploads.filter((u) => !queuedIds.has(u.clip_id));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
          Merge queue{" "}
          <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {(clips || []).length}
          </span>
        </h2>
        <button
          onClick={addDoneUploads}
          disabled={addable.length === 0}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add current uploads{addable.length > 0 ? ` (${addable.length})` : ""}
        </button>
      </div>

      {(clips || []).length === 0 ? (
        <p className="rounded-md bg-slate-50 px-3 py-6 text-center text-xs text-slate-400 dark:bg-slate-800/60 dark:text-slate-500">
          No clips queued. Upload clips and add them to the merge queue.
        </p>
      ) : (
        <ul className="max-h-72 space-y-2 overflow-y-auto">
          {(clips || []).map((clip, i) => (
            <li
              key={clip.clip_id || i}
              className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-800/60"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-100">
                  {clip.name || clip.clip_id}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {fmt(clip.duration)}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {clip.transition || "none"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeClip(clip.clip_id)}
                title="Remove from merge queue"
                className="shrink-0 rounded-md px-2 py-1 text-xs text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
