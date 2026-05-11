'use client'

import Link from 'next/link'
import { useFeedbackList } from '@/hooks/useFeedbackList'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
}

export function AdminFeedbackList() {
  const { feedbacks, loading, error } = useFeedbackList()

  if (loading) {
    return <p className="text-sm text-muted-foreground py-4">불러오는 중...</p>
  }

  if (error) {
    return <p className="text-sm text-destructive py-4">{error}</p>
  }

  if (feedbacks.length === 0) {
    return (
      <div className="rounded-[8px] border border-border py-10 text-center">
        <p className="text-sm text-muted-foreground">아직 접수된 의견이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="rounded-[8px] border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="w-10 py-2.5 pl-4 text-left text-xs font-medium text-muted-foreground">#</th>
            <th className="py-2.5 pl-3 text-left text-xs font-medium text-muted-foreground">제목</th>
            <th className="w-16 py-2.5 pr-4 text-right text-xs font-medium text-muted-foreground">날짜</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((fb, idx) => (
            <tr key={fb.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
              <td className="py-3 pl-4 text-xs text-muted-foreground tabular-nums">{idx + 1}</td>
              <td className="py-3 pl-3">
                <Link
                  href={`/admin/feedback/${fb.id}`}
                  className="hover:text-[#010120] hover:underline underline-offset-2 transition-colors line-clamp-1"
                >
                  {fb.title}
                </Link>
              </td>
              <td className="py-3 pr-4 text-right text-xs text-muted-foreground tabular-nums">
                {formatDate(fb.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
