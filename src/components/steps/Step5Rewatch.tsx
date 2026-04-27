'use client'

// Step 4 (재배치): 재시청
// Step 1~3을 완료한 후 동일 영상을 다시 본다.
// 목표: 학습한 표현이 귀로도 들리는지 확인. 하단 스크립트 참고 가능.

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { apiFetch } from '@/lib/api-client'

interface TranscriptData {
  raw_text: string
}

interface Props {
  videoId: string
  videoTitle: string
  transcript: TranscriptData | null
}

export function Step5Rewatch({ videoId, videoTitle, transcript }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checked, setChecked] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleComplete() {
    setLoading(true)
    try {
      await Promise.all([
        apiFetch('/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ videoId, step: 4 }),
        }),
        apiFetch('/api/streak', { method: 'POST' })
      ])
      const params = new URLSearchParams(searchParams.toString())
      params.set('videoId', videoId)
      params.set('title', videoTitle)
      params.delete('step')
      router.push(`/study/complete?${params.toString()}`)
    } catch (error) {
      console.error('Failed to complete step 4:', error)
    } finally {
      setLoading(false)
    }
  }

  const embedUrl =
    `https://www.youtube.com/embed/${videoId}` +
    `?cc_load_policy=0&rel=0&modestbranding=1`

  const paragraphs = transcript?.raw_text
    .match(/[^.!?]+[.!?]\s*/g)
    ?.reduce((acc: string[][], sentence, i) => {
      const pIdx = Math.floor(i / 4)
      if (!acc[pIdx]) acc[pIdx] = []
      acc[pIdx].push(sentence)
      return acc
    }, [])
    .map(p => p.join('')) ?? (transcript ? [transcript.raw_text] : [])

  return (
    <div className='flex flex-col gap-5'>
      {/* 재시청 안내 */}
      <div className='rounded-lg bg-muted/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground'>
        이제 처음과 달리 <strong className='text-foreground'>귀로 들리는 영어</strong>가 늘었을 것이다.
        자막 없이 다시 시청하며, 1~3단계에서 익힌 표현이 실제 발화에서 어떻게 들리는지 느껴보자.
      </div>

      <div className='overflow-hidden rounded-lg bg-black'>
        <div className='relative w-full' style={{ paddingBottom: '56.25%' }}>
          <iframe
            src={embedUrl}
            className='absolute inset-0 h-full w-full'
            allowFullScreen
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          />
        </div>
      </div>

      <div className='rounded-lg border p-4'>
        <p className='mb-3 text-sm font-medium'>시청 체크리스트</p>
        <label className='flex cursor-pointer items-center gap-3 text-sm'>
          <input
            type='checkbox'
            checked={checked}
            onChange={e => setChecked(e.target.checked)}
            className='h-4 w-4 rounded accent-[var(--brand-orange)]'
          />
          <span>Step 1보다 더 많이 들렸습니다.</span>
        </label>
      </div>

      {/* 스크립트 참고 섹션 */}
      {transcript && paragraphs.length > 0 && (
        <div className='rounded-lg border bg-muted/30 p-4'>
          <p className='mb-2 text-xs font-semibold text-muted-foreground'>스크립트 참고</p>
          <div className='space-y-4 text-sm leading-relaxed'>
            {expanded
              ? paragraphs.map((p, i) => <p key={i}>{p}</p>)
              : <p>{transcript.raw_text.slice(0, 500)}{transcript.raw_text.length > 500 ? '…' : ''}</p>}
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
      )}

      <Button
        onClick={handleComplete}
        disabled={!checked || loading}
        className='w-full'
      >
        {loading ? '저장 중...' : '완료 →'}
      </Button>
    </div>
  )
}
