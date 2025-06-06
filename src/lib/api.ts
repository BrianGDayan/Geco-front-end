// src/lib/api.ts
const PROD_BASE = process.env.NEXT_PUBLIC_API_URL; // ej. "http://localhost:4000"
const BASE_URL = PROD_BASE ? `${PROD_BASE}/api` : '/api';

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  // Si 'url' ya es absoluto (empieza con http), lo usamos tal cual. 
  // Si no, lo concatenamos con BASE_URL. 
  const endpoint = url.startsWith('http')
    ? url
    : `${BASE_URL}${url}`;

  const res = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    if (res.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("No autorizado");
    }
    const error = new Error(errorBody.message || "Ocurrió un error");
    (error as any).info = errorBody;
    (error as any).status = res.status;
    throw error;
  }

  return res.json();
}
