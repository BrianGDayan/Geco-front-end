const PROD_BASE = process.env.NEXT_PUBLIC_API_URL;
const BASE_URL = PROD_BASE ? `${PROD_BASE}/api` : "/api";

export async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  const endpoint = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  const isForm = options.body instanceof FormData;

  // obtener token desde localStorage (si existe)
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const headers: Record<string,string> = isForm
    ? { ...(options.headers as Record<string,string> || {}) }
    : { "Content-Type": "application/json", ...(options.headers as Record<string,string> || {}) };

  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(endpoint, {
    ...options,
    headers,
    // no usamos cookies para auth, no hace falta credentials
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    const error = new Error(errorBody.message || "Ocurrió un error");
    (error as any).info = errorBody;
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
}
