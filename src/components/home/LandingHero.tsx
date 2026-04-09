import Link from 'next/link'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'
import { Badge } from '@/components/ui/badge'

export function LandingHero() {
  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-16 text-center'>
      <div className='flex flex-col items-center gap-6 max-w-lg w-full'>
        <h1
          className='text-4xl font-bold tracking-tight'
          style={{ color: 'var(--brand-primary)' }}
        >
          TED-fi
        </h1>

        <Badge
          variant='secondary'
          className='px-4 py-1.5 text-sm font-medium rounded-full'
        >
          TED-Ed × AI 영어 학습
        </Badge>

        <div className='space-y-2'>
          <p className='text-3xl font-bold leading-tight text-foreground'>
            매일 조금씩,
            <br />
            영어 귀가 트이는 경험
          </p>
          <p className='text-base text-muted-foreground mt-3'>
            TED-Ed 영상 한 편으로
            <br />
            읽기·듣기·쓰기를 한 번에
          </p>
        </div>

        <div className='flex flex-col items-center gap-3 w-full mt-2'>
          <GoogleSignInButton />

          <div className='flex items-center gap-3 text-xs text-muted-foreground'>
            <span>무료</span>
            <span>·</span>
            <span>광고 없음</span>
            <span>·</span>
            <span>매일 1영상</span>
          </div>
        </div>

        <div className='mt-4 flex flex-col items-center gap-4'>
          <div
            className='grid grid-cols-2 gap-3 w-full text-left'
          >
            {[
              { step: '1', label: '무자막 시청', desc: '영어 듣기 감각 깨우기' },
              { step: '2', label: '스크립트 확인', desc: '영어 원문 독해' },
              { step: '3', label: '학습지', desc: 'AI 생성 문제 풀기' },
              { step: '4', label: '핵심 표현', desc: '일상 영어 표현 내 것으로' },
            ].map((item) => (
              <div
                key={item.step}
                className='rounded-xl p-3 text-sm'
                style={{ backgroundColor: `var(--step-${item.step})` }}
              >
                <div className='font-semibold text-foreground'>{item.label}</div>
                <div className='text-xs text-muted-foreground mt-0.5'>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <Link
          href='/guide'
          className='text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline'
        >
          학습 가이드 보기 →
        </Link>
      </div>
    </div>
  )
}
