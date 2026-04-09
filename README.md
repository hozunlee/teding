<div align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/TED_Ed_logo.svg" alt="TED-fi Logo" width="120" />
  <h1>TED-fi</h1>
  <p><strong>매일 조금씩, 영어 귀가 트이는 경험</strong></p>
  <p>TED-Ed 영상 한 편을 4단계로 마스터하는 AI 기반 영어 학습 애플리케이션</p>
  
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" /></a>
    <a href="https://ai.google.dev/"><img src="https://img.shields.io/badge/Gemini_1.5_Flash-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" /></a>
  </p>
</div>

<br />

## 🌟 Introduction

**TED-fi**는 수많은 영어 강의와 자료 속에서 헤매지 않도록, **'매일 하나의 영상'**에만 집중하게 만드는 AI 기반 영어 학습 서비스입니다. 
관리자가 매일 하나의 TED-Ed 영상을 등록하면, **Google Gemini 1.5 Flash** 모델이 영상을 분석해 자동으로 학습지, 핵심 어휘, 구문 분석 자료를 생성합니다. 생성된 자료는 전역 캐싱되어 모든 사용자가 대기 시간 없이 즉각적으로 학습에 돌입할 수 있습니다.

## ✨ Core Features

*   📺 **오늘의 영상 (Daily Video)**: 매일 새롭게 제공되는 TED-Ed 영상 1개. 무한 스크롤의 늪에 빠지지 않도록 선택의 고민을 없앴습니다.
*   🔄 **4단계 학습 사이클 (Study Cycle)**:
    1.  **무자막 시청**: 오직 소리와 영상에만 집중하여 스토리를 파악합니다. (`cc_load_policy=0` 적용)
    2.  **스크립트 확인**: AI가 분석한 영상의 단어 수, 문장 수, 수준 등을 파악하며 스크립트 미리보기를 제공합니다.
    3.  **마법의 학습지**: 리딩 지문, 객관식, 단답형, 에세이로 구성된 HTML 학습지를 PDF로 다운로드하고 결과물을 업로드합니다.
    4.  **핵심 표현 및 구문 분석**: 에피소드에서 뽑아낸 일상 표현 5개와 심층 문장 구조 분석 트리를 학습합니다.
*   ⚡ **전역 캐싱 아키텍처 (Global Caching)**: 첫 번째 학습자(혹은 서버)가 AI 자료를 생성하면 `learning_materials` 테이블에 원자적(Atomic)으로 Upsert되어, 이후 두 번째 접속자부터는 **0초**만에 자료가 로딩됩니다 (부분 실패 구조적 방지).
*   🔥 **학습 스트릭 & 공유**: 매일 달성하는 연속 학습 일수(Streak)를 확인하고 카카오톡/SNS로 소셜에 공유할 수 있습니다.
*   🎨 **Together AI Design System**: 부드러운 Pastel Cloud 그라데이션, 샤프한 4px 기하학 라운딩, 밀도 높은 타이포그래피(`.text-display`)를 결합한 극강의 프리미엄 UI.

## 🛠️ Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Database & Auth**: Supabase (PostgreSQL, Auth, Storage)
*   **AI Model**: Google Gemini 1.5 Flash (응답 파싱 안전성을 위한 `application/json` Schema 강제 적용) / Claude 3.5 Sonnet (Fallback)
*   **UI/Styling**: Tailwind CSS, shadcn/ui
*   **State / Routing**: URL SearchParams (Single Source of Truth)
*   **Deployment**: Vercel (AI 라우트 `maxDuration` 지원)

## 🚀 Getting Started

### 1. Prerequisites

-   Node.js (>= 20)
-   [pnpm](https://pnpm.io/) (>= 9.0)
-   Supabase 프로젝트 및 Google Gemini API Key

### 2. Environment Variables

루트 디렉토리에 `.env.local` 파일을 생성하고 다음 값을 입력합니다.

```env
# Supabase 연결
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AI API Keys
GEMINI_API_KEY=your_gemini_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key  # (Fallback 용)
SUPADATA_API_KEY=your_supadata_api_key    # (유튜브 스트립트 추출용)

# 관리자 인증 (Daily 비디오 생성용)
ADMIN_SECRET=your_admin_secret
```

### 3. Installation & Run

```bash
# 의존성 설치
pnpm install

# 타입 유효성 검사
pnpm typecheck

# Supabase 데이터베이스 타입 동기화 (Prisma 사용 안함)
pnpm supabase gen types typescript --project-id <your-project-id> > src/types/database.ts

# 로컬 개발 서버 실행
pnpm dev
```
접속 URL: `http://localhost:4000`

## 📁 Project Structure

```bash
📦 src
 ┣ 📂 app              # Next.js App 라우터 (페이지 및 API 엔드포인트)
 ┃ ┣ 📂 api            # 백엔드 파이프라인 (transcript, generate, admin 등)
 ┃ ┣ 📂 home           # 접속 후 진입하는 대시보드
 ┃ ┣ 📂 study          # 4단계 학습 사이클 및 완료 화면
 ┃ ┗ 📂 auth           # Supabase OAuth 라우트
 ┣ 📂 components       # UI 컴포넌트
 ┃ ┣ 📂 home           # 홈 대시보드 조각 (Today Banner, Streak Card)
 ┃ ┣ 📂 steps          # 4단계 학습 컴포넌트 모음
 ┃ ┣ 📂 ui             # shadcn/ui 기반 공통 Foundation 컴포넌트
 ┃ ┗ 📂 worksheet      # 학습지 렌더러 및 파일 업로더
 ┣ 📂 lib              # 외부 연동 유틸리티 (Supabase Client, Gemini SDK)
 ┗ 📂 types            # Database Type 및 AI 프롬프트 스키마 구조체
```

## 📐 Design System & Guidelines

단순한 기능 구현을 넘어 지속 가능한 프로젝트를 위해 엄격한 개발/디자인 규칙을 적용하고 있습니다. 관련 문서는 `docs/` 하위에서 확인할 수 있습니다.

- [PRD.md](./docs/PRD.md): 제품 기획 및 캐싱 전략
- [UI_UX_GUIDE.md](./docs/UI_UX_GUIDE.md): 에어리한 분위기, 다크/라이트 존, 브레이크포인트 규격
- [WORKFLOW.md](./docs/WORKFLOW.md): 태스크 기반의 AI 페어 프로그래밍 협업 사이클
- [CLAUDE_CODE_GUIDE.md](./docs/CLAUDE_CODE_GUIDE.md): Vercel Serverless 한계, 멱등성 보장(API Design), 상태(URL param) 관리 규칙

## 📜 License

This project is licensed under the [MIT License](LICENSE).
