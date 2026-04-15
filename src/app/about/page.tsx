import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

export const metadata = {
  title: '서비스 소개 — tedding',
  description: 'tedding은 TED-Ed의 지식을 AI가 심플하게 큐레이션하는 영어 학습 서비스입니다.',
}

export default async function AboutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className='flex-1 flex flex-col'>
      {/* Hero (From Landing) */}
      <section className='relative flex flex-col items-center justify-center min-h-[70vh] px-6 py-20 text-center overflow-hidden'>
        {/* Ambient blur */}
        <div className='absolute inset-0 pointer-events-none'>
          <div className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-linear-to-r from-[#ef2cc1]/8 to-[#bdbbff]/15 blur-[120px] rounded-full' />
          <div className='absolute bottom-1/4 right-1/4 w-[300px] h-[200px] bg-[#fc4c02]/5 blur-[80px] rounded-full' />
        </div>

        <div className='relative z-10 max-w-xl w-full flex flex-col items-center gap-8'>
          {/* Logo */}
          <div className='flex flex-col items-center gap-3'>
            <span className='text-mono-label text-muted-foreground tracking-[0.2em]'>KNOWLEDGE CURATION</span>
            <h1
              className='text-[4.5rem] sm:text-[6rem] font-bold leading-none tracking-[-0.04em]'
              style={{ color: 'var(--dark-blue)' }}
            >
              ted<span className='logo-colon'>:</span>ing
            </h1>
          </div>

          {/* Main slogan */}
          <div className='flex flex-col gap-2'>
            <p className='text-xl sm:text-2xl font-medium tracking-tight text-foreground leading-snug'>
              밀도 높은 영어를<br className='sm:hidden' /> 가장 심플하게 펼치다
            </p>
            <p className='text-sm text-muted-foreground leading-relaxed max-w-sm'>
              TED-Ed의 지식을 AI가 심플하게 큐레이션합니다.<br />
              매일 하나씩, 내 안의 영어가 자라나는 감각을 경험하세요.
            </p>
          </div>

          {!user && (
            <div className='flex flex-col items-center gap-3 w-full max-w-sm'>
              <Link
                href='/'
                className='w-full flex items-center justify-center gap-2 h-12 rounded-lg font-semibold text-sm tracking-wide text-white transition-all hover:opacity-90 active:scale-[0.98]'
                style={{ backgroundColor: 'var(--dark-blue)' }}
              >
                오늘의 큐레이션 경험하기
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M5 12h14M12 5l7 7-7 7' />
                </svg>
              </Link>
              <GoogleSignInButton />
            </div>
          )}
        </div>
      </section>

      {/* About Content */}
      <div className='container mx-auto max-w-2xl px-4 py-16 flex flex-col gap-16'>
        {/* Brand story */}
        <section>
          <p className='text-mono-label text-muted-foreground mb-4'>BRAND STORY</p>
          <div className='rounded-xl border border-border bg-card p-6 flex flex-col gap-4'>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              <strong className='text-foreground'>Tedding</strong>은 본래 수확한 작물을 고루 펼쳐 말리는 농업 공정입니다.
              우리는 이를 현대 지식인의 <strong className='text-foreground'>심플한 큐레이션</strong>으로 재해석합니다.
            </p>
            <p className='text-sm leading-relaxed text-muted-foreground'>
              TED-Ed 영상(원시 데이터)을 사람이 흡수하기 좋은 최적의 상태로 정제(tedding)하여 제공합니다.
              유저는 그저 물을 주듯, <strong className='text-foreground'>하루 15분의 루틴</strong>으로 내 안의 영어를 성장시키면 됩니다.
            </p>
            <div className='pt-2 border-t border-border'>
              <p className='text-xs text-muted-foreground italic'>
                &ldquo;밀도 높은 영어를 가장 심플하게 펼치다&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section>
          <p className='text-mono-label text-muted-foreground mb-4'>HOW IT WORKS</p>
          <div className='flex flex-col gap-3'>
            {[
              {
                step: 'STEP 1', label: '무자막 시청', desc: '영어 듣기 감각 깨우기. 자막 없이 TED-Ed 영상을 시청합니다.',
                color: '#fc4c02',
              },
              {
                step: 'STEP 2', label: '스크립트 확인', desc: 'AI가 추출한 영어 원문으로 독해. 소리와 문자를 연결합니다.',
                color: '#ef2cc1',
              },
              {
                step: 'STEP 3', label: '학습지', desc: 'AI가 생성한 빈칸채우기·독해·작문 문제. PDF 다운로드 가능.',
                color: '#7c3aed',
              },
              {
                step: 'STEP 4', label: '핵심 표현', desc: '영상의 핵심 패턴과 구문 분석. 일상 영어 표현을 내재화합니다.',
                color: '#010120',
              },
            ].map((item) => (
              <div key={item.step} className='flex gap-4 rounded-xl border border-border p-4'>
                <div
                  className='shrink-0 w-1 rounded-full'
                  style={{ backgroundColor: item.color }}
                />
                <div className='flex flex-col gap-0.5'>
                  <span className='text-mono-label' style={{ color: item.color }}>{item.step}</span>
                  <span className='font-semibold text-sm'>{item.label}</span>
                  <span className='text-xs text-muted-foreground leading-relaxed'>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Tedding */}
        <section>
          <p className='text-mono-label text-muted-foreground mb-4'>WHY TEDDING</p>
          <div className='grid grid-cols-2 gap-3'>
            {[
              { icon: '🌱', title: '성장 시각화', desc: '연속 학습 스트릭이 픽셀 식물로 자라납니다' },
              { icon: '⚡', title: 'AI 큐레이션', desc: '학습자료는 최초 1회 생성 후 전체 공유' },
              { icon: '📖', title: '완전 무료', desc: '광고 없이 모든 기능을 무료로 이용' },
              { icon: '🎯', title: '매일 1영상', desc: '모든 유저가 같은 영상으로 함께 학습' },
            ].map((item) => (
              <div key={item.title} className='rounded-xl border border-border bg-card p-4 flex flex-col gap-2'>
                <span className='text-2xl'>{item.icon}</span>
                <span className='font-semibold text-sm'>{item.title}</span>
                <span className='text-xs text-muted-foreground leading-relaxed'>{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className='rounded-xl border border-border bg-card p-8 text-center flex flex-col items-center gap-4 mb-20'>
          <p className='text-sm font-medium'>오늘의 큐레이션을 경험해보세요</p>
          <div className='flex flex-col gap-3 w-full max-w-xs'>
            <Link
              href='/'
              className='w-full flex items-center justify-center gap-2 h-11 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90'
              style={{ backgroundColor: 'var(--dark-blue)' }}
            >
              오늘 학습 시작하기 →
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
