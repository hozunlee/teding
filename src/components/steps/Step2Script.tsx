'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { apiFetch } from '@/lib/api-client'

interface TranscriptData {
  video_id: string
  raw_text: string
  word_count: number
  sentence_count: number
}

interface Props {
  videoId: string
  transcript: TranscriptData
  materialsReady: boolean
  isReviewMode?: boolean
}

export function Step2Script({ videoId, transcript, materialsReady, isReviewMode = false }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [expanded, setExpanded] = useState(false)
  const [generating, setGenerating] = useState(!materialsReady)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isReviewMode || materialsReady) return

    async function triggerGenerate() {
      try {
        await apiFetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId, transcript: transcript.raw_text }),
        })
        setGenerating(false)
      } catch (error) {
        console.error('Failed to trigger generate:', error)
      }
    }

    triggerGenerate()
  }, [isReviewMode, materialsReady, videoId, transcript.raw_text])

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

  const preview = transcript.raw_text.slice(0, 500)

  const paragraphs = transcript.raw_text
    .match(/[^.!?]+[.!?]\s*/g)
    ?.reduce((acc: string[][], sentence, i) => {
      const pIdx = Math.floor(i / 4)
      if (!acc[pIdx]) acc[pIdx] = []
      acc[pIdx].push(sentence)
      return acc
    }, [])
    .map(p => p.join('')) ?? [transcript.raw_text]

  return (
    <div className='flex flex-col gap-5'>
      {isReviewMode && (
        <div className='rounded-lg bg-muted/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground'>
          핵심 표현을 익혔으니, 스크립트를 읽으며 전체 내용을 다시 한번 확인해 보세요.
        </div>
      )}

      <div className='flex flex-wrap gap-2'>
        <Badge variant='secondary'>{transcript.word_count.toLocaleString()} 단어</Badge>
        <Badge variant='secondary'>{transcript.sentence_count} 문장</Badge>
        <Badge variant='outline'>Grade 6</Badge>
      </div>

      <div className='rounded-lg border bg-muted/30 p-4'>
        <p className='mb-2 text-xs font-semibold text-muted-foreground'>스크립트</p>
        <div className='space-y-4 text-sm leading-relaxed'>
          {expanded
            ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
            : <p>{preview}{transcript.raw_text.length > 500 ? '…' : ''}</p>}
        </div>
        {transcript.raw_text.length > 500 && (
          <button
            onClick={() => setExpanded(v => !v)}
            className='mt-2 text-xs text-[var(--brand-orange)] hover:underline'
          >
            {expanded ? '접기' : '전체 보기'}
          </button>
        )}
      </div>

      {!isReviewMode && generating && (
        <div className='flex items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground'>
          <span className='inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent' />
          학습자료 생성 중... (Step 3 진입 시 준비 완료)
        </div>
      )}

      {isReviewMode ? (
        <Link
          href='/'
          className='flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground'
        >
          홈으로
        </Link>
      ) : (
        <Button
          onClick={handleComplete}
          disabled={loading}
          className='w-full'
        >
          {loading ? '저장 중...' : '스크립트 확인 완료 → Step 3'}
        </Button>
      )}
    </div>
  )
}
