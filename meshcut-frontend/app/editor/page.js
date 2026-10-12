"use client";

import { useRef } from "react";
import VideoPlayer from "../../components/editor/VideoPlayer";
import PlayPauseControls from "../../components/editor/PlayPauseControls";
import SeekControls from "../../components/editor/SeekControls";
import Timeline from "../../components/editor/Timeline";
import TimelineZoom from "../../components/editor/TimelineZoom";
import TimelineMarkers from "../../components/editor/TimelineMarkers";
import TrimControls from "../../components/editor/TrimControls";
import TrimPreview from "../../components/editor/TrimPreview";
import MergeClipList from "../../components/editor/MergeClipList";
import ClipReorder from "../../components/editor/ClipReorder";
import Transitions from "../../components/editor/Transitions";
import FontPicker from "../../components/editor/TextOverlay/FontPicker";
import PositionDrag from "../../components/editor/TextOverlay/PositionDrag";
import TextTimeline from "../../components/editor/TextOverlay/TextTimeline";
import StylePresets from "../../components/editor/TextOverlay/StylePresets";
import FilterSliders from "../../components/editor/Filters/FilterSliders";
import LiveFilterPreview from "../../components/editor/Filters/LiveFilterPreview";
import DarkModeToggle from "../../components/layout/DarkModeToggle";
import { useMesh } from "../../lib/store";

function Panel({ title, children }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function EditorPage() {
  const videoRef = useRef(null);
  const darkMode = useMesh((s) => s.darkMode);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-zinc-100 text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
        <header className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-lg font-bold tracking-tight">MeshCut</h1>
          <nav className="flex items-center gap-3">
            <a
              href="/upload"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              Upload
            </a>
            <a
              href="/export"
              className="rounded-md px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
            >
              Export
            </a>
            <DarkModeToggle />
          </nav>
        </header>

        <main className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-3">
          {/* Left column: preview + playback + trim */}
          <div className="space-y-4 lg:col-span-2">
            <Panel title="Preview">
              <VideoPlayer videoRef={videoRef} />
              <PlayPauseControls videoRef={videoRef} />
              <SeekControls videoRef={videoRef} />
            </Panel>

            <Panel title="Trim">
              <TrimControls />
              <TrimPreview />
            </Panel>
          </div>

          {/* Right column: stacked editing panels */}
          <div className="space-y-4">
            <Panel title="Merge">
              <MergeClipList />
              <ClipReorder />
              <Transitions />
            </Panel>

            <Panel title="Text Overlay">
              <FontPicker />
              <PositionDrag />
              <TextTimeline />
              <StylePresets />
            </Panel>

            <Panel title="Filters">
              <FilterSliders />
              <LiveFilterPreview />
            </Panel>

            <Panel title="Markers">
              <TimelineMarkers />
            </Panel>
          </div>
        </main>

        {/* Bottom: timeline */}
        <footer className="border-t border-zinc-200 bg-white px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="space-y-2">
            <TimelineZoom />
            <Timeline videoRef={videoRef} />
          </div>
        </footer>
      </div>
    </div>
  );
}
