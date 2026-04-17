# DONE

<!-- - YYYY-MM-DD TASK_XXX: [한 줄 요약] -->

- 2026-04-17 TASK_032: 카카오 인앱 브라우저 외부 오픈 — KakaoExternalBrowser 컴포넌트 신규 생성, layout.tsx body 래핑, kakaotalk://web/openExternal 딥링크로 Google OAuth 차단 우회
- 2026-04-17 TASK_031: 모바일 헤더 About·로그인 버튼 노출 — SiteHeader lg:hidden 래퍼 제거, 로그인/비로그인 모두 모바일 헤더에서 직접 노출
- 2026-04-17 TASK_030: 브랜드 에셋 및 스토리 적용 — `public/favi` 파일 루트 이동 및 메타데이터(favicon, manifest, apple-icon) 연동, `nail.png` 공용 OG 이미지 지정, `docs/INTEND.md` 기반 `/about` 브랜드 스토리 개편
- 2026-04-17 TASK_029: Step 3 학습지 인터랙티브 퀴즈 — 객관식(MCQ) 즉각 피드백(정오답 색상/아이콘) 및 해설 노출, 단답형(SA) 클릭 시 모범 답안 reveal, 인쇄 시 정적 레이아웃 유지 처리
- 2026-04-17 TASK_028: Archive 고도화 — 난이도 통계(평균 기반 라벨+평가인원), RollingComment 클라이언트 컴포넌트(4초 fade), 내 학습지 링크(user_uploads 조회)
- 2026-04-17 TASK_027: 대시보드 한 줄 평 노출 — history API daily_comment 포함, RecentList CommentToggle(line-clamp-1 클릭펼침)
- 2026-04-17 TASK_026: 완료 화면 난이도+한줄평 폼 — 쉬워요/할만해요/어려워요 칩 버튼, textarea 100자 제한, PATCH /api/progress, 로그인 사용자만 노출
- 2026-04-17 TASK_025: DB difficulty_rating 컬럼 추가 — 마이그레이션 SQL 생성, database.ts 타입 업데이트(daily_comment 포함), progress API PATCH 핸들러 추가
- 2026-04-17 TASK_024: 구문분석 koreanTranslation — SentenceAnalysis 타입 옵셔널 필드 추가, Gemini·Claude 프롬프트 갱신, SentenceCard 카드에 한국어 번역 표시
- 2026-04-17 TASK_023: Web Speech API — useSpeech 훅 생성, WorksheetRenderer 문단별 🔊 버튼, Step4 PhraseCard·SentenceCard 🔊 버튼 추가
- 2026-04-17 TASK_022: StepProgress 클릭 네비게이션 — 완료 스텝 클릭 시 router.push, useSearchParams로 date 파라미터 보존
- 2026-04-17 TASK_021: 메인 UI 조정 — 타이틀 text-2xl sm:text-[2.5rem] 반응형, 마이크로 카피 "5분짜리 TED-Ed 영상으로 가볍게 시작하는 영어 루틴" 추가
- 2026-04-17 TASK_020: GA4 연동 — @next/third-parties/google GoogleAnalytics 컴포넌트 layout.tsx 주입, NEXT_PUBLIC_GA_ID 환경변수 조건부 렌더링
- 2026-04-17 TASK_019: robots.txt — app/robots.ts 생성, /admin·/auth/callback Disallow, sitemap URL 명시
- 2026-04-17 TASK_018: 사이트맵 자동 생성 — app/sitemap.ts 생성, daily_videos 최근 30개 동적 URL 포함 (/study?date=YYYY-MM-DD)
- 2026-04-17 TASK_017: teding 리브랜딩(ted:ing 로고) + PLG 비로그인 전체 개방 + 전역 AuthModal(zustand) + StreakCard SVG Ring·픽셀식물 5단계 + 강화 랜딩·/about 신설 + DB raw_json·daily_comment 컬럼 추가

- 2026-04-16 Bug Fix: 비로그인 시 영상 미노출 해결 (By Gemini) — `createServiceClient`를 활용해 서버 컴포넌트(Home/Study)에서 RLS를 우회하여 공개 데이터(`daily_videos` 등) 패치 완료
- 2026-04-16 TASK_015: 헤더네비 및 About 추가 (By Gemini) — 상단/모바일 메뉴 순서 최적화 및 `About` 라우트(데스크톱/모바일) 연동 완료
- 2026-04-16 Bug Fix: `legacyBehavior` 지원 중단 경고 해결 (By Gemini) — `SiteNav.tsx`의 `NavigationMenuLink`를 Base UI `render` Prop 방식으로 리팩토링하여 Next.js 15+ 경고 제거 완료
- 2026-04-16 Bug Fix: Next.js Client/Server Component 경계 오류 해결 (By Gemini) — `SiteHeader` 서버 컴포넌트 내 `NavigationMenu` 충돌을 `SiteNav` 클라이언트 컴포넌트 분리로 해결 완료
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
