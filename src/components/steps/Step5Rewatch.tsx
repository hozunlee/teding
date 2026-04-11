'use client'

// Step 5: 재시청
// Step 1~4를 완료한 후 동일 영상을 다시 본다.
// 목표: 텍스트·그림으로 이해한 내용이 이제 귀로도 들리는지 확인하는 단계.
// "아, 이 표현이 이렇게 들리는구나"를 경험하는 것이 핵심이며
// 별도 학습 없이 영상만 틀면 된다.

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Props {
  videoId: string
}

export function Step5Rewatch({ videoId }: Props) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  const embedUrl =
    `https://www.youtube.com/embed/${videoId}` +
    `?cc_load_policy=0&rel=0&modestbranding=1`

  return (
    <div className='flex flex-col gap-5'>
      {/* 재시청 안내 */}
      <div className='rounded-lg bg-muted/50 px-4 py-3 text-sm leading-relaxed text-muted-foreground'>
        이제 처음과 달리 <strong className='text-foreground'>귀로 들리는 영어</strong>가 늘었을 것이다.
        자막 없이 다시 시청하며, 1~4단계에서 익힌 표현이 실제 발화에서 어떻게 들리는지 느껴보자.
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

      <Button
        onClick={() => router.push(`/study/complete?videoId=${videoId}`)}
        disabled={!checked}
        className='w-full'
      >
        완료 →
      </Button>
    </div>
  )
}
