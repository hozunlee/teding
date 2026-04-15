# Teding — Product Requirements Document

**Version:** 0.1 MVP  
**Stack:** Next.js (App Router) · Supabase · Gemini API (Free Tier) · youtube-transcript-api

> Prisma 미사용. Supabase SDK + `supabase gen types` 로 타입 안전성 확보.  
> AI 생성: Gemini 2.5 Flash-Lite (Free Tier) 우선, 폴백으로 Claude API.

---

## 1. 제품 개요

Teding는 TED-Ed 영상 한 편을 4단계로 학습하는 AI 기반 영어 학습 앱이다.  
핵심 가치는 **"매일 부담 없이, 꾸준히"**다.

### 핵심 메커니즘

- 관리자(또는 먼저 접속한 사용자)가 오늘의 TED-Ed 영상을 1개 등록
- **모든 사용자가 동일한 영상으로 학습**한다 — 학습자료는 최초 생성 후 전체 캐싱
- 사용자는 영상 선택 없이 접속하면 바로 오늘의 학습을 시작한다
- 학습자료(학습지 PDF, 핵심표현, 구문분석)는 DB에 캐싱되어 API 비용이 최초 1회만 발생

### MVP 범위 (v1)

- Google OAuth 로그인
- 솔로 학습 모드 (스트릭, 출석 체크)
- 4단계 학습 사이클
- 학습지 PDF 다운로드 + 필기본 업로드
- 학습 완료 후 SNS/카카오톡 공유
- 반응형 UI (모바일 · 태블릿 · 데스크톱)

### 추후 공개 (v2, 비공개)

- 파트너 대결 모드 — 지인 초대, 스트릭 경쟁, 상호 알림

---

## 2. 사용자 플로우

### 2-1. 최초 방문 (비로그인)

```
랜딩 페이지
  └─ "Google로 시작하기" 클릭
       └─ Supabase Auth (Google OAuth)
            └─ 신규 유저: 닉네임 설정 → 앱 홈
            └─ 기존 유저: 앱 홈 바로 이동
```

### 2-2. 앱 홈 (매일 반복)

```
앱 홈 (대시보드)
  ├─ 오늘의 영상 배너 (제목 · 길이 · 캐시 상태)
  ├─ 내 스트릭 카드 (연속 일수 · 주간 스탬프)
  ├─ 학습 진행 상태 (Step 1~4 중 어디까지 완료)
  └─ "학습 시작" 버튼 → Step 1
```

### 2-3. 4단계 학습 사이클

```
Step 1 · 무자막 시청 (5분)
  └─ YouTube iFrame, cc_load_policy=0 으로 자막 강제 off
  └─ 완료 버튼 → Step 2

Step 2 · 스크립트 확인 (자동)
  └─ DB에 캐시 있음 → 즉시 로드
  └─ 캐시 없음 → youtube-transcript-api 호출 → DB 저장
  └─ 스크립트 미리보기 표시 → Step 3

Step 3 · 학습지 (15~20분)
  ├─ DB에 캐시 있음 → learning_materials 에서 즉시 로드
  ├─ 캐시 없음 → Gemini API 호출 → learning_materials 에 1회 저장
  ├─ 학습지 렌더링 (리딩 지문 · 객관식 5문제 · 단답형 3문제 · 에세이 프롬프트)
  ├─ PDF 다운로드 (window.print() + @media print)
  ├─ 필기본 업로드 (Supabase Storage)
  └─ 완료 → Step 4

Step 4 · 핵심 표현 + 구문 분석 (10분)
  ├─ Step 3에서 로드한 learning_materials 재사용 (추가 쿼리 없음)
  ├─ 일상 활용 표현 5개 (패턴 · 예문 · 한국어 설명 · 구문 구조)
  ├─ 문장 탭 → 구문 트리 + 학습 팁
  ├─ "알았어요" 체크 → 진행 저장
  └─ 완료 → 완료 화면 (/study/complete)

완료 화면
  ├─ 오늘 학습 요약 (문장 수 · 표현 수 · 스트릭)
  ├─ 카카오톡으로 공유 버튼
  └─ SNS 공유 버튼 (공유 텍스트 + 링크 복사)
```

---

## 3. 캐싱 전략 (핵심)

모든 학습자료는 `video_id` 기준으로 전역 캐싱된다.  
**같은 영상을 두 번째로 학습하는 사람부터는 Gemini API를 호출하지 않는다.**

### 캐시 히트 판별 순서

```
1. daily_videos 테이블에서 오늘 날짜의 video_id 조회
2. transcripts 테이블에서 video_id로 스크립트 조회
   → 없으면: Supadata API 호출 후 저장
3. learning_materials 테이블에서 video_id 조회 (학습지 + 핵심표현 + 구문분석 통합)
   → 없으면: Gemini API 1회 호출 → 1번 upsert로 원자적 저장
   → 있으면: 즉시 반환 (Step 3, Step 4 모두 이 1개 row 재사용)
```

### 캐시 키 설계

| 테이블               | 캐시 키    | 설명                                                   |
| -------------------- | ---------- | ------------------------------------------------------ |
| `transcripts`        | `video_id` | 유튜브 자막 원문                                       |
| `learning_materials` | `video_id` | 학습지 + 핵심표현 + 구문분석 **통합** (부분 실패 없음) |

레벨은 MVP에서 **초등 6학년(Grade 6)으로 고정**한다.

---

## 4. 데이터 모델 (Supabase SQL)

Prisma 미사용. Supabase Dashboard 또는 마이그레이션 SQL로 직접 관리한다.
타입은 `supabase gen types typescript --project-id <id> > src/types/database.ts` 로 자동 생성.

```sql
-- 오늘의 영상 (관리자가 매일 1건 등록)
create table daily_videos (
  id         uuid primary key default gen_random_uuid(),
  date       text unique not null,       -- "2025-01-15"
  video_id   text not null,
  title      text not null,
  duration   text not null,
  created_at timestamptz default now()
);

-- 스크립트 캐시 (video_id 기준 전역 캐시)
create table transcripts (
  id             uuid primary key default gen_random_uuid(),
  video_id       text unique not null,
  raw_text       text not null,
  word_count     int not null,
  sentence_count int not null,
  created_at     timestamptz default now()
);

-- AI 생성 학습자료 통합 캐시 (worksheets + phrases 통합)
-- Gemini API 1회 호출 → 이 테이블 1회 upsert → 부분 실패 없음
-- Step 3(학습지)과 Step 4(핵심표현/구문분석) 모두 이 1개 row 사용
create table learning_materials (
  id              uuid primary key default gen_random_uuid(),
  video_id        text unique not null,
  worksheet_json  jsonb not null,   -- { readingPassage, vocabulary, multipleChoice, shortAnswer, essayPrompt }
  phrases_json    jsonb not null,   -- [ { pattern, korean, explanation, example, dailyUse, tags } ]
  sentences_json  jsonb not null,   -- [ { text, structureLabel, parse, tip, vocab } ]
  raw_json        jsonb not null,   -- Gemini 원본 응답 전체 (디버깅용)
  created_at      timestamptz default now()
);

-- 사용자 학습 진행 (개인별)
create table user_progress (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users not null,
  video_id            text not null,
  date                text not null,
  step1_completed_at  timestamptz,
  step2_completed_at  timestamptz,
  step3_completed_at  timestamptz,
  step4_completed_at  timestamptz,
  completed_at        timestamptz,
  known_sentences     jsonb default '[]',
  quiz_results        jsonb default '{}',
  created_at          timestamptz default now(),
  unique(user_id, video_id)
);

-- 필기본 업로드 기록
create table user_uploads (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  video_id   text not null,
  file_url   text not null,
  file_name  text not null,
  created_at timestamptz default now()
);

-- 스트릭
create table streaks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users unique not null,
  current_streak  int default 0,
  longest_streak  int default 0,
  last_study_date text,
  updated_at      timestamptz default now()
);

-- 유저 프로필 (auth.users 확장)
create table profiles (
  id         uuid primary key references auth.users,
  nickname   text not null,
  avatar_url text,
  created_at timestamptz default now()
);

-- RLS 활성화
alter table user_progress      enable row level security;
alter table user_uploads       enable row level security;
alter table streaks             enable row level security;
alter table profiles           enable row level security;

-- 본인 데이터만 접근
create policy "own_progress" on user_progress
  for all using (auth.uid() = user_id);

create policy "own_uploads" on user_uploads
  for all using (auth.uid() = user_id);

create policy "own_streak" on streaks
  for all using (auth.uid() = user_id);

create policy "own_profile" on profiles
  for all using (auth.uid() = id);

-- 전역 캐시 테이블은 로그인 사용자 읽기 허용
create policy "read_transcripts" on transcripts
  for select to authenticated using (true);

create policy "read_learning_materials" on learning_materials
  for select to authenticated using (true);

create policy "read_daily_videos" on daily_videos
  for select to authenticated using (true);
```

---

## 5. API 엔드포인트

### Next.js App Router API Routes

| Method | Path                       | 설명                                                |
| ------ | -------------------------- | --------------------------------------------------- |
| GET    | `/api/today`               | 오늘의 영상 + 캐시 상태 반환                        |
| POST   | `/api/transcript`          | 스크립트 추출 (캐시 미스 시만 실행)                 |
| POST   | `/api/generate`            | 학습지+핵심표현+구문분석 통합 생성 (캐시 미스 시만) |
| GET    | `/api/materials/[videoId]` | learning_materials 전체 조회 (Step 3+4 공용)        |
| POST   | `/api/progress`            | 학습 진행 저장 (스텝 완료 등)                       |
| GET    | `/api/progress/[videoId]`  | 내 학습 진행 조회                                   |
| POST   | `/api/upload`              | 필기본 PDF 업로드                                   |
| GET    | `/api/streak`              | 내 스트릭 조회                                      |
| POST   | `/api/admin/daily`         | 오늘의 영상 등록 (관리자)                           |

> `/api/worksheet/[videoId]` 와 `/api/phrases/[videoId]` 는 제거.  
> `learning_materials` 통합으로 `/api/materials/[videoId]` 단일 엔드포인트로 대체.

---

## 6. Gemini API 호출 구조

학습지·핵심표현·구문분석은 **Gemini 2.5 Flash-Lite 단 1회 호출**로 생성, `learning_materials` 테이블에 **1회 upsert**로 원자적 저장한다.

### Free Tier 한도 (2026 기준)

| 항목           | 한도    |
| -------------- | ------- |
| 분당 요청(RPM) | 15      |
| 일 요청(RPD)   | 1,000   |
| 입력 컨텍스트  | 1M 토큰 |

관리자가 하루 1회 `/api/admin/daily` 를 호출해 사전 생성하므로 Free Tier로 충분하다.

### 요청 구조

```typescript
// src/lib/gemini.ts
// pnpm add @google/generative-ai

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateLearningMaterials(transcript: string) {
    const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        generationConfig: {
            responseMimeType: "application/json", // JSON만 반환 — 파싱 안전
            temperature: 0.4, // 낮게 유지해 구조 일관성 확보
        },
    });

    const prompt = `
You are an English learning content creator for Korean adult learners.
Based on the following TED-Ed script, generate a complete learning package.
Reading level: Grade 6 (Korean elementary school 6th grade equivalent).

SCRIPT:
${transcript}

Return a single JSON object with this exact structure:
{
  "worksheet": {
    "readingPassage": {
      "paragraphs": [{ "heading": "string", "body": "string" }]
    },
    "vocabulary": [
      { "word": "string", "pos": "string", "definition": "string", "example": "string" }
    ],
    "multipleChoice": [
      { "question": "string", "choices": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "A" }
    ],
    "shortAnswer": [
      { "question": "string", "modelAnswer": "string" }
    ],
    "essayPrompt": "string"
  },
  "phrases": [
    { "pattern": "string", "korean": "string", "explanation": "string",
      "example": "string", "dailyUse": "string", "tags": ["string"] }
  ],
  "sentences": [
    { "text": "string", "structureLabel": "string",
      "parse": [{ "role": "string", "chunk": "string", "cssClass": "subj|verb|obj|mod" }],
      "tip": "string", "vocab": ["string"] }
  ]
}

Rules:
- Simplify into 5-6 readable paragraphs (Grade 6 level)
- Exactly 6 vocabulary items
- Exactly 5 multiple choice questions with 4 choices each
- Exactly 3 short answer questions (last = inference)
- Exactly 5 daily-life phrases
- 6-8 sentences for parse analysis
- All tips, explanations, korean fields in Korean
`;

    const result = await model.generateContent(prompt);
    const json = JSON.parse(result.response.text());
    return json;
}
```

### learning_materials 저장 (원자적 upsert)

```typescript
// /api/generate/route.ts
export const maxDuration = 60; // Vercel Pro 필요

export async function POST(req: Request) {
    const { videoId, transcript } = await req.json();
    const supabase = createClient();

    // 캐시 확인
    const { data: existing } = await supabase
        .from("learning_materials")
        .select("id")
        .eq("video_id", videoId)
        .single();

    if (existing) return Response.json({ cached: true });

    // Gemini 호출
    const materials = await generateLearningMaterials(transcript);

    // 1회 upsert — 부분 실패 없음
    const { error } = await supabase.from("learning_materials").upsert(
        {
            video_id: videoId,
            worksheet_json: materials.worksheet,
            phrases_json: materials.phrases,
            sentences_json: materials.sentences,
            raw_json: materials,
        },
        { onConflict: "video_id", ignoreDuplicates: true },
    );

    if (error) throw error;
    return Response.json({ cached: false, generated: true });
}
```

### 폴백: Gemini 실패 시 Claude API

````typescript
// src/lib/gemini.ts 하단에 추가
export async function generateWithFallback(transcript: string) {
    try {
        return await generateLearningMaterials(transcript); // Gemini 우선
    } catch (err) {
        console.warn("Gemini failed, falling back to Claude:", err);
        return await generateWithClaude(transcript); // Claude 폴백
    }
}

// src/lib/claude.ts
async function generateWithClaude(transcript: string) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 8000,
            messages: [{ role: "user", content: buildPrompt(transcript) }],
        }),
    });
    const data = await res.json();
    const text = data.content[0].text;
    return JSON.parse(text.replace(/```json|```/g, "").trim());
}
````

---

## 7. 스크립트 추출

### 서버사이드 Python (FastAPI 또는 Next.js + python-shell)

```python
# 옵션 A: 별도 Python 서버 (FastAPI)
# GET /transcript?video_id=vAKCmMNHdHw

from youtube_transcript_api import YouTubeTranscriptApi

def get_transcript(video_id: str) -> dict:
    transcript = YouTubeTranscriptApi.get_transcript(
        video_id, languages=['en']
    )
    full_text = ' '.join([t['text'] for t in transcript])
    return {
        'text': full_text,
        'segments': transcript,
        'word_count': len(full_text.split()),
    }
```

```typescript
// 옵션 B: Next.js API route에서 Supadata REST API 호출 (서버리스 친화)
// youtube-transcript-api가 서버에 없을 때 대안

const res = await fetch(
    `https://api.supadata.ai/v1/youtube/transcript?url=https://youtube.com/watch?v=${videoId}`,
    { headers: { Authorization: `Bearer ${process.env.SUPADATA_KEY}` } },
);
```

**권장:** Vercel 배포 시 Supadata API, 자체 서버 시 youtube-transcript-api (Python).

---

## 8. PDF 생성

`jsPDF + html2canvas` 미사용. 브라우저 네이티브 인쇄 기능을 활용한다.

```css
/* globals.css 또는 worksheet.module.css */
@media print {
    /* 학습지 외 모든 UI 숨김 */
    body > *:not(#print-root) {
        display: none !important;
    }
    nav,
    header,
    footer,
    .step-progress,
    .pdf-bar,
    .upload-section {
        display: none !important;
    }

    /* 학습지 영역 풀페이지 출력 */
    #worksheet-container {
        display: block !important;
        width: 100%;
        margin: 0;
        padding: 0;
        font-size: 11pt;
        color: #000;
    }

    /* 페이지 여백 설정 */
    @page {
        size: A4;
        margin: 18mm 22mm;
    }

    /* 단락 중간 페이지 나뉨 방지 */
    .ws-passage-block {
        break-inside: avoid;
    }
}
```

```typescript
// PDFDownloadButton.tsx
export function PDFDownloadButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button onClick={handlePrint}>
      PDF 다운로드 ↓
    </button>
  );
}
```

**사용자 안내 문구:** "브라우저의 인쇄 대화상자에서 '목적지'를 'PDF로 저장'으로 선택하세요."

> 이 방식으로 한글 폰트 깨짐, 번들 크기 증가, CSS 변수 미인식 문제를 모두 해결한다.

---

## 9. 파일 업로드 (필기본)

```typescript
// Supabase Storage
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(url, key);

async function uploadAnnotated(file: File, userId: string, videoId: string) {
    const path = `${userId}/${videoId}/annotated_${Date.now()}.pdf`;
    const { data, error } = await supabase.storage
        .from("worksheets")
        .upload(path, file, { contentType: "application/pdf" });

    if (error) throw error;

    // DB에 기록
    await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({
            userId,
            videoId,
            fileUrl: data.path,
            fileName: file.name,
        }),
    });
}
```

---

## 10. 공유 기능

### 카카오톡

```typescript
// Kakao SDK (카카오 개발자 콘솔에서 앱 등록 필요)
Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
        title: `오늘의 TED-Ed 학습 완료! 🎉`,
        description: `"${videoTitle}" — ${streakDays}일 연속 학습 중`,
        imageUrl: thumbnailUrl,
        link: {
            mobileWebUrl: "https://tedfi.app",
            webUrl: "https://tedfi.app",
        },
    },
    buttons: [
        { title: "나도 학습하기", link: { mobileWebUrl: "https://tedfi.app" } },
    ],
});
```

### SNS (클립보드 복사 + Web Share API)

```typescript
const shareText = `오늘 TED-Ed로 영어 공부 완료! 🦥\n"${videoTitle}"\n${streakDays}일 연속 학습 중\n\nhttps://tedfi.app`;

if (navigator.share) {
    navigator.share({ title: "Teding", text: shareText });
} else {
    navigator.clipboard.writeText(shareText);
}
```

---

## 11. 스트릭 로직

```typescript
// /api/progress POST 호출 시 (Step 완료마다)
// 학습 완전 완료(Step 4 완료) 시 스트릭 갱신

async function updateStreak(userId: string) {
    const today = new Date().toISOString().split("T")[0]; // "2025-01-15"
    const streak = await prisma.streak.findUnique({ where: { userId } });

    if (!streak) {
        await prisma.streak.create({
            data: {
                userId,
                currentStreak: 1,
                longestStreak: 1,
                lastStudyDate: today,
            },
        });
        return;
    }

    const yesterday = new Date(Date.now() - 86400000)
        .toISOString()
        .split("T")[0];
    const isConsecutive = streak.lastStudyDate === yesterday;
    const isAlreadyDoneToday = streak.lastStudyDate === today;

    if (isAlreadyDoneToday) return; // 오늘 이미 카운트됨

    const newCurrent = isConsecutive ? streak.currentStreak + 1 : 1;
    await prisma.streak.update({
        where: { userId },
        data: {
            currentStreak: newCurrent,
            longestStreak: Math.max(newCurrent, streak.longestStreak),
            lastStudyDate: today,
        },
    });
}
```

---

## 12. 관리자 — 오늘의 영상 등록

MVP에서는 별도 관리자 페이지 없이 API 직접 호출로 등록한다.

```bash
# 오늘의 영상 등록
curl -X POST https://tedfi.app/api/admin/daily \
  -H "Authorization: Bearer $ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "videoId": "vAKCmMNHdHw",
    "title": "Why are sloths so slow?",
    "duration": "5:15"
  }'
```

이 API 호출 1번으로:

1. `daily_videos` 테이블에 오늘 날짜 + video_id 저장
2. `transcripts` 캐시 확인 → 없으면 자동 추출
3. `worksheets` + `phrases` 캐시 확인 → 없으면 Claude API 자동 생성

**결과:** 첫 번째 사용자가 앱에 접속할 때는 이미 모든 학습자료가 준비된 상태.
