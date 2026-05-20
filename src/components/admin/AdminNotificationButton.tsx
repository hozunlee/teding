'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Film, MessageSquare, ChevronRight } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface NotificationItem {
  id: string
  type: 'request' | 'feedback'
  title: string
  nickname: string
  createdAt: string
}

/**
 * 날짜를 상대 시간 형식으로 포맷팅합니다. (예: 방금 전, 5분 전, 1시간 전)
 */
function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    
    if (diffMs < 0) return '방금 전'
    
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return '방금 전'
    if (diffMins < 60) return `${diffMins}분 전`
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}시간 전`
    
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays}일 전`
    
    // 7일 이상은 단순 날짜 표기
    return date.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return '이전'
  }
}

export function AdminNotificationButton() {
  const router = useRouter()
  const [items, setItems] = useState<NotificationItem[]>([])
  const [count, setCount] = useState<number>(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // 알림 데이터를 가져옵니다.
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/notifications')
      if (res.ok) {
        const data = await res.json()
        setItems(data.items || [])
        setCount(data.count || 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // 컴포넌트 마운트 시 최초 로드 및 30초 단위 폴링 설정
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Popover 열릴 때 최신 데이터 갱신
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      fetchNotifications()
    }
  }

  // 알림 항목 클릭 처리
  const handleItemClick = (item: NotificationItem) => {
    setIsOpen(false)
    if (item.type === 'request') {
      router.push('/admin?tab=requests')
    } else {
      router.push(`/admin/feedback/${item.id}`)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        className="relative flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground transition-all duration-200 focus-visible:outline-none"
        aria-label="알림"
      >
        <Bell className="h-4.5 w-4.5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand-orange)] opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--brand-orange)]"></span>
          </span>
        )}
      </PopoverTrigger>
      
      <PopoverContent align="end" className="w-80 p-0 shadow-xl overflow-hidden border border-border/80 bg-popover text-popover-foreground">
        {/* 알림 헤더 */}
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-muted/20">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            알림 {count > 0 && <span className="ml-1 text-[var(--brand-orange)] font-mono">{count}</span>}
          </span>
          {count > 0 && (
            <span className="text-[10px] text-muted-foreground font-mono">
              미처리 기준
            </span>
          )}
        </div>

        {/* 알림 리스트 */}
        <div className="max-h-[320px] overflow-y-auto divide-y divide-border/40">
          {loading && items.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              불러오는 중...
            </div>
          ) : items.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-muted-foreground">
              대기 중인 요청이나 미답변 피드백이 없습니다.
            </div>
          ) : (
            items.slice(0, 5).map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                onClick={() => handleItemClick(item)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors focus-visible:outline-none"
              >
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[4px] bg-muted/60 text-muted-foreground">
                  {item.type === 'request' ? (
                    <Film className="h-3.5 w-3.5 text-blue-500" />
                  ) : (
                    <MessageSquare className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {item.type === 'request' ? '영상 조르기' : '의견 보내기'}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>
                  <p className="truncate text-xs font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    작성자: {item.nickname}
                  </p>
                </div>
                <ChevronRight className="mt-2.5 h-3 w-3 shrink-0 text-muted-foreground/40" />
              </button>
            ))
          )}
        </div>

        {/* 알림 푸터 */}
        <div className="border-t border-border/50 bg-muted/10 p-2">
          <button
            onClick={() => {
              setIsOpen(false)
              router.push('/admin')
            }}
            className="flex w-full items-center justify-center rounded-[4px] py-1.5 text-center text-xs font-semibold text-[var(--dark-blue)] hover:bg-muted/40 transition-colors"
          >
            어드민 대시보드 바로가기
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
