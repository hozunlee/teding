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
  // 새벽 3시 기준 초기화를 위해 3시간을 뺍니다.
  // (예: 1월 16일 02:00 -> 1월 15일 23:00으로 취급되어 15일 영상이 유지됨)
  const offsetTime = date.getTime() - (3 * 60 * 60 * 1000)
  const offsetDate = new Date(offsetTime)

  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(offsetDate)
    .replace(/\. /g, '-')
    .replace(/\./g, '')
}
