'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface Props {
  videoId: string
}

export function Step1Player({ videoId }: Props) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)

  const embedUrl =
    `https://www.youtube.com/embed/${videoId}` +
    `?cc_load_policy=0&rel=0&modestbranding=1`

  async function handleComplete() {
    setLoading(true)
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId, step: 1 }),
    })
    router.push(`/study?step=2`)
  }

  return (
    <div className='flex flex-col gap-5'>
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
          <span>영상을 처음부터 끝까지 자막 없이 시청했습니다.</span>
        </label>
      </div>

      <Button
        onClick={handleComplete}
        disabled={!checked || loading}
        className='w-full'
      >
        {loading ? '저장 중...' : '시청 완료 → Step 2'}
      </Button>
    </div>
  )
}
