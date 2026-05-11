'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFeedbackDetail } from '@/hooks/useFeedbackDetail'

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  })
}

export function AdminFeedbackDetail({ id }: { id: string }) {
  const { feedback, loading, error, addComment, commenting } = useFeedbackDetail(id)
  const [commentBody, setCommentBody] = useState('')

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentBody.trim()) return
    await addComment(commentBody.trim())
    setCommentBody('')
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground py-4">불러오는 중...</p>
  }

  if (error || !feedback) {
    return <p className="text-sm text-destructive py-4">{error ?? '데이터 없음'}</p>
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/admin"
        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
      >
        ← 목록으로
      </Link>

      {/* 의견 본문 */}
      <div className="rounded-[8px] border border-border p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold">{feedback.title}</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{feedback.nickname}</span>
            <span>·</span>
            <span>{feedback.email}</span>
            <span>·</span>
            <span>{formatDate(feedback.created_at)}</span>
          </div>
        </div>
        <hr className="border-border" />
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{feedback.body}</p>
      </div>

      {/* 댓글 목록 */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          반영 결과 ({feedback.comments.length})
        </h3>

        {feedback.comments.length > 0 && (
          <div className="flex flex-col gap-2">
            {feedback.comments.map((c) => (
              <div key={c.id} className="rounded-[4px] border border-border bg-muted/20 px-4 py-3 flex flex-col gap-1">
                <p className="text-sm">{c.body}</p>
                <span className="text-[11px] text-muted-foreground">{formatDate(c.created_at)}</span>
              </div>
            ))}
          </div>
        )}

        {/* 댓글 입력 */}
        <form onSubmit={handleComment} className="flex flex-col gap-2">
          <textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="반영 결과나 검토 의견을 작성하세요"
            className="resize-none rounded-[4px] border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-foreground/20 placeholder:text-muted-foreground/50"
          />
          <button
            type="submit"
            disabled={commenting || !commentBody.trim()}
            className="self-end rounded-[4px] border border-border bg-background px-4 py-1.5 text-sm transition-colors hover:bg-muted disabled:opacity-40"
          >
            {commenting ? '등록 중...' : '반영 결과 등록'}
          </button>
        </form>
      </div>
    </div>
  )
}
