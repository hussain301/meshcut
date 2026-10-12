# MeshCut — Online Video Editor (Frontend)

Next.js + Tailwind CSS frontend for the MeshCut video editor.

## Backend API contract

Base URL: set `NEXT_PUBLIC_API_BASE` env (defaults to same-origin `/`).

- `POST /upload` — multipart form, field `file` → `{ "clip_id": "...", "url": "..." }`
- `POST /trim` — JSON `{ "clip_id", "start", "end" }` (seconds) → `{ "clip_id": "..." }`
- `POST /merge` — JSON `{ "clips": ["<clip_id>", ...] }` → `{ "job_id": "..." }`
- `POST /text` — JSON `{ "clip_id", "text", "x", "y", "start", "end" }` → `{ "ok": true }`
- `GET /export/{job_id}` — poll → `{ "status": "queued|processing|done|error", "progress": 0-100, "download_url": "..." }`

## Run

```bash
npm install
npm run dev
```

## Pages

- `/` — landing
- `/upload` — drag & drop upload with progress, validation, thumbnails
- `/editor` — timeline, preview player, trim, merge, text overlays, filters
- `/export` — format/quality select, progress, download
