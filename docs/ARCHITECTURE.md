# ARCHITECTURE

> 스키마·API·공유 타입 변경 이력. 변경 즉시 기록. AI 환각 방지용.

---

## 2026-04-17: 프로덕트 v2 스키마 확장 (TASK_017)

### learning_materials — raw_json 컬럼 추가
- `raw_json jsonb nullable` — Gemini 원본 응답 보존용
- Public Read RLS 정책 추가 (`public_read_learning_materials`)
- 마이그레이션: `docs/migrations/001_product_v2.sql`

### user_progress — daily_comment 컬럼 추가
- `daily_comment text nullable` — 학습 완료 후 한 줄 코멘트 저장
- 별도 코멘트 테이블 생성 금지. user_progress 단일 row에 병합.

### 타입 재생성
```bash
npx supabase gen types typescript --project-id pavarzhfncjxokvgsmka > src/types/database.ts
```

---

## 2026-04-17: 인증 아키텍처 변경 (TASK_017 PLG)

### 미들웨어 생성 (`src/middleware.ts`)
- `/admin` 경로만 인증 보호. 나머지(`/home`, `/study`, `/guide`, `/about`) 통과.
- 기존: 각 페이지 서버 컴포넌트에서 `if (!user) redirect('/')` 패턴
- 변경: 미들웨어에서 `/admin`만 차단, 페이지 레벨에서 user null 처리

### 전역 AuthModal (zustand)
- `src/lib/store/auth-modal.ts` — `useAuthModal()` 훅, open/close/message
- `src/components/auth/AuthModal.tsx` — root layout에 단일 마운트
- 로그인 유도 시점: Step4 완료 버튼(비로그인), /study/complete 진입(비로그인), RecentList 클릭(비로그인)

### API 변경
- `GET /api/history` — 비로그인 시 401 대신 `{ history: [], loggedIn: false }` 반환

---

## 초기 스키마 (v0.1 MVP)

테이블 목록:
- `daily_videos` — 오늘의 영상 (관리자 등록)
- `transcripts` — 스크립트 캐시 (video_id 기준)
- `learning_materials` — AI 생성 학습자료 통합 캐시 (worksheet_json · phrases_json · sentences_json · raw_json)
- `user_progress` — 개인별 학습 진행 (step1~4 완료 시각 · known_sentences · quiz_results)
- `user_uploads` — 필기본 PDF 업로드 기록
- `streaks` — 연속 학습 일수
- `profiles` — auth.users 확장 (nickname · avatar_url)

캐시 키: 모든 전역 캐시 테이블의 캐시 키는 `video_id` (text unique).

타입 생성:
```bash
pnpm supabase gen types typescript --project-id <id> > src/types/database.ts
```

---

## 핵심 기능 아키텍처 및 설계 결정

### 1. 하이라이트 매칭: Passage-First 전략 (TASK_010)
- **문제:** AI가 원본 스크립트에서 추출한 학습용 문장과, 각색된 지문(Reading Passage)의 텍스트가 미세하게 달라 UI 하이라이트 매칭이 실패함.
- **해결:** 생성 순서를 [지문 선제작 → 지문 내 추출]로 강제.
- **로직:** 
  1. AI가 A2 수준의 쉬운 영어 지문을 먼저 작성한다.
  2. **방금 본인이 쓴 지문 내부에서만** 핵심표현(Phrases)과 분석 문장(Sentences)을 토씨 하나 틀리지 않고 그대로(Verbatim) 추출하도록 프롬프트 지시.
  3. 결과적으로 지문과 학습 데이터가 100% 일치하여 안정적인 형광펜 효과 보장.

### 2. 학습 경험: 점진적 노출 (Progressive Disclosure)
- **원칙:** 영어 중심 학습을 유지하되, 학습자의 인지 부하를 줄이기 위해 한글 정보는 필요 시에만 노출한다.
- **패턴:**
  - **단어장(Part 2):** 한글 뜻을 기본적으로 `blur` 처리. 클릭/호버 시 해제.
  - **상세 설명:** `[English definition] / [Korean meaning]` 형태의 영한 믹스 데이터 구조.
  - **반응형 대응:** 터치 기반인 모바일/아이패드는 `Drawer(BottomSheet)`, 정밀 제어가 가능한 데스크톱은 `Popover`를 사용하는 혼합형 UI 제공.

### 3. 데이터 파이프라인 및 동기화
- **생성 로직:** 단일 API 호출(`/api/generate`)로 `worksheet`, `phrases`, `sentences`를 한 번에 생성하여 원자성(Atomicity) 확보.
- **폴백(Fallback):** Gemini 1.5-flash-lite 실패 시 Claude로 자동 전환.
- **클라이언트 동기화:** Step 3 진입 시 학습자료가 생성 중일 경우, 3초 주기 `router.refresh()` 폴링을 통해 백그라운드 생성 완료를 감지하고 즉시 화면 전환.

### 4. 상태 관리: URL SSoT (Single Source of Truth)
- **결정:** 학습 스텝 상태를 컴포넌트 내부 `useState`가 아닌 URL `?step=N` 파라미터에 저장.
- **사유:** 브라우저 새로고침, 뒤로 가기 시에도 학습 진도를 완벽히 보존하며 서버 사이드 렌더링(SSR) 시 즉시 해당 단계의 데이터를 페칭하기 위함.

### 5. 인쇄 최적화 (Native Print)
- **결정:** `jsPDF` 등 라이브러리 미사용. 브라우저 네이티브 `window.print()` 사용.
- **메커니즘:** `@media print` 시 네비게이션과 학습 지원 UI를 `display: none` 처리하고, 워크시트 컨테이너만 A4 규격에 맞춰 렌더링. 인쇄 시에는 `blur`와 `hidden` 처리된 정답지가 자동으로 해제되어 출력됨.
