import { cookies } from "next/headers";

export async function fetchFromAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const token = (await cookies()).get("access_token")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) {
    const errorBody = await res.json();
    throw new Error(errorBody.message || "Error en fetch");
  }

  return res.json();
}
