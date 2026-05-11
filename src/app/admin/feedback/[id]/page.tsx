'use client'

import { use } from 'react'
import { useAdminCheck } from '../../_hooks/useAdminCheck'
import { AdminFeedbackDetail } from '@/widgets/AdminFeedbackDetail'

export default function AdminFeedbackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { isAdmin } = useAdminCheck()

  if (isAdmin === null) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-8 text-sm text-muted-foreground">
        확인 중...
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto max-w-lg px-4 py-8 text-center">
        <p className="text-lg font-semibold">권한 없음</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <AdminFeedbackDetail id={id} />
    </div>
  )
}
