export const dynamic = 'force-dynamic'
import { getAuthedClient } from '@/lib/supabase/api-auth'
import { getKSTDate, getDayOfWeekKST, getDiffDays } from '@/lib/utils'
import { getHolidaysForDates } from '@/lib/utills/holiday'

export async function GET(req: Request) {
  const { supabase, user } = await getAuthedClient(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return Response.json({ streak: data ?? null })
}

export async function POST(req: Request) {
  const { supabase, user } = await getAuthedClient(req)
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const todayStr = getKSTDate()
  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!streak) {
    const newStreakData = {
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_study_date: todayStr,
    }
    await supabase.from('streaks').insert(newStreakData)
    return Response.json({ current_streak: 1, longest_streak: 1 })
  }

  if (streak.last_study_date === todayStr) {
    return Response.json({
      current_streak: streak.current_streak,
      longest_streak: streak.longest_streak,
    })
  }

  // 스트릭 유지 판단 로직 (공휴일 보너스 및 주말 유동성 적용)
  let canMaintain = false
  const lastStudyDate = streak.last_study_date ?? todayStr
  const diffDays = getDiffDays(lastStudyDate, todayStr)

  if (diffDays <= 1) {
    canMaintain = true
  } else {
    canMaintain = true 
    const [lastY, lastM, lastD] = lastStudyDate.split('-').map(Number)
    const lastUTC = Date.UTC(lastY, lastM - 1, lastD)

    // 1. 검사할 모든 날짜 수집
    const datesToCheck: string[] = []
    const getFormattedDate = (utcTime: number) => {
      const dObj = new Date(utcTime)
      const y = dObj.getUTCFullYear()
      const m = String(dObj.getUTCMonth() + 1).padStart(2, '0')
      const d = String(dObj.getUTCDate()).padStart(2, '0')
      return `${y}-${m}-${d}`
    }

    for (let i = 1; i < diffDays; i++) {
      const gapUTC = lastUTC + (i * 24 * 60 * 60 * 1000)
      const gapDateStr = getFormattedDate(gapUTC)
      datesToCheck.push(gapDateStr)
      
      const dayOfWeek = getDayOfWeekKST(gapDateStr)
      if (dayOfWeek === 6) {
        datesToCheck.push(getFormattedDate(gapUTC + (24 * 60 * 60 * 1000)))
      }
    }

    // 2. DB에서 한 번에 공휴일 조회
    const holidaysMap = await getHolidaysForDates(supabase, datesToCheck)

    // 3. 루프 돌며 판단
    for (let i = 1; i < diffDays; i++) {
      const gapUTC = lastUTC + (i * 24 * 60 * 60 * 1000)
      const gapDateStr = getFormattedDate(gapUTC)
      
      // 1. 공휴일 체크
      if (holidaysMap.has(gapDateStr)) continue
      
      // 2. 주말 유동성 체크
      const dayOfWeek = getDayOfWeekKST(gapDateStr) // 0: 일, 6: 토
      
      if (dayOfWeek === 0) { // 일요일 결석은 일단 무조건 보너스 허용 (토요일 학습 여부와 관계없이)
        continue
      }
      
      if (dayOfWeek === 6) { // 토요일 결석 시 일요일(내일)에 학습하는지 확인
        const tomorrowStr = getFormattedDate(gapUTC + (24 * 60 * 60 * 1000))

        // 내일(일요일)이 오늘 학습일이거나, 내일이 공휴일이면 토요일 결석 허용
        if (tomorrowStr === todayStr || holidaysMap.has(tomorrowStr)) continue

        canMaintain = false
        break
      } else {
        // 보너스 대상이 아닌 평일 결석
        canMaintain = false
        break
      }
    }
  }

  const newCurrent = canMaintain ? streak.current_streak + 1 : 1
  const newLongest = Math.max(newCurrent, streak.longest_streak)

  await supabase.from('streaks').update({
    current_streak: newCurrent,
    longest_streak: newLongest,
    last_study_date: todayStr,
    updated_at: new Date().toISOString(),
  }).eq('user_id', user.id)

  return Response.json({ current_streak: newCurrent, longest_streak: newLongest })
}
