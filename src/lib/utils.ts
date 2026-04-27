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
