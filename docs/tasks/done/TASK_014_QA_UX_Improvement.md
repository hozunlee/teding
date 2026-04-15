# TASK_014: QA 및 사용자 경험(UX) 고도화

> 상태: TODO

## 목표

- 로그인 전후 사용자 경험을 개선하고, 보고된 QA 이슈들을 해결하며 디자인 시스템을 고도화한다.

## 맥락

- **현재 상황:** 라우팅 구조 개편 후 로그인 전 상태의 UI 처리가 미흡하며, 디자인 시스템(Together AI 스타일) 반영이 필요함.
- **연관 파일:**
    - `src/components/layout/TopNav.tsx`
    - `src/components/layout/Sidebar.tsx`
    - `src/components/auth/AuthModal.tsx`
    - `src/app/(main)/page.tsx`
    - `src/app/(main)/about/page.tsx`

## 완료 기준

- [ ] **헤더 개선**: 로그인/로그아웃 버튼을 헤더 우측 끝으로 이동.
- [ ] **사이드바 수정**: 비로그인 시 로그아웃 버튼 제거.
- [ ] **아카이브 보호**: 비로그인 시 '보고또보고' 메뉴 회색 처리 및 클릭 시 로그인 유도 모달 노출.
- [ ] **디자인 고도화**: `AuthModal`을 `@DESIGN.md` 기준(파스텔 그라데이션, 정교한 타이포그래피)으로 개선.
- [ ] **큐레이션 노출**: 오늘의 영상이 정상적으로 표시되도록 데이터 로직 점검.
- [ ] **About 페이지 레이아웃**: 사이드바/헤더 중첩 문제 해결 (전체 레이아웃과의 조화).

## 제약

- `@DESIGN.md`의 Together AI 스타일 가이드(색상, 폰트, 자간 등) 준수.
- `getSupabaseBrowser()` 싱글턴 사용.
- 비로그인 사용자의 접근성을 유지하되, 개인화 기능만 적절히 제한.
