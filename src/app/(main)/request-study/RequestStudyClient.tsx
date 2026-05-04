'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'

interface YTPlayerEvent {
  target: { getDuration: () => number; destroy: () => void }
}
interface YTPlayer {
  destroy: () => void
}
interface YTStatic {
  Player: new (
    el: string,
    opts: { videoId: string; events: { onReady: (e: YTPlayerEvent) => void } }
  ) => YTPlayer
}
declare global {
  interface Window {
    YT: YTStatic
    onYouTubeIframeAPIReady: () => void
  }
}

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

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface Props {
  longestStreak: number
}

export function RequestStudyClient({ longestStreak }: Props) {
  const [urlInput, setUrlInput] = useState('')
  const [videoId, setVideoId] = useState('')
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDuration, setVideoDuration] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)
  const playerRef = useRef<YTPlayer | null>(null)

  useEffect(() => {
    const id = parseVideoId(urlInput)
    setVideoId(id)
    setVideoTitle('')
    setVideoDuration('')

    if (id.length !== 11) return

    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`)
      .then(r => (r.ok ? r.json() : null))
      .then((data: { title?: string } | null) => {
        if (data?.title) setVideoTitle(data.title)
      })
      .catch(() => {})

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
      const div = document.createElement('div')
      div.id = 'yt-req-player'
      div.style.display = 'none'
      document.body.appendChild(div)

      playerRef.current = new window.YT.Player('yt-req-player', {
        videoId: id,
        events: {
          onReady: (e: YTPlayerEvent) => {
            const secs = e.target.getDuration()
            if (secs > 0) setVideoDuration(formatDuration(secs))
            e.target.destroy()
            playerRef.current = null
            div.remove()
          },
        },
      })
    }

    if (window.YT?.Player) {
      createPlayer()
    } else {
      window.onYouTubeIframeAPIReady = createPlayer
      if (!document.getElementById('yt-iframe-api')) {
        const script = document.createElement('script')
        script.id = 'yt-iframe-api'
        script.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(script)
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
      document.getElementById('yt-req-player')?.remove()
    }
  }, [urlInput])

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
        videoTitle: videoTitle || null,
        videoDuration: videoDuration || null,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
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

  const thumbnailUrl = videoId.length === 11 ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null

  return (
    <div className='mx-auto max-w-lg'>
      <div className='mb-6'>
        <div className='mb-3 flex items-center justify-between'>
          <p className='text-xs text-muted-foreground'>최장 스트릭 {longestStreak}일 달성 해금</p>
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
            {(videoTitle || videoDuration) && (
              <div className='px-3 py-2'>
                {videoTitle && <p className='text-sm font-medium line-clamp-2'>{videoTitle}</p>}
                {videoDuration && (
                  <p className='mt-0.5 text-xs text-muted-foreground'>{videoDuration}</p>
                )}
              </div>
            )}
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
