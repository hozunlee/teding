'use client'

import { useState } from 'react'
import type { Worksheet } from '@/types/worksheet'

interface Props {
  worksheet: Worksheet
}

export function WorksheetRenderer({ worksheet }: Props) {
  const [showAnswer, setShowAnswer] = useState(false)
  return (
    <div
      id='worksheet-container'
      className='ws-wrapper mx-auto max-w-[860px] bg-[var(--ws-parchment)] p-10 font-serif text-[var(--ws-ink)] shadow-[var(--shadow-elegant)] print:bg-white print:p-0 print:shadow-none'
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
          Read the passage carefully before answering the questions below.
        </p>

        <div className='border-l-4 border-[var(--ws-gold)] bg-[#f5edd8] px-8 py-7 text-[1.08rem] leading-[1.85] print:bg-transparent'>
          {worksheet.readingPassage.paragraphs.map((para, i) => (
            <div key={i} className='mb-3 last:mb-0'>
              {para.heading && (
                <p className='mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--ws-gold)]'>
                  {para.heading}
                </p>
              )}
              <p>{para.body}</p>
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
        <div className='grid grid-cols-2 gap-3'>
          {worksheet.vocabulary.map((item, i) => (
            <div key={i} className='border border-[var(--ws-gold)]/30 bg-[#f5edd8] p-3.5 print:bg-transparent'>
              <div className='text-[1.05rem] font-bold text-[var(--ws-red)]'>{item.word}</div>
              <span className='font-mono text-[0.65rem] text-[var(--ws-faded)] uppercase'>{item.pos}</span>
              <div className='mt-1 text-[0.92rem] leading-normal text-[var(--ws-ink)]'>
                {item.definition} <em className='text-[var(--ws-faded)]'>{item.example}</em>
              </div>
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
          {showAnswer ? '🔒 정답 숨기기' : '🔑 정답 확인하기'}
        </button>

        <div className={showAnswer ? 'block' : 'hidden print:block'}>
          <div className='border-t-[3px] border-double border-[var(--ws-gold)] pt-8'>
            <h3 className='mb-4 font-mono text-[0.75rem] uppercase tracking-[0.2em] text-[var(--ws-faded)]'>
              🔑 Answer Key
            </h3>

            {/* 객관식 정답 */}
            <div className='mb-5'>
              <p className='mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--ws-faded)]'>Multiple Choice</p>
              <div className='flex flex-wrap gap-2.5'>
                {worksheet.multipleChoice.map((q, i) => (
                  <div key={i} className='border border-[var(--ws-gold)]/30 bg-[#f5edd8] px-3.5 py-1.5 font-mono text-[0.8rem] text-[var(--ws-red)] print:bg-transparent'>
                    Q{i+1} → {q.answer}
                  </div>
                ))}
              </div>
            </div>

            {/* 단답형 모범 답안 */}
            <div>
              <p className='mb-2 font-mono text-[0.65rem] uppercase tracking-widest text-[var(--ws-faded)]'>Short Answer — Model Answers</p>
              <div className='space-y-3 text-[0.88rem] leading-relaxed'>
                {worksheet.shortAnswer.map((q, i) => (
                  <div key={i} className='border-l-2 border-[var(--ws-gold)]/40 pl-3'>
                    <p className='font-semibold text-[var(--ws-deep)]'>Q{worksheet.multipleChoice.length + i + 1}. {q.question}</p>
                    <p className='italic text-[var(--ws-faded)]'>{q.modelAnswer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
