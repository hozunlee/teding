'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useAuthModal } from '@/lib/store/auth-modal'
import { useSpeech } from '@/lib/hooks/use-speech'
import { Volume1 } from 'lucide-react'
import type { Phrase, SentenceAnalysis } from '@/types/worksheet'

interface Props {
  videoId: string
  phrases: Phrase[]
  sentences: SentenceAnalysis[]
  isLoggedIn?: boolean
}

const CSS_CLASS_COLORS: Record<string, string> = {
  subj: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  verb: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  obj: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  mod: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
}

// 핵심 표현 카드 컴포넌트
function PhraseCard({ phrase }: { phrase: Phrase }) {
  const [showKorean, setShowKorean] = useState(false)
  const { speak, speakingText } = useSpeech()
  const parts = phrase.explanation.split(' / ')
  const englishExp = parts[0]
  const koreanExp = parts[1] || ''

  return (
    <Card className='group overflow-hidden border-border/50 shadow-sm transition-all hover:border-[var(--brand-orange)]/30'>
      <CardContent className='p-5'>
        <div className='mb-3 flex flex-col gap-2'>
          <div className='flex items-start gap-2'>
            <div className='min-w-0 flex-1 space-y-1'>
              <p className='text-lg font-bold tracking-tight text-[var(--brand-orange)]'>{phrase.pattern}</p>
              <div className='relative'>
                <p
                  onClick={() => setShowKorean(!showKorean)}
                  className={cn(
                    'text-sm font-medium text-muted-foreground transition-all cursor-pointer',
                    !showKorean && 'blur-[4px] select-none'
                  )}
                >
                  {phrase.korean}
                </p>
                {!showKorean && <span className='absolute inset-0 flex items-center text-[10px] uppercase font-bold text-orange-500/40 pointer-events-none'>Tap to reveal</span>}
              </div>
            </div>
            <button
              onClick={() => speak(phrase.pattern)}
              className={`shrink-0 rounded p-1 text-base leading-none transition-colors ${speakingText === phrase.pattern ? 'text-[var(--brand-orange)]' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="발음 듣기"
            >
              <Volume1 size={18} />
            </button>
          </div>
          {phrase.tags.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {phrase.tags.map(tag => (
                <Badge key={tag} variant='secondary' className='rounded-[4px] bg-black/5 text-[10px] uppercase font-mono'>
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className='space-y-3 rounded-lg bg-muted/30 p-4'>
          <div className='space-y-1'>
            <p className='text-[10px] font-bold uppercase text-muted-foreground'>Explanation</p>
            <p className='text-sm leading-relaxed'>{englishExp}</p>
          </div>

          {koreanExp && (
            <div className='pt-2 border-t border-border/50'>
              <button 
                onClick={() => setShowKorean(!showKorean)}
                className='text-[10px] font-bold uppercase text-[var(--brand-orange)] hover:underline mb-1'
              >
                {showKorean ? 'Hide Translation' : 'Show Translation'}
              </button>
              {showKorean && (
                <p className='text-sm text-foreground font-medium leading-relaxed animate-in fade-in slide-in-from-top-1'>
                  {koreanExp}
                </p>
              )}
            </div>
          )}
        </div>

        <div className='mt-4 space-y-2 px-1'>
          <p className='text-[10px] font-bold uppercase text-muted-foreground'>Example & Usage</p>
          <p className='text-sm italic leading-relaxed'>&ldquo;{phrase.example}&rdquo;</p>
          <p className='text-xs text-muted-foreground'>💬 {phrase.dailyUse}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// 구문 분석 카드 컴포넌트
function SentenceCard({
  sentence,
  index,
  isKnown,
  onToggleKnown,
  isActive,
  onToggleActive
}: {
  sentence: SentenceAnalysis,
  index: number,
  isKnown: boolean,
  onToggleKnown: (i: number) => void,
  isActive: boolean,
  onToggleActive: (i: number | null) => void
}) {
  const [showKorean, setShowKorean] = useState(false)
  const { speak, speakingText } = useSpeech()
  const parts = sentence.tip.split(' / ')
  const englishTip = parts[0]
  const koreanTip = parts[1] || ''

  return (
    <Card
      className={cn(
        'group overflow-hidden border-border/50 shadow-sm transition-all',
        isActive ? 'ring-2 ring-[var(--brand-orange)] border-transparent' : 'hover:border-border'
      )}
    >
      <CardContent className='p-5' onClick={() => onToggleActive(isActive ? null : index)}>
        <div className='mb-3 flex flex-wrap items-center justify-between gap-2'>
          <Badge variant='outline' className='rounded-[4px] border-border bg-muted/20 px-2 py-0.5 text-[10px] font-mono uppercase'>
            {sentence.structureLabel}
          </Badge>
          <div className='flex items-center gap-2'>
            <button
              onClick={(e) => { e.stopPropagation(); speak(sentence.text) }}
              className={`rounded p-1 text-base leading-none transition-colors ${speakingText === sentence.text ? 'text-[var(--brand-orange)]' : 'text-muted-foreground hover:text-foreground'}`}
              aria-label="발음 듣기"
            >
              <Volume1 size={18} />
            </button>
            <label
              className='flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
              onClick={e => e.stopPropagation()}
            >
              <input
                type='checkbox'
                checked={isKnown}
                onChange={() => onToggleKnown(index)}
                className='h-4 w-4 rounded-[4px] border-border accent-[var(--brand-orange)]'
              />
              I got it!
            </label>
          </div>
        </div>

        {sentence.koreanTranslation && (
          <p className='mb-3 text-xs text-muted-foreground'>{sentence.koreanTranslation}</p>
        )}

        <div className='flex flex-wrap gap-1.5 mb-4'>
          {sentence.parse.map((chunk, j) => (
            <div
              key={j}
              className={cn(
                'rounded px-2 py-1 text-sm font-medium transition-colors',
                CSS_CLASS_COLORS[chunk.cssClass] ?? 'bg-muted text-muted-foreground'
              )}
            >
              <p className='mb-0.5 text-[8px] font-mono uppercase opacity-60 leading-none'>{chunk.role}</p>
              <p className='leading-tight'>{chunk.chunk}</p>
            </div>
          ))}
        </div>

        {(isActive || showKorean) && (
          <div className='space-y-3 rounded-lg bg-muted/30 p-4 animate-in fade-in slide-in-from-top-2' onClick={e => e.stopPropagation()}>
            <div className='space-y-1'>
              <p className='text-[10px] font-bold uppercase text-muted-foreground'>Grammar Tip</p>
              <p className='text-sm leading-relaxed'>{englishTip}</p>
            </div>

            {koreanTip && (
              <div className='pt-2 border-t border-border/50'>
                <button 
                  onClick={() => setShowKorean(!showKorean)}
                  className='text-[10px] font-bold uppercase text-[var(--brand-orange)] hover:underline mb-1'
                >
                  {showKorean ? 'Hide Translation' : 'Show Translation'}
                </button>
                {showKorean && (
                  <p className='text-sm text-foreground font-medium leading-relaxed'>
                    {koreanTip}
                  </p>
                )}
              </div>
            )}

            {sentence.vocab.length > 0 && (
              <div className='flex flex-wrap gap-1.5 pt-1'>
                {sentence.vocab.map(v => (
                  <Badge key={v} variant='outline' className='rounded-[4px] bg-white text-[10px] px-1.5 border-border/50'>
                    {v}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function Step4Phrases({ videoId, phrases, sentences, isLoggedIn = true }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const openModal = useAuthModal((s) => s.open)
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
    if (!isLoggedIn) {
      openModal()
      return
    }
    setLoading(true)
    const knownSentences = [...known].map(i => sentences[i]?.text ?? '')
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, step: 4, knownSentences }),
    })
    await fetch('/api/streak', { method: 'POST' })
    const params = new URLSearchParams(searchParams.toString())
    params.set('step', '5')
    router.push(`/study?${params.toString()}`)
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* 탭 */}
      <div className='flex gap-1 rounded-lg bg-black/5 p-1'>
        {(['phrases', 'sentences'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 rounded-[6px] px-3 py-2 text-sm font-medium transition-all',
              tab === t
                ? 'bg-white text-[var(--dark-blue)] shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {t === 'phrases' ? '핵심 표현' : '구문 분석'}
          </button>
        ))}
      </div>

      {/* 핵심 표현 탭 */}
      {tab === 'phrases' && (
        <div className='flex flex-col gap-4'>
          <p className='text-mono-label px-1 text-muted-foreground'>AI가 엄선한 일상 활용 표현</p>
          <div className='flex flex-col gap-4'>
            {phrases.map((phrase, i) => (
              <PhraseCard key={i} phrase={phrase} />
            ))}
          </div>
        </div>
      )}

      {/* 구문 분석 탭 */}
      {tab === 'sentences' && (
        <div className='flex flex-col gap-4'>
          <p className='text-mono-label px-1 text-muted-foreground'>문장 구문 분석</p>
          <div className='flex flex-col gap-4'>
            {sentences.map((s, i) => (
              <SentenceCard 
                key={i} 
                sentence={s} 
                index={i}
                isKnown={known.has(i)}
                onToggleKnown={toggleKnown}
                isActive={activeSentence === i}
                onToggleActive={setActiveSentence}
              />
            ))}
          </div>
        </div>
      )}

      {tab === 'phrases' && (
        <Button
          onClick={() => { setTab('sentences'); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          variant='outline'
          className='h-12 w-full rounded-lg border-[var(--dark-blue)] text-base font-semibold transition-transform active:scale-[0.98]'
        >
          구문 분석 추가학습 →
        </Button>
      )}
      <Button
        onClick={handleComplete}
        disabled={loading}
        className='h-12 w-full rounded-lg bg-[var(--dark-blue)] text-base font-semibold shadow-[var(--shadow-elegant)] transition-transform active:scale-[0.98]'
      >
        {loading ? '저장 중...' : '학습 완료 🎉'}
      </Button>
    </div>
  )
}
