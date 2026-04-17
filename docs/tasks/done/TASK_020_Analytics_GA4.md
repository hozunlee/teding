# TASK_020: Analytics - GA4 연동

> 상태: DONE

## 목표

Google Analytics 4를 Next.js 공식 패키지 `@next/third-parties`를 통해 주입해 페이지뷰·이벤트 추적 활성화.

## 맥락

- `@next/third-parties/google`의 `GoogleAnalytics` 컴포넌트 사용
- `src/app/layout.tsx` 루트 레이아웃에 추가
- 환경변수로 GA Measurement ID 관리

## 완료 기준

- [ ] `pnpm add @next/third-parties` 설치
- [ ] `.env.local`에 `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` 추가
- [ ] `src/app/layout.tsx`에 `<GoogleAnalytics gaId={...}/>` 주입
- [ ] 프로덕션 빌드 후 GA 실시간 보고서에서 페이지뷰 확인

## 구현 세부

```typescript
// src/app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}
```

## 환경변수

```bash
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # GA4 Measurement ID (관리 > 데이터 스트림)
```

## 제약

- `NEXT_PUBLIC_GA_ID` 미설정 시 스크립트 미주입 (개발 환경 오염 방지)
- `strategy="afterInteractive"` 기본값 유지 (Next.js Script 최적화 자동 적용)
