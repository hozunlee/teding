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

// 서버 사이드 전용: 공공 API 직접 호출 로직 (API Route와 공유)
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
    const res = await fetch(url, { next: { revalidate: 2592000 } }); // 1개월 캐시
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

/**
 * 특정 연도와 월의 공휴일 목록을 가져옵니다.
 */
export const getHolidays = async (year: string, month: string): Promise<SimplifiedHoliday[]> => {
  // 1. 서버 사이드: 직접 로직 실행
  if (typeof window === 'undefined') {
    const holidays = await fetchHolidaysFromPublicApi(year, month);
    
    // 노동절(5월 1일) 수동 추가
    if (month === '05' || month === '5') {
      const laborDay = `${year}-05-01`;
      if (!holidays.find(h => h.date === laborDay)) {
        holidays.push({ date: laborDay, name: '근로자의 날' });
      }
    }
    return holidays;
  }

  // 2. 클라이언트 사이드: 내부 API 호출
  try {
    const res = await fetch(`/api/admin/holidays?year=${year}&month=${month}`);
    if (res.ok) {
      const data = await res.json();
      return data.holidays || [];
    }
  } catch (err) {
    console.error('[getHolidays] Client Fetch Error:', err);
  }
  return [];
};

export const isWeekend = (date: Date | string = new Date()): boolean => {
  const d = new Date(date);
  const kstDate = new Date(d.getTime() + (9 * 60 * 60 * 1000));
  const day = kstDate.getUTCDay(); // 0: 일요일, 6: 토요일
  return day === 0 || day === 6;
};

export const isPublicHoliday = async (date: Date | string = new Date()): Promise<boolean> => {
  const d = new Date(date);
  const kstDate = new Date(d.getTime() + (9 * 60 * 60 * 1000));
  const year = String(kstDate.getUTCFullYear());
  const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
  
  const y = kstDate.getUTCFullYear();
  const m = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
  const day = String(kstDate.getUTCDate()).padStart(2, "0");
  const formattedDate = `${y}-${m}-${day}`;

  const holidayList = await getHolidays(year, month);
  return !!holidayList.find(h => h.date === formattedDate);
};

export const getHolidayName = async (date: Date | string = new Date()): Promise<string | null> => {
    const d = new Date(date);
    const kstDate = new Date(d.getTime() + (9 * 60 * 60 * 1000));
    const year = String(kstDate.getUTCFullYear());
    const month = String(kstDate.getUTCMonth() + 1).padStart(2, '0');
    
    const y = kstDate.getUTCFullYear();
    const m = String(kstDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(kstDate.getUTCDate()).padStart(2, "0");
    const formattedDate = `${y}-${m}-${day}`;
  
    const holidayList = await getHolidays(year, month);
    const holiday = holidayList.find(h => h.date === formattedDate);
    return holiday ? holiday.name : null;
};
