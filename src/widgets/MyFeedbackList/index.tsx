'use client'

import { useState, useEffect } from 'react'
import { useMyFeedbacks } from '@/hooks/useMyFeedbacks'
import type { MyFeedback } from '@/features/feedback/types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
}

function FeedbackRow({ fb, idx }: { fb: MyFeedback; idx: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/20 transition-colors"
      >
        <span className="w-6 shrink-0 text-xs text-muted-foreground tabular-nums">{idx + 1}</span>
        <span className="flex-1 truncate text-sm">{fb.title}</span>
        {fb.comments.length > 0 && (
          <span className="shrink-0 rounded-full bg-[#010120] px-1.5 py-0.5 text-[10px] font-medium text-white">
            답변
          </span>
        )}
        <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{formatDate(fb.created_at)}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/80">{fb.body}</p>

          {fb.comments.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">반영 결과</span>
              {fb.comments.map((c) => (
                <div key={c.id} className="rounded-[4px] border border-border bg-muted/20 px-3 py-2 flex flex-col gap-1">
                  <p className="text-sm">{c.body}</p>
                  <span className="text-[11px] text-muted-foreground">{formatDate(c.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function MyFeedbackList({ refreshKey }: { refreshKey?: number }) {
  const { feedbacks, loading, error, refresh } = useMyFeedbacks()

  useEffect(() => {
    if (refreshKey) refresh()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey])

  if (loading) return <p className="text-sm text-muted-foreground py-4">불러오는 중...</p>
  if (error) return <p className="text-sm text-destructive py-4">{error}</p>
  if (feedbacks.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">내가 보낸 의견</h2>
      <div className="rounded-[8px] border border-border overflow-hidden">
        {feedbacks.map((fb, idx) => (
          <FeedbackRow key={fb.id} fb={fb} idx={idx} />
        ))}
      </div>
    </div>
  )
}
