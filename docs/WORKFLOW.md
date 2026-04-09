# TED-fi Workflow

> 목적: AI와의 컨텍스트 단절 방지. 모든 기능은 단일 태스크로 취급.

---

## 1. 폴더 구조

```
docs/
├── WORKFLOW.md          ← 이 파일. 협업 규칙의 SSoT
├── PRD.md               ← 제품 기획 및 기술 설계
├── CLAUDE_CODE_GUIDE.md ← 구현 순서 및 패턴 가이드
├── UI_UX_GUIDE.md       ← 화면 명세 및 컴포넌트 목록
├── ARCHITECTURE.md      ← 스키마/API 변경 이력 (AI 환각 방지)
├── DONE.md              ← 완료 작업 한 줄 요약 (토큰 절약)
└── tasks/
    ├── TASK_001_인증_구글로그인.md
    └── TASK_002_오늘의영상_대시보드.md
```

---

## 2. 태스크 상태 흐름

```
[TODO] → [IN_PROGRESS] → [AI_REVIEW] → [DONE]
```

---

## 3. 태스크 파일 템플릿

```markdown
# TASK_[번호]: [작업명]

> 상태: TODO | IN_PROGRESS | AI_REVIEW | DONE

## 목표
- [한 줄 요약]

## 맥락
- **현재 상황:** [무엇이 완료됐고 무엇이 막혀 있는지]
- **연관 파일:**
  - `src/...`

## 완료 기준
- [ ] [검증 가능한 동작 조건 1]
- [ ] [검증 가능한 동작 조건 2]

## 제약
- Supabase 클라이언트는 반드시 `getSupabaseBrowser()` 싱글턴 사용
- DB 접근은 서버(API Route)에서만
- 스텝 상태는 URL SearchParams로만 관리 (`?step=N`)
- PDF는 `window.print()` + `@media print` 방식만 사용
```

### 예시

```markdown
# TASK_003: 학습지 렌더링 및 PDF 다운로드

> 상태: IN_PROGRESS

## 목표
- Step 3에서 학습지를 화면에 렌더링하고 PDF로 다운로드할 수 있다.

## 맥락
- **현재 상황:** `/api/materials/[videoId]` 완료. WorksheetRenderer 미구현.
- **연관 파일:**
  - `src/app/study/page.tsx`
  - `src/components/steps/Step3Worksheet.tsx`
  - `src/components/worksheet/WorksheetRenderer.tsx`
  - `src/types/worksheet.ts`

## 완료 기준
- [ ] `worksheet_json` 데이터로 리딩 지문·어휘·문제가 렌더링되는가
- [ ] `window.print()` 호출 시 학습지 영역만 A4로 출력되는가
- [ ] `@media print`에서 nav·step-progress·pdf-bar가 숨겨지는가
- [ ] 필기본 PDF 업로드 후 Supabase Storage에 저장되는가

## 제약
- `jsPDF`, `html2canvas` 사용 금지
- `getSupabaseBrowser()` 싱글턴만 사용
```

---

## 4. 세션 시작 프롬프트

새 세션(채팅) 시작 시 아래 형식으로 AI를 깨운다.

```
새로운 세션 시작.
CLAUDE.md와 docs/tasks/TASK_XXX.md를 읽고 현재 상태를 파악해.
오늘 작업할 태스크: TASK_[번호]
```

---

## 5. 완료 후 이력 업데이트

태스크 완료 시 `DONE.md`에 한 줄만 추가. 태스크 파일은 상태만 DONE으로 변경.

```markdown
<!-- docs/DONE.md -->
- 2026-01-15 TASK_001: Google OAuth + Middleware matcher + 싱글턴 클라이언트 구현 완료
- 2026-01-16 TASK_002: 오늘의 영상 대시보드 + 스트릭 카드 구현 완료
```

---

## 6. 스키마/API 변경 시 (필수)

Supabase 테이블·컬럼·API 인터페이스가 변경되면 **즉시** `ARCHITECTURE.md`에 기록.  
기록하지 않으면 AI가 구 버전 구조 기반으로 코드를 생성함.

```markdown
<!-- docs/ARCHITECTURE.md 예시 -->
## 2026-01-15: learning_materials 테이블 추가 (TASK_001)
- worksheets + phrases 통합 → learning_materials 단일 테이블
- 컬럼: worksheet_json, phrases_json, sentences_json, raw_json
- 이유: 부분 실패(Partial Failure) 방지, upsert 1회로 원자적 저장
- 타입 재생성: `pnpm supabase gen types typescript --project-id <id> > src/types/database.ts`
```

---

## 7. 핵심 원칙

| 원칙 | 이유 |
|------|------|
| 태스크 파일은 짧고 구조화 | AI 컨텍스트를 코드 생성에 집중 |
| 완료 기준은 체크리스트로 | 검증 가능한 동작만 기술 |
| 스키마 변경은 즉시 ARCHITECTURE.md 기록 | AI의 구 버전 환각 방지 |
| DONE.md는 한 줄 요약만 | 히스토리 보존 + 토큰 낭비 방지 |
