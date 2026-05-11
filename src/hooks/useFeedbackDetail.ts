import { useState, useEffect, useCallback } from 'react'
import { fetchFeedbackDetail, addFeedbackComment } from '@/features/feedback/api'
import type { FeedbackDetail } from '@/features/feedback/types'

export function useFeedbackDetail(id: string) {
  const [feedback, setFeedback] = useState<FeedbackDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commenting, setCommenting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetchFeedbackDetail(id)
      .then(setFeedback)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  const addComment = async (body: string) => {
    setCommenting(true)
    try {
      await addFeedbackComment(id, body)
      await load()
    } finally {
      setCommenting(false)
    }
  }

  return { feedback, loading, error, addComment, commenting }
}
