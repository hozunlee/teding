'use client'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface DailyVideo {
  video_id: string
  title: string
  duration: string
  date: string
}

interface CacheStatus {
  transcript: boolean
  materials: boolean
}

interface Props {
  video: DailyVideo
  cached: CacheStatus
  startStep: number
}

export function DailyVideoBanner({ video, cached, startStep }: Props) {
  const thumbnailUrl = `https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`
  const isReady = cached.transcript && cached.materials

  return (
    <div className='group relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-elegant)] transition-all hover:shadow-lg md:p-6'>
      <div className='flex flex-col gap-5 md:flex-row md:items-center'>
        {/* Thumbnail Area */}
        <div className='relative shrink-0 overflow-hidden rounded-[4px] shadow-sm md:w-[240px]'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailUrl}
            alt={video.title}
            className='aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
          <div className='absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[10px] text-white'>
            {video.duration}
          </div>
        </div>

        {/* Content Area */}
        <div className='flex min-w-0 flex-1 flex-col justify-between self-stretch py-1'>
          <div>
            <div className='mb-2 flex items-center justify-between'>
              <p className='text-mono-label text-muted-foreground'>오늘의 영상</p>
              <div
                className={cn(
                  'text-mono-micro rounded-[4px] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider',
                  isReady ? 'bg-black/5 text-black border border-black/10' : 'bg-orange-50 text-orange-600 border border-orange-200'
                )}
              >
                {isReady ? '즉시 로드 ✓' : '준비 중...'}
              </div>
            </div>
            <h2 className='line-clamp-2 text-[1.38rem] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--dark-blue)]'>
              {video.title}
            </h2>
            <p className='mt-2 text-xs text-muted-foreground'>TED-Ed · English Study</p>
          </div>

          <div className='mt-6 flex items-center justify-end'>
            <Link
              href={`/study?step=${startStep}`}
              className={cn(
                buttonVariants({ variant: 'default', size: 'sm' }),
                'h-9 rounded-[4px] bg-[var(--dark-blue)] px-6 text-sm font-medium tracking-tight transition-transform active:scale-95'
              )}
            >
              {startStep > 1 ? `Step ${startStep}부터 계속하기 →` : '학습 시작 →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
