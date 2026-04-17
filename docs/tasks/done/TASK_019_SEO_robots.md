# TASK_019: SEO - robots.txt 설정

> 상태: DONE

## 목표

`src/app/robots.ts`를 생성해 검색엔진 크롤러에게 허용/차단 경로와 사이트맵 위치를 알린다.

## 맥락

- Next.js 13+ App Router의 `MetadataRoute.Robots` 방식 사용
- `/admin` 경로는 크롤링 차단 필요
- sitemap.xml 위치 명시

## 완료 기준

- [ ] `src/app/robots.ts` 생성
- [ ] `/admin` Disallow 설정
- [ ] `sitemap` 필드에 `https://tedfi.app/sitemap.xml` 명시
- [ ] `https://tedfi.app/robots.txt` 접근 시 텍스트 반환 확인

## 구현 세부

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/auth/callback'],
      },
    ],
    sitemap: 'https://tedfi.app/sitemap.xml',
  }
}
```

## 제약

- 정적 파일(`public/robots.txt`) 방식 사용 금지 → Next.js 네이티브 방식만 사용
