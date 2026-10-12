"use client";

import { useMesh } from "../../lib/store";
import { filterCSS } from "../../lib/api";

export default function VideoPlayer({ videoRef }) {
  const {
    currentClip,
    filters,
    textOverlays,
    timeline: { currentTime },
    setCurrentTime,
  } = useMesh();

  if (!currentClip) {
    return (
      <div className="w-full aspect-video rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
        <p className="text-zinc-500 text-sm">
          No clip loaded — upload a video first
        </p>
      </div>
    );
  }

  const visibleOverlays = (textOverlays || []).filter(
    (o) => o.start <= currentTime && currentTime <= o.end
  );

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-black border border-zinc-800">
      <video
        ref={videoRef}
        src={currentClip.url}
        className="w-full rounded-lg bg-black"
        controls={false}
        style={{ filter: filterCSS(filters) }}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onLoadedMetadata={(e) => {
          // Duration captured here for duration-aware modules (e.g. timeline ruler).
          if (e.target.duration && !Number.isNaN(e.target.duration)) {
            videoRef.current.dataset.duration = e.target.duration;
          }
        }}
      />
      {visibleOverlays.map((o) => (
        <div
          key={o.id}
          className="absolute pointer-events-none whitespace-pre-wrap break-words"
          style={{
            left: `${o.x}%`,
            top: `${o.y}%`,
            fontFamily: o.font,
            fontSize: o.size,
            color: o.color,
            textShadow:
              "0 1px 3px rgba(0,0,0,0.9), 0 0 1px rgba(0,0,0,0.9)",
            transform: "translate(-50%, -50%)",
          }}
        >
          {o.text}
        </div>
      ))}
    </div>
  );
}
