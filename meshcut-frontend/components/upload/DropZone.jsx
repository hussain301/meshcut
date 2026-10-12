"use client";

import { useCallback, useRef, useState } from "react";

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 GB

export default function DropZone({ onFiles }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const dragCount = useRef(0);

  const filterValidFiles = (list) => {
    const files = Array.from(list).filter((f) => f.type.startsWith("video/"));
    const tooBig = files.filter((f) => f.size > MAX_FILE_SIZE);
    const valid = files.filter((f) => f.size <= MAX_FILE_SIZE);
    if (files.length === 0) {
      setError("Please drop video files only (MP4, WebM, MOV, MKV).");
    } else if (tooBig.length > 0) {
      setError(
        `${tooBig.length} file${tooBig.length > 1 ? "s" : ""} skipped — max 2 GB each.`
      );
    } else {
      setError("");
    }
    return valid;
  };

  const handleFiles = useCallback(
    (fileList) => {
      const valid = filterValidFiles(fileList);
      if (valid.length > 0) onFiles(valid);
    },
    [onFiles]
  );

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCount.current += 1;
    if (e.dataTransfer?.items?.length > 0) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCount.current -= 1;
    if (dragCount.current <= 0) {
      dragCount.current = 0;
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCount.current = 0;
    setIsDragging(false);
    if (e.dataTransfer?.files?.length > 0) handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    if (e.target.files?.length > 0) handleFiles(e.target.files);
    e.target.value = "";
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openPicker();
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/40"
            : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-indigo-500 dark:hover:bg-indigo-950/20"
        }`}
      >
        <svg
          className={`mb-4 h-12 w-12 transition-colors ${
            isDragging
              ? "text-indigo-500 dark:text-indigo-400"
              : "text-gray-400 dark:text-gray-500"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>

        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {isDragging ? "Drop your videos here" : "Drag & drop videos here"}
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          or{" "}
          <span className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400">
            browse your files
          </span>
        </p>
        <p className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          Accepted formats: MP4, WebM, MOV, MKV · Max 2 GB per file
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={handleChange}
          aria-label="Upload video files"
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
