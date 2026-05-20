import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { fetchHolidaysFromPublicApi } from '@/lib/utills/holiday';

export const maxDuration = 60; // 외부 API 의존성이 있으므로 여유 시간 확보

export async function POST(request: Request) {
  try {
    // 1. Authorization Check
    const authHeader = request.headers.get('Authorization');
    const expectedSecret = process.env.ADMIN_SECRET;
    
    let isAuthorized = false;
    const supabase = await createClient();

    if (authHeader && authHeader === `Bearer ${expectedSecret}`) {
      isAuthorized = true; // 내부 Cron / API 호출
    } else {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (profile?.role === 'admin') {
          isAuthorized = true; // 관리자 페이지 직접 호출
        }
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const targetDate = body.date ? new Date(body.date) : new Date();

    // 동기화할 월: targetDate의 월과 그 다음 월
    const year1 = String(targetDate.getFullYear());
    const month1 = String(targetDate.getMonth() + 1).padStart(2, '0');
    
    const nextMonthDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1);
    const year2 = String(nextMonthDate.getFullYear());
    const month2 = String(nextMonthDate.getMonth() + 1).padStart(2, '0');

    // 공공 API에서 공휴일 가져오기
    const holidaysM1 = await fetchHolidaysFromPublicApi(year1, month1);
    const holidaysM2 = await fetchHolidaysFromPublicApi(year2, month2);

    const allHolidays = [...holidaysM1, ...holidaysM2];
    
    // 수동 추가 (근로자의 날)
    if (month1 === '05' || month2 === '05') {
      const yearToUse = month1 === '05' ? year1 : year2;
      const laborDay = `${yearToUse}-05-01`;
      if (!allHolidays.find(h => h.date === laborDay)) {
        allHolidays.push({ date: laborDay, name: '근로자의 날' });
      }
    }

    if (allHolidays.length === 0) {
      return NextResponse.json({ message: 'No holidays to sync for the given months', count: 0 });
    }

    // 서비스 롤 키를 사용해 DB에 upsert
    const adminSupabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await adminSupabase
      .from('holidays')
      .upsert(
        allHolidays.map(h => ({ date: h.date, name: h.name })),
        { onConflict: 'date' }
      );

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      message: 'Holidays synced successfully', 
      count: allHolidays.length,
      holidays: allHolidays
    });

  } catch (error) {
    console.error('[Sync Holidays] Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
