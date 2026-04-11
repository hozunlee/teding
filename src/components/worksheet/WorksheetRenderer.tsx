'use client'

import { useState, useMemo, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { Worksheet, Phrase, SentenceAnalysis } from '@/types/worksheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { Button } from "@/components/ui/button"

interface Props {
  worksheet: Worksheet
  phrases: Phrase[]
  sentences: SentenceAnalysis[]
}

const CSS_CLASS_COLORS: Record<string, string> = {
  subj: 'bg-blue-100 text-blue-800',
  verb: 'bg-red-100 text-red-800',
  obj: 'bg-green-100 text-green-800',
  mod: 'bg-orange-100 text-orange-800',
}

export function WorksheetRenderer({ worksheet, phrases, sentences }: Props) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [revealedVocab, setRevealedVocab] = useState<Set<number>>(new Set())
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const toggleVocab = (idx: number) => {
    setRevealedVocab(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  // 매칭할 패턴 리스트 준비 (길이 역순 정렬하여 긴 문장 우선 매칭)
  const patterns = useMemo(() => {
    const items = [
      ...phrases.map(p => ({ type: 'phrase', text: p.pattern, data: p })),
      ...sentences.map(s => ({ type: 'sentence', text: s.text, data: s }))
    ].sort((a, b) => b.text.length - a.text.length)
    return items
  }, [phrases, sentences])

  // 하이라이트 렌더링 함수
  const renderHighlightedText = (text: string) => {
    if (patterns.length === 0) return <span>{text}</span>

    // 정규식 생성 (특수문자 이스케이프 처리 필요)
    const regexSource = patterns
      .map(p => p.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')
    const regex = new RegExp(`(${regexSource})`, 'gi')

    const parts = text.split(regex)

    return (
      <>
        {parts.map((part, i) => {
          const match = patterns.find(p => p.text.toLowerCase() === part.toLowerCase())
          if (match) {
            return (
              <StudyContextTrigger 
                key={i} 
                item={match.data} 
                type={match.type as 'phrase' | 'sentence'}
                isDesktop={isDesktop}
              >
                <span className='cursor-pointer border-b-2 border-[var(--ws-gold)]/40 bg-[var(--ws-gold)]/10 px-0.5 font-medium transition-colors hover:bg-[var(--ws-gold)]/20 print:border-none print:bg-transparent print:p-0 print:font-normal'>
                  {part}
                </span>
              </StudyContextTrigger>
            )
          }
          return <span key={i}>{part}</span>
        })}
      </>
    )
  }

  return (
    <div
      id='worksheet-container'
      className='ws-wrapper mx-auto max-w-[860px] bg-[var(--ws-parchment)] p-6 md:p-10 font-serif text-[var(--ws-ink)] shadow-[var(--shadow-elegant)] print:bg-white print:p-0 print:shadow-none'
    >
      {/* HEADER */}
      <div className='relative mb-10 border-b-[3px] border-double border-[var(--ws-gold)] pb-8 pt-12 text-center'>
        <span className='absolute left-0 top-[50px] text-2xl text-[var(--ws-gold)] print:hidden'>☯</span>
        <span className='absolute right-0 top-[50px] text-2xl text-[var(--ws-gold)] print:hidden'>☯</span>
        <div className='font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[var(--ws-faded)]'>
          English Reading Worksheet · Grade 6
        </div>
        <h1 className='mt-3 text-[2.6rem] font-bold leading-tight text-[var(--ws-deep)]'>
          TED-fi <span className='text-[var(--ws-gold)]'>Lounge</span>
        </h1>
        <div className='mt-1 text-base italic text-[var(--ws-faded)]'>
          Deep Learning Journey through TED-Ed
        </div>
      </div>

      {/* INFO BAR */}
      <div className='mb-10 flex border-[1.5px] border-[var(--ws-gold)] bg-[#f5edd8] print:bg-transparent'>
        {['Name', 'Date', 'Class', 'Score'].map((label) => (
          <div key={label} className='flex-1 border-r border-[var(--ws-gold)]/30 p-2.5 last:border-r-0'>
            <label className='block font-mono text-[0.65rem] uppercase tracking-widest text-[var(--ws-faded)]'>
              {label}
            </label>
            <div className='min-h-[22px] border-b border-[var(--ws-ink)]' />
          </div>
        ))}
      </div>

      {/* PART 1: READING PASSAGE */}
      <section className='mb-11'>
        <div className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--ws-red)]'>Part 1</div>
        <h2 className='mb-5 border-b-[1.5px] border-[var(--ws-gold)]/30 pb-2 text-[1.45rem] font-bold text-[var(--ws-deep)]'>
          📖 Reading Passage
        </h2>
        <p className='mb-4 text-[0.92rem] italic text-[var(--ws-faded)]'>
          Tap the highlighted text to see explanations.
        </p>

        <div className='border-l-4 border-[var(--ws-gold)] bg-[#f5edd8] px-6 md:px-8 py-7 text-[1.05rem] md:text-[1.08rem] leading-[1.85] print:bg-transparent'>
          {worksheet.readingPassage.paragraphs.map((para, i) => (
            <div key={i} className='mb-3 last:mb-0'>
              {para.heading && (
                <p className='mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--ws-gold)]'>
                  {para.heading}
                </p>
              )}
              <p>{renderHighlightedText(para.body)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PART 2: VOCABULARY */}
      <section className='mb-11'>
        <div className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--ws-red)]'>Part 2</div>
        <h2 className='mb-5 border-b-[1.5px] border-[var(--ws-gold)]/30 pb-2 text-[1.45rem] font-bold text-[var(--ws-deep)]'>
          📚 Key Vocabulary
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {worksheet.vocabulary.map((item, i) => (
            <div 
              key={i} 
              onClick={() => toggleVocab(i)}
              className='group relative cursor-pointer border border-[var(--ws-gold)]/30 bg-[#f5edd8] p-3.5 transition-colors hover:border-[var(--ws-gold)] print:bg-transparent'
            >
              <div className='flex items-baseline justify-between'>
                <div className='text-[1.05rem] font-bold text-[var(--ws-red)]'>{item.word}</div>
                <span className='font-mono text-[0.65rem] text-[var(--ws-faded)] uppercase'>{item.pos}</span>
              </div>
              <div className='mt-1 text-[0.92rem] leading-normal text-[var(--ws-ink)]'>
                {item.definition}
              </div>
              <div className='mt-1.5 flex items-center gap-2'>
                <span className='text-[10px] font-bold uppercase text-[var(--ws-gold)] print:hidden'>Meaning:</span>
                <span 
                  className={cn(
                    'text-[0.9rem] font-medium text-[var(--ws-red)] transition-all print:blur-0',
                    !revealedVocab.has(i) && 'blur-[4px] group-hover:blur-0'
                  )}
                >
                  {item.koreanMeaning}
                </span>
              </div>
              <em className='mt-2 block text-[0.85rem] italic leading-tight text-[var(--ws-faded)]'>{item.example}</em>
            </div>
          ))}
        </div>
      </section>


      {/* PART 3: COMPREHENSION */}
      <section className='mb-11'>
        <div className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--ws-red)]'>Part 3</div>
        <h2 className='mb-5 border-b-[1.5px] border-[var(--ws-gold)]/30 pb-2 text-[1.45rem] font-bold text-[var(--ws-deep)]'>
          🧠 Comprehension Questions
        </h2>
        
        {/* MCQ */}
        <div className='space-y-7'>
          {worksheet.multipleChoice.map((q, i) => (
            <div key={i} className='break-inside-avoid'>
              <div className='font-mono text-[0.75rem] text-[var(--ws-gold)]'>Question 0{i+1} — Multiple Choice</div>
              <p className='mb-3 text-[1.05rem] font-semibold leading-normal text-[var(--ws-deep)]'>{q.question}</p>
              <div className='flex flex-col gap-2'>
                {q.choices.map((choice, j) => (
                  <div key={j} className='flex cursor-pointer items-start gap-2.5 border border-[var(--ws-gold)]/30 bg-[#f5edd8] px-3.5 py-2 text-[0.97rem] transition-colors hover:bg-[#f0e4c8] print:bg-transparent'>
                    <span className='mt-0.5 font-mono text-[0.85rem] font-bold text-[var(--ws-gold)]'>
                      {String.fromCharCode(65 + j)})
                    </span>
                    <span>{choice}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Short Answer */}
          {worksheet.shortAnswer.map((q, i) => (
            <div key={i} className='break-inside-avoid'>
              <div className='font-mono text-[0.75rem] text-[var(--ws-gold)]'>Question 0{worksheet.multipleChoice.length + i + 1} — Short Answer</div>
              <p className='mb-3 text-[1.05rem] font-semibold leading-normal text-[var(--ws-deep)]'>{q.question}</p>
              <div className='space-y-2.5'>
                <div className='min-h-[28px] border-b border-[var(--ws-ink)]' />
                <div className='min-h-[28px] border-b border-[var(--ws-ink)]' />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PART 4: ESSAY */}
      <section className='break-before-page'>
        <div className='font-mono text-[0.7rem] uppercase tracking-[0.2em] text-[var(--ws-red)]'>Part 4</div>
        <h2 className='mb-5 border-b-[1.5px] border-[var(--ws-gold)]/30 pb-2 text-[1.45rem] font-bold text-[var(--ws-deep)]'>
          ✍️ Short Essay
        </h2>
        <div className='border-[1.5px] border-[var(--ws-gold)] bg-[#f5edd8] p-5 text-[1.05rem] leading-relaxed print:bg-transparent'>
          <strong>Prompt:</strong> {worksheet.essayPrompt}
        </div>
        <div className='mt-5 space-y-3.5'>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className='min-h-[28px] border-b border-[#c0b090]' />
          ))}
        </div>
      </section>

      {/* ANSWER KEY — 화면: 토글, 인쇄: 마지막 페이지 */}
      <div className='break-before-page'>
        {/* 화면 전용 토글 버튼 */}
        <button
          onClick={() => setShowAnswer(v => !v)}
          className='mb-4 w-full rounded border border-[var(--ws-gold)]/40 bg-[#f5edd8] py-2 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-[var(--ws-faded)] transition-colors hover:bg-[#f0e4c8] print:hidden'
        >
          {showAnswer ? '🔒 정답 숨기기' : '🔑 정답 및 해설 확인하기'}
        </button>

        <div className={showAnswer ? 'block' : 'hidden print:block'}>
          <div className='border-t-[3px] border-double border-[var(--ws-gold)] pt-8'>
            <h3 className='mb-6 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-[var(--ws-faded)]'>
              🔑 Answer Key & Explanations
            </h3>

            {/* 객관식 정답 및 해설 */}
            <div className='mb-8 space-y-4'>
              <p className='mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--ws-faded)]'>Multiple Choice</p>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                {worksheet.multipleChoice.map((q, i) => (
                  <div key={i} className='border border-[var(--ws-gold)]/30 bg-[#f5edd8] p-4 text-[0.88rem] print:bg-transparent'>
                    <p className='font-bold text-[var(--ws-red)]'>Q{i+1} → {q.answer}</p>
                    <p className='mt-1 italic leading-relaxed text-[var(--ws-ink)]/80'>{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 단답형 해설 */}
            <div className='mb-8 space-y-4'>
              <p className='mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--ws-faded)]'>Short Answer</p>
              <div className='space-y-4 text-[0.88rem] leading-relaxed'>
                {worksheet.shortAnswer.map((q, i) => (
                  <div key={i} className='border-l-2 border-[var(--ws-gold)]/40 bg-[#f5edd8]/30 p-4 print:bg-transparent'>
                    <p className='font-bold text-[var(--ws-deep)]'>Q{worksheet.multipleChoice.length + i + 1} Model Answer:</p>
                    <p className='mt-1 font-medium'>{q.modelAnswer}</p>
                    <p className='mt-2 italic text-[var(--ws-faded)]'>{q.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 모범 에세이 */}
            <div className='border-t border-[var(--ws-gold)]/20 pt-6'>
              <h4 className='mb-3 font-mono text-[0.7rem] uppercase text-[var(--ws-faded)]'>📝 Model Essay Example</h4>
              <div className='whitespace-pre-wrap rounded bg-[#f5edd8] p-5 text-[0.95rem] leading-relaxed italic text-[var(--ws-ink)]/90 print:bg-transparent print:p-0'>
                {worksheet.modelEssay}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 상세 학습 정보 렌더링 컴포넌트
function StudyContextContent({ item, type }: { item: Phrase | SentenceAnalysis, type: 'phrase' | 'sentence' }) {
  const [showKorean, setShowKorean] = useState(false)
  
  // "[English] / [Korean]" 형식을 분리
  const splitText = (text: string) => {
    const parts = text.split(' / ')
    return {
      english: parts[0],
      korean: parts[1] || ''
    }
  }

  const tip = splitText(type === 'phrase' ? (item as Phrase).explanation : (item as SentenceAnalysis).tip)

  return (
    <div className='flex flex-col gap-4 p-4 md:p-0'>
      <div className='space-y-1'>
        <p className='text-mono-label text-[var(--ws-gold)]'>{type === 'phrase' ? 'Key Phrase' : 'Grammar Point'}</p>
        <h3 className='text-xl font-bold text-[var(--ws-deep)]'>
          {type === 'phrase' ? (item as Phrase).pattern : (item as SentenceAnalysis).structureLabel}
        </h3>
      </div>

      <div className='rounded-lg bg-[var(--ws-gold)]/5 p-4 space-y-3 border border-[var(--ws-gold)]/10'>
        <div className='space-y-1'>
          <p className='text-[10px] font-bold uppercase text-[var(--ws-faded)]'>Explanation</p>
          <p className='text-[1rem] leading-relaxed'>{tip.english}</p>
        </div>

        {tip.korean && (
          <div className='pt-2 border-t border-[var(--ws-gold)]/10'>
            <button 
              onClick={() => setShowKorean(!showKorean)}
              className='text-[10px] font-bold uppercase text-[var(--brand-orange)] hover:underline mb-1'
            >
              {showKorean ? 'Hide Translation' : 'Show Translation (한글 해석)'}
            </button>
            {showKorean && (
              <p className='text-[0.95rem] text-[var(--ws-red)] font-medium leading-relaxed animate-in fade-in slide-in-from-top-1'>
                {tip.korean}
              </p>
            )}
          </div>
        )}
      </div>

      {type === 'phrase' && (
        <div className='space-y-2'>
          <p className='text-[10px] font-bold uppercase text-[var(--ws-faded)]'>Example & Usage</p>
          <p className='text-[0.95rem] italic leading-relaxed text-[var(--ws-ink)]/80'>
            &ldquo;{(item as Phrase).example}&rdquo;
          </p>
          <p className='text-[0.9rem] text-[var(--ws-faded)]'>💬 {(item as Phrase).dailyUse}</p>
        </div>
      )}

      {type === 'sentence' && (
        <div className='flex flex-wrap gap-1.5'>
          {(item as SentenceAnalysis).parse.map((chunk, i) => (
            <div key={i} className={`rounded px-2 py-1 shadow-sm ${CSS_CLASS_COLORS[chunk.cssClass] || 'bg-muted'}`}>
              <p className='text-[9px] font-mono uppercase opacity-70'>{chunk.role}</p>
              <p className='text-sm font-medium'>{chunk.chunk}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StudyContextTrigger({ 
  children, 
  item, 
  type, 
  isDesktop 
}: { 
  children: ReactNode, 
  item: Phrase | SentenceAnalysis, 
  type: 'phrase' | 'sentence',
  isDesktop: boolean 
}) {
  const [open, setOpen] = useState(false)

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className='appearance-none border-none bg-transparent p-0 text-left outline-none'>
          {children}
        </PopoverTrigger>
        <PopoverContent className='w-[380px] bg-[var(--ws-parchment)] border-[var(--ws-gold)]/30 shadow-xl p-5'>
          <StudyContextContent item={item} type={type} />
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger className='appearance-none border-none bg-transparent p-0 text-left outline-none'>
        {children}
      </DrawerTrigger>
      <DrawerContent className='bg-[var(--ws-parchment)] border-t-[var(--ws-gold)]/30 max-h-[85vh]'>
        <div className='mx-auto w-full max-w-lg overflow-y-auto px-4 pb-8 pt-2'>
          <DrawerHeader className='px-0'>
            <DrawerTitle className='sr-only'>Details</DrawerTitle>
          </DrawerHeader>
          <StudyContextContent item={item} type={type} />
          <DrawerFooter className='px-0 mt-4'>
            <DrawerClose asChild>
              <Button variant='outline' className='w-full border-[var(--ws-gold)]/30 text-[var(--ws-faded)]'>Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
