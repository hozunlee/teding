# TASK_017: teding 프로덕트 v2 — 리브랜딩 + PLG + StreakCard 개편

> 상태: DONE

## 목표

- ted-fi → teding(테딩) 리브랜딩 전반 적용
- 비로그인 유저에게 전체 학습 플로우 개방 (PLG 전략)
- 전역 AuthModal(zustand) 도입 및 로그인 유도 시점 연결
- StreakCard SVG Ring + 픽셀 식물 5단계 UI 구현
- 강화 랜딩 + /about 소개 페이지 신설
- DB 스키마 확장 (raw_json, daily_comment)

## 맥락

- **현재 상황:** 완료. typecheck·lint 에러 0.
- **연관 파일:**
    - `src/app/layout.tsx` — metadata, AuthModal 마운트
    - `src/app/page.tsx` — 강화 랜딩 페이지
    - `src/app/about/page.tsx` — 신규 소개 페이지
    - `src/app/home/page.tsx` — 비로그인 null 처리
    - `src/app/study/page.tsx` — auth redirect 제거
    - `src/app/study/complete/page.tsx` — 비로그인 AuthModal 호출
    - `src/middleware.ts` — /admin만 보호
    - `src/components/layout/tedingLogo.tsx` — ted:ing 깜빡임 로고
    - `src/components/layout/TopNav.tsx` — 로고 교체, 비로그인 nav
    - `src/components/home/StreakCard.tsx` — Ring + 픽셀 식물
    - `src/components/home/RecentList.tsx` — 비로그인 AuthModal 유도
    - `src/components/steps/Step4Phrases.tsx` — 완료 시 AuthModal
    - `src/components/auth/AuthModal.tsx` — 신규 전역 모달
    - `src/lib/store/auth-modal.ts` — zustand 스토어
    - `src/app/api/history/route.ts` — loggedIn 필드 추가
    - `src/app/globals.css` — @keyframes logo-blink, .logo-colon
    - `docs/migrations/001_product_v2.sql` — DB 마이그레이션

## 완료 기준

- [x] 로고 `ted:ing` `:` 깜빡임 적용
- [x] 비로그인으로 `/home`, `/study` 접근 가능
- [x] Step4 완료 버튼 비로그인 시 AuthModal 팝업
- [x] `/study/complete` 비로그인 진입 시 AuthModal 팝업
- [x] RecentList 비로그인 시 로그인 유도 버튼
- [x] StreakCard Ring + 픽셀 식물 5단계 렌더링
- [x] 강화 랜딩(`/`) + 소개(`/about`) 페이지 구현
- [x] DB: `learning_materials.raw_json`, `user_progress.daily_comment` 컬럼 추가
- [x] `pnpm typecheck` 에러 0
- [x] `pnpm lint` 에러 0

## 제약

- 픽셀 식물은 외부 이미지 파일 사용 금지 — SVG crispEdges rect만 사용
- AuthModal은 zustand 전역 스토어로만 호출 (`useAuthModal().open()`)
- 스텝 상태는 URL SearchParams로만 관리
