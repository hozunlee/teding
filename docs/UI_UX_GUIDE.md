# TED-fi — UI/UX 가이드

---

## 1. 디자인 원칙

| 원칙 | 설명 |
|------|------|
| 에어리한 분위기 (Pastel Cloud) | 부드러운 핑크-라벤더-블루 그라데이션으로 밝고 열린 플랫폼 환경 구성 |
| 샤프한 기하학 (Sharp Geometry) | 둥근(Rounded) 컴포넌트 형태 지양. 4px, 8px 위주의 날카롭고 단단한 에지(Edge) 사용 |
| 세련된 타이포그래피 밀도 | 표시 텍스트(Headings)의 자간(Negative Tracking)을 좁히고 모노(Mono) 라벨을 대문자로 배치해 모던함 연출 |
| 다크/라이트 존 명확 분리 | 메인 비즈니스 로직(라이트 존) 및 연구·기술 설명 영역(딥 네이비 #010120 다크 존) 분리 |
| 흐름 유지 및 즉각적 반응 | 4단계가 자연스럽게 이어지며, 잦은 스피너 대신 즉각적으로 응답 (캐시 활용 최대화) |

---

## 1.5. UI Engineering Checklist (에이전트 필수 점검)
프론트엔드 컴포넌트나 레이아웃 변경 시 반드시 다음을 자체 점검한다.
- **Edge Cases**: Empty state(데이터 없음), Loading state, Error state가 시각적으로 핸들링되었는가?
- **Responsiveness**: `< 640px` 모바일 뷰파인트를 먼저 고려했는가? (Tap target size 44px+ 권장)
- **Accessibility**: 폼 엘리먼트에 적절한 label 및 aria 속성이 있거나 키보드 탐색이 가능한가?
- **Performance**: 하드코딩 배열 매핑 대신, 최소 렌더링을 보장하는 구조인가?

---

## 2. 반응형 브레이크포인트

| 디바이스 | 너비 | 레이아웃 |
|----------|------|----------|
| 모바일 (갤럭시 S25 등) | < 640px | 1열, 하단 탭바 |
| 태블릿 (아이패드, 갤탭) | 640px ~ 1024px | 1열, 상단 네비 |
| 데스크톱 | > 1024px | 사이드바 + 본문 2단 |

### 태블릿 특이사항
- 학습지 화면은 태블릿에서 **A4 비율 렌더링** — 굿노트에서 열었을 때와 동일한 레이아웃
- PDF 다운로드 버튼을 탭 상단에 고정 노출

---

## 3. 컬러 시스템

```css
/* 브랜드 컬러 (Together AI Design System) */
--brand-magenta: #ef2cc1;       /* 일러스트 및 그라데이션 하이라이트 */
--brand-orange:  #fc4c02;       /* 그라데이션 웜 엔드포인트 */
--dark-blue:     #010120;       /* 다크 모드 / 서페이스 배경 (절대 일반 검정/회색 제외) */
--soft-lavender: #bdbbff;       /* 부드러운 하이라이트 및 액센트 */

/* UI 기반 */
--background: #ffffff;
--foreground: #000000;
--shadow-elegant: 0px 4px 10px rgba(1, 1, 32, 0.1); /* 약간 푸른빛 도는 그림자 엘리베이션 */

/* 상태 및 서페이스 뱃지 */
--cache-hit:  rgba(0,0,0,0.04);
--cache-miss: rgba(0,0,0,0.04);
```

---

## 4. 주요 화면 명세

### 4-1. 랜딩 (비로그인)

```
┌─────────────────────────────┐
│  TED-fi                     │  ← 로고
│                             │
│  [TED-Ed × AI 영어 학습]    │  ← badge
│                             │
│  매일 조금씩,               │
│  영어 귀가 트이는 경험       │  ← hero title
│                             │
│  TED-Ed 영상 한 편으로      │
│  읽기·듣기·쓰기를 한 번에  │  ← subtitle
│                             │
│  [G] Google로 시작하기      │  ← CTA 버튼
│                             │
│  학습 가이드 보기 →         │  ← About 링크
└─────────────────────────────┘
```

**컴포넌트:**
- `LandingHero` — 배지, 타이틀, 서브타이틀, CTA
- `GoogleSignInButton` — Supabase OAuth 트리거

---

### 4-2. 앱 홈 (대시보드)

```
┌─────────────────────────────────────────┐
│ TED-fi              [호야] 🔥 12일      │  ← topnav
├─────────────────────────────────────────┤
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [썸네일] 오늘의 영상               │ │
│ │          How did the Monkey King…  │ │
│ │          TED-Ed · 5:24 · 즉시 로드 │ │  ← DailyVideoBanner
│ │                      [학습 시작 →] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌──────────────┐  ┌──────────────────┐ │
│ │ 내 스트릭    │  │ 이번 주 학습     │ │
│ │    12일      │  │ ● ● ● ● ● ○ ○   │ │  ← StreakCard
│ │ 연속 학습 중 │  │                  │ │
│ └──────────────┘  └──────────────────┘ │
│                                         │
│ 최근 학습 기록                          │
│ ┌─────────────────────────────────────┐ │
│ │ ✓ Why sloths are slow   어제        │ │
│ │ ✓ Monkey King           2일 전      │ │  ← RecentList
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

### 4-3. Step 1 — 무자막 시청

```
┌─────────────────────────────┐
│ ← 오늘의 학습    1 / 4      │  ← progress header
│ ━━━━━━━━░░░░░░░░░░░░░░░░░░ │  ← progress bar 25%
│                             │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │    ▶   [YouTube 플레이어] │ │  ← iFrame (cc_load_policy=0)
│ │       자막 숨김 재생 중  │ │
│ │                    CC̶   │ │  ← CC 취소선 표시
│ └─────────────────────────┘ │
│                             │
│  2:10 ━━━━━━░░░░░░░ 5:24   │
│                             │
│ ✓ 전체 맥락 파악            │
│ ✓ 애니메이션으로 흐름 이해  │
│ ○ 끝까지 시청               │
│                             │
│ ℹ 100% 이해 안 해도 돼요.   │
│   분위기만 느껴보세요.      │
│                             │
│ [시청 완료 → 스크립트 확인] │  ← CTA
└─────────────────────────────┘
```

**컴포넌트:**
- `YouTubePlayer` — iFrame API, `cc_load_policy=0`, `rel=0`
- `CheckList` — 3개 항목, 체크 애니메이션
- `StepCTA` — 완료 버튼

---

### 4-4. Step 2 — 스크립트 확인

```
┌─────────────────────────────┐
│ ← 스크립트 확인   2 / 4    │
│ ━━━━━━━━━━━━━░░░░░░░░░░░░░ │  50%
│                             │
│ [● 캐시 히트 — 즉시 로드]  │  ← CacheBadge
│                             │
│ ┌────────────┬────┬────┐   │
│ │ 847 단어   │ 32 │ B1 │   │  ← StatRow
│ │            │문장│레벨│   │
│ └────────────┴────┴────┘   │
│                             │
│ ┌─────────────────────────┐ │
│ │ After wreaking havoc…   │ │
│ │ the Monkey King had…    │ │  ← ScriptPreview (fade)
│ │ ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ │ │
│ └─────────────────────────┘ │
│                             │
│ [학습지 보기 →]             │
└─────────────────────────────┘
```

---

### 4-5. Step 3 — 학습지

```
┌─────────────────────────────┐
│ ← 학습지          3 / 4    │
│ ━━━━━━━━━━━━━━━━━━░░░░░░░░ │  75%
│                             │
│ [PDF 다운로드 ↓] [필기본 업로드 ↑] │
│                             │
│ ┌─────────────────────────┐ │
│ │ English Reading Worksheet│ │
│ │ ── Grade 6 ──           │ │
│ │                         │ │
│ │ Part 1 · Reading        │ │
│ │ The Monkey King refused │ │
│ │ to bow even before…    │ │
│ │                         │ │
│ │ Part 2 · Vocabulary     │ │
│ │ extinct / metabolism…   │ │
│ │                         │ │
│ │ Part 3 · Questions      │ │
│ │ 1. Why was Sun Wukong…  │ │  ← WorksheetRenderer
│ │   A) …  B) …           │ │
│ └─────────────────────────┘ │
│                             │
│ [학습지 완료 → 핵심 표현]  │
└─────────────────────────────┘
```

**필기본 업로드 플로우:**
1. "필기본 업로드" 버튼 탭
2. 파일 선택 다이얼로그 (PDF만 허용)
3. Supabase Storage 업로드
4. 완료 시 "업로드 완료 ✓" 카드 표시

---

### 4-6. Step 4 — 핵심 표현 + 구문 분석

```
┌─────────────────────────────┐
│ ← 핵심 표현       4 / 4    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━ │  100%
│                             │
│ AI가 엄선한 일상 활용 표현  │
│                             │
│ ┌─────────────────────────┐ │
│ │ refuse to + 동사        │ │  ← PhraseCard
│ │ "~하기를 거부하다"      │ │
│ │ "I refuse to give up."  │ │
│ │ 일상: "I refuse to let… │ │
│ │ [의지표현] [to부정사]   │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ what he thought was ~   │ │
│ │ …                       │ │
│ └─────────────────────────┘ │
│                             │
│ 문장 구문 분석              │
│                             │
│ "Boasting of his abilities, │
│  he demanded to be made…"  │  ← 탭 가능한 문장
│                             │
│ ┌────────┬──────┬─────────┐ │
│ │분사구문│ 주어 │수동부정사│ │  ← ParseChips
│ │Boasting│  he  │to be…  │ │
│ └────────┴──────┴─────────┘ │
│                             │
│ 💡 문두 분사구문은…        │  ← TipBox
│                             │
│ [알았어요 ✓]  [Claude에 질문]│
└─────────────────────────────┘
```

---

### 4-7. 완료 화면

```
┌─────────────────────────────┐
│                             │
│         ✓ (초록 원)         │
│                             │
│     오늘 학습 완료!         │
│  13일 연속 학습 달성 중     │
│                             │
│ ┌──────┬──────┬──────────┐  │
│ │  32  │  5   │    5     │  │  ← StatRow
│ │문장  │ 표현 │ 문제완료 │  │
│ └──────┴──────┴──────────┘  │
│                             │
│    학습 완료 자랑하기        │
│                             │
│ ┌─────────────────────────┐ │
│ │ [노란색] 카카오톡으로 공유│ │  ← KakaoShareBtn
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ [파란색] SNS에 공유      │ │  ← SNSShareBtn
│ └─────────────────────────┘ │
│                             │
│ [← 홈으로]                 │
└─────────────────────────────┘
```

---

### 4-8. 학습 가이드 (About)

**접근:** 네비게이션 "학습 가이드" 탭 또는 랜딩 하단 링크

```
학습 가이드 페이지 구성:
1. 제목 + 한 줄 설명
2. 4단계 가이드 (Step 번호 · 제목 · 소요시간 · 설명 · 팁박스)
3. FAQ 아코디언 (5~6개)
   - 매일 해야 하나요?
   - 영어 수준이 낮아도 괜찮나요?
   - 굿노트 없이도 사용할 수 있나요?
   - 오늘의 영상은 누가 정하나요?
   - 같은 영상을 다른 사람도 공부하나요?
4. 앱 소개 카드 (만든 이유 · 기술 · 개인정보 · 캐싱 정책)
```

---

## 5. 컴포넌트 목록 (Claude Code 구현 단위)

```
src/
├── components/
│   ├── layout/
│   │   ├── TopNav.tsx
│   │   ├── BottomTabBar.tsx      ← 모바일 전용
│   │   └── Sidebar.tsx           ← 데스크톱 전용
│   ├── home/
│   │   ├── DailyVideoBanner.tsx
│   │   ├── StreakCard.tsx
│   │   └── RecentList.tsx
│   ├── steps/
│   │   ├── StepProgress.tsx      ← 상단 진행바
│   │   ├── Step1Player.tsx       ← YouTube iFrame
│   │   ├── Step2Script.tsx       ← 스크립트 미리보기
│   │   ├── Step3Worksheet.tsx    ← 학습지 렌더러
│   │   ├── Step4Phrases.tsx      ← 핵심 표현 카드
│   │   ├── Step4SentenceAnalysis.tsx  ← 구문 분석
│   │   └── CompleteScreen.tsx
│   ├── worksheet/
│   │   ├── WorksheetRenderer.tsx ← HTML 학습지 렌더링
│   │   ├── PDFDownloadButton.tsx
│   │   └── UploadAnnotated.tsx
│   ├── ui/
│   │   ├── CacheBadge.tsx
│   │   ├── PhraseCard.tsx
│   │   ├── ParseChip.tsx
│   │   └── ShareButtons.tsx
│   └── auth/
│       ├── GoogleSignInButton.tsx
│       └── AuthGuard.tsx
├── app/
│   ├── page.tsx                  ← 랜딩
│   ├── home/page.tsx             ← 앱 홈
│   ├── study/page.tsx            ← 학습 사이클 메인
│   ├── guide/page.tsx            ← 학습 가이드
│   └── api/
│       ├── today/route.ts
│       ├── transcript/route.ts
│       ├── generate/route.ts
│       ├── worksheet/[videoId]/route.ts
│       ├── phrases/[videoId]/route.ts
│       ├── progress/route.ts
│       ├── upload/route.ts
│       ├── streak/route.ts
│       └── admin/daily/route.ts
├── lib/
│   ├── supabase.ts
│   ├── prisma.ts
│   ├── claude.ts                 ← Claude API 래퍼
│   ├── transcript.ts             ← 스크립트 추출 로직
│   └── pdf.ts                    ← PDF 생성 유틸
└── types/
    └── worksheet.ts              ← Claude 응답 타입 정의
```

---

## 6. 학습지 HTML 렌더링 스펙

학습지는 **PDF와 동일한 레이아웃**으로 화면에도 렌더링된다.  
`WorksheetRenderer.tsx`가 `worksheet` JSON을 받아 아래 구조를 렌더링한다.

```
┌─────────────────────────────────────────┐
│  골드 이중 구분선                       │
│  English Reading Worksheet · Grade 6    │
│  제목 (골드 강조)                       │
│  Based on TED-Ed                        │
│  골드 이중 구분선                       │
│  Name / Date / Class / Score 입력칸     │
├─────────────────────────────────────────┤
│  PART 1 (빨간 소문자)                  │
│  📖 Reading Passage                     │
│  각 단락 (골드 왼쪽 보더, 파치먼트 배경) │
├─────────────────────────────────────────┤
│  PART 2                                 │
│  📚 Key Vocabulary (2열 그리드)        │
├─────────────────────────────────────────┤
│  PART 3                                 │
│  🧠 Comprehension Questions            │
│  객관식 5개 (선택지 박스 스타일)        │
│  단답형 3개 (밑줄 3줄)                 │
├─────────────────────────────────────────┤
│  PART 4                                 │
│  ✍️ Short Essay (프롬프트 + 밑줄 18줄) │
└─────────────────────────────────────────┘
```

**CSS 변수 (학습지 전용):**
```css
--ws-gold:      #C8963E;
--ws-parchment: #FBF7EE;
--ws-ink:       #2C1F0A;
--ws-deep:      #1A1208;
--ws-red:       #9B2335;
--ws-faded:     #8A7560;
```

PDF 다운로드 시 이 HTML을 `html2canvas → jsPDF`로 변환.
