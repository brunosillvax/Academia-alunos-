export type ApiOptions = RequestInit & { json?: any };

const baseURL = (process.env.NEXT_PUBLIC_API_URL as string) || 'http://localhost:4000';

export async function api(path: string, options: ApiOptions = {}) {
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(`${baseURL}${path}`, {
    credentials: 'include',
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export async function getMe() {
  try {
    const data = await api('/auth/me');
    return data?.user || null;
  } catch {
    return null;
  }
}








