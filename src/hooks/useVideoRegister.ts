'use client'

import { useState } from 'react'

interface RegisterOpts {
  videoId: string
  title: string
  duration: string
  videoUrl: string
  date: string
  force?: boolean
}

interface RegisterSuccess {
  ok: true
  transcriptCached: boolean
  materialsCached: boolean
}

interface RegisterFailure {
  ok: false
  error: string
}

type RegisterResult = RegisterSuccess | RegisterFailure

export function useVideoRegister() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [result, setResult] = useState<RegisterResult | null>(null)

  async function register(opts: RegisterOpts): Promise<RegisterResult> {
    setIsRegistering(true)
    setResult(null)

    try {
      const res = await fetch('/api/admin/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
      })
      const data = (await res.json()) as {
        ok?: boolean
        error?: string
        transcriptCached?: boolean
        materialsCached?: boolean
      }

      const result: RegisterResult = res.ok
        ? { ok: true, transcriptCached: data.transcriptCached ?? false, materialsCached: data.materialsCached ?? false }
        : { ok: false, error: data.error ?? '등록 실패' }

      setResult(result)
      return result
    } catch {
      const result: RegisterResult = { ok: false, error: '네트워크 오류' }
      setResult(result)
      return result
    } finally {
      setIsRegistering(false)
    }
  }

  return { register, isRegistering, result, setResult }
}
