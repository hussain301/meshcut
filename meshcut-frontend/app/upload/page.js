"use client";

import { useCallback } from "react";
import Link from "next/link";
import DropZone from "../../components/upload/DropZone";
import UploadProgress from "../../components/upload/UploadProgress";
import ThumbnailPreview from "../../components/upload/ThumbnailPreview";
import { validateFile } from "../../lib/fileValidation";
import { uploadFile } from "../../lib/api";
import { useMesh } from "../../lib/store";

function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function UploadPage() {
  const { addUpload, updateUpload, uploads, darkMode } = useMesh();

  const handleFiles = useCallback(
    async (files) => {
      const list = Array.from(files || []);
      for (const file of list) {
        const id = makeId();

        const validation = validateFile(file);
        if (!validation.valid) {
          addUpload({
            id,
            name: file.name,
            size: file.size,
            status: "error",
            error: validation.error || "File is not valid.",
          });
          continue;
        }

        addUpload({ id, name: file.name, size: file.size, status: "uploading", progress: 0 });

        try {
          const res = await uploadFile(file, (pct) => {
            updateUpload(id, { progress: pct });
          });
          updateUpload(id, {
            status: "done",
            progress: 100,
            url: res && res.url ? res.url : undefined,
            clip_id: res && res.clip_id ? res.clip_id : undefined,
            duration: res && typeof res.duration !== "undefined" ? res.duration : undefined,
          });
        } catch (err) {
          updateUpload(id, {
            status: "error",
            error: err && err.message ? err.message : "Upload failed. Please try again.",
          });
        }
      }
    },
    [addUpload, updateUpload]
  );

  const hasDone = uploads.some((u) => u.status === "done");

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <header className="border-b border-gray-200 dark:border-gray-800">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <Link href="/" className="text-xl font-bold tracking-tight">
              MeshCut
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link
                href="/editor"
                className="rounded-md bg-blue-600 px-3 py-2 font-medium text-white hover:bg-blue-700"
              >
                Open editor
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Upload your clips</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Drop video files below. Valid clips are uploaded automatically and
              ready to use in the editor.
            </p>
          </div>

          <section aria-label="File drop zone">
            <DropZone onFiles={handleFiles} />
          </section>

          {uploads.length > 0 && (
            <section aria-label="Upload progress" className="space-y-3">
              <h2 className="text-lg font-semibold">Uploads</h2>
              <ul className="space-y-3">
                {uploads.map((u) => (
                  <li key={u.id}>
                    <UploadProgress upload={u} />
                  </li>
                ))}
              </ul>
            </section>
          )}

          {uploads.length > 0 && (
            <section aria-label="Uploaded thumbnails">
              <h2 className="mb-3 text-lg font-semibold">Thumbnails</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {uploads.map((u) => (
                  <ThumbnailPreview key={u.id} upload={u} />
                ))}
              </div>
            </section>
          )}

          <div className="flex justify-end pt-2">
            <Link
              href="/editor"
              className={`inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold ${
                hasDone
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
              }`}
              aria-disabled={!hasDone}
              onClick={(e) => {
                if (!hasDone) e.preventDefault();
              }}
            >
              Continue to editor &rarr;
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
