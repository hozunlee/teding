'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RollingComment } from '@/components/archive/RollingComment'
import { getKSTDate } from '@/lib/utils'

interface VideoItem {
  id: string
  date: string
  video_id: string
  title: string
  duration: string
  completion_count: number
  avg_difficulty: number | null
  completers: string[]
  comments: { text: string; isMine: boolean }[]
  myUploadUrl: string | null
}

const CATEGORIES = [
  { label: '최신순', value: 'latest' },
  { label: '완료인원순', value: 'completed' },
  { label: '😌 쉬워요', value: 'easy' },
  { label: '🔥 할만해요', value: 'normal' },
  { label: '💪 어려워요', value: 'hard' },
]

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`
}

function getDifficultyLabel(avg: number): string {
  if (avg <= 2) return '😌 쉬워요'
  if (avg <= 4) return '🔥 할만해요'
  return '💪 어려워요'
}

export default function ArchiveClient() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [page, setPage] = useState(0)
  const [category, setCategory] = useState('latest')
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const today = getKSTDate()
  
  const observer = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const fetchVideos = useCallback(async (pageNum: number, cat: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/archive?page=${pageNum}&category=${cat}`)
      const data = await res.json()
      if (data.videos) {
        setVideos((prev) => (pageNum === 0 ? data.videos : [...prev, ...data.videos]))
        setHasMore(data.hasMore)
      }
    } catch (error) {
      console.error('Failed to fetch archive:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setVideos([])
    setPage(0)
    setHasMore(true)
    fetchVideos(0, category)
  }, [category, fetchVideos])

  useEffect(() => {
    if (page > 0) {
      fetchVideos(page, category)
    }
  }, [page, category, fetchVideos])

  return (
    <div className='container mx-auto max-w-2xl px-4 py-6'>
      <h1 className='text-xl font-semibold mb-6'>보고또보고</h1>

      {/* 카테고리 필터 */}
      <div className='flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide'>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 whitespace-nowrap ${
              category === cat.value
                ? 'bg-[#166534] text-white shadow-sm shadow-[#166534]/20'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {videos.length === 0 && !loading ? (
        <p className='text-muted-foreground text-sm text-center py-10 italic'>
          기록된 학습 지식이 아직 없습니다 🌱
        </p>
      ) : (
        <ul className='flex flex-col gap-6'>
          {videos.map((video, index) => {
            const isToday = video.date === today
            const completedCount = video.completion_count
            const visibleNames = video.completers.slice(0, 5)
            const hiddenCount = completedCount - visibleNames.length
            const isLast = index === videos.length - 1

            return (
              <li
                key={`${video.id}-${index}`}
                ref={isLast ? lastElementRef : null}
                className='flex flex-col gap-2'
              >
                <div className='rounded-xl border border-border bg-card overflow-hidden flex gap-0 hover:border-[#166534]/30 transition-all group h-auto sm:h-32 shadow-sm'>
                  {/* 콘텐츠 영역 - 왼쪽 배치 */}
                  <div className='p-4 flex-1 flex flex-col justify-center min-w-0 gap-1'>
                    <div className='flex items-center gap-2'>
                      <span className='text-[10px] text-muted-foreground font-mono uppercase tracking-tight'>
                        {formatDate(video.date)}
                      </span>
                      {isToday && (
                        <span className='text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#22c55e]/10 text-[#166534] border border-[#22c55e]/20'>
                          TODAY
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/study?date=${video.date}&step=1`}
                      className='text-sm font-semibold hover:text-[#16a34a] transition-colors line-clamp-2 leading-snug'
                    >
                      {video.title}
                    </Link>

                    <div className='flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5'>
                      <span className='text-[11px] font-bold text-[#16a34a] whitespace-nowrap'>
                        {completedCount}명 완료
                      </span>
                      {completedCount > 0 && (
                        <span className='text-[10px] text-muted-foreground truncate max-w-[120px] sm:max-w-none'>
                          — {visibleNames.join(', ')}
                          {hiddenCount > 0 && ` 외 ${hiddenCount}명`}
                        </span>
                      )}
                    </div>

                    {/* 난이도 통계 */}
                    {video.avg_difficulty && (
                      <p className='text-[10px] text-muted-foreground flex items-center gap-1'>
                        <span className='w-1 h-1 rounded-full bg-[#16a34a]/40' />
                        {getDifficultyLabel(video.avg_difficulty)}
                      </p>
                    )}

                    {/* 내 학습지 링크 */}
                    {video.myUploadUrl && (
                      <a
                        href={video.myUploadUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='mt-1 inline-flex items-center gap-1 text-[10px] font-medium text-[#16a34a] hover:underline'
                      >
                        📄 내 학습지 보기
                      </a>
                    )}
                  </div>

                  {/* 썸네일 영역 - 오른쪽 배치 */}
                  <div className='relative w-24 sm:w-56 aspect-square sm:aspect-video bg-muted shrink-0 overflow-hidden border-l border-border/50'>
                    <Image
                      src={`https://img.youtube.com/vi/${video.video_id}/mqdefault.jpg`}
                      alt={video.title}
                      fill
                      sizes='(max-width: 640px) 96px, 224px'
                      className='object-cover group-hover:scale-105 transition-transform duration-500'
                      priority={index < 4}
                    />
                    <div className='absolute bottom-1 right-1 bg-black/70 text-white text-[8px] sm:text-[9px] px-1 sm:px-1.5 py-0.5 rounded font-mono z-10'>
                      {video.duration}
                    </div>
                  </div>
                </div>

                {/* 롤링 한 줄 평 - 박스 하단 외부에 배치 */}
                {video.comments.length > 0 && (
                  <div className='px-2 py-0.5'>
                    <RollingComment comments={video.comments} />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {/* 로딩 표시 */}
      {loading && (
        <div className='flex justify-center py-6'>
          <div className='w-6 h-6 border-2 border-[#166534] border-t-transparent rounded-full animate-spin' />
        </div>
      )}
    </div>
  )
}
