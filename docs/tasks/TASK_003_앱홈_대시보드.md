# TASK_003: 앱 홈 (대시보드) 및 스트릭 로직

> 상태: TODO

## 목표

- 접속 후 최우선적으로 리다이렉트되는 앱 홈(`/home`)을 구현하고 스트릭(Streak)을 표시.

## 맥락

- **현재 상황:** 사용자 인증 후 진입할 메인 페이지 부재
- **연관 파일:**
    - `src/app/home/page.tsx`
    - `src/components/home/DailyVideoBanner.tsx`
    - `src/components/home/StreakCard.tsx`
    - `src/app/api/streak/route.ts`

## 완료 기준

- [ ] SSR 환경에서 `/api/today` 정보를 패치하여 오늘의 영상 썸네일과 정보를 렌더링하는가
- [ ] 현재 로그인한 유저의 스트릭(Streak) 정보를 바탕으로 이번 주 스탬프를 UI에 노출하는가
- [ ] "학습 시작" 버튼 클릭 시 정확히 `/study?step=1` (혹은 기존 진행된 스텝)으로 이동하는가

## 제약

- Empty State 핸들링 (오늘의 영상이 없을 경우 메시지 표시)
- Together AI 디자인 시스템의 카드 및 폰트 `.text-mono-label` 적용
