import { useState, useEffect, useRef } from 'react'
import { fetchMyFeedbacks } from '@/features/feedback/api'
import type { MyFeedback } from '@/features/feedback/types'

export function useMyFeedbacks() {
  const [feedbacks, setFeedbacks] = useState<MyFeedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const refreshRef = useRef(0)

  const refresh = () => { refreshRef.current += 1; setLoading(true) }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchMyFeedbacks()
      .then((data) => { if (!cancelled) setFeedbacks(data) })
      .catch((e: Error) => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  // refreshRef.current is intentionally used as a trigger
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshRef.current])

  return { feedbacks, loading, error, refresh }
}
