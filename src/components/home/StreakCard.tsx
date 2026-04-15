'use client'

import { useAuthModal } from '@/lib/store/auth-modal'
import { getKSTDate } from '@/lib/utils'

interface Props {
  currentStreak: number
  longestStreak: number
  lastStudyDate: string | null
  weeklyProgress?: string[]
  isLoggedIn: boolean
}

// Pixel plant stages (each pixel: {x, y, color} on a 4px grid)
const PIXEL = 4

type PixelDef = { x: number; y: number; color: string }

const G = '#16a34a' // stem/leaf green
const LG = '#4ade80' // light green leaf tip
const BR = '#78350f' // seed/soil brown
const AM = '#92400e' // pot amber
const DG = '#15803d' // dark green

const STAGES: { label: string; minDays: number; pixels: PixelDef[]; w: number; h: number }[] = [
  {
    label: '씨앗',
    minDays: 0,
    w: 5, h: 5,
    pixels: [
      { x: 1, y: 1, color: BR }, { x: 2, y: 1, color: BR },
      { x: 1, y: 2, color: BR }, { x: 2, y: 2, color: BR },
      { x: 1, y: 3, color: BR }, { x: 2, y: 3, color: BR },
    ],
  },
  {
    label: '발아',
    minDays: 1,
    w: 6, h: 9,
    pixels: [
      { x: 2, y: 0, color: LG },
      { x: 1, y: 1, color: G }, { x: 2, y: 1, color: G },
      { x: 2, y: 2, color: G },
      { x: 1, y: 3, color: BR }, { x: 2, y: 3, color: BR },
      { x: 1, y: 4, color: BR }, { x: 2, y: 4, color: BR },
    ],
  },
  {
    label: '새싹',
    minDays: 3,
    w: 8, h: 11,
    pixels: [
      { x: 0, y: 1, color: LG }, { x: 1, y: 0, color: LG },
      { x: 4, y: 1, color: LG }, { x: 5, y: 0, color: LG },
      { x: 1, y: 1, color: G }, { x: 2, y: 1, color: G }, { x: 3, y: 1, color: G }, { x: 4, y: 1, color: G },
      { x: 2, y: 2, color: G }, { x: 3, y: 2, color: G },
      { x: 2, y: 3, color: G }, { x: 3, y: 3, color: G },
      { x: 2, y: 4, color: BR }, { x: 3, y: 4, color: BR },
      { x: 1, y: 5, color: BR }, { x: 2, y: 5, color: BR }, { x: 3, y: 5, color: BR }, { x: 4, y: 5, color: BR },
    ],
  },
  {
    label: '성장',
    minDays: 7,
    w: 10, h: 14,
    pixels: [
      { x: 0, y: 2, color: LG }, { x: 1, y: 1, color: LG }, { x: 2, y: 0, color: LG },
      { x: 6, y: 2, color: LG }, { x: 7, y: 1, color: LG }, { x: 8, y: 0, color: LG },
      { x: 1, y: 2, color: G }, { x: 2, y: 2, color: G }, { x: 3, y: 1, color: G }, { x: 4, y: 1, color: G }, { x: 5, y: 1, color: G }, { x: 6, y: 2, color: G },
      { x: 3, y: 2, color: G }, { x: 4, y: 2, color: G }, { x: 5, y: 2, color: G },
      { x: 4, y: 3, color: DG }, { x: 5, y: 3, color: DG },
      { x: 4, y: 4, color: DG }, { x: 5, y: 4, color: DG },
      { x: 3, y: 5, color: BR }, { x: 4, y: 5, color: BR }, { x: 5, y: 5, color: BR }, { x: 6, y: 5, color: BR },
      { x: 2, y: 6, color: AM }, { x: 3, y: 6, color: AM }, { x: 4, y: 6, color: AM }, { x: 5, y: 6, color: AM }, { x: 6, y: 6, color: AM }, { x: 7, y: 6, color: AM },
      { x: 3, y: 7, color: AM }, { x: 4, y: 7, color: AM }, { x: 5, y: 7, color: AM }, { x: 6, y: 7, color: AM },
    ],
  },
  {
    label: '완성',
    minDays: 14,
    w: 10, h: 14,
    pixels: [
      { x: 0, y: 1, color: LG }, { x: 1, y: 0, color: LG }, { x: 2, y: 1, color: LG },
      { x: 6, y: 1, color: LG }, { x: 7, y: 0, color: LG }, { x: 8, y: 1, color: LG },
      { x: 3, y: 0, color: DG }, { x: 4, y: 0, color: DG }, { x: 5, y: 0, color: DG },
      { x: 1, y: 1, color: G }, { x: 2, y: 1, color: G }, { x: 3, y: 1, color: G }, { x: 4, y: 1, color: G }, { x: 5, y: 1, color: G }, { x: 6, y: 1, color: G }, { x: 7, y: 1, color: G },
      { x: 0, y: 2, color: G }, { x: 1, y: 2, color: DG }, { x: 2, y: 2, color: DG }, { x: 3, y: 2, color: DG }, { x: 4, y: 2, color: DG }, { x: 5, y: 2, color: DG }, { x: 6, y: 2, color: DG }, { x: 7, y: 2, color: DG }, { x: 8, y: 2, color: G },
      { x: 4, y: 3, color: DG }, { x: 5, y: 3, color: DG },
      { x: 4, y: 4, color: DG }, { x: 5, y: 4, color: DG },
      { x: 3, y: 5, color: BR }, { x: 4, y: 5, color: BR }, { x: 5, y: 5, color: BR }, { x: 6, y: 5, color: BR },
      { x: 2, y: 6, color: AM }, { x: 3, y: 6, color: AM }, { x: 4, y: 6, color: AM }, { x: 5, y: 6, color: AM }, { x: 6, y: 6, color: AM }, { x: 7, y: 6, color: AM },
      { x: 3, y: 7, color: AM }, { x: 4, y: 7, color: AM }, { x: 5, y: 7, color: AM }, { x: 6, y: 7, color: AM },
    ],
  },
]

function getStage(streak: number) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (streak >= STAGES[i].minDays) return STAGES[i]
  }
  return STAGES[0]
}

function RingGauge({ streak }: { streak: number }) {
  const RADIUS = 54
  const STROKE = 7
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const SIZE = (RADIUS + STROKE) * 2 + 4

  const cycleProgress =
    streak === 0 ? 0 :
    streak >= 14 ? 1 :
    streak >= 7 ? (streak - 7) / 7 :
    streak / 7

  const isComplete = streak >= 7
  const fillColor = streak >= 14 ? '#15803d' : streak >= 7 ? '#16a34a' : '#fc4c02'
  const offset = CIRCUMFERENCE * (1 - cycleProgress)

  const stage = getStage(streak)
  const plantW = stage.w * PIXEL
  const plantH = stage.h * PIXEL
  const cx = SIZE / 2
  const cy = SIZE / 2
  const ox = cx - plantW / 2
  const oy = cy - plantH / 2

  return (
    <svg
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      shapeRendering='crispEdges'
      className='overflow-visible'
    >
      {isComplete && (
        <defs>
          <filter id='ring-glow'>
            <feGaussianBlur stdDeviation='2.5' result='blur' />
            <feComposite in='SourceGraphic' in2='blur' operator='over' />
          </filter>
        </defs>
      )}

      {/* Track */}
      <circle
        cx={cx} cy={cy} r={RADIUS}
        fill='none'
        stroke='rgba(0,0,0,0.07)'
        strokeWidth={STROKE}
      />

      {/* Fill arc */}
      <circle
        cx={cx} cy={cy} r={RADIUS}
        fill='none'
        stroke={fillColor}
        strokeWidth={STROKE}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap='round'
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        filter={isComplete ? 'url(#ring-glow)' : undefined}
      />

      {/* Pixel plant — inline SVG rects */}
      {stage.pixels.map((px, i) => (
        <rect
          key={i}
          x={ox + px.x * PIXEL}
          y={oy + px.y * PIXEL}
          width={PIXEL}
          height={PIXEL}
          fill={px.color}
        />
      ))}
    </svg>
  )
}

export function StreakCard({ currentStreak, longestStreak, weeklyProgress = [], isLoggedIn }: Props) {
  const openModal = useAuthModal((s) => s.open)
  const stage = getStage(currentStreak)

  // week stamps (Mon–Sun)
  const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']
  
  // Get current date in KST for Monday calculation
  const now = new Date()
  const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
  // 새벽 3시 오프셋 적용
  const offsetKst = new Date(kstNow.getTime() - 3 * 60 * 60 * 1000)
  const dayOfWeek = (offsetKst.getDay() + 6) % 7
  const monday = new Date(offsetKst)
  monday.setDate(offsetKst.getDate() - dayOfWeek)
  monday.setHours(0, 0, 0, 0)
  
  const stamps = Array.from({ length: 7 }, (_, i) => {
    if (!isLoggedIn) return false
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    const dayStr = getKSTDate(day)
    return weeklyProgress.includes(dayStr)
  })

  return (
    <div className='flex flex-col gap-4'>
      {/* Ring + info row */}
      <div className='flex gap-4 rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-elegant)]'>
        {/* Ring */}
        <div className='flex items-center justify-center shrink-0'>
          <RingGauge streak={currentStreak} />
        </div>

        {/* Info */}
        <div className='flex flex-col justify-center gap-2 flex-1 min-w-0'>
          <p className='text-mono-label text-muted-foreground'>내 스트릭</p>

          {isLoggedIn ? (
            <>
              <div className='flex items-baseline gap-1'>
                <span className='text-[3rem] font-medium leading-none tracking-[-0.04em]' style={{ color: 'var(--dark-blue)' }}>
                  {currentStreak}
                </span>
                <span className='text-sm font-medium text-muted-foreground'>일</span>
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-xs font-semibold' style={{ color: 'var(--brand-orange)' }}>
                  {stage.label} 단계
                </span>
                <span className='text-[10px] text-muted-foreground'>최고 {longestStreak}일</span>
              </div>
            </>
          ) : (
            <div className='flex flex-col gap-2'>
              <div className='flex items-baseline gap-1'>
                <span className='text-[3rem] font-medium leading-none tracking-[-0.04em] text-muted-foreground'>0</span>
                <span className='text-sm font-medium text-muted-foreground'>일</span>
              </div>
              <button
                onClick={() => openModal('로그인하면 학습 기록이 저장되고, 나만의 지식 플랜테리어를 키울 수 있습니다.')}
                className='text-xs text-left underline underline-offset-2 transition-colors'
                style={{ color: 'var(--brand-orange)' }}
              >
                로그인하면 기록됩니다 →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Week stamps */}
      <div className='rounded-lg border border-border bg-card px-6 py-4 shadow-[var(--shadow-elegant)]'>
        <p className='text-mono-label text-muted-foreground mb-3'>이번 주 학습</p>
        <div className='flex gap-2'>
          {DAY_LABELS.map((label, i) => (
            <div key={label} className='flex flex-1 flex-col items-center gap-1.5'>
              <div
                className='h-8 w-full rounded-[3px] transition-all duration-300'
                style={
                  stamps[i]
                    ? {
                        background: 'linear-gradient(135deg, var(--brand-orange), #ff8c00)',
                        boxShadow: '0 2px 6px rgba(252,76,2,0.3)',
                      }
                    : { backgroundColor: 'rgba(0,0,0,0.05)' }
                }
              />
              <span className='text-[10px] font-medium text-muted-foreground'>{label}</span>
            </div>
          ))}
        </div>

        {!isLoggedIn && (
          <p className='mt-3 text-[10px] text-muted-foreground text-center'>
            <button 
              onClick={() => openModal()}
              className='underline underline-offset-2 hover:text-foreground transition-colors'
            >
              로그인
            </button>
            하면 학습 기록이 저장됩니다
          </p>
        )}
      </div>
    </div>
  )
}
