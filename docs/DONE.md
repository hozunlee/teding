# DONE

<!-- - YYYY-MM-DD TASK_XXX: [한 줄 요약] -->

- 2026-04-11 TASK_011: Admin 영상 등록 시 재생시간 자동 입력 — YouTube iframe API 숨김 플레이어로 getDuration() 호출, formatDuration() M:SS 포맷, @types/youtube 대신 최소 인터페이스 직접 선언
- 2026-04-11 TASK_010: Gemini 모델 gemini-2.5-flash-lite 교체, 프롬프트 영어 강제(⚠️ CRITICAL), learning_materials upsert RLS 우회(createServiceClient), WorksheetRenderer Answer Key PDF 마지막 페이지 포함(print:block + break-before-page), globals.css print visibility 트릭으로 worksheet만 인쇄 출력
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
