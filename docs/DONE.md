# DONE

- 2026-05-20 학습 완료 후 학습 페이지 재진입 및 자유 이동 지원:
    - 학습을 완료한 콘텐츠에 다시 접근 시 `/study/complete`로 튕기지 않고 `step=4`로 진입하도록 개선.
    - 복습 시 모든 단계로 자유롭게 이동할 수 있도록 `StepProgress` 컴포넌트의 클릭 제한 로직 우회 구현.
    - 복습 중 완료 버튼 클릭 시 데이터베이스 중복 갱신을 방지하기 위해 `/api/progress` 및 `/api/streak` API 호출을 건너뛰고 단순 경로 이동만 하도록 각 단계 컴포넌트(Step1Player, Step3Worksheet, Step4Phrases, Step5Rewatch) 보완 완료.

- 2026-05-20 이번 주 학습 현황판 겨울나무 스탬프 비주얼 리팩토링:
    - `src/components/home/streak/Icons.tsx`의 `SeasonIcon` 컴포넌트 내 겨울나무(`winter`)를 소복하게 눈이 내려앉은 풍성한 설목(Snow Tree) 픽셀 아트로 새로 디자인하여 다른 계절의 나무 스탬프들과의 부조화를 해결.

- 2026-05-20 프리미엄 스트릭 시뮬레이터 및 나무 성장 비주얼 고도화:
    - `src/components/home/streak/TreeIcons.tsx` 내 모든 성장 상태 아이콘의 `viewBox`를 `0 0 180 180`으로 일체화하고 크기 및 위치 중앙 정렬.
    - `RingGauge.tsx`에 `TreeRenderer` 및 겨울철 흰 배경에서의 시각성 확보를 위한 계절별(봄/여름/가을/겨울) HSL 파스텔톤 그라데이션 서클 배경판 적용.
    - `StreakCard.tsx`의 이번 주 학습 현황판 스탬프(나무 아이콘) 크기를 월요일부터 일요일까지 점진적으로 스케일링하는 트랜지션 적용.
    - 신규 개발용 라우트 `/streak-test`에 실시간 슬라이더 및 입력 상자를 결합한 스트릭 가시성 테스트 시뮬레이터 페이지 구현 완료.
    - `TedingLogo.tsx` 컴포넌트 함수명 및 import 대소문자 매칭 충돌을 바로잡아 `pnpm typecheck` 및 `pnpm lint` 100% 무오류 빌드 패스 달성.

- 2026-05-20 영상 정보 자동 추출 및 daily_videos 스키마 보완:
    - `src/lib/youtube-server.ts`: 서버 사이드에서 유튜브 제목(oEmbed) 및 재생시간(HTML 파싱)을 자동 추출하는 유틸리티 신규 구현.
    - `/api/request-study`: 영상 조르기 시점에 서버에서 메타데이터를 즉시 추출하여 `video_requests` 테이블(`video_title`, `video_duration`)에 저장하도록 개선. 어드민 가시성 확보.
    - `src/lib/admin-daily.ts` & `/api/admin/daily`: `daily_videos` 테이블에 `video_url` 필드를 저장하도록 로직 확장 및 관리자 API 반영.
    - 관리자 UI 연동: `AdminVideoTab` 및 `AdminRequestsTab`에서 영상 등록 시 원본 URL이 `daily_videos.video_url`에 기록되도록 훅(`useAdminVideos`, `useVideoRegister`) 및 컴포넌트 수정 완료.
    - AI 생성 품질 향상: `Gemini` 및 `Claude` 생성 프롬프트에 `Video Title` 컨텍스트를 주입하여 영상 주제에 부합하는 정교한 학습지 생성이 가능하도록 최적화 완료.

- 2026-05-20 가이드 페이지 스트릭 안내 고도화 및 컴파일 에러 해결:
    - `src/app/(main)/guide/page.tsx` 의 스트릭 안내 카드들을 새벽 3시 리셋 오프셋, 4단계 중 1단계 이상 완료(과거 영상 복습 인정), 주말 유동성(토·일 중 하루 완료 시 보정) 상세 예시를 담아 직관적으로 개편 완료.
    - `src/app/api/generate/route.ts` 에서 `generateWithFallback` 호출 시 `title` 인자 누락 컴파일 에러를 `daily_videos` 테이블 조회 로직을 적용하여 완벽하게 해소.
    - `pnpm typecheck` 및 `pnpm lint` 툴을 사용해 빌드 및 코드 품질 안전성 최종 검증 완료 (0 error, 0 warning).

- 2026-05-20 docs/streak-rule.md 신규 생성:
    - 스트릭 시스템의 KST 3시간 오프셋 계산 공식 명세화.
    - 공휴일 보너스 및 주말 유동성(토/일 결석 시 조건부 유지) 규칙 정리 완료.

- 2026-05-20 주간 학습 현황 스탬프 부조화 해결 및 쿼리 성능 최적화:
    - 1개 비디오 분할 학습(어제 step1~2, 오늘 step3~4) 시 날짜 타일 스탬프 누락 문제를 해결하기 위해 `user_progress`의 `stepX_completed_at` 타임스탬프를 수집/파싱하도록 변경(방안 A).
    - 대시보드 로드 시 `user_progress` 전체 스캔을 방지하고자 최근 14일(`lastMondayStr`) 데이터로만 범위를 한정하여 DB 쿼리 성능 최적화.
    - 관련 `weeklyHolidayMap` eslint `prefer-const` 에러 및 타 파일들의 `set-state-in-effect`, 미사용 임포트 경고 등을 해결하여 `pnpm lint` 패스 보장.

- 2026-05-11 어드민 요청 탭 등록 버튼 수정 + LLM 로직 리팩토링:
    - `useVideoRegister` 훅 신규 생성 (`src/hooks/useVideoRegister.ts`): `POST /api/admin/daily` wrapping, 영상 탭과 동일한 엔드포인트 재사용.
    - `AdminRequestsTab.tsx`: 등록 흐름을 `POST /api/admin/daily` (LLM) → `PATCH /api/admin/requests/{id}` (상태 업데이트) 2단계로 분리. 결과 피드백에 스크립트/학습자료 캐시 여부 표시.
    - `api/admin/requests/[id]/route.ts`: `schedule` action에서 `registerDailyVideo()` 및 oEmbed fetch 제거, 상태 업데이트만 수행.

- 2026-05-11 Supabase 마이그레이션 완료: `feedback`, `feedback_comments` 테이블 생성 및 RLS 정책 적용.

- 2026-05-11 의견 보내기 게시판 + FSD-lite 구조 도입:
    - `feedback`, `feedback_comments` 테이블 스키마 정의 (database.ts 수동 추가, Supabase 마이그레이션 별도 필요).
    - FSD-lite 폴더 구조 신설: `src/features/`, `src/widgets/`, `src/hooks/`.
    - 신규 API: `POST /api/feedback` (사용자 제출), `GET /api/admin/feedback` (목록), `GET /api/admin/feedback/[id]` (상세), `POST /api/admin/feedback/[id]/comment` (어드민 댓글).
    - 사용자 페이지: `/(main)/feedback` — 제목+본문 제출 폼, 제출 후 인라인 성공 메시지.
    - 어드민 페이지: `/admin` 피드백 탭 추가 (번호+제목+날짜 테이블), `/admin/feedback/[id]` 상세 (작성자 닉네임+이메일, 본문, 반영 결과 댓글 입력).
    - SiteNav(데스크톱) + MobileNav(햄버거) 에 "의견 보내기" 링크 추가 (로그인 필요).

- 2026-05-04 StreakCard UI 컴포넌트 리팩토링:
    - 1000줄이 넘는 monolithic StreakCard.tsx 컴포넌트를 utils.ts, Icons.tsx, TreeIcons.tsx, RingGauge.tsx 로 분할 및 모듈화 완료.

- 2026-05-11 영상 조르기 프로세스 개선:
    - 사용자 브라우저에서 외부 API 호출(YouTube oEmbed, iframe_api) 제거. URL + 메시지만 제출, title/duration은 DB에 저장하지 않음.
    - 어드민 schedule 시 서버에서 YouTube oEmbed로 타이틀 가져온 후 `registerDailyVideo` 호출하도록 변경.
    - 역할 분리 완료: 사용자 = URL 전달, 어드민 = 스크립트 추출 + LLM 생성 트리거.

- 2026-05-04 영상 조르기 기능 추가:
    - `longest_streak >= 5` 달성 유저에게만 `/request-study` 페이지 접근 허용. 미달성 시 잠금 화면 + 진행 바 표시.
    - SiteNav(데스크톱), MobileNav(모바일 햄버거) 에 "영상 조르기" 메뉴 추가. 잠금 상태일 때 `opacity-50` + hover 툴팁 "5일 이상이면 열려요!" 표시.
    - 요청 폼: YouTube URL 입력 → 썸네일·제목·재생시간 자동 완성(oEmbed + YT IFrame API). 추천 이유(선택) textarea. 유저당 pending 요청 1개 제한(DB unique index).
    - 신규 API: `POST /api/request-study`, `GET /api/admin/requests`, `PATCH /api/admin/requests/[id]`, `GET /api/admin/schedule-map`.
    - `src/lib/admin-daily.ts` 추출: daily 등록 핵심 로직(daily_videos upsert + transcript + learning_materials) 분리하여 `/api/admin/daily`·`/api/admin/requests/[id]` 양쪽에서 재사용.
    - 어드민 페이지 `requests` 탭 추가: date-fns 기반 인라인 달력(등록된 날 주황 dot), 요청 카드(썸네일·닉네임·메시지), 날짜 선택 후 "등록" 또는 "거절" 처리.
    - 메인 화면 배너: 오늘 날짜가 scheduled 요청과 일치하면 "OO님이 추천한 오늘의 영상입니다. 같이 공부해봐요!" 배너 표시.
    - DB: `video_requests` 테이블 신규 생성 (Supabase SQL Editor에서 수동 마이그레이션 필요).

- 2026-05-02 어드민 페이지 리팩토링: 단일 파일 700줄 코드를 `_components`, `_hooks`, `_lib` 디렉토리로 관심사 분리 및 모듈화 완료.

- 2026-05-02 어드민 페이지 개선:
    - 영상/공휴일 카테고리 탭 분리.
    - 영상 탭: 오늘·내일 현황 카드에 등록 여부에 따라 변경 버튼 조건부 노출. 둘 다 등록 시 폼 숨김, 미등록 날짜 있을 때만 폼 노출. 변경 모드 취소 기능 추가.
    - 공휴일 탭: 한국천문연구원 API 연동 (`/api/admin/holidays`), `revalidate: 86400` 캐싱, 연·월 선택 후 공휴일 목록 조회.

- 2026-05-02 TASK_029: 스트릭 휴일/주말 보너스 정책 도입:
    - 공휴일 미학습 시 스트릭 유지 로직 적용.
    - 주말 2일 중 1일만 학습해도 스트릭 유지 유동성 부여.
    - 보너스일(공휴일/유효한 주말 결석)에 주간 학습 현황에 레트로 마리오 코인 아이콘 노출.
    - `src/lib/utills/holiday.ts` 개편 및 API 최적화.

- 2026-05-02 Bug Fix: 이번주 학습현황 및 최근 학습 기록 정렬 버그 수정:
    - `progress/route.ts`: step=1은 upsert(date 설정), step=2/3/4는 `.update()`로 분리하여 날짜 덮어쓰기 방지. step1 완료 시점의 날짜가 이후 스텝 완료 시 변경되지 않음.
    - `history/route.ts`: map 후 실제 영상 날짜(`daily_videos.date`) 기준으로 JS re-sort 추가하여 정렬 안정화.

- 2026-04-27 Archive 버그 수정 및 UI 조정:
    - 타인 코멘트 미노출 해결: `user_progress` 조회 시 Supabase RLS 우회를 위해 `createServiceClient`(Service Role) 적용
    - 본인 코멘트 UI 변경: 색상 강조 제거 및 아이콘 차별화 (본인 코멘트는 👤, 타인 코멘트는 💬 표시)

- 2026-04-27 Archive 확장 및 Urban Botanical UI 적용:
    - `archive_videos_view` 생성: `daily_videos`와 `user_progress`를 조인하여 완료 인원 및 평균 난이도를 집계하는 DB 뷰 도입
    - `/api/archive`: 10개 단위 페이지네이션, 카테고리 필터링, 그리고 미래 날짜 영상 노출 방지(`lte` 필터) 로직 구현
    - `ArchiveClient.tsx`: `IntersectionObserver` 기반 네이티브 무한 스크롤 및 `Urban Botanical` 컨셉의 UI 전면 개편
    - 디자인 고도화: `Growth Green` 계열 색상 적용, YouTube 썸네일(16:9) 및 호버 애니메이션 도입, `next/image` 성능 최적화(`sizes` 적용)
    - `next.config.ts`: `img.youtube.com` 외부 이미지 허용 설정 추가

- 2026-04-27 학습 경험 및 데이터 무결성 고도화:
    - `getKSTDate` 리팩토링: 서버 환경(UTC)에 관계없이 새벽 3시 오프셋이 적용된 KST 날짜를 수동 포맷팅 방식으로 정확히 생성하도록 수정 (자정 이후 학습 시 날짜 어긋남 방지)
    - `api/progress` & `api/history`: 학습 기록 저장 시 영상 날짜가 아닌 '학습 시점의 논리적 날짜'를 사용하고, 링크 생성 시에는 '영상의 실제 날짜'를 사용하여 과거 영상 복습 시 링크 깨짐 현상 해결
    - `RecentList.tsx`: 학습 기록 라벨 표시 로직 수정 (마지막 완료 단계 -> 현재 진행 단계)으로 사용자 혼선 해결 및 Step 4 완료 저장 로직(`Step5Rewatch.tsx`) 추가
    - 홈 화면(`page.tsx`): 오늘의 학습 완료 시 맞춤형 환영 메시지("오늘의 학습을 완료하셨네요!") 및 복습 제안 문구 추가
    - 보고또보고(`ArchivePage`): 롤링 한 줄 평에 내 코멘트도 포함(👤 아이콘 구분)하여 노출되도록 개선

- 2026-04-27 학습 단계 네비게이션 및 Step 4 저장 버그 수정:
    - `RecentList.tsx`: 학습 기록 라벨 표시 로직 수정 (마지막 완료 단계 -> 현재 진행 단계)으로 사용자 혼선 해결
    - `Step5Rewatch.tsx`: Step 4(재시청) 완료 시 DB 진행 상황(`step: 4`) 저장 로직 추가
    - `RecentList.tsx`: 스텝 재배치에 따른 1단계 오프셋 및 링크 불일치 현상 수정

- 2026-04-27 앱 전환 작업 최소 롤백 및 웹 개발 환경 정상화:
    - `next.config.ts`: 개발 환경(`process.env.NODE_ENV !== 'production'`)에서 Serwist(PWA) 비활성화 및 `--webpack` 모드 수동 전환 설정으로 Turbopack 충돌 해결
    - `package.json`: `dev` 스크립트에 `--webpack` 플래그 추가
    - `src/lib/api-client.ts` & `src/lib/supabase/client.ts`: SSR 단계에서 크래시를 유발하는 Capacitor 및 Preferences 의존성 제거, 순수 웹 로직으로 복구
    - `src/lib/offline-queue.ts` & `src/lib/notifications.ts`: 네이티브 전용 Capacitor 모듈 참조 제거 및 웹 환경 대응 더미/간소화 로직 적용
    - 앱 전용 컴포넌트(`NetworkSync`, `DeepLinkHandler`, `NotificationOnboarding`) 및 `AdminNativeGuard` 무효화로 런타임 오류 차단

- 2026-04-27 앱 패키징 build:app 빌드 수정 작업 (중단 및 롤백):
    - TASK 11 완료: `capacitor-assets generate --android` sharp 바이너리 문제 해결 → 87개 아이콘/스플래시 에셋 생성
        - 원인: pnpm v10 기본값이 install scripts 실행 안 함
        - 조치: `package.json`에 `pnpm.onlyBuiltDependencies: ["sharp"]`, `pnpm.overrides: {"sharp": "0.33.0"}` 추가 (0.33.x는 @img/sharp-darwin-arm64 prebuilt 사용)
    - `next.config.ts` 수정: serwist 래퍼를 앱 빌드 시 완전 우회 (`isAppBuild ? nextConfig : withSerwist(nextConfig)`)
        - 원인: `disable: isAppBuild` 옵션만으로는 Turbopack과 webpack 플러그인 충돌 미해결
    - `admin/layout.tsx` 수정: 서버 컴포넌트로 전환 + `AdminNativeGuard` 클라이언트 컴포넌트 분리
        - 원인: `'use client'` 레이아웃이 `next/headers`를 사용하는 `SiteHeader`를 import해 서버/클라이언트 경계 위반
    - API Route 12개 전체에 `export const dynamic = 'force-dynamic'` 추가
    - `robots.ts`, `sitemap.ts`에 `export const dynamic = 'force-static'` 추가, sitemap DB 호출 try-catch 감싸기
    - **현재 블로커**: Next.js 16.2.2 기본 번들러가 Turbopack으로 변경됨
        - Turbopack은 `output: 'export'` + `force-dynamic` 조합을 하드 에러로 거부 (webpack은 API Route 자동 제외)
        - `NEXT_TURBOPACK=0`, `--no-turbo` 플래그 모두 미작동 확인
        - 해결 방향 결정 필요: (A) Turbopack 비활성화 방법 탐색 vs (B) Capacitor Remote URL 모드 전환 (`output: 'export'` 제거)

- 2026-04-26 앱 패키징 Phase1 (TASK 1~10, 12, 14): Supabase 인증 이원화(api-auth.ts + 8개 API Route), Capacitor 네이티브 분기(client.ts), apiFetch 래퍼(21개 호출 치환), CORS 이중 방어(next.config.ts headers + proxy.ts Preflight), Admin 네이티브 차단, 빌드 스크립트(build:app/sync:app), Capacitor 초기화 + Android 플랫폼 추가, Local Notifications(notifications.ts + NotificationSettings + NotificationOnboarding), Offline Queue(offline-queue.ts + NetworkSync), OAuth 딥링크(DeepLinkHandler), 개인정보처리방침(/privacy), 동적 라우트 규약 + CI 검사 스크립트 완료

- 2026-04-23 Bug Fix: RecentList step 이동 오류·Step4 구문분석 모바일 UI 겹침·카카오톡 공유 한줄평+영상제목 포함·Step4 핵심표현 탭 하단 "구문 분석 추가학습 →" 버튼 추가(구문분석 탭에선 학습완료만 노출) 완료
- 2026-04-20 TASK_036: 스트릭 식물 시스템 고도화 및 요일 버그 수정 — 레트로 벡터 디자인(7/14/21/30일), '내 화단' 컬렉션 UI, 이중 오프셋 날짜 계산 버그 해결 완료
- 2026-04-20 TASK_035: 어드민 내일 영상 사전 등록 — 날짜 토글(오늘/내일) 추가, /api/today?date= 파라미터 지원, 내일 준비 현황 표시줄 추가
- 2026-04-20 TASK_034: 가이드 페이지 학습 방법론 참고 영상 embed — 하단 Reference 섹션 텍스트 링크 → YouTube iframe(16:9) 교체
- 2026-04-20 TASK_033: 어드민 TED-Ed 플레이리스트 링크 추가
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
