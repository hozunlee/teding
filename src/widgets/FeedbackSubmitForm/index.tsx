'use client'

import { useState } from 'react'
import { useFeedbackSubmit } from '@/hooks/useFeedbackSubmit'

export function FeedbackSubmitForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const { submit, loading, error } = useFeedbackSubmit()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    const ok = await submit(title.trim(), body.trim())
    if (ok) {
      setTitle('')
      setBody('')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      onSubmitted?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="fb-title" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          제목
        </label>
        <input
          id="fb-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          placeholder="한 줄로 요약해주세요"
          required
          className="rounded-[4px] border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground/20 placeholder:text-muted-foreground/50"
        />
        <span className="self-end text-[11px] text-muted-foreground">{title.length}/100</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="fb-body" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          내용
        </label>
        <textarea
          id="fb-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          maxLength={2000}
          rows={6}
          placeholder="자유롭게 적어주세요. 버그, 기능 제안, 불편한 점 모두 환영합니다."
          required
          className="resize-none rounded-[4px] border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground/20 placeholder:text-muted-foreground/50"
        />
        <span className="self-end text-[11px] text-muted-foreground">{body.length}/2000</span>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
      {showSuccess && <p className="text-xs text-green-600">의견이 접수되었습니다.</p>}

      <button
        type="submit"
        disabled={loading || !title.trim() || !body.trim()}
        className="self-end rounded-[4px] bg-[#010120] px-5 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-40"
      >
        {loading ? '제출 중...' : '제출하기'}
      </button>
    </form>
  )
}
