"use client";

import { useMesh } from "../../lib/store";

function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[i]}`;
}

const STATUS_STYLES = {
  uploading: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function UploadProgress() {
  const { uploads, removeUpload } = useMesh();

  if (!uploads || uploads.length === 0) return null;

  return (
    <div className="space-y-3">
      {uploads.map((u) => (
        <div
          key={u.id}
          className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {u.name}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {formatSize(u.size)}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[u.status] || STATUS_STYLES.uploading}`}
            >
              {u.status === "uploading" ? "Uploading" : u.status === "done" ? "Done" : "Error"}
            </span>
            <button
              type="button"
              onClick={() => removeUpload(u.id)}
              aria-label={`Remove ${u.name}`}
              className="shrink-0 rounded px-1.5 text-lg leading-none text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              ×
            </button>
          </div>

          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                u.status === "error"
                  ? "bg-red-500"
                  : u.status === "done"
                    ? "bg-emerald-500"
                    : "animate-pulse bg-sky-500"
              }`}
              style={{ width: `${Math.min(100, Math.max(0, u.progress ?? 0))}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {Math.round(u.progress ?? 0)}%
          </p>

          {u.status === "error" && (
            <div className="mt-2">
              <p className="text-xs font-medium text-red-600 dark:text-red-400">
                {u.error || "Upload failed."}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                You can retry by uploading the file again, or remove it with ×.
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
