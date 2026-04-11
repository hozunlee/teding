'use client'

import { useEffect, useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

interface HistoryItem {
  date: string
  completed_at: string
  video_id: string
  daily_videos: {
    title: string
  }
}

export function RecentList() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(d => {
        setHistory(d.history || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className='flex flex-col gap-3'>
        <p className='text-mono-label px-1 text-muted-foreground animate-pulse'>Loading History...</p>
        <div className='h-[100px] w-full rounded-lg border border-border bg-muted/5 animate-pulse' />
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className='flex flex-col gap-3'>
        <p className='text-mono-label px-1 text-muted-foreground'>최근 학습 기록</p>
        <div className='flex min-h-[100px] items-center justify-center rounded-lg border border-border bg-muted/10 p-8 text-center text-xs text-muted-foreground shadow-sm'>
          <div className='flex flex-col items-center gap-2 text-muted-foreground/60'>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
            </svg>
            아직 완료한 학습이 없습니다.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-mono-label px-1 text-muted-foreground'>최근 학습 기록</p>
      <div className='overflow-hidden rounded-lg border border-border bg-card shadow-[var(--shadow-elegant)]'>
        <div className='divide-y divide-border/50'>
          {history.map((item) => (
            <div key={item.video_id} className='flex items-center justify-between p-4 transition-colors hover:bg-muted/5'>
              <div className='flex min-w-0 items-center gap-3'>
                <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400'>
                  <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'>
                    <polyline points='20 6 9 17 4 12' />
                  </svg>
                </div>
                <p className='truncate text-sm font-medium text-[var(--dark-blue)]'>{item.daily_videos.title}</p>
              </div>
              <p className='shrink-0 text-[10px] text-muted-foreground'>
                {formatDistanceToNow(new Date(item.completed_at), { addSuffix: true, locale: ko })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
