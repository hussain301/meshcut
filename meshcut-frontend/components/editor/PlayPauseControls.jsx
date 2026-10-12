"use client";

import { useState, useEffect } from "react";

/**
 * PlayPauseControls — play / pause / restart buttons for the editor's
 * preview <video>. Syncs local state with the real media element so other
 * controls (keyboard shortcuts, scrubbing) never leave the UI out of sync.
 *
 * @param {{ videoRef: React.RefObject<HTMLVideoElement> }} props
 */
export default function PlayPauseControls({ videoRef }) {
  const [playing, setPlaying] = useState(false);
  const [hasSource, setHasSource] = useState(false);

  // Keep `playing` and `hasSource` in sync with the actual video element.
  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onLoadedMeta = () => setHasSource(!!video.src);

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("loadedmetadata", onLoadedMeta);
    // Capture the case where src was already set before mount.
    setHasSource(!!video.src);
    setPlaying(!video.paused && !video.ended);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("loadedmetadata", onLoadedMeta);
    };
  }, [videoRef]);

  const disabled = !videoRef?.current || !hasSource;

  const handlePlay = () => {
    videoRef.current?.play().catch(() => {});
  };

  const handlePause = () => {
    videoRef.current?.pause();
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const baseBtn =
    "inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium " +
    "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 " +
    "disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Playback controls">
      {!playing ? (
        <button
          type="button"
          onClick={handlePlay}
          disabled={disabled}
          aria-label="Play"
          className={`${baseBtn} bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M8 5.14v14l11-7-11-7z" />
          </svg>
          Play
        </button>
      ) : (
        <button
          type="button"
          onClick={handlePause}
          disabled={disabled}
          aria-label="Pause"
          className={`${baseBtn} bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
          </svg>
          Pause
        </button>
      )}

      <button
        type="button"
        onClick={handleRestart}
        disabled={disabled}
        aria-label="Restart from beginning"
        className={`${baseBtn} bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
        </svg>
        Restart
      </button>
    </div>
  );
}
