import { getFirebaseAuth } from "@/lib/firebase";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const currentUser = typeof window === "undefined" ? null : getFirebaseAuth().currentUser;
  const token = currentUser ? await currentUser.getIdToken() : null;
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && init?.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message ?? "Request failed");
  }

  return response.json() as Promise<T>;
}
