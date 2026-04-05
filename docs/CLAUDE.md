# 시스템 지시사항

- 언어: 항상 한국어로 답변
- 트리거: 기획 확인 후 '가보자고' 입력 시 코딩 시작
- 출력: 이모지, 불필요한 줄바꿈, 인간적 대화 배제. 건조하고 압축된 형태로 답변.

---

## Project Overview

TED-fi는 TED-Ed 영상 한 편을 4단계로 학습하는 AI 기반 영어 학습 웹앱이다.

핵심 메커니즘: 관리자가 매일 TED-Ed 영상 1개를 등록하면, 모든 사용자가 동일한 영상으로 학습한다. 학습자료(학습지·핵심표현·구문분석)는 최초 1회 Gemini API로 생성 후 DB에 전역 캐싱된다. 두 번째 사용자부터는 API 호출 없이 즉시 로드된다.

4단계 학습 사이클: 무자막 시청 → 스크립트 확인 → 학습지(PDF 다운로드/업로드) → 핵심표현+구문분석 → 완료(공유)

---

## Workflow

- 복잡한 작업·설계 변경 시 구현 전 Plan 모드로 계획 공유 후 승인받을 것.
- 작업 시작 전 `docs/PRD.md`, `docs/CLAUDE_CODE_GUIDE.md` 반드시 확인.
- 작업 완료 시 `docs/DONE.md` 업데이트.

---

## Tech Stack

- Framework: Next.js (App Router), Node.js 런타임
- DB/Auth: Supabase (Auth · Storage · PostgREST)
- ORM: 없음. Supabase SDK + `supabase gen types` 로 타입 안전성 확보. Prisma 미사용.
- AI: Gemini 1.5 Flash (Free Tier) 우선, 폴백으로 Claude API
- Style: TailwindCSS, shadcn/ui
- Package manager: pnpm

---

## Architecture & Rules

### DB 접근
- 서버(API Routes, Server Actions)에서만 Supabase 서버 클라이언트로 DB 접근.
- 클라이언트 컴포넌트에서 DB 직접 접근 금지.
- 스키마 변경 시 반드시 `supabase gen types` 재실행.

```bash
pnpm supabase gen types typescript \
  --project-id <your-project-id> \
  > src/types/database.ts
```

### 캐싱 구조 (핵심)
- `learning_materials` 테이블이 학습지·핵심표현·구문분석을 단일 row로 저장.
- `video_id` 가 캐시 키. upsert는 항상 `ignoreDuplicates: true`.
- 부분 실패 방지: Gemini 1회 호출 → `learning_materials` 1회 upsert만 실행.
- Step 3(학습지)과 Step 4(핵심표현)는 같은 row를 재사용 — 추가 쿼리 없음.

### Supabase 클라이언트 패턴
```typescript
// 클라이언트 컴포넌트: 반드시 싱글턴 사용 (리렌더링마다 재생성 금지)
import { getSupabaseBrowser } from '@/lib/supabase/client'

// 서버(API Route, Server Action):
import { createClient } from '@/lib/supabase/server'
```

### URL 상태 관리
- 학습 스텝 상태는 `useSearchParams`로 URL에 보관. (`/study?step=2`)
- `useState`로 스텝 관리 금지 — 새로고침/뒤로가기 시 증발함.
- 완료 화면은 `/study/complete` 별도 라우트 (공유 링크 오염 방지).

### Middleware
- `src/middleware.ts` 에 `config.matcher` 필수 설정.
- 정적 파일(`_next/static`, 이미지, 파비콘)을 matcher에서 제외하지 않으면 모든 정적 요청에서 Supabase Auth 연산 실행 → TTFB 저하.

```typescript
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Vercel 타임아웃
- AI 생성 API Route 상단에 `export const maxDuration = 60` 필수.
- 대상: `/api/generate/route.ts`, `/api/admin/daily/route.ts`
- Vercel Pro 플랜 필요 (Free = 10초).

### PDF 생성
- `jsPDF`, `html2canvas` 사용 금지.
- `window.print()` + `@media print` CSS 방식만 사용.
- 학습지 외 모든 UI는 `@media print { display: none }` 처리.

---

## 디렉토리 구조

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # getSupabaseBrowser() 싱글턴
│   │   └── server.ts       # createClient() 서버용
│   ├── gemini.ts           # generateWithFallback()
│   ├── claude.ts           # generateWithClaude() 폴백
│   └── transcript.ts       # Supadata API 호출
├── app/
│   ├── page.tsx            # 랜딩 (비로그인)
│   ├── home/page.tsx       # 대시보드
│   ├── study/
│   │   ├── page.tsx        # 학습 사이클 (?step=1~4)
│   │   └── complete/page.tsx
│   ├── guide/page.tsx      # 학습 가이드
│   └── api/
│       ├── today/route.ts
│       ├── transcript/route.ts
│       ├── generate/route.ts           # maxDuration=60
│       ├── materials/[videoId]/route.ts
│       ├── progress/route.ts
│       ├── upload/route.ts
│       ├── streak/route.ts
│       └── admin/daily/route.ts        # maxDuration=60
├── middleware.ts                        # matcher 필수
└── types/
    ├── database.ts     # supabase gen types 자동생성 — 직접 편집 금지
    └── worksheet.ts    # ClaudeResponse 등 수동 타입 정의
```

---

## Code Conventions

- 포맷터: Prettier (세미콜론 없음, 탭 2, 작은따옴표, trailing commas off)
- TypeScript strict 모드 필수. `@/*` alias 사용.
- 스타일링: Tailwind 유틸리티 클래스. 하드코딩 컬러 금지.
- 네이밍: `[Domain][Target][Form]` 패턴 (예: `StudyStepProgress`, `WorksheetRenderer`)

---

## Verification Requirements

- 코드 수정 후 완료 표시 전 `pnpm typecheck` 및 `pnpm lint` 필수 실행.
- UI 변경 시 모바일(375px) · 태블릿(768px) · 데스크톱(1280px) 3종 확인.

---

## Commands

```bash
pnpm dev           # 개발 서버
pnpm build         # 빌드
pnpm typecheck     # 타입 검사
pnpm lint          # 린트

# Supabase
pnpm supabase gen types typescript --project-id <id> > src/types/database.ts
```

---

## Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=              # 우선 사용
ANTHROPIC_API_KEY=           # 폴백

SUPADATA_API_KEY=            # 스크립트 추출 (Vercel 배포 시)

ADMIN_SECRET=                # /api/admin/daily 인증

NEXT_PUBLIC_KAKAO_JS_KEY=
NEXT_PUBLIC_APP_URL=https://tedfi.app
```

---

## Learnings (Team Memory)

- Supabase 클라이언트를 컴포넌트 내부에서 직접 생성하면 리렌더링마다 인스턴스 재생성됨 → `getSupabaseBrowser()` 싱글턴만 사용.
- Middleware에 matcher 미설정 시 정적 파일 요청마다 Auth 연산 실행됨.
- `worksheets`와 `phrases`를 별도 테이블로 분리하면 부분 실패 위험 존재 → `learning_materials` 단일 테이블로 통합.
- Gemini `responseMimeType: 'application/json'` 설정 시 markdown fence 제거 불필요.
- 스텝 상태를 `useState`로 관리하면 새로고침 시 초기화됨 → URL SearchParams를 SSoT로 사용.

---

## References

- 기획: `docs/PRD.md`
- 구현 가이드: `docs/CLAUDE_CODE_GUIDE.md`
- UI/UX: `docs/UI_UX_GUIDE.md`
