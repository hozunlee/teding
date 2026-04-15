# TASK_012: 모바일 UI/UX 및 반응형 개선

> 상태: DONE

## 목표

- 모바일(S25 등) 환경에서 단어장 가독성을 높이기 위해 레이아웃을 1열로 변경.
- 모바일에서 사용성이 떨어지는 하단 네비게이션(BottomTabBar)을 상단 헤더의 햄버거 메뉴(반투명 드로어)로 교체.

## 완료 결과

### 1. Step 3 단어장(Part 2) 반응형 수정

- **파일:** `src/components/worksheet/WorksheetRenderer.tsx`
- **변경 사항:** `grid-cols-2` -> `grid-cols-1 md:grid-cols-2`로 변경하여 모바일 1열, 태블릿 이상 2열 적용 완료.

### 2. 모바일 네비게이션 개편 (하단 바 → 상단 햄버거 메뉴)

- **BottomTabBar 제거:** 모든 레이아웃(`home`, `study`, `archive`, `guide`)에서 하단 네비게이션 제거 및 불필요한 하단 패딩(`pb-16`) 정리.
- **상단 헤더(Top Nav) 개편:**
    - `TopNav`가 이제 모바일에서도 보이며(`sticky top-0`), 왼쪽에 로고, 오른쪽에 햄버거 메뉴 배치.
    - `MobileMenu` 컴포넌트 신설: `shadcn/ui`의 `Sheet` 컴포넌트를 사용하여 화면의 60%를 차지하는 프리미엄 슬라이드 메뉴 구현.
    - 메뉴 배경에 `backdrop-blur-md`와 반투명 효과를 적용하여 사용자 집중도 향상.

### 3. 기술적 해결 사항

- `base-ui`를 사용하는 `Sheet` 컴포넌트의 특성에 맞춰 `SheetTrigger`에 `render` prop을 사용하여 타입 에러 해결 및 정상 동작 확인.
