"use client";

import { useMesh } from "../../lib/store";

function formatTime(sec) {
  if (!isFinite(sec) || sec < 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function SeekControls({ videoRef }) {
  const { timeline, setCurrentTime, currentClip } = useMesh();
  const duration = currentClip?.duration || 0;
  const currentTime = timeline?.currentTime || 0;

  const seekTo = (t) => {
    const clamped = Math.max(0, Math.min(duration || 0, t));
    setCurrentTime(clamped);
    if (videoRef?.current) videoRef.current.currentTime = clamped;
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900 dark:bg-zinc-950 rounded-lg">
      <button
        type="button"
        onClick={() => seekTo(currentTime - 5)}
        className="px-2 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 dark:bg-zinc-800"
        title="Back 5 seconds"
      >
        -5s
      </button>
      <button
        type="button"
        onClick={() => seekTo(currentTime - 1 / 30)}
        className="px-2 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 dark:bg-zinc-800"
        title="Back 1 frame"
      >
        ◀
      </button>
      <input
        type="range"
        min={0}
        max={duration}
        step={0.01}
        value={Math.min(currentTime, duration)}
        onChange={(e) => seekTo(parseFloat(e.target.value))}
        className="flex-1 accent-indigo-500 cursor-pointer"
        aria-label="Seek"
      />
      <button
        type="button"
        onClick={() => seekTo(currentTime + 1 / 30)}
        className="px-2 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 dark:bg-zinc-800"
        title="Forward 1 frame"
      >
        ▶
      </button>
      <button
        type="button"
        onClick={() => seekTo(currentTime + 5)}
        className="px-2 py-1 text-xs rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 dark:bg-zinc-800"
        title="Forward 5 seconds"
      >
        +5s
      </button>
      <span className="text-xs font-mono text-zinc-300 dark:text-zinc-400 whitespace-nowrap">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
