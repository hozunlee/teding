'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { WorksheetRenderer } from '@/components/worksheet/WorksheetRenderer'
import { PDFDownloadButton } from '@/components/worksheet/PDFDownloadButton'
import { UploadAnnotated } from '@/components/worksheet/UploadAnnotated'
import type { Worksheet, Phrase, SentenceAnalysis } from '@/types/worksheet'
import { apiFetch } from '@/lib/api-client'

interface TranscriptData {
  raw_text: string
}

interface Props {
  videoId: string
  worksheet: Worksheet | null
  phrases: Phrase[] | null
  sentences: SentenceAnalysis[] | null
  transcript: TranscriptData | null
  materialsReady: boolean
}

export function Step3Worksheet({ videoId, worksheet, phrases, sentences, transcript, materialsReady }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (materialsReady || !transcript) return

    apiFetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, transcript: transcript.raw_text }),
    })
      .then(() => router.refresh())
      .catch(console.error)
  }, [materialsReady, videoId, transcript, router])

  async function handleComplete() {
    setLoading(true)
    try {
      await Promise.all([
        apiFetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId, step: 2 }),
        }),
        apiFetch('/api/streak', { method: 'POST' })
      ])
      const params = new URLSearchParams(searchParams.toString())
      params.set('step', '3')
      router.push(`/study?${params.toString()}`)
    } catch (error) {
      console.error('Failed to complete step 2:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!materialsReady || !worksheet || !phrases || !sentences) {
    return (
      <div className='flex items-center gap-3 rounded-lg border border-dashed p-6 text-sm text-muted-foreground'>
        <span className='inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent' />
        학습자료 생성 중... 잠시만 기다려 주세요.
      </div>
    )
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
          {loading ? '저장 중...' : '학습지 완료 → Step 3'}
        </Button>
      </div>
    </div>
  )
}
