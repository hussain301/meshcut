"use client";

import { useEffect, useRef, useState } from "react";
import { mergeClips, getExportStatus } from "../../lib/api";
import { useMesh } from "../../lib/store";
import DarkModeToggle from "../../components/layout/DarkModeToggle";

export default function ExportPage() {
  const { clips, exportJobs, addExportJob, updateExportJob, darkMode } = useMesh();
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("1080p");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");
  const timers = useRef({});

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach((t) => clearInterval(t));
      timers.current = {};
    };
  }, []);

  const pollJob = (jobId) => {
    const timer = setInterval(async () => {
      try {
        const data = await getExportStatus(jobId);
        updateExportJob(jobId, {
          status: data.status,
          progress: typeof data.progress === "number" ? data.progress : 0,
          downloadUrl: data.download_url || null,
        });
        if (data.status === "done" || data.status === "error") {
          clearInterval(timer);
          delete timers.current[jobId];
          if (data.status === "error") {
            setError(`Export ${jobId} failed: ${data.error || "unknown error"}`);
          }
        }
      } catch (e) {
        clearInterval(timer);
        delete timers.current[jobId];
        updateExportJob(jobId, { status: "error", progress: 0 });
        setError(`Status check failed for ${jobId}: ${e.message || e}`);
      }
    }, 2000);
    timers.current[jobId] = timer;
  };

  const startExport = async () => {
    if (clips.length === 0) {
      setError("No clips to export. Upload and trim clips first.");
      return;
    }
    setStarting(true);
    setError("");
    try {
      const res = await mergeClips(clips.map((c) => c.clip_id));
      const jobId = res.job_id || res.jobId || `job-${Date.now()}`;
      addExportJob({ jobId, status: "queued", progress: 0, format, quality, downloadUrl: null });
      pollJob(jobId);
    } catch (e) {
      setError(`Export failed to start: ${e.message || e}`);
    } finally {
      setStarting(false);
    }
  };

  const badgeClass = (status) => {
    switch (status) {
      case "done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
          <h1 className="text-xl font-bold">MeshCut</h1>
          <nav className="flex items-center gap-4">
            <a href="/upload" className="text-sm hover:underline">Upload</a>
            <a href="/editor" className="text-sm hover:underline">Editor</a>
            <DarkModeToggle />
          </nav>
        </header>

        <main className="mx-auto max-w-3xl space-y-8 px-6 py-8">
          <section className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-lg font-semibold">Export settings</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Format</span>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="mp4">MP4</option>
                  <option value="webm">WebM</option>
                  <option value="mov">MOV</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium">Quality</span>
                <select
                  value={quality}
                  onChange={(e) => setQuality(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4k">4K</option>
                </select>
              </label>
            </div>
            <button
              onClick={startExport}
              disabled={starting}
              className="mt-6 rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {starting ? "Starting..." : "Start export"}
            </button>
            {error && (
              <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {clips.length} clip{clips.length === 1 ? "" : "s"} queued for export.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">Export jobs</h2>
            {exportJobs.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No exports yet. Start one above.
              </p>
            ) : (
              <ul className="space-y-4">
                {exportJobs.map((job) => (
                  <li
                    key={job.jobId}
                    className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {job.format.toUpperCase()} · {job.quality}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass(job.status)}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all"
                        style={{ width: `${job.progress || 0}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {job.progress || 0}% · {job.jobId}
                      </span>
                      {job.status === "done" && job.downloadUrl && (
                        <a
                          href={job.downloadUrl}
                          download
                          className="rounded-md bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700"
                        >
                          Download
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
