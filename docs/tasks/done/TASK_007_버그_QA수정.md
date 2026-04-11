# TASK_007: QA 버그 수정 및 Gemini 안정화

> 상태: DONE

## 목표

- 보고된 4가지 QA 이슈(홈 화면 에러, Admin 제목 바인딩, 스크립트 가독성, Gemini 생성 실패) 해결

## 맥락

- **현재 상황:** 기능 구현은 완료되었으나 실제 사용 시 발생하는 런타임 에러 및 사용성 저하 문제 발견.
- **연관 파일:**
    - `src/components/home/DailyVideoBanner.tsx`
    - `src/app/admin/page.tsx`
    - `src/components/steps/Step2Script.tsx`
    - `src/lib/gemini.ts`

## 완료 기준

- [x] `/home` 진입 시 `buttonVariants` 관련 SSR 에러가 발생하지 않는가
- [x] Admin 페이지에서 YouTube URL 입력 시 제목이 자동으로 채워지는가
- [x] Step 2 스크립트가 문단 단위로 나뉘어 가독성 있게 표시되는가
- [x] Gemini API가 `gemini-1.5-flash-lite` 모델을 사용하며, JSON 파싱 에러 없이 학습자료를 생성하는가
- [x] Gemini 실패 시 Claude 폴백 과정에서 API 키 부재 시 적절한 에러를 반환하는가

## 제약

- `gemini-1.5-flash-lite` 모델 강제 사용 (2.5는 현재 미지원으로 가장 안정적인 1.5-lite 적용)
- `buttonVariants` 에러 해결을 위해 Client Component 전환
