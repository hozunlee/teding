'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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
}

export function Step2Script({ videoId, transcript, materialsReady }: Props) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [generating, setGenerating] = useState(!materialsReady)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (materialsReady) return

    async function triggerGenerate() {
      await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, transcript: transcript.raw_text }),
      })
      setGenerating(false)
    }

    triggerGenerate()
  }, [materialsReady, videoId, transcript.raw_text])

  async function handleComplete() {
    setLoading(true)
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, step: 2 }),
    })
    router.push(`/study?step=3`)
  }

  const preview = transcript.raw_text.slice(0, 500)

  // 문단 나누기 로직 (3-4문장 단위)
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
      <div className='flex flex-wrap gap-2'>
        <Badge variant='secondary'>{transcript.word_count.toLocaleString()} 단어</Badge>
        <Badge variant='secondary'>{transcript.sentence_count} 문장</Badge>
        <Badge variant='outline'>Grade 6</Badge>
      </div>

      <div className='rounded-lg border bg-muted/30 p-4'>
        <p className='mb-2 text-xs font-semibold text-muted-foreground'>스크립트 미리보기</p>
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

      {generating && (
        <div className='flex items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground'>
          <span className='inline-block h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent' />
          학습자료 생성 중... (Step 3 진입 시 준비 완료)
        </div>
      )}

      <Button
        onClick={handleComplete}
        disabled={loading}
        className='w-full'
      >
        {loading ? '저장 중...' : '스크립트 확인 완료 → Step 3'}
      </Button>
    </div>
  )
}
