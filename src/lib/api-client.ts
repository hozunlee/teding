import { createClient } from '@/lib/supabase/client'

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' ? window.location.origin : '')

export async function apiFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)

  if (init.body && !(init.body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'same-origin',
  })
}
