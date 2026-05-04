export const dynamic = 'force-dynamic'
import { fetchHolidaysFromPublicApi } from '@/lib/utills/holiday'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  if (!year || !month) {
    return Response.json({ error: 'year, month required' }, { status: 400 })
  }

  try {
    const holidays = await fetchHolidaysFromPublicApi(year, month)
    
    // 노동절 수동 추가
    if (month === '05' || month === '5') {
      const laborDay = `${year}-05-01`
      if (!holidays.find(h => h.date === laborDay)) {
        holidays.push({ date: laborDay, name: '근로자의 날' })
      }
    }

    return Response.json({ holidays })
  } catch (err) {
    console.error('[api/admin/holidays]', err)
    return Response.json({ error: '공휴일 정보 조회 실패' }, { status: 500 })
  }
}
