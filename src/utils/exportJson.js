// JSON import / export (V2 §9).
//
// serializeColorway builds the V2 export shape; deserializeColorway parses and
// validates an imported file, throwing an Error with a user-facing message on
// any failure so callers can show it inline.

const VALID_LAYOUTS = ['60', '65', '75', 'tkl', 'full'];

export function serializeColorway(state) {
  return {
    version: 2,
    name: state.colorwayName,
    layout: state.layout,
    caseColor: state.caseColor,
    caseFinish: state.caseFinish,
    keyColors: { ...state.keyColors },
    exportedAt: new Date().toISOString(),
  };
}

// Accepts a JSON string or an already-parsed object. Returns the validated
// data; throws Error(message) on invalid JSON or a failed validation check.
export function deserializeColorway(raw) {
  let data = raw;
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error('File is not valid JSON.');
    }
  }
  if (!data || typeof data !== 'object') {
    throw new Error('File does not contain a colorway.');
  }
  if (typeof data.version !== 'number') {
    throw new Error('Missing or invalid "version" field.');
  }
  if (!VALID_LAYOUTS.includes(data.layout)) {
    throw new Error('Unsupported or missing layout.');
  }
  if (!data.keyColors || typeof data.keyColors !== 'object') {
    throw new Error('Missing or invalid "keyColors".');
  }
  return data;
}

// Serialize the current colorway and trigger a .json download.
export function downloadColorway(state) {
  const json = JSON.stringify(serializeColorway(state), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${slugify(state.colorwayName)}-${state.layout}.json`);
  URL.revokeObjectURL(url);
}

function triggerDownload(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function slugify(name) {
  const slug = (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'colorway';
}
