# TASK_013: Hydration 에러 해결 및 라우팅 구조 개편

## 개요
- 브라우저 확장 프로그램에 의한 Hydration Mismatch 경고 해결.
- 오늘의 큐레이션 화면을 루트(`/`)로 이동하고 비로그인 접근 허용.
- 기존 랜딩 페이지를 `/about` 페이지로 통합.

## 수행 내역
1.  **Hydration Fix**: `src/app/layout.tsx`의 `<body>` 태그에 `suppressHydrationWarning` 추가.
2.  **라우팅 구조 개편**:
    - `src/app/(main)` Route Group 생성.
    - `src/app/home/page.tsx` (큐레이션) ➡️ `src/app/(main)/page.tsx`.
    - `src/app/home/layout.tsx` ➡️ `src/app/(main)/layout.tsx` (AuthGuard 제거).
    - `src/app/about`, `src/app/archive`, `src/app/guide`, `src/app/study` 를 `src/app/(main)/` 하위로 이동.
    - `src/app/study/layout.tsx` 제거 (공통 레이아웃 사용).
    - 기존 `src/app/page.tsx` (랜딩) 를 `src/app/about/page.tsx` 에 통합.
3.  **링크 업데이트**: `/home` ➡️ `/` 변경 완료.

## 최종 확인 사항
- [x] `suppressHydrationWarning` 적용 완료.
- [x] `/` (루트) 에서 '오늘의 큐레이션' 정상 출력 및 비로그인 접근 확인.
- [x] `/about` 에 기존 랜딩 로고 및 콘텐츠 통합 완료.
- [x] 모든 내부 링크 `/home` ➡️ `/` 교체 완료.
- [x] `AuthGuard` 제거로 인한 비로그인 학습 경험 최적화.


## 검증 결과
- `/` 접속 시 오늘의 큐레이션 표시 확인.
- `/about` 접속 시 로고 및 소개글 표시 확인.
- 브라우저 콘솔 경고 감소 확인.
