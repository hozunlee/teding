'use client'

import { useEffect, useState } from 'react'
import { useAuthModal } from '@/lib/store/auth-modal'
import Link from 'next/link'

interface HistoryItem {
  date: string
  step1_completed_at: string | null
  step2_completed_at: string | null
  step3_completed_at: string | null
  step4_completed_at: string | null
  video_id: string
  daily_comment: string | null
  daily_videos: {
    title: string
  }
}

function CommentToggle({ comment }: { comment: string }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <p
      onClick={(e) => { e.preventDefault(); setExpanded(!expanded) }}
      className={`mt-1 text-xs text-muted-foreground cursor-pointer ${expanded ? '' : 'line-clamp-1'}`}
    >
      💬 {comment}
    </p>
  )
}

export function RecentList() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const openModal = useAuthModal((s) => s.open)

  useEffect(() => {
    fetch('/api/history')
      .then(r => r.json())
      .then(d => {
        setHistory(d.history || [])
        setIsLoggedIn(d.loggedIn !== false)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const getLatestStep = (item: HistoryItem) => {
    if (item.step4_completed_at) return 4
    if (item.step3_completed_at) return 3
    if (item.step2_completed_at) return 2
    if (item.step1_completed_at) return 1
    return 0
  }

  if (loading) {
    return (
      <div className='flex flex-col gap-3'>
        <p className='text-mono-label px-1 text-muted-foreground animate-pulse'>Loading History...</p>
        <div className='h-[100px] w-full rounded-lg border border-border bg-muted/5 animate-pulse' />
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className='flex flex-col gap-3'>
        <p className='text-mono-label px-1 text-muted-foreground'>최근 학습 기록</p>
        <button
          onClick={() => openModal('로그인하면 지난 학습 기록을 언제든지 확인하고 복습할 수 있습니다.')}
          className='flex min-h-[100px] w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/5 p-8 text-center text-xs text-muted-foreground transition-colors hover:bg-muted/10'
        >
          <div className='flex flex-col items-center gap-2'>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
              <rect x='3' y='11' width='18' height='11' rx='2' ry='2' />
              <path d='M7 11V7a5 5 0 0 1 10 0v4' />
            </svg>
            <span>로그인하면 기록이 저장됩니다</span>
            <span style={{ color: 'var(--brand-orange)' }} className='font-medium underline underline-offset-2'>로그인하기 →</span>
          </div>
        </button>
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
          {history.map((item) => {
            const step = getLatestStep(item)
            return (
              <Link
                key={item.video_id}
                href={`/study?date=${item.date}&step=${step}`}
                className='flex items-center justify-between p-4 transition-colors hover:bg-muted/5'
              >
                <div className='flex min-w-0 items-center gap-3'>
                  <div 
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold ${step === 4 ? 'bg-green-500' : 'bg-orange-400'}`}
                  >
                    {step === 4 ? (
                      <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3' strokeLinecap='round' strokeLinejoin='round'>
                        <polyline points='20 6 9 17 4 12' />
                      </svg>
                    ) : (
                      `S${step}`
                    )}
                  </div>
                  <div className='flex flex-col min-w-0'>
                    <p className='truncate text-sm font-medium text-[var(--dark-blue)]'>{item.daily_videos.title}</p>
                    <p className='text-[10px] text-muted-foreground'>{item.date.replace(/-/g, '.')}</p>
                    {item.daily_comment && <CommentToggle comment={item.daily_comment} />}
                  </div>
                </div>
                <div className='shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground'>
                  {step === 4 ? '완료' : `Step ${step} 진행 중`}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
