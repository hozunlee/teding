# TASK_018: SEO - 사이트맵 자동 생성

> 상태: DONE

## 목표

`src/app/sitemap.ts`를 생성해 Google 등 검색엔진이 Teding의 모든 공개 페이지를 크롤할 수 있도록 동적 사이트맵 제공.

## 맥락

- Next.js 13+ App Router의 `MetadataRoute.Sitemap` 방식 사용
- Supabase `daily_videos` 테이블에서 과거 영상 날짜를 조회해 동적 URL 생성
- 정적 페이지 + 동적 study URL 포함

## 완료 기준

- [ ] `src/app/sitemap.ts` 생성
- [ ] 정적 URL 포함: `/`, `/about`, `/guide`, `/archive`
- [ ] 동적 URL 포함: `/study?date=YYYY-MM-DD` (최근 30개 daily_videos)
- [ ] `https://tedfi.app/sitemap.xml` 접근 시 XML 반환 확인

## 구현 세부

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { createServiceClient } from '@/lib/supabase/server' // 서비스 클라이언트

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServiceClient()
  const { data: videos } = await supabase
    .from('daily_videos')
    .select('date')
    .order('date', { ascending: false })
    .limit(30)

  const staticPages = ['/', '/about', '/guide', '/archive'].map(path => ({
    url: `https://tedfi.app${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: path === '/' ? 1 : 0.8,
  }))

  const videoPages = (videos ?? []).map(v => ({
    url: `https://tedfi.app/study?date=${v.date}`,
    lastModified: new Date(v.date),
    changeFrequency: 'never' as const,
    priority: 0.6,
  }))

  return [...staticPages, ...videoPages]
}
```

## 제약

- 서비스 클라이언트 사용 (RLS 우회, 공개 날짜 데이터만 조회)
- `NEXT_PUBLIC_APP_URL` 환경변수 대신 하드코딩 가능 (`https://tedfi.app`)
