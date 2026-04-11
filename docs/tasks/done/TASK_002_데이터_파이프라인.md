# TASK_002: 데이터 파이프라인 (Data Pipeline)

> 상태: DONE

## 목표

- Supabase Database API 통신 및 Gemini/Supadata(또는 파이썬) 스크립트 추출 파이프라인 구현

## 맥락

- **현재 상황:** 인증 완료, 레이아웃/디자인 시스템 준비됨. 데이터 생성 파이프라인 부재.
- **연관 파일:**
    - `src/lib/transcript.ts`
    - `src/lib/gemini.ts`
    - `src/app/api/admin/daily/route.ts`
    - `src/app/api/transcript/route.ts`
    - `src/app/api/generate/route.ts`
    - `src/app/api/today/route.ts`

## 완료 기준

- [x] `/api/admin/daily`를 호출하면 `daily_videos`에 영상이 등록되는가 (관리자 시크릿 검증 적용)
- [x] `/api/transcript`를 통해 스크립트 텍스트가 정상 추출 및 DB `transcripts`에 캐싱되는가
- [x] `/api/generate`를 통해 Gemini Flash 응답이 JSON으로 정상 반환 및 `learning_materials` 테이블에 단일 row로 Atomic하게 upsert되는가
- [x] Vercel 타임아웃 방지를 위해 AI 라우트에 `export const maxDuration = 60;` 이 명시되었는가

## 제약

- **Agent Engineering Skills의 'API & Interface Design(멱등성)' 적용 필수:** `learning_materials` upsert 시 `ignoreDuplicates: true` 반드시 적용할 것.
- 부분 실패(Partial Failure)를 방지하기 위해 생성 로직을 분리하지 않고 단일 흐름으로 처리할 것.
