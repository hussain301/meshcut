"use client";

import Link from "next/link";
import { useMesh } from "../../lib/store";

const NAV_LINKS = [
  { href: "/", label: "Upload" },
  { href: "/editor", label: "Editor" },
  { href: "/export", label: "Export" },
];

export default function ResponsiveLayout({ children }) {
  const { darkMode } = useMesh();

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100 flex flex-col">
        <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur dark:border-gray-800 dark:bg-gray-950/90">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
            <Link
              href="/"
              className="shrink-0 text-xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400"
            >
              MeshCut
            </Link>
            <nav
              aria-label="Primary"
              className="flex-1 flex items-center gap-1 overflow-x-auto whitespace-nowrap sm:justify-end"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
          {children}
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
            <p>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                MeshCut
              </span>{" "}
              — browser-first video editor
            </p>
            <p>Built with Next.js 14 · Tailwind CSS</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
