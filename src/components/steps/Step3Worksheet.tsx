'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { WorksheetRenderer } from '@/components/worksheet/WorksheetRenderer'
import { PDFDownloadButton } from '@/components/worksheet/PDFDownloadButton'
import { UploadAnnotated } from '@/components/worksheet/UploadAnnotated'
import type { Worksheet, Phrase, SentenceAnalysis } from '@/types/worksheet'

interface Props {
  videoId: string
  worksheet: Worksheet
  phrases: Phrase[]
  sentences: SentenceAnalysis[]
}

export function Step3Worksheet({ videoId, worksheet, phrases, sentences }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    setLoading(true)
    try {
      await Promise.all([
        fetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId, step: 3 }),
        }),
        fetch('/api/streak', { method: 'POST' })
      ])
      const params = new URLSearchParams(searchParams.toString())
      params.set('step', '4')
      router.push(`/study?${params.toString()}`)
    } catch (error) {
      console.error('Failed to complete step 3:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap gap-2 print:hidden'>
        <PDFDownloadButton />
        <UploadAnnotated videoId={videoId} />
      </div>

      <WorksheetRenderer 
        worksheet={worksheet} 
        phrases={phrases} 
        sentences={sentences} 
      />

      <div className='step-nav print:hidden'>
        <Button onClick={handleComplete} disabled={loading} className='w-full'>
          {loading ? '저장 중...' : '학습지 완료 → Step 4'}
        </Button>
      </div>
    </div>
  )
}
