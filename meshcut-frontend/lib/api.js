// Shared backend API client for MeshCut.
// Imported by every other module — keep these signatures EXACT.

export const API_BASE =
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE) || '';

function parseErrorMessage(payload) {
  if (payload && typeof payload.message === 'string') return payload.message;
  if (payload && typeof payload.error === 'string') return payload.error;
  return null;
}

async function handleJsonResponse(res) {
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (_) {
    data = null;
  }
  if (!res.ok) {
    throw new Error(parseErrorMessage(data) || res.statusText || `HTTP ${res.status}`);
  }
  return data;
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return handleJsonResponse(res);
}

// Upload a file with XMLHttpRequest so we can report progress.
// onProgress(pct) is called with 0-100. Resolves with {clip_id, url}.
export async function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}/upload`);

    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    xhr.addEventListener('load', () => {
      let data = null;
      try {
        data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
      } catch (_) {
        data = null;
      }
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(parseErrorMessage(data) || xhr.statusText || `HTTP ${xhr.status}`));
        return;
      }
      resolve(data);
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed (network error)'));
    });
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'));
    });

    const form = new FormData();
    form.append('file', file);
    xhr.send(form);
  });
}

// Trim a clip to [start, end]. Returns parsed JSON.
export async function trimClip(clipId, start, end) {
  return postJson(`${API_BASE}/trim`, { clip_id: clipId, start, end });
}

// Merge clips. Returns parsed JSON {job_id}.
export async function mergeClips(clipIds) {
  return postJson(`${API_BASE}/merge`, { clips: clipIds });
}

// Add a text overlay. Returns parsed JSON.
export async function addTextOverlayApi(clipId, { text, x, y, start, end, font }) {
  return postJson(`${API_BASE}/text`, {
    clip_id: clipId,
    text,
    x,
    y,
    start,
    end,
    font,
  });
}

// Get export job status. Returns {status, progress, download_url}.
export async function getExportStatus(jobId) {
  const res = await fetch(`${API_BASE}/export/${jobId}`);
  return handleJsonResponse(res);
}

// Build a CSS filter string from percent numbers.
export function filterCSS(filters) {
  const f = filters || {};
  const b = typeof f.brightness === 'number' ? f.brightness : 100;
  const c = typeof f.contrast === 'number' ? f.contrast : 100;
  const s = typeof f.saturation === 'number' ? f.saturation : 100;
  return `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
}
