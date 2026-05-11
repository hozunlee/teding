import { useState, useEffect } from 'react'
import { fetchFeedbackList } from '@/features/feedback/api'
import type { FeedbackWithProfile } from '@/features/feedback/types'

export function useFeedbackList() {
  const [feedbacks, setFeedbacks] = useState<FeedbackWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFeedbackList()
      .then(setFeedbacks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { feedbacks, loading, error }
}
