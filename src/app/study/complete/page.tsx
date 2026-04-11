'use client'

import { useEffect, useState } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface StreakData {
  current_streak: number
  longest_streak: number
}

export default function CompletePage() {
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    fetch('/api/streak')
      .then(r => r.json())
      .then((d: { streak: StreakData | null }) => setStreak(d.streak))
  }, [])

  async function handleShare() {
    const streakDays = streak?.current_streak ?? 0
    const shareText = `오늘 TED-Ed로 영어 공부 완료! 🦥\n${streakDays}일 연속 학습 중\n\n${process.env.NEXT_PUBLIC_APP_URL ?? 'https://ted-fi-web.vercel.app'}`

    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({ title: 'TED-fi', text: shareText })
    } else {
      await navigator.clipboard.writeText(shareText)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  return (
    <div className='container mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 py-8 text-center'>
      <div className='mb-6 text-6xl'>🎉</div>

      <h1 className='mb-2 text-2xl font-bold'>오늘 학습 완료!</h1>
      <p className='mb-8 text-muted-foreground text-sm'>
        TED-Ed 영상 한 편을 4단계로 완주했습니다.
      </p>

      {streak && (
        <div className='mb-8 flex gap-6 rounded-xl border p-6'>
          <div className='text-center'>
            <p className='text-mono-label text-muted-foreground'>연속 학습</p>
            <p className='text-3xl font-bold text-[var(--brand-orange)]'>
              {streak.current_streak}
              <span className='text-base font-normal'>일</span>
            </p>
          </div>
          <div className='border-l' />
          <div className='text-center'>
            <p className='text-mono-label text-muted-foreground'>최고 기록</p>
            <p className='text-3xl font-bold'>{streak.longest_streak}<span className='text-base font-normal'>일</span></p>
          </div>
        </div>
      )}

      <div className='flex w-full flex-col gap-3'>
        <Button onClick={handleShare} variant='outline' className='w-full'>
          {shared ? '✓ 클립보드에 복사됨' : '공유하기'}
        </Button>
        <Link href='/home' className={cn(buttonVariants(), 'w-full justify-center')}>
          홈으로
        </Link>
      </div>
    </div>
  )
}
