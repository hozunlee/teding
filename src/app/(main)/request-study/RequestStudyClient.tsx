'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

function parseVideoId(input: string): string {
  const trimmed = input.trim()
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
  return ''
}

export function RequestStudyClient() {
  const [urlInput, setUrlInput] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)

  const videoId = parseVideoId(urlInput)
  const thumbnailUrl = videoId.length === 11 ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (videoId.length !== 11) return
    setSubmitting(true)
    setResult(null)

    const res = await fetch('/api/request-study', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId,
        videoUrl: urlInput.trim(),
        thumbnailUrl,
        userMessage: userMessage.trim() || null,
      }),
    })

    const data = (await res.json()) as { ok?: boolean; error?: string }
    setSubmitting(false)

    if (!res.ok) {
      const msg =
        data.error === 'already_requested'
          ? '이미 대기 중인 요청이 있습니다. 기존 요청이 처리된 후 새로운 요청을 보낼 수 있습니다.'
          : data.error ?? '오류가 발생했습니다.'
      setResult({ ok: false, message: msg })
    } else {
      setResult({ ok: true, message: '요청이 접수되었습니다! 관리자 검토 후 일정에 반영됩니다.' })
      setUrlInput('')
      setUserMessage('')
    }
  }

  return (
    <div className='mx-auto max-w-lg'>
      <div className='mb-6'>
        <div className='mb-3 flex items-center justify-between'>
          <p className='text-xs text-muted-foreground'>최장 스트릭 5일 달성 해금</p>
          <a
            href='https://www.youtube.com/@TEDEd/playlists'
            target='_blank'
            rel='noopener noreferrer'
            className='text-xs text-muted-foreground hover:text-[var(--brand-orange)] underline underline-offset-2 transition-colors'
          >
            TED-Ed 플레이리스트 →
          </a>
        </div>
        <h1 className='text-2xl font-semibold tracking-tight'>영상 조르기 🎬</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          같이 공부하고 싶은 TED-Ed 영상을 추천해주세요. 관리자가 검토 후 일정에 반영합니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1.5'>
          <label className='text-mono-label text-muted-foreground'>TED-Ed 영상 URL</label>
          <input
            type='text'
            value={urlInput}
            onChange={e => setUrlInput(e.target.value)}
            placeholder='https://www.youtube.com/watch?v=...'
            required
            className='rounded-[4px] border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50'
          />
          {urlInput && videoId.length !== 11 && (
            <p className='text-xs text-destructive'>유효한 YouTube URL을 입력해주세요.</p>
          )}
        </div>

        {thumbnailUrl && (
          <div className='overflow-hidden rounded-[4px] border bg-card'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={thumbnailUrl} alt='영상 썸네일' className='aspect-video w-full object-cover' />
          </div>
        )}

        <div className='flex flex-col gap-1.5'>
          <label className='text-mono-label text-muted-foreground'>추천 이유 (선택)</label>
          <textarea
            value={userMessage}
            onChange={e => setUserMessage(e.target.value)}
            placeholder='이거 같이 공부하면 어때요? 주제가 흥미롭고 표현이 다양하게 나올 것 같아서요!'
            rows={3}
            className='rounded-[4px] border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50 resize-none'
          />
        </div>

        {result && (
          <div
            className={`rounded-lg border p-3 text-sm ${
              result.ok
                ? 'border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300'
                : 'border-destructive/30 bg-destructive/10 text-destructive'
            }`}
          >
            {result.message}
          </div>
        )}

        <Button type='submit' disabled={submitting || videoId.length !== 11}>
          {submitting ? '제출 중...' : '영상 추천하기'}
        </Button>
      </form>
    </div>
  )
}
