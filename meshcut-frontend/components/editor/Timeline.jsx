"use client";

import { useMesh } from "../../lib/store";

export default function Timeline({ videoRef }) {
  const { clips, textOverlays, timeline, setCurrentTime, trim } = useMesh();
  const { currentTime, zoom, markers } = timeline;

  const pxPerSec = 60 * zoom;
  const duration = Math.max(
    60,
    ...clips.map((c) => c.start + (c.trimEnd ?? c.duration)),
    ...textOverlays.map((t) => t.end),
    currentTime + 10
  );
  const width = duration * pxPerSec;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const t = Math.max(0, Math.min(duration, x / pxPerSec));
    setCurrentTime(t);
    if (videoRef?.current) videoRef.current.currentTime = t;
  };

  const seconds = [];
  for (let s = 0; s <= Math.ceil(duration); s++) seconds.push(s);

  const format = (s) => {
    const m = Math.floor(s / 60);
    const r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 dark:bg-black border-t border-zinc-800">
      <div className="overflow-x-auto scroll-thin relative flex-1" onClick={handleSeek}>
        <div className="relative" style={{ width, minWidth: "100%" }}>
          {/* Ruler */}
          <div className="sticky top-0 z-10 flex h-7 bg-zinc-900 border-b border-zinc-800 text-[10px] text-zinc-500 select-none">
            {seconds.map((s) => (
              <div
                key={s}
                className="shrink-0 border-l border-zinc-700 pl-1"
                style={{ width: pxPerSec }}
              >
                {format(s)}
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-px bg-red-500 z-20 pointer-events-none"
            style={{ left: currentTime * pxPerSec }}
          >
            <div className="w-3 h-3 -ml-[5px] bg-red-500 rotate-45" />
          </div>

          {/* Markers row */}
          <div className="relative h-5 bg-zinc-900/60 border-b border-zinc-800">
            {markers.map((m, i) => (
              <div
                key={i}
                className="absolute top-1 w-2 h-2 bg-amber-400 rotate-45 pointer-events-none"
                style={{ left: m.time * pxPerSec - 4 }}
                title={m.label ?? `Marker ${i + 1}`}
              />
            ))}
          </div>

          {/* Video track */}
          <div className="relative h-16 bg-zinc-900 border-b border-zinc-800">
            {clips.map((clip) => {
              const clipDur = clip.trimEnd ?? clip.duration;
              const left = clip.start * pxPerSec;
              const w = Math.max(8, clipDur * pxPerSec);
              const selected = currentTime >= clip.start && currentTime <= clip.start + clipDur;
              return (
                <div
                  key={clip.id}
                  className={`absolute top-1 bottom-1 rounded-md overflow-hidden border text-[10px] text-white px-1 truncate cursor-pointer ${
                    selected
                      ? "bg-indigo-600 border-indigo-400"
                      : "bg-indigo-900/70 border-indigo-700"
                  }`}
                  style={{ left, width: w }}
                  onClick={(e) => e.stopPropagation()}
                  title={clip.name}
                >
                  <span className="leading-6">{clip.name}</span>
                  {/* trim handles */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/20 hover:bg-white/40"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      const startX = e.clientX;
                      const origStart = clip.start;
                      const origTrimStart = clip.trimStart ?? 0;
                      const move = (ev) => {
                        const dt = (ev.clientX - startX) / pxPerSec;
                        trim(clip.id, {
                          start: Math.max(0, origStart + dt),
                          trimStart: Math.max(0, origTrimStart + dt),
                        });
                      };
                      const up = () => {
                        window.removeEventListener("mousemove", move);
                        window.removeEventListener("mouseup", up);
                      };
                      window.addEventListener("mousemove", move);
                      window.addEventListener("mouseup", up);
                    }}
                  />
                  <div
                    className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-white/20 hover:bg-white/40"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      const startX = e.clientX;
                      const origEnd = clip.trimEnd ?? clip.duration;
                      const move = (ev) => {
                        const dt = (ev.clientX - startX) / pxPerSec;
                        trim(clip.id, { trimEnd: Math.max(1, origEnd + dt) });
                      };
                      const up = () => {
                        window.removeEventListener("mousemove", move);
                        window.removeEventListener("mouseup", up);
                      };
                      window.addEventListener("mousemove", move);
                      window.addEventListener("mouseup", up);
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Text track */}
          <div className="relative h-12 bg-zinc-900/80">
            {textOverlays.map((ov) => {
              const left = ov.start * pxPerSec;
              const w = Math.max(8, (ov.end - ov.start) * pxPerSec);
              const active = currentTime >= ov.start && currentTime <= ov.end;
              return (
                <div
                  key={ov.id}
                  className={`absolute top-1 bottom-1 rounded-md border px-1 text-[10px] text-white truncate pointer-events-none ${
                    active
                      ? "bg-emerald-600 border-emerald-400"
                      : "bg-emerald-900/60 border-emerald-700"
                  }`}
                  style={{ left, width: w }}
                  title={ov.text}
                >
                  <span className="leading-6">T&nbsp;{ov.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
