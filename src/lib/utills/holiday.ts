import { SupabaseClient } from '@supabase/supabase-js';

/**
 * 공휴일 및 주말 계산 유틸리티 (Next.js용)
 */

export interface HolidayItem {
  dateKind: string;
  dateName: string;
  isHoliday: string;
  locdate: number;
  seq: number;
}

export interface SimplifiedHoliday {
  date: string; // YYYY-MM-DD
  name: string; // 공휴일 명칭
}

// 서버 사이드 전용: 공공 API 직접 호출 로직 (API Route 동기화용)
export const fetchHolidaysFromPublicApi = async (year: string, month: string): Promise<SimplifiedHoliday[]> => {
  const serviceKey = process.env.HOLIDAY_KEY;
  if (!serviceKey) return [];

  const params = new URLSearchParams({
    ServiceKey: serviceKey,
    solYear: year,
    solMonth: month.padStart(2, '0'),
    _type: 'json',
  });

  try {
    const url = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?${params.toString()}`;
    const res = await fetch(url); // 동기화에 사용되므로 캐시 제외
    if (!res.ok) return [];

    const result = await res.json();
    const item = result.response?.body?.items?.item;
    if (!item) return [];

    const items: HolidayItem[] = Array.isArray(item) ? item : [item];
    return items.map((h) => {
      const s = String(h.locdate);
      const date = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
      return {
        date,
        name: h.dateName
      };
    });
  } catch (err) {
    console.error('[fetchHolidaysFromPublicApi] Error:', err);
    return [];
  }
};

export const isWeekend = (date: Date | string = new Date()): boolean => {
  const d = new Date(date);
  const kstDate = new Date(d.getTime() + (9 * 60 * 60 * 1000));
  const day = kstDate.getUTCDay(); // 0: 일요일, 6: 토요일
  return day === 0 || day === 6;
};

// DB 기반 헬퍼 함수들

/**
 * 여러 날짜의 공휴일 정보를 한 번의 쿼리로 가져옵니다.
 * @returns Map<"YYYY-MM-DD", "공휴일명">
 */
export const getHolidaysForDates = async (
  supabase: SupabaseClient,
  dates: string[]
): Promise<Map<string, string>> => {
  if (!dates || dates.length === 0) return new Map();

  const { data, error } = await supabase
    .from('holidays')
    .select('date, name')
    .in('date', dates);

  if (error || !data) {
    console.error('[getHolidaysForDates] Error:', error);
    return new Map();
  }

  return new Map(data.map(h => [h.date, h.name]));
};

export const isPublicHoliday = async (
  supabase: SupabaseClient,
  date: Date | string = new Date()
): Promise<boolean> => {
  const d = new Date(date);
  const kstDate = new Date(d.getTime() + (9 * 60 * 60 * 1000));
  
  const y = kstDate.getUTCFullYear();
  const m = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getUTCDate()).padStart(2, "0");
  const formattedDate = `${y}-${m}-${day}`;

  const holidaysMap = await getHolidaysForDates(supabase, [formattedDate]);
  return holidaysMap.has(formattedDate);
};

export const getHolidayName = async (
  supabase: SupabaseClient,
  date: Date | string = new Date()
): Promise<string | null> => {
  const d = new Date(date);
  const kstDate = new Date(d.getTime() + (9 * 60 * 60 * 1000));
  
  const y = kstDate.getUTCFullYear();
  const m = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getUTCDate()).padStart(2, "0");
  const formattedDate = `${y}-${m}-${day}`;

  const holidaysMap = await getHolidaysForDates(supabase, [formattedDate]);
  return holidaysMap.get(formattedDate) ?? null;
};
