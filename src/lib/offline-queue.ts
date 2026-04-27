import { apiFetch } from '@/lib/api-client'

export type SaveResult =
  | { status: 'success' }
  | { status: 'queued'; reason: 'network' }
  | { status: 'auth_required' }
  | { status: 'client_error'; code: number }
  | { status: 'server_error'; code: number }

export async function saveProgress(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
): Promise<SaveResult> {
  try {
    const res = await apiFetch(path, { method, body: JSON.stringify(body) })
    if (res.ok) return { status: 'success' }
    if (res.status === 401) return { status: 'auth_required' }
    if (res.status >= 500) return { status: 'server_error', code: res.status }
    return { status: 'client_error', code: res.status }
  } catch {
    return { status: 'client_error', code: 0 }
  }
}

export async function flushQueue(): Promise<{ success: number; failed: number; dropped: number }> {
  return { success: 0, failed: 0, dropped: 0 }
}
