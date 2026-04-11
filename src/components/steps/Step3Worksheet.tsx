'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { WorksheetRenderer } from '@/components/worksheet/WorksheetRenderer'
import { PDFDownloadButton } from '@/components/worksheet/PDFDownloadButton'
import { UploadAnnotated } from '@/components/worksheet/UploadAnnotated'
import type { Worksheet } from '@/types/worksheet'

interface Props {
  videoId: string
  worksheet: Worksheet
}

export function Step3Worksheet({ videoId, worksheet }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    setLoading(true)
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, step: 3 }),
    })
    router.push(`/study?step=4`)
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap gap-2 print:hidden'>
        <PDFDownloadButton />
        <UploadAnnotated videoId={videoId} />
      </div>

      <WorksheetRenderer worksheet={worksheet} />

      <div className='step-nav print:hidden'>
        <Button onClick={handleComplete} disabled={loading} className='w-full'>
          {loading ? '저장 중...' : '학습지 완료 → Step 4'}
        </Button>
      </div>
    </div>
  )
}
