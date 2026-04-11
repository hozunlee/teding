<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/TED_Ed_logo.svg" alt="TED-fi Logo" width="100" />
  <h1>TED-fi</h1>
  <p><strong>매일 조금씩, 영어 귀가 트이는 경험</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Gemini_2.5_Flash-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" /></a>
  </p>

  <p>
    <a href="https://ted-hoho.vercel.app">🌐 ted-hoho.vercel.app</a>
  </p>
</div>

---

## 만든 이유

아내가 영어 공부한다고 했다.

뭔가를 결제한다길래 아차 싶었다.
앱을 만들었다.

이제 아내는 매일 TED-Ed 영상 한 편으로 공부하고 있다.  
나는 가끔 서버 로그를 본다.

---

## 어떻게 공부하나요?

TED-fi의 학습 방식은 한 영상을 **여러 번, 목적을 바꿔가며** 보는 구조다.  
이 방법론은 [이 영상](https://www.youtube.com/watch?v=Z6NXm05VC14)에서 영감을 받았다.

자세한 학습 방법은 → **[학습 가이드](/guide)** 에서 확인 (로그인 불필요)

---

## 5단계 학습 사이클

| 단계 | 이름                | 목적                                    |
| ---- | ------------------- | --------------------------------------- |
| 1    | 무자막 시청         | 자막 없이 소리에만 집중                 |
| 2    | 스크립트 확인       | 원문 독해, 단어/문장 수준 파악          |
| 3    | AI 학습지           | AI 생성 문제 풀기 (PDF 다운로드/업로드) |
| 4    | 핵심 표현·구문 분석 | 일상 활용 표현 5개 + 심층 문법          |
| 5    | 재시청              | 학습 후 다시 들으면 들린다              |

> 관리자가 매일 TED-Ed 영상 1개를 등록하면, 모든 사용자가 동일한 영상으로 학습한다.  
> AI 학습 자료는 최초 1회 생성 후 전역 캐싱 — 두 번째 접속자부터 즉시 로딩.

---

## 주요 기능

- **오늘의 영상** — 매일 새 영상 1개. 선택 고민 없음.
- **AI 학습자료 자동 생성** — Gemini 2.5 Flash가 학습지·핵심표현·구문분석 자동 생성
- **보고또보고** — 과거 날짜별 영상 목록. 다시 공부하고 싶을 때.
- **스트릭 & 공유** — 연속 학습 일수 추적, 카카오톡/SNS 공유
- **학습 가이드** — 비로그인 공개 페이지, 공부법 설명

---

## Tech Stack

- **Framework**: Next.js (App Router), TypeScript
- **DB / Auth**: Supabase (PostgreSQL, Auth, Storage)
- **AI**: Google Gemini 2.5 Flash / Claude (Fallback)
- **UI**: Tailwind CSS, shadcn/ui
- **State**: URL SearchParams (SSoT — 새로고침해도 스텝 유지)
- **Deployment**: Vercel

---

## Getting Started

```bash
# 1. 의존성 설치
pnpm install

# 2. 환경변수 설정
cp .env.example .env.local
# .env.local 편집

# 3. 개발 서버
pnpm dev
# http://localhost:4000
```

### 환경변수

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=
ANTHROPIC_API_KEY=       # Fallback

SUPADATA_API_KEY=        # 유튜브 스크립트 추출
ADMIN_SECRET=            # 관리자 API 인증
ADMIN_EMAIL=

NEXT_PUBLIC_KAKAO_JS_KEY=
NEXT_PUBLIC_APP_URL=https://ted-hoho.vercel.app
```

---

## 관련 문서

- [PRD.md](./docs/PRD.md) — 제품 기획
- [CLAUDE_CODE_GUIDE.md](./docs/CLAUDE_CODE_GUIDE.md) — 개발 규칙
- [SCHEMA.md](./docs/SCHEMA.md) — DB 스키마

---

## License

[MIT](LICENSE)
