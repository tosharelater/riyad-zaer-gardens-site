export function withBase(path: string): string {
  const raw = import.meta.env.BASE_URL || '/';
  const base = raw.endsWith('/') ? raw : `${raw}/`;
  const clean = path.replace(/^\/+/, '');
  return clean ? `${base}${clean}` : base;
}

export function isHomePath(pathname: string, baseUrl = import.meta.env.BASE_URL || '/'): boolean {
  const path = (pathname || '/').replace(/\/+$/, '') || '/';
  const base = (baseUrl || '/').replace(/\/+$/, '') || '/';
  const stripped = path.replace(/\/index\.html$/, '') || '/';
  return stripped === base;
}
