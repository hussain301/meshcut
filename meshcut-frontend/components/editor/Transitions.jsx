"use client";

import { useMesh } from "../../lib/store";

const TRANSITION_OPTIONS = ["none", "fade", "dissolve", "slide", "wipe"];

export default function Transitions() {
  const { clips, setClipTransition } = useMesh();

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        Transitions
      </h2>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        The transition is applied at the start of each clip, blending in from the
        previous clip.
      </p>

      {clips.length === 0 ? (
        <p className="mt-3 text-xs italic text-zinc-400 dark:text-zinc-500">
          No clips in the timeline yet.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {clips.map((clip) => (
            <li
              key={clip.clip_id}
              className="flex items-center gap-3 rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/60"
            >
              <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-700 dark:text-zinc-200">
                {clip.name || clip.clip_id}
              </span>
              <label
                htmlFor={`transition-${clip.clip_id}`}
                className="text-xs text-zinc-500 dark:text-zinc-400"
              >
                Transition
              </label>
              <select
                id={`transition-${clip.clip_id}`}
                value={clip.transition || "none"}
                onChange={(e) =>
                  setClipTransition(clip.clip_id, e.target.value)
                }
                className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-800 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              >
                {TRANSITION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
