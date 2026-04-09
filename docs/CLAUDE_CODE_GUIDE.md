# TED-fi — Claude Code 구현 가이드

이 문서는 Claude Code가 TED-fi를 처음부터 구현할 때 따라야 할 순서와 세부 지침이다.

@AGENTS.md

---

## 0. 전제 조건

```bash
# 모노레포 구조 (Law-fi와 동일 워크스페이스)
# 신규 앱으로 추가하거나 독립 레포로 시작 가능
node >= 20
pnpm >= 9
```

### 환경변수 (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# GEMINI
GEMINI_API_KEY=

# 스크립트 추출 (둘 중 하나)
SUPADATA_API_KEY=              # 서버리스(Vercel) 배포 시
# PYTHON_TRANSCRIPT_URL=       # 자체 서버 시

# 관리자
ADMIN_SECRET=

# 카카오
NEXT_PUBLIC_KAKAO_JS_KEY=

# 앱
NEXT_PUBLIC_LOCAL_APP_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=https://ted-fi-web.vercel.app
```

---

## 1. 프로젝트 초기 세팅

```bash
# 1. Next.js 프로젝트 생성
pnpm create next-app@latest tedfi \
  --typescript --tailwind --app --src-dir --import-alias "@/*"

cd tedfi

# 2. 의존성 설치 (Prisma 미사용 — Supabase SDK만으로 충분)
pnpm add @supabase/supabase-js @supabase/ssr \
  @google/generative-ai \
  @anthropic-ai/sdk          # Gemini 폴백용

pnpm add -D supabase @types/node

# 3. Supabase 타입 자동 생성
# PRD.md의 SQL을 Supabase Dashboard에서 실행한 뒤:
pnpm supabase login
pnpm supabase gen types typescript \
  --project-id <your-project-id> \
  > src/types/database.ts

# 이후 스키마 변경 시 위 명령어 재실행으로 타입 동기화
```

---

## 2. 구현 순서 (Claude Code 작업 단위)

### Phase 1 — 인증 + 기본 레이아웃

**작업 1: Supabase Auth 설정** (위 §1 참조)

**작업 2: 레이아웃 + 네비게이션**

```
목표: 반응형 Shell 완성
파일:
  - src/app/layout.tsx (폰트, 전역 스타일)
  - src/components/layout/TopNav.tsx
  - src/components/layout/BottomTabBar.tsx (모바일 < 640px)
  - src/components/layout/Sidebar.tsx (데스크톱 > 1024px)
브레이크포인트: Tailwind sm(640) / lg(1024)
```

**작업 3: 랜딩 페이지**

```
파일: src/app/page.tsx, src/components/home/LandingHero.tsx
로그인 후 → /home 리다이렉트
```

---

### Phase 2 — 데이터 파이프라인

**작업 4: 관리자 API**

```
파일: src/app/api/admin/daily/route.ts
export const maxDuration = 60;

동작:
  1. Authorization 헤더로 ADMIN_SECRET 검증
  2. daily_videos upsert
  3. transcript 캐시 확인 → 없으면 추출
  4. learning_materials 캐시 확인 → 없으면 Gemini 생성
  5. 완료 후 200 반환
```

**작업 5: 스크립트 추출 API**

```
파일: src/app/api/transcript/route.ts, src/lib/transcript.ts

동작:
  1. transcripts 조회 → 있으면 즉시 반환
  2. 없으면 Supadata API 호출:
     GET https://api.supadata.ai/v1/youtube/transcript?url=...
     Authorization: Bearer {SUPADATA_API_KEY}
  3. transcripts upsert 후 반환
```

**작업 6: Gemini API 생성** (위 §2 Phase 2 참조)

**작업 7: Today API + Materials API**

```
파일:
  src/app/api/today/route.ts
  src/app/api/materials/[videoId]/route.ts   ← worksheet+phrases 통합

/api/today 반환:
  { video, cache: { transcript, materials }, userProgress }

/api/materials/[videoId] 반환:
  learning_materials row 전체 (worksheet_json, phrases_json, sentences_json)
  Step 3과 Step 4 모두 이 1개 엔드포인트 사용
```

---

### Phase 3 — 학습 화면

**작업 8~14:** (이전과 동일, 단 Step 4는 추가 쿼리 없이 Step 3 데이터 재사용)

---

### 파일 구조

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts    ← getSupabaseBrowser() 싱글턴
│   │   └── server.ts    ← createClient() 서버용
│   ├── gemini.ts        ← generateWithFallback()
│   ├── claude.ts        ← generateWithClaude() 폴백
│   └── transcript.ts
├── app/
│   └── api/
│       ├── today/route.ts
│       ├── transcript/route.ts
│       ├── generate/route.ts          ← maxDuration=60
│       ├── materials/[videoId]/route.ts  ← 통합 엔드포인트
│       ├── progress/route.ts
│       ├── upload/route.ts
│       ├── streak/route.ts
│       └── admin/daily/route.ts       ← maxDuration=60
├── middleware.ts                       ← matcher 필수
└── types/
    ├── database.ts    ← supabase gen types 자동생성 (편집 금지)
    └── worksheet.ts   ← ClaudeResponse 등 수동 정의
```

```
목표: Google OAuth 로그인 동작
파일:
  - src/lib/supabase/client.ts   (브라우저용 싱글턴)
  - src/lib/supabase/server.ts   (서버용 createServerClient)
  - src/middleware.ts             (세션 갱신 + matcher 필수)
  - src/app/auth/callback/route.ts (OAuth 콜백)
  - src/components/auth/GoogleSignInButton.tsx
  - src/components/auth/AuthGuard.tsx

── 클라이언트 싱글턴 패턴 (리렌더링마다 재생성 방지) ──
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// 모듈 레벨 싱글턴 — 컴포넌트 외부에서 1회만 생성
let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function getSupabaseBrowser() {
  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}

// 컴포넌트에서 사용:
// const supabase = getSupabaseBrowser()  ← createClient() 직접 호출 금지

── 서버 클라이언트 패턴 ──
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}

── Middleware — matcher 필수 (정적 파일 제외) ──
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.getUser()
  return supabaseResponse
}

// ★ matcher 없으면 정적 파일/_next/image 요청마다 Auth 연산 실행 → TTFB 저하
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**작업 2: 레이아웃 + 네비게이션**

```
목표: 반응형 Shell 완성
파일:
  - src/app/layout.tsx (폰트, 전역 스타일)
  - src/components/layout/TopNav.tsx
  - src/components/layout/BottomTabBar.tsx (모바일 < 640px)
  - src/components/layout/Sidebar.tsx (데스크톱 > 1024px)
브레이크포인트: Tailwind sm(640) / lg(1024)
```

**작업 3: 랜딩 페이지**

```
목표: 비로그인 진입점
파일:
  - src/app/page.tsx
  - src/components/home/LandingHero.tsx
로그인 후 → /home 리다이렉트
```

---

### Phase 2 — 데이터 파이프라인

**작업 4: 관리자 API — 오늘의 영상 등록**

```
파일: src/app/api/admin/daily/route.ts
동작:
  1. Authorization 헤더로 ADMIN_SECRET 검증
  2. daily_videos 테이블에 오늘 날짜 + video_id upsert
  3. transcript 캐시 확인 → 없으면 추출 트리거
  4. worksheet + phrases 캐시 확인 → 없으면 생성 트리거
  5. 모든 작업 완료 후 200 반환
```

**작업 5: 스크립트 추출 API**

```
파일: src/app/api/transcript/route.ts
       src/lib/transcript.ts

동작 (transcript.ts):
  1. transcripts 테이블에서 video_id 조회
  2. 있으면 → 즉시 반환 (캐시 히트)
  3. 없으면 → Supadata API 호출:
     GET https://api.supadata.ai/v1/youtube/transcript
       ?url=https://youtube.com/watch?v={videoId}
     Authorization: Bearer {SUPADATA_API_KEY}
  4. 응답 파싱 → wordCount, sentenceCount 계산
  5. transcripts 테이블에 저장
  6. 반환

에러 처리:
  - 자막 없는 영상: 404 + "No transcript available"
  - API 실패: 503 + 재시도 안내
```

**작업 6: Gemini API — 학습자료 생성**

```
파일: src/app/api/generate/route.ts
       src/lib/gemini.ts
       src/lib/claude.ts   (폴백 전용)

export const maxDuration = 60;  // route.ts 상단 — Vercel Pro 필요

동작 (generate/route.ts):
  1. learning_materials 테이블에서 video_id 조회
  2. 있으면 → { cached: true } 즉시 반환
  3. 없으면 → generateWithFallback(transcript) 호출
     ├─ 1차: Gemini 1.5 Flash (responseMimeType: 'application/json')
     └─ 폴백: Claude Sonnet (JSON 파싱, markdown fence 제거)
  4. learning_materials 단일 upsert (worksheet_json, phrases_json, sentences_json, raw_json)
     → ignoreDuplicates: true 로 레이스 컨디션 방지
  5. { cached: false, generated: true } 반환

핵심: worksheets와 phrases가 통합되어 1번 upsert만 실행
      → 부분 실패(Partial Failure) 구조적으로 불가능

Gemini 설정:
  model: 'gemini-1.5-flash'
  generationConfig: {
    responseMimeType: 'application/json',  // JSON 전용 응답 — 파싱 안전
    temperature: 0.4,                       // 구조 일관성 확보
  }
```

**작업 7: Today API**

```
파일: src/app/api/today/route.ts

반환 구조:
{
  video: { id, title, duration, thumbnailUrl },
  cache: {
    transcript: boolean,
    materials: boolean,    // worksheets+phrases 통합 → materials 단일 플래그
  },
  userProgress: { step1, step2, step3, step4, completedAt } | null
}
```

---

### Phase 3 — 학습 화면

**작업 8: 앱 홈 (대시보드)**

```
파일: src/app/home/page.tsx
       src/components/home/DailyVideoBanner.tsx
       src/components/home/StreakCard.tsx
       src/components/home/RecentList.tsx

DailyVideoBanner:
  - /api/today 호출
  - 영상 제목, 썸네일, 캐시 상태 배지 표시
  - "학습 시작" 버튼 → /study

StreakCard:
  - /api/streak 호출
  - 현재 스트릭 숫자 (크게)
  - 이번 주 7개 스탬프 (완료=초록, 오늘=앰버, 미래=회색)
```

**작업 9: 학습 사이클 메인**

```
파일: src/app/study/page.tsx

상태 관리 — URL을 Single Source of Truth로 사용:
  'use client'
  import { useSearchParams, useRouter } from 'next/navigation'

  // URL: /study?step=2
  // 새로고침, 뒤로가기에도 상태 유지
  // useState/useEffect 불필요

  const searchParams = useSearchParams()
  const router = useRouter()
  const currentStep = Number(searchParams.get('step') ?? '1') as 1|2|3|4

  const goToStep = (step: number) => {
    router.push(`/study?step=${step}`)
    // DB 진행 저장은 각 Step 컴포넌트 내에서 처리
  }

완료 화면은 별도 라우트:
  /study/complete  ← 공유 링크가 /study?step=4 로 퍼지는 것 방지

DB 이어하기:
  // 페이지 진입 시 user_progress 조회
  // step1_completed_at 이 있으면 ?step=2 로 자동 이동
  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('video_id', videoId)
    .single()

  if (progress?.step3_completed_at && !progress?.step4_completed_at) {
    redirect('/study?step=4')
  }
```

**작업 10: Step 1 — YouTube 플레이어**

```
파일: src/components/steps/Step1Player.tsx

YouTube iFrame 파라미터:
  autoplay=1
  cc_load_policy=0    ← 자막 강제 OFF (핵심)
  rel=0               ← 관련 영상 숨김
  modestbranding=1

완료 처리:
  - "시청 완료" 버튼 클릭 → POST /api/progress { step: 1 }
  - 스트릭 갱신 없음 (Step 4 완료 시에만)
  - → Step 2로 이동
```

**작업 11: Step 2 — 스크립트**

```
파일: src/components/steps/Step2Script.tsx

동작:
  1. GET /api/materials/[videoId] 로 캐시 확인
  2. 캐시 없으면 POST /api/transcript 호출 (로딩 표시)
  3. 단어 수, 문장 수, 예상 레벨 표시
  4. 스크립트 첫 200자 미리보기 (fade 처리)
  5. router.push('/study?step=3')
```

**작업 12: Step 3 — 학습지**

```
파일:
  src/components/steps/Step3Worksheet.tsx
  src/components/worksheet/WorksheetRenderer.tsx
  src/components/worksheet/PDFDownloadButton.tsx
  src/components/worksheet/UploadAnnotated.tsx

WorksheetRenderer:
  - worksheet JSON → UI_UX_GUIDE.md §6 스펙대로 HTML 렌더링
  - 학습지 전용 CSS 변수 적용
  - id="worksheet-container" 지정 (@media print 타겟)

PDFDownloadButton — window.print() 방식 (jsPDF/html2canvas 미사용):
  export function PDFDownloadButton() {
    return (
      <button onClick={() => window.print()}>
        PDF 다운로드 ↓
      </button>
    )
  }

  // globals.css 에 추가
  @media print {
    nav, header, .step-progress,
    .pdf-bar, .upload-section,
    .step-nav { display: none !important; }

    #worksheet-container {
      display: block !important;
      width: 100%;
    }

    @page { size: A4; margin: 18mm 22mm; }
    .ws-passage-block { break-inside: avoid; }
  }

  // 사용자 안내: "인쇄 대화상자 → 목적지 → PDF로 저장"
  // 한글 폰트 깨짐 없음, 번들 크기 증가 없음

UploadAnnotated:
  - 파일 선택 (PDF only, max 50MB)
  - supabase.storage.from('worksheets').upload(path, file)
  - POST /api/upload 로 user_uploads 테이블 기록
  - 완료 카드 표시

완료 처리:
  - POST /api/progress { step: 3 }
  - router.push('/study?step=4')
```

**작업 13: Step 4 — 핵심 표현 + 구문 분석**

```
파일:
  src/components/steps/Step4Phrases.tsx
  src/components/steps/Step4SentenceAnalysis.tsx

데이터 로딩:
  - Step 3에서 이미 로드한 learning_materials 를 Context 또는 props로 전달
  - 추가 API 호출 없음 — phrases_json, sentences_json 바로 사용

PhraseCard (phrases_json 배열 반복):
  - pattern (bold)
  - korean (muted)
  - example (italic, 파란 왼쪽 보더)
  - dailyUse (힌트 색)
  - tags (pill 배지)

SentenceAnalysis (sentences_json 배열):
  - 문장 탭 → ParseChips + TipBox 표시
  - "알았어요 ✓" → knownSentences 배열에 추가
  - PATCH /api/progress { knownSentences: [...] }
  - Claude에 질문 버튼 → 새 탭 claude.ai (추후: 앱 내 Chat)

완료 처리:
  - POST /api/progress { step: 4, completed: true }
  - updateStreak() 호출
  - router.push('/study/complete')
```

**작업 14: 완료 화면**

```
파일: src/components/steps/CompleteScreen.tsx

표시:
  - 완료 아이콘 (초록 원 체크)
  - "오늘 학습 완료!"
  - 스트릭 일수 (갱신된 값)
  - 통계: 문장 수 / 핵심 표현 수 / 완료 문제 수

카카오톡 공유:
  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: '오늘의 TED-Ed 학습 완료! 🎉',
      description: `"${videoTitle}" — ${streak}일 연속`,
      imageUrl: thumbnailUrl,
      link: { mobileWebUrl: APP_URL, webUrl: APP_URL }
    },
    buttons: [{ title: '나도 시작하기', link: { mobileWebUrl: APP_URL } }]
  })

SNS 공유:
  const text = `오늘 TED-Ed로 영어 공부 완료! 🎉\n"${videoTitle}"\n${streak}일 연속 학습 중\n\n${APP_URL}`;
  if (navigator.share) navigator.share({ title: 'TED-fi', text });
  else navigator.clipboard.writeText(text);
```

---

### Phase 4 — 학습 가이드 페이지

**작업 15: About / 학습 가이드**

```
파일: src/app/guide/page.tsx

섹션 구성:
  1. 제목 + 한 줄 소개
  2. 4단계 가이드 (GuideStep 컴포넌트 × 4)
     - 단계 번호 (색상별 원)
     - 제목 + 소요시간 뱃지
     - 본문 설명
     - 팁 박스
  3. FAQ 아코디언 (5개)
  4. 앱 소개 카드 그리드 (2×2)

SEO:
  export const metadata = {
    title: '학습 가이드 — TED-fi',
    description: 'TED-Ed 영상으로 영어를 배우는 4단계 학습법',
  }
```

---

## 3. 타입 정의

```typescript
// src/types/database.ts — supabase gen types 자동 생성 (직접 편집 금지)
// src/types/worksheet.ts — Claude 응답 구조 수동 정의

export interface WorksheetParagraph {
    heading: string;
    body: string;
}

export interface VocabItem {
    word: string;
    pos: string;
    definition: string;
    example: string;
}

export interface MCQuestion {
    question: string;
    choices: string[]; // ["A) ...", "B) ...", "C) ...", "D) ..."]
    answer: "A" | "B" | "C" | "D";
}

export interface SAQuestion {
    question: string;
    modelAnswer: string;
}

export interface Worksheet {
    readingPassage: { paragraphs: WorksheetParagraph[] };
    vocabulary: VocabItem[];
    multipleChoice: MCQuestion[];
    shortAnswer: SAQuestion[];
    essayPrompt: string;
}

export interface Phrase {
    pattern: string;
    korean: string;
    explanation: string;
    example: string;
    dailyUse: string;
    tags: string[];
}

export interface ParseChunk {
    role: string;
    chunk: string;
    cssClass: "subj" | "verb" | "obj" | "mod";
}

export interface SentenceAnalysis {
    text: string;
    structureLabel: string;
    parse: ParseChunk[];
    tip: string;
    vocab: string[];
}

export interface ClaudeResponse {
    worksheet: Worksheet;
    phrases: Phrase[];
    sentences: SentenceAnalysis[];
}

// DB 조회 결과 타입은 database.ts의 자동생성 타입 사용
// 예: Database['public']['Tables']['worksheets']['Row']
```

---

## 4. 핵심 구현 주의사항

### Vercel 타임아웃 — `maxDuration` 명시 필수

```typescript
// /api/generate/route.ts
// /api/admin/daily/route.ts
export const maxDuration = 60; // Vercel Pro 필요 (Free = 10초)

// Gemini 1.5 Flash 응답 시간: 8000토큰 기준 약 15~25초
// 관리자 등록 시 1회만 발생 — 일반 사용자는 캐시 히트로 미호출
```

### learning_materials 단일 upsert — 부분 실패 방지

```typescript
// worksheet_json, phrases_json, sentences_json 을 하나의 row로 저장
// ignoreDuplicates: true 로 레이스 컨디션도 방지
const { error } = await supabase.from("learning_materials").upsert(
    {
        video_id: videoId,
        worksheet_json,
        phrases_json,
        sentences_json,
        raw_json,
    },
    { onConflict: "video_id", ignoreDuplicates: true },
);
```

### 클라이언트 Supabase 인스턴스 — 싱글턴 강제

```typescript
// ❌ 금지: 컴포넌트 내부에서 createClient() 직접 호출
// 리렌더링마다 새 인스턴스 생성 → 메모리 누수 + 세션 동기화 깨짐
function MyComponent() {
    const supabase = createBrowserClient(url, key); // ← 절대 금지
}

// ✅ 올바른 방법: 모듈 레벨 싱글턴 임포트
import { getSupabaseBrowser } from "@/lib/supabase/client";
function MyComponent() {
    const supabase = getSupabaseBrowser(); // ← 항상 이것만 사용
}
```

### Middleware matcher — 정적 파일 제외 필수

```typescript
// matcher 없으면 /_next/static, 이미지, 파비콘 요청마다
// Supabase Auth 세션 연산 실행 → TTFB 저하
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
```

### Gemini JSON 파싱 안전성

````typescript
// responseMimeType: 'application/json' 설정 시
// 응답이 항상 순수 JSON — markdown fence 제거 불필요
const result = await model.generateContent(prompt);
const json = JSON.parse(result.response.text()); // 바로 파싱 가능

// Claude 폴백 시엔 fence 제거 필요
const text = data.content[0].text;
const json = JSON.parse(text.replace(/```json|```/g, "").trim());
````

### YouTube iFrame API 로드

```typescript
<Script src="https://www.youtube.com/iframe_api" strategy="lazyOnload" />

const player = new YT.Player('player', {
  playerVars: {
    cc_load_policy: 0,   // 자막 강제 OFF (핵심)
    rel: 0,
    modestbranding: 1,
  }
})
```

### 모바일 하단 탭바 항목

```
홈 | 학습 | 가이드 | 내 기록
```

---

## 5. 배포

### Vercel (권장)

```bash
vercel env pull .env.local
vercel --prod
```

**Vercel 제한 주의:**

- `youtube-transcript-api` (Python)은 Vercel에서 실행 불가
- 반드시 **Supadata API** (REST) 사용할 것
- Claude API 호출 라우트에 `export const maxDuration = 60` 필수
    - `/api/generate/route.ts`
    - `/api/admin/daily/route.ts`
- `maxDuration = 60` 은 Vercel **Pro 플랜** 필요 (Free는 최대 10초)
    - 무료 플랜 유지 시: Supabase Edge Functions로 생성 로직 분리 고려

### Supabase Storage 버킷 설정

```sql
-- Supabase Dashboard > Storage > New bucket
-- Name: worksheets, Public: false

-- RLS는 PRD.md SQL에 포함된 own_uploads 정책으로 처리
```

### 타입 동기화 (스키마 변경 시)

```bash
pnpm supabase gen types typescript \
  --project-id <your-project-id> \
  > src/types/database.ts
```

---

## 6. 오늘의 영상 등록 워크플로우 (운영)

매일 1회 실행:

```bash
# 1. TED-Ed에서 오늘의 영상 선정
# 2. YouTube URL에서 video_id 복사 (예: vAKCmMNHdHw)
# 3. 아래 curl 실행

curl -X POST https://tedfi.app/api/admin/daily \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": "vAKCmMNHdHw",
    "title": "Why are sloths so slow?",
    "duration": "5:15"
  }'

# 응답 예시:
# {
#   "success": true,
#   "cached": { "transcript": false, "worksheet": false },
#   "generated": true,
#   "message": "오늘의 영상 등록 및 학습자료 생성 완료"
# }
```

이 1번의 API 호출로 당일 전체 학습자료가 준비된다.  
이후 사용자들은 모두 캐시에서 즉시 로드한다.

---

## 7. v2 대결 모드 (추후 구현, 비공개)

v1 완성 후 별도 브랜치에서 구현.  
PRD에 상세 기획 추가 예정.  
기술 기반: couples 테이블, invite_token, 실시간 알림(Supabase Realtime).
