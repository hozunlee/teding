import { useState } from 'react'
import { submitFeedback } from '@/features/feedback/api'

export function useFeedbackSubmit() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (title: string, body: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      await submitFeedback(title, body)
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : '제출 실패')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}
