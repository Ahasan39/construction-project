/** Public assets share Vite's base; router links use the router basename. */
export function assetUrl(path: string, base = import.meta.env.BASE_URL): string {
  if (/^(?:[a-z]+:|\/\/|#)/i.test(path)) return path;
  if (base !== "/" && path.startsWith(base)) return path;
  return `${base}${path.replace(/^\/+/, "")}`;
}
