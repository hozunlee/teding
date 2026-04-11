import { cn } from '@/lib/utils'

interface Props {
  currentStreak: number
  longestStreak: number
  lastStudyDate: string | null
}

const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

function getWeekStamps(lastStudyDate: string | null): boolean[] {
  const today = new Date()
  // Monday = 0, ..., Sunday = 6
  const dayOfWeek = (today.getDay() + 6) % 7
  const monday = new Date(today)
  monday.setDate(today.getDate() - dayOfWeek)
  monday.setHours(0, 0, 0, 0)

  return Array.from({ length: 7 }, (_, i) => {
    if (!lastStudyDate) return false
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    const dayStr = day.toISOString().split('T')[0]
    // mark days up to and including lastStudyDate within this week
    return dayStr <= lastStudyDate && dayStr <= today.toISOString().split('T')[0]
  })
}

export function StreakCard({ currentStreak, longestStreak, lastStudyDate }: Props) {
  const stamps = getWeekStamps(lastStudyDate)

  return (
    <div className='flex flex-col gap-6 md:flex-row'>
      {/* My Streak Section */}
      <div className='flex flex-1 flex-col rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-elegant)]'>
        <p className='text-mono-label mb-2 text-muted-foreground'>내 스트릭</p>
        <div className='flex items-baseline gap-1'>
          <p className='text-[4rem] font-medium leading-[1] tracking-[-0.04em] text-[var(--dark-blue)]'>
            {currentStreak}
          </p>
          <p className='text-sm font-medium text-muted-foreground'>일</p>
        </div>
        <div className='mt-2 flex items-center gap-1.5'>
          <p className='text-xs font-medium text-[var(--brand-orange)]'>연속 학습 중 🔥</p>
          <span className='h-3 w-[1px] bg-border' />
          <p className='text-[10px] text-muted-foreground'>최고 기록 {longestStreak}일</p>
        </div>
      </div>

      {/* This Week Section */}
      <div className='flex flex-[1.4] flex-col rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-elegant)]'>
        <p className='text-mono-label mb-4 text-muted-foreground'>이번 주 학습</p>
        <div className='flex h-full flex-col justify-between'>
          <div className='flex gap-2'>
            {DAY_LABELS.map((label, i) => (
              <div key={label} className='flex flex-1 flex-col items-center gap-1.5'>
                <div
                  className={cn(
                    'h-10 w-full rounded-[4px] transition-all duration-300',
                    stamps[i]
                      ? 'bg-gradient-to-br from-[var(--brand-orange)] to-[#ff8c00] shadow-[0_2px_8px_rgba(252,76,2,0.3)]'
                      : 'bg-black/5 dark:bg-white/5'
                  )}
                />
                <span className='text-mono-micro text-muted-foreground'>{label}</span>
              </div>
            ))}
          </div>
          <p className='mt-4 text-[10px] text-muted-foreground'>
            매일 꾸준히 학습하여 스트릭을 이어가세요!
          </p>
        </div>
      </div>
    </div>
  )
}
