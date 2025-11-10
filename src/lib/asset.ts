export const asset = (p: string) => {
  const base = import.meta.env.BASE_URL || "/";
  try {
    return new URL(p.replace(/^\/+/, ""), base).toString();
  } catch {
    // fallback to plain relative path during local dev
    return p.startsWith("/") ? p : `/${p}`;
  }
};
