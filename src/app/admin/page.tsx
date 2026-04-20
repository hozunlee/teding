'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface YTPlayerEvent { target: { getDuration: () => number; destroy: () => void } }
interface YTPlayer { destroy: () => void }
interface YTStatic { Player: new (el: string, opts: { videoId: string; events: { onReady: (e: YTPlayerEvent) => void } }) => YTPlayer }
declare global { interface Window { YT: YTStatic; onYouTubeIframeAPIReady: () => void } }

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface TodayData {
  video: {
    video_id: string
    title: string
    duration: string
    date: string
  } | null
  cached: {
    transcript: boolean
    materials: boolean
  } | null
}

function parseVideoId(input: string): string {
  const trimmed = input.trim()
  // 유튜브 URL 파싱: watch?v=ID, youtu.be/ID, embed/ID
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }
  // 11자리 ID 직접 입력
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
  return trimmed
}

function getKSTDateStr(offset = 0): string {
  const d = new Date()
  d.setTime(d.getTime() + (9 * 60 + offset * 24 * 60) * 60 * 1000)
  return d.toISOString().slice(0, 10)
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [today, setToday] = useState<TodayData | null>(null)
  const [tomorrow, setTomorrow] = useState<TodayData | null>(null)
  const [videoInput, setVideoInput] = useState('')
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [force, setForce] = useState(false)
  const [targetDate, setTargetDate] = useState<'today' | 'tomorrow'>('today')
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)
  const playerRef = useRef<YTPlayer | null>(null)

  useEffect(() => {
    const videoId = parseVideoId(videoInput)
    if (videoId.length !== 11) return

    // 제목 가져오기 (oEmbed)
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`)
      .then(r => r.ok ? r.json() : null)
      .then((data: { title?: string } | null) => { if (data?.title) setTitle(data.title) })
      .catch(() => {})

    // 재생시간 가져오기 (iframe API)
    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
      const div = document.createElement('div')
      div.id = 'yt-hidden-player'
      div.style.display = 'none'
      document.body.appendChild(div)

      playerRef.current = new window.YT.Player('yt-hidden-player', {
        videoId,
        events: {
          onReady: (e: YTPlayerEvent) => {
            const secs = e.target.getDuration()
            if (secs > 0) setDuration(formatDuration(secs))
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
      document.getElementById('yt-hidden-player')?.remove()
    }
  }, [videoInput])

  useEffect(() => {
    // 어드민 여부 확인
    fetch('/api/admin/check')
      .then(r => r.json())
      .then((d: { isAdmin: boolean }) => setIsAdmin(d.isAdmin))
      .catch(() => setIsAdmin(false))

    // 오늘/내일 영상 상태 확인
    fetch('/api/today')
      .then(r => r.json())
      .then((d: TodayData) => setToday(d))
      .catch(() => {})
    fetch(`/api/today?date=${getKSTDateStr(1)}`)
      .then(r => r.json())
      .then((d: TodayData) => setTomorrow(d))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)

    const videoId = parseVideoId(videoInput)

    const res = await fetch('/api/admin/daily', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, title, duration, force, date: getKSTDateStr(targetDate === 'tomorrow' ? 1 : 0) }),
    })

    const data = await res.json() as { ok?: boolean; error?: string; transcriptCached?: boolean; materialsCached?: boolean }
    setSubmitting(false)

    if (!res.ok) {
      setResult({ ok: false, message: data.error ?? '오류 발생' })
    } else {
      setResult({
        ok: true,
        message: `${targetDate === 'tomorrow' ? '내일' : '오늘'} 등록 완료 · 스크립트 ${data.transcriptCached ? '캐시' : '신규'} · 학습자료 ${data.materialsCached ? '캐시' : '신규 생성'}`,
      })
      // 상태 갱신
      fetch('/api/today').then(r => r.json()).then((d: TodayData) => setToday(d))
      fetch(`/api/today?date=${getKSTDateStr(1)}`).then(r => r.json()).then((d: TodayData) => setTomorrow(d))
    }
  }

  async function handleReset() {
    if (!confirm('정말로 오늘의 학습자료(영상, 스크립트, 학습지 전체)를 초기화하시겠습니까?')) return
    setSubmitting(true)
    setResult(null)

    const videoId = parseVideoId(videoInput)
    const res = await fetch('/api/admin/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId: videoId || today?.video?.video_id }),
    })

    const data = await res.json() as { ok?: boolean; error?: string; message?: string }
    setSubmitting(false)

    if (!res.ok) {
      setResult({ ok: false, message: data.error ?? '초기화 실패' })
    } else {
      setResult({ ok: true, message: data.message ?? '초기화 성공' })
      setVideoInput('')
      setTitle('')
      setDuration('')
      fetch('/api/today').then(r => r.json()).then((d: TodayData) => setToday(d))
    }
  }

  if (isAdmin === null) {
    return <div className='container mx-auto max-w-lg px-4 py-8 text-sm text-muted-foreground'>확인 중...</div>
  }

  if (!isAdmin) {
    return (
      <div className='container mx-auto max-w-lg px-4 py-8 text-center'>
        <p className='text-lg font-semibold'>권한 없음</p>
        <p className='mt-1 text-sm text-muted-foreground'>관리자 계정으로 로그인하세요.</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto max-w-lg px-4 py-8'>
      <div className='mb-6 flex items-center gap-2'>
        <h1 className='text-xl font-bold'>어드민</h1>
        <Badge variant='secondary'>ho2yahh@gmail.com</Badge>
        <a
          href='https://www.youtube.com/@TEDEd/playlists'
          target='_blank'
          rel='noopener noreferrer'
          className='ml-auto text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors'
        >
          TED-Ed 플레이리스트
        </a>
      </div>

      {/* 오늘 영상 현황 */}
      <div className='mb-3 rounded-lg border p-4'>
        <p className='text-mono-label mb-2 text-muted-foreground'>오늘의 영상 현황</p>
        {today?.video ? (
          <div className='flex flex-col gap-1'>
            <p className='text-sm font-medium'>{today.video.title}</p>
            <p className='text-xs text-muted-foreground'>
              {today.video.video_id} · {today.video.duration}
            </p>
            <div className='mt-1 flex gap-2'>
              <Badge variant={today.cached?.transcript ? 'default' : 'outline'}>
                스크립트 {today.cached?.transcript ? '✓' : '미생성'}
              </Badge>
              <Badge variant={today.cached?.materials ? 'default' : 'outline'}>
                학습자료 {today.cached?.materials ? '✓' : '미생성'}
              </Badge>
            </div>
          </div>
        ) : (
          <p className='text-sm text-muted-foreground'>등록된 영상 없음</p>
        )}
      </div>

      {/* 내일 영상 현황 */}
      <div className='mb-6 rounded-lg border border-dashed p-3 flex items-center gap-3'>
        <p className='text-xs text-muted-foreground shrink-0'>내일 준비</p>
        {tomorrow?.video ? (
          <>
            <p className='text-xs font-medium truncate flex-1'>{tomorrow.video.title}</p>
            <Badge variant={tomorrow.cached?.materials ? 'default' : 'outline'} className='shrink-0 text-[10px] px-1.5 py-0'>
              {tomorrow.cached?.materials ? '완료' : '자료 미생성'}
            </Badge>
          </>
        ) : (
          <p className='text-xs text-muted-foreground'>미등록</p>
        )}
      </div>

      {/* 영상 등록 폼 */}
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1.5'>
          <label className='text-mono-label text-muted-foreground'>등록 날짜</label>
          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => setTargetDate('today')}
              className={`flex-1 rounded-[4px] border px-3 py-2 text-sm transition-colors ${targetDate === 'today' ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground hover:text-foreground'}`}
            >
              오늘 ({getKSTDateStr(0)})
            </button>
            <button
              type='button'
              onClick={() => setTargetDate('tomorrow')}
              className={`flex-1 rounded-[4px] border px-3 py-2 text-sm transition-colors ${targetDate === 'tomorrow' ? 'border-foreground bg-foreground text-background' : 'border-border bg-background text-muted-foreground hover:text-foreground'}`}
            >
              내일 ({getKSTDateStr(1)})
            </button>
          </div>
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-mono-label text-muted-foreground'>YouTube URL 또는 Video ID</label>
          <input
            type='text'
            value={videoInput}
            onChange={e => setVideoInput(e.target.value)}
            placeholder='https://youtube.com/watch?v=vAKCmMNHdHw'
            required
            className='rounded-[4px] border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50'
          />
          {videoInput && (
            <p className='text-xs text-muted-foreground'>
              Video ID: <code className='font-mono'>{parseVideoId(videoInput)}</code>
            </p>
          )}
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-mono-label text-muted-foreground'>제목</label>
          <input
            type='text'
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder='Why are sloths so slow?'
            required
            className='rounded-[4px] border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50'
          />
        </div>

        <div className='flex flex-col gap-1.5'>
          <label className='text-mono-label text-muted-foreground'>재생 시간</label>
          <input
            type='text'
            value={duration}
            onChange={e => setDuration(e.target.value)}
            placeholder='5:15'
            required
            className='rounded-[4px] border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50'
          />
        </div>

        {result && (
          <div className={`rounded-lg border p-3 text-sm ${result.ok ? 'border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300' : 'border-destructive/30 bg-destructive/10 text-destructive'}`}>
            {result.message}
          </div>
        )}

        <div className='flex gap-2 mt-2'>
          <Button type='button' variant='outline' onClick={handleReset} disabled={submitting} className='flex-1 border-destructive text-destructive hover:bg-destructive/10'>
            오늘 자료 초기화
          </Button>
          <Button type='submit' disabled={submitting} className='flex-1'>
            {submitting ? '생성 중... (최대 60초)' : '오늘의 영상 등록 + 학습자료 생성'}
          </Button>
        </div>

        <label className='flex cursor-pointer items-center gap-2 px-1 mt-1 text-xs text-muted-foreground'>
          <input
            type='checkbox'
            checked={force}
            onChange={e => setForce(e.target.checked)}
            className='h-3.5 w-3.5 rounded border-border accent-[var(--brand-orange)]'
          />
          기존 캐시 무시하고 강제 생성 (Prompt 업데이트 시 사용)
        </label>
      </form>
    </div>
  )
}
