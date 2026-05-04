import React from 'react';
import { isPublicHoliday, isWeekend } from './holiday';

/**
 * 공휴일 및 주말 여부를 화면에 표시하는 서버 컴포넌트 예시 (Next.js)
 */
export default async function HolidayCheckComponent() {
  const now = new Date();
  // KST 시간 표시용
  const kstNow = new Date(now.getTime() + (9 * 60 * 60 * 1000));
  
  const todayIsPublicHoliday = await isPublicHoliday(now);
  const todayIsWeekend = isWeekend(now);
  const todayIsHoliday = todayIsPublicHoliday || todayIsWeekend;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>📅 공휴일 및 영업일 체크</h2>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>현재 기준 시간 (KST):</strong> {kstNow.toISOString().replace('T', ' ').slice(0, 19)}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <strong>오늘의 상태:</strong> 
        {todayIsHoliday ? (
          <span style={{ color: 'red', marginLeft: '5px' }}>휴일 (공휴일 또는 주말)</span>
        ) : (
          <span style={{ color: 'green', marginLeft: '5px' }}>평일 (영업일)</span>
        )}
      </div>
    </div>
  );
}
