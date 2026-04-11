'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Phrase, SentenceAnalysis } from '@/types/worksheet'

interface Props {
  videoId: string
  phrases: Phrase[]
  sentences: SentenceAnalysis[]
}

const CSS_CLASS_COLORS: Record<string, string> = {
  subj: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  verb: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  obj: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  mod: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
}

export function Step4Phrases({ videoId, phrases, sentences }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'phrases' | 'sentences'>('phrases')
  const [known, setKnown] = useState<Set<number>>(new Set())
  const [activeSentence, setActiveSentence] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  function toggleKnown(i: number) {
    setKnown(prev => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  async function handleComplete() {
    setLoading(true)
    const knownSentences = [...known].map(i => sentences[i]?.text ?? '')
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, step: 4, knownSentences }),
    })
    await fetch('/api/streak', { method: 'POST' })
    router.push(`/study/complete?videoId=${videoId}`)
  }

  return (
    <div className='flex flex-col gap-4'>
      {/* 탭 */}
      <div className='flex gap-1 rounded-lg bg-muted p-1'>
        {(['phrases', 'sentences'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {t === 'phrases' ? '핵심 표현' : '구문 분석'}
          </button>
        ))}
      </div>

      {/* 핵심 표현 탭 */}
      {tab === 'phrases' && (
        <div className='flex flex-col gap-3'>
          {phrases.map((phrase, i) => (
            <Card key={i}>
              <CardContent className='pt-4'>
                <div className='mb-2 flex items-start justify-between gap-2'>
                  <div>
                    <p className='font-semibold text-[var(--brand-orange)]'>{phrase.pattern}</p>
                    <p className='text-sm text-muted-foreground'>{phrase.korean}</p>
                  </div>
                  <div className='flex gap-1 flex-wrap justify-end'>
                    {phrase.tags.map(tag => (
                      <Badge key={tag} variant='secondary' className='shrink-0'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className='mb-1 text-sm'>{phrase.explanation}</p>
                <p className='mb-1 text-sm italic text-muted-foreground'>&ldquo;{phrase.example}&rdquo;</p>
                <p className='text-xs text-muted-foreground'>💬 {phrase.dailyUse}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 구문 분석 탭 */}
      {tab === 'sentences' && (
        <div className='flex flex-col gap-3'>
          {sentences.map((s, i) => (
            <Card
              key={i}
              className={`cursor-pointer transition-colors ${
                activeSentence === i ? 'ring-2 ring-[var(--brand-orange)]' : ''
              }`}
              onClick={() => setActiveSentence(activeSentence === i ? null : i)}
            >
              <CardContent className='pt-4'>
                <div className='mb-2 flex items-start justify-between gap-2'>
                  <Badge variant='outline' className='shrink-0 text-xs'>
                    {s.structureLabel}
                  </Badge>
                  <label
                    className='flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground'
                    onClick={e => e.stopPropagation()}
                  >
                    <input
                      type='checkbox'
                      checked={known.has(i)}
                      onChange={() => toggleKnown(i)}
                      className='h-3 w-3 accent-[var(--brand-orange)]'
                    />
                    알았어요
                  </label>
                </div>

                <div className='flex flex-wrap gap-1.5 mb-2'>
                  {s.parse.map((chunk, j) => (
                    <span
                      key={j}
                      className={`rounded px-1.5 py-0.5 text-sm ${CSS_CLASS_COLORS[chunk.cssClass] ?? ''}`}
                      title={chunk.role}
                    >
                      {chunk.chunk}
                    </span>
                  ))}
                </div>

                {activeSentence === i && (
                  <div className='mt-2 space-y-1 border-t pt-2'>
                    <p className='text-xs text-muted-foreground'>{s.tip}</p>
                    {s.vocab.length > 0 && (
                      <div className='flex flex-wrap gap-1'>
                        {s.vocab.map(v => (
                          <Badge key={v} variant='ghost' className='text-xs'>
                            {v}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button onClick={handleComplete} disabled={loading} className='w-full'>
        {loading ? '저장 중...' : '학습 완료 🎉'}
      </Button>
    </div>
  )
}
