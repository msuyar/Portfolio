// src/lib/asset.ts
export function asset(path: string) {
  const clean = path.replace(/^\/+/, "");                    // drop any leading /
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, ""); // drop trailing /
  return `${base}/${clean}`;
}
