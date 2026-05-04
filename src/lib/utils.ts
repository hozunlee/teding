import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Returns the current date in KST (Asia/Seoul) timezone as a string (YYYY-MM-DD).
 * Includes a 3-hour offset to handle the "daily reset" at 03:00 AM.
 */
export function getKSTDate(date: Date = new Date()): string {
  // 1. KST 시간으로 변환 (서버가 UTC인 경우 대비)
  const kstTime = date.getTime() + (9 * 60 * 60 * 1000)
  
  // 2. 새벽 3시 오프셋 적용 (3시간을 뺌)
  const logicalTime = kstTime - (3 * 60 * 60 * 1000)
  const d = new Date(logicalTime)

  // 3. UTC 메서드를 사용하여 포맷팅 (이미 kstTime을 더했으므로 UTC 메서드가 KST 값을 반환함)
  const year = d.getUTCFullYear()
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * YYYY-MM-DD 형식의 날짜 문자열에서 요일을 추출합니다 (0: 일, 6: 토).
 * 타임존 영향을 받지 않도록 Date.UTC를 사용합니다.
 */
export function getDayOfWeekKST(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay()
}

/**
 * 두 날짜 문자열(YYYY-MM-DD) 사이의 일수 차이를 계산합니다.
 */
export function getDiffDays(startDate: string, endDate: string): number {
  const [y1, m1, d1] = startDate.split('-').map(Number)
  const [y2, m2, d2] = endDate.split('-').map(Number)
  const utc1 = Date.UTC(y1, m1 - 1, d1)
  const utc2 = Date.UTC(y2, m2 - 1, d2)
  return Math.round((utc2 - utc1) / (1000 * 60 * 60 * 24))
}
