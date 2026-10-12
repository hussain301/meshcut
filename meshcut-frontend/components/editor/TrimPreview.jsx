"use client";

import { useRef, useState } from "react";
import { useMesh } from "../../lib/store";

export default function TrimPreview() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const { currentClip, trim } = useMesh();
  const { start = 0, end = 0 } = trim || {};

  if (!currentClip) {
    return (
      <div className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 p-4 flex items-center justify-center">
        <p className="text-zinc-500 text-xs">No clip loaded</p>
      </div>
    );
  }

  const handlePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    // Always restart the trimmed segment from its start point.
    video.currentTime = start;
    video
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
  };

  const handlePause = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setPlaying(false);
  };

  const handleTimeUpdate = (e) => {
    const video = e.target;
    // Stop at the trim end so only the trimmed segment plays.
    if (video.currentTime >= end) {
      video.pause();
      video.currentTime = end;
      setPlaying(false);
    }
  };

  return (
    <div className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-950 border border-zinc-800 p-3">
      <video
        ref={videoRef}
        src={currentClip.url}
        muted
        playsInline
        preload="metadata"
        className="w-full rounded-md bg-black"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setPlaying(false)}
      />
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={playing ? handlePause : handlePlay}
          className="px-3 py-1.5 rounded-md bg-zinc-700 hover:bg-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-100 text-xs font-medium transition-colors"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <p className="text-zinc-400 dark:text-zinc-300 text-xs">
          Trim: {start}s &ndash; {end}s
        </p>
      </div>
    </div>
  );
}
