"use client";

import Link from "next/link";
import DarkModeToggle from "../components/layout/DarkModeToggle";
import { useMesh } from "../lib/store";
import { t } from "../lib/i18n";

const cards = [
  { href: "/upload", title: "Upload", desc: "Drag & drop your video files" },
  { href: "/editor", title: "Editor", desc: "Timeline, trim, merge, text, filters" },
  { href: "/export", title: "Export", desc: "Choose format & quality, download" },
];

export default function Home() {
  const { darkMode, lang } = useMesh();
  return (
    <div className={darkMode ? "dark" : ""}>
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="text-indigo-600 dark:text-indigo-400">Mesh</span>Cut
          </h1>
          <DarkModeToggle />
        </header>
        <section className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-4xl font-extrabold mb-4">{t(lang, "tagline")}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10">
            {t(lang, "subtitle")}
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {cards.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                className="block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
              >
                <div className="text-xl font-semibold mb-2">{c.title}</div>
                <p className="text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
