# TASK_009: 홈 화면(Home) UI/UX 가이드 적용

> 상태: DONE

## 목표
- `docs/UI_UX_GUIDE.md` (4-2. 앱 홈 명세) 및 `DESIGN.md`를 바탕으로 `/home` 페이지와 하위 컴포넌트를 정확하게 구현한다.

## 완료 기준
- [x] `src/app/home/page.tsx` 레이아웃 개편: 가이드 명세에 따른 세로 배치 및 타이포그래피 적용
- [x] `DailyVideoBanner.tsx` 리팩토링: 좌측 썸네일, 우측 정보 레이아웃 및 디자인 시스템 적용
- [x] `StreakCard.tsx` 리팩토링: "내 스트릭"과 "이번 주 학습" 시각적 분리 및 대형 숫자 스탯 적용
- [x] 공통 스타일 적용: `text-mono-label`, `shadow-elegant` 및 `The Future` 폰트 스타일링 반영

## 제약
- 둥근(Rounded) 모서리를 과도하게 사용하지 않고 4px, 8px 위주로 사용
- 색상은 가이드에 명시된 시스템 변수를 활용
