'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function MaterialsLoading() {
  const router = useRouter()

  useEffect(() => {
    const interval = setInterval(() => {
      // 3초마다 새로고침하여 학습자료가 생성되었는지 확인 (SSR이므로 router.refresh() 사용)
      router.refresh()
    }, 3000)

    return () => clearInterval(interval)
  }, [router])

  return (
    <div className='flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-muted/20 p-12 text-center'>
      <div className='relative h-12 w-12'>
        <div className='absolute inset-0 animate-ping rounded-full bg-[var(--brand-magenta)]/20' />
        <div className='relative flex h-full w-full items-center justify-center rounded-full bg-background border-2 border-[var(--brand-magenta)]'>
          <span className='h-5 w-5 animate-spin rounded-full border-2 border-[var(--brand-magenta)] border-t-transparent' />
        </div>
      </div>
      <div className='space-y-1'>
        <p className='text-mono-label text-[var(--brand-magenta)]'>Generating Materials</p>
        <p className='text-sm text-muted-foreground'>AI가 맞춤형 학습지를 제작하고 있습니다.<br/>잠시만 기다려주세요 (약 10~20초 소요)</p>
      </div>
      <button 
        onClick={() => router.refresh()}
        className='mt-4 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4'
      >
        수동 새로고침
      </button>
    </div>
  )
}
