"use client";

import { useRef } from "react";
import { useMesh } from "../../../lib/store";

export default function PositionDrag({ overlayId }) {
  const { textOverlays, updateTextOverlay, currentClip } = useMesh();
  const stageRef = useRef(null);
  const overlay = textOverlays?.find((o) => o.id === overlayId);

  if (!overlayId || !currentClip) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Select a clip and a text overlay to drag it into position.
      </p>
    );
  }

  const clampPct = (v) => Math.min(100, Math.max(0, v));

  const handlePointerMove = (e) => {
    if (!stageRef.current || e.buttons !== 1) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = clampPct(((e.clientX - rect.left) / rect.width) * 100);
    const y = clampPct(((e.clientY - rect.top) / rect.height) * 100);
    updateTextOverlay(overlayId, {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10,
    });
  };

  return (
    <div className="space-y-2">
      <div
        ref={stageRef}
        onPointerDown={(e) => {
          e.target.setPointerCapture?.(e.pointerId);
          handlePointerMove(e);
        }}
        onPointerMove={handlePointerMove}
        className="relative aspect-video w-full cursor-move select-none overflow-hidden rounded-lg border border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-900 touch-none"
      >
        {overlay && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
            style={{
              left: `${overlay.x ?? 50}%`,
              top: `${overlay.y ?? 50}%`,
              fontSize: `${overlay.fontSize ?? 24}px`,
              color: overlay.color ?? "#ffffff",
              textShadow: "0 1px 4px rgba(0,0,0,0.7)",
            }}
          >
            {overlay.text || "Text"}
          </div>
        )}
        <span className="absolute bottom-1 right-2 text-xs text-gray-500 dark:text-gray-400">
          x: {Math.round(overlay?.x ?? 50)}% · y: {Math.round(overlay?.y ?? 50)}%
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Drag the text to set its position on the clip.
      </p>
    </div>
  );
}
