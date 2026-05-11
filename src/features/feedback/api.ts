import type { FeedbackWithProfile, FeedbackDetail, MyFeedback } from './types'

export async function fetchMyFeedbacks(): Promise<MyFeedback[]> {
  const res = await fetch('/api/feedback')
  if (!res.ok) throw new Error('목록 조회 실패')
  const { feedbacks } = await res.json()
  return feedbacks
}

export async function submitFeedback(title: string, body: string): Promise<void> {
  const res = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? '제출 실패')
  }
}

export async function fetchFeedbackList(): Promise<FeedbackWithProfile[]> {
  const res = await fetch('/api/admin/feedback')
  if (!res.ok) throw new Error('목록 조회 실패')
  const { feedbacks } = await res.json()
  return feedbacks
}

export async function fetchFeedbackDetail(id: string): Promise<FeedbackDetail> {
  const res = await fetch(`/api/admin/feedback/${id}`)
  if (!res.ok) throw new Error('상세 조회 실패')
  const { feedback } = await res.json()
  return feedback
}

export async function addFeedbackComment(id: string, body: string): Promise<void> {
  const res = await fetch(`/api/admin/feedback/${id}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  })
  if (!res.ok) {
    const { error } = await res.json()
    throw new Error(error ?? '댓글 등록 실패')
  }
}
