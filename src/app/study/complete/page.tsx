'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface StreakData {
  current_streak: number
  longest_streak: number
}

interface StatsData {
  sentences: number
  phrases: number
  vocabulary: number
}

function CompleteContent() {
  const searchParams = useSearchParams()
  const videoId = searchParams.get('videoId')
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    // 스트릭 정보 가져오기
    fetch('/api/streak')
      .then(r => r.json())
      .then((d: { streak: StreakData | null }) => setStreak(d.streak))

    // 영상 통계 정보 가져오기
    if (videoId) {
      fetch(`/api/materials/${videoId}`)
        .then(r => r.json())
        .then(d => {
          if (d.materials) {
            setStats({
              sentences: d.materials.sentences_json?.length || 0,
              phrases: d.materials.phrases_json?.length || 0,
              vocabulary: d.materials.worksheet_json?.vocabulary?.length || 0,
            })
          }
        })
    }
  }, [videoId])

  async function handleShare() {
    const streakDays = streak?.current_streak ?? 0
    const shareText = `오늘 TED-fi로 영어 공부 완주! 🦥\n${streakDays}일 연속 학습 중\n\n${process.env.NEXT_PUBLIC_APP_URL ?? 'https://ted-fi-web.vercel.app'}`

    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: 'TED-fi', text: shareText })
    } else {
      await navigator.clipboard.writeText(shareText)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  return (
    <div className='container mx-auto flex min-h-[85vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center'>
      {/* Success Icon */}
      <div className='relative mb-8'>
        <div className='absolute inset-0 animate-ping rounded-full bg-green-500/20' />
        <div className='relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30'>
          <svg width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='3.5' strokeLinecap='round' strokeLinejoin='round'>
            <polyline points='20 6 9 17 4 12' />
          </svg>
        </div>
      </div>

      <h1 className='text-[2.5rem] font-medium leading-tight tracking-[-0.03em] text-[var(--dark-blue)]'>
        Great Job!
      </h1>
      <p className='mt-2 text-lg font-medium text-muted-foreground'>오늘의 학습을 무사히 마쳤습니다.</p>

      {/* Stats Row */}
      <div className='my-10 grid w-full grid-cols-3 gap-4'>
        {[
          { label: 'Sentences', value: stats?.sentences || '-', color: 'text-blue-600' },
          { label: 'Phrases', value: stats?.phrases || '-', color: 'text-orange-600' },
          { label: 'Words', value: stats?.vocabulary || '-', color: 'text-magenta-600' },
        ].map((stat) => (
          <div key={stat.label} className='flex flex-col items-center rounded-xl border border-border bg-card p-4 shadow-sm'>
            <p className='text-[1.5rem] font-bold tracking-tight'>{stat.value}</p>
            <p className='text-mono-micro mt-1 text-muted-foreground uppercase'>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Streak Info Card */}
      {streak && (
        <div className='mb-10 flex w-full flex-col items-center justify-center rounded-2xl border border-border bg-[var(--dark-blue)] p-8 text-white shadow-xl'>
          <div className='flex items-baseline gap-2'>
            <span className='text-[3.5rem] font-medium tracking-tighter text-[var(--brand-orange)]'>{streak.current_streak}</span>
            <span className='text-xl font-medium opacity-80'>일 연속 학습 중</span>
          </div>
          <p className='mt-2 text-sm font-medium opacity-60'>최고 기록 {streak.longest_streak}일</p>
          <div className='mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10'>
            <div className='h-full bg-[var(--brand-orange)] shadow-[0_0_15px_rgba(252,76,2,0.5)]' style={{ width: '100%' }} />
          </div>
        </div>
      )}

      {/* Share & Actions */}
      <div className='flex w-full flex-col gap-4'>
        <button
          onClick={handleShare}
          className='flex h-14 items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-6 text-sm font-bold text-[#3C1E1E] shadow-sm transition-transform active:scale-95'
        >
          <svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M12 3c-4.97 0-9 3.185-9 7 0 3.16 2.761 5.813 6.53 6.71l-1.31 4.81c-.13.48.43.85.83.56l5.68-3.83c.41.02.83.03 1.27.03 4.97 0 9-3.185 9-7s-4.03-7-9-7z' />
          </svg>
          {shared ? '링크가 복사되었습니다!' : '카카오톡으로 자랑하기'}
        </button>
        <Link 
          href='/home' 
          className={cn(buttonVariants({ variant: 'outline' }), 'h-14 rounded-xl border-border bg-white text-base font-semibold shadow-sm')}
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

export default function CompletePage() {
  return (
    <Suspense fallback={<div className='flex min-h-screen items-center justify-center'>Loading...</div>}>
      <CompleteContent />
    </Suspense>
  )
}
