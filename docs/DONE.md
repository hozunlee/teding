# DONE

<!-- - YYYY-MM-DD TASK_XXX: [한 줄 요약] -->

- 2026-04-16 Bug Fix: Next.js Client/Server Component 경계 오류 해결 (By Gemini) — `SiteHeader` 서버 컴포넌트 내에 있던 `shadcn`의 NavigationMenu(클라이언트 컴포넌트)를 `SiteNav`로 완전히 분리해 `legacyBehavior` 및 Next.js 충돌 이슈 해결 완료

- 2026-04-16 TASK_014~016: 모바일 반응형 및 레이아웃 분리 리팩토링 (By Gemini) — TopNav/Sidebar를 반응형 단일 Header(Sheet 햄버거 결합)로 통합 및 /study Route Group 별도 격리 적용 완료

- 2026-04-16 TASK_013: 버그 수정 (By Gemini) — 보고또보고(Archive) 메뉴에서 단계 전환 시 date 파라미터 유실 현상 수정 (Step 1~5 useSearchParams 연동) 완료
- 2026-04-11 TASK_010: 학습 경험 고도화 (By Gemini) — 지문 내 핵심표현/구문 하이라이트 매칭률 100% 보장(Passage-First 전략), 반응형 상세보기(Popover/Drawer), 단어장 클릭/호버 블러 해제 기능 적용 완료
- 2026-04-12 TASK_012: 모바일 UI/UX 및 반응형 개선 (By Gemini) — 하단 네비게이션 바 제거 및 상단 햄버거 메뉴(Sheet) 도입, Step 3 단어장 모바일 1열 레이아웃 최적화 완료
- 2026-04-11 TASK_011: 학습 완료 화면(Complete) 리뉴얼 및 이력 연동 — 대형 체크 애니메이션, 학습 통계, 최근 학습 이력(RecentList) 실제 데이터 연동 완료
- 2026-04-11 TASK_009: 홈 화면(Home) UI/UX 리뉴얼 — UI_UX_GUIDE.md 4-2 명세 기반 레이아웃 개편 및 디자인 시스템 전면 적용 완료
- 2026-04-11 TASK_008: Step 3 학습지 UI 리뉴얼 — worksheet_guide.html 사양 이식 및 자동 폴링 로딩 UI 구현 완료
- 2026-04-11 TASK_007: QA 버그 수정 — /home SSR 에러 해결, Admin 제목 자동 바인딩, 스크립트 문단화, Gemini 1.5-lite 강제 및 예외 처리 강화 완료
- 2026-04-09 TASK_001: Google OAuth 연동 + auth/callback 리다이렉션 + 사이드바 로그아웃 + AuthGuard 보호 완료
- 2026-04-09 Design_System: Together AI 디자인(Aerocano) 토큰 적용 및 LandingHero/Base 컴포넌트 리팩토링 완료
- 2026-04-05 Phase1_Step0: Next.js 16.2.2 + pnpm 프로젝트 생성, @supabase/ssr · @google/generative-ai · @anthropic-ai/sdk 설치, shadcn/ui 초기화
- 2026-04-05 Phase1_Task1: Supabase Auth 설정 — getSupabaseBrowser() 싱글턴, createClient() 서버용, middleware matcher, /auth/callback, GoogleSignInButton, AuthGuard
- 2026-04-05 Phase1_Task2: 레이아웃 + 네비게이션 — globals.css CSS 변수(@media print 포함), TopNav/BottomTabBar/Sidebar, home·study·guide layout.tsx
- 2026-04-05 Phase1_Task3: 랜딩 페이지 — page.tsx 로그인 시 /home 리다이렉트, LandingHero(배지·4단계카드·CTA)
- 2026-04-05 Phase1_Types: database.ts(PRD 스키마 수동정의) + worksheet.ts(LearningMaterials·Phrase·SentenceAnalysis) 타입 파일 작성, typecheck·lint 통과
- 2026-04-06 Debug_Env: Next.js 16 규칙에 따른 proxy.ts 마이그레이션 및 Supabase 환경변수 ANON_KEY -> PUBLISHABLE_KEY 일괄 갱신
- 2026-04-09 TASK_002: 데이터 파이프라인 — lib/{transcript,gemini,claude}.ts + api/{today,transcript,generate,materials,progress,upload,streak,admin/daily} 9개 라우트 구현
- 2026-04-09 TASK_003: 홈 대시보드 — DailyVideoBanner·StreakCard 컴포넌트 + home/page.tsx SSR 데이터 패치
- 2026-04-09 TASK_004: Step1·2 — StepProgress·Step1Player(YouTube cc_load_policy=0)·Step2Script(배경 generate 트리거) + study/page.tsx URL step SSoT
- 2026-04-09 TASK_005: Step3 학습지 — WorksheetRenderer(골드 이중선·5파트)·PDFDownloadButton(window.print)·UploadAnnotated(Supabase Storage)
- 2026-04-09 TASK_006: Step4·완료 — Step4Phrases(탭: 핵심표현/구문분석·알았어요 체크)·study/complete/page.tsx(Web Share API 공유)

- 2026-04-16 TASK_014: Hydration 에러 해결, 라우팅 구조 개편(홈 이동), 새벽 3시 오프셋 적용 및 디자인 시스템(Together AI) 반영 완료 (최근학습기록 디버깅 중)
