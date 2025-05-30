const BASE_URL = `${process.env.PUBLIC_API_URL}/api`;

export async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: { 
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
  });

  if (!res.ok) {
  const errorBody = await res.json();

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