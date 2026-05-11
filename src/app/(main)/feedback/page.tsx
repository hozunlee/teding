'use client'

import { useState } from 'react'
import { FeedbackSubmitForm } from '@/widgets/FeedbackSubmitForm'
import { MyFeedbackList } from '@/widgets/MyFeedbackList'

export default function FeedbackPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="container mx-auto max-w-lg px-4 py-10 flex flex-col gap-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">의견 보내기</h1>
          <p className="text-sm text-muted-foreground">
            버그, 기능 제안, 불편한 점 등 자유롭게 남겨주세요.
          </p>
        </div>
        <FeedbackSubmitForm onSubmitted={() => setRefreshKey((k) => k + 1)} />
      </div>

      <MyFeedbackList refreshKey={refreshKey} />
    </div>
  )
}
