# TASK_006: Step 4 (핵심표현) & 학습 완료 화면

> 상태: DONE

## 목표

- 학습 사이클의 매듭을 짓고 카카오/SNS 공유를 유도하는 루프 달성

## 맥락

- **현재 상황:** 마지막 스텝, 앞 단계에서 불러온 캐시(JSON)를 재활용하여 렌더링
- **연관 파일:**
    - `src/components/steps/Step4Phrases.tsx`
    - `src/components/steps/Step4SentenceAnalysis.tsx`
    - `src/app/study/complete/page.tsx`
    - `src/app/api/progress/route.ts`

## 완료 기준

- [x] `learning_materials` 데이터를 바탕으로 핵심 표현 카드와 탭 가능한 구문 분석 트리를 추가 API 호출 없이 표시하는가
- [x] 마지막 "완료" 처리 시 스트릭 업데이트 백엔드 로직이 올바르게 동작하는가
- [x] 완료 화면(`/study/complete`)에서 통계 데이터 노출 및 외부 공유 버튼(Web Share API / Kakao SDK 등)이 작동하는가

## 제약

- 데이터 로딩은 지양하며 Step 3의 props / Context 캐시 데이터를 100% 재사용
- 공유 시 URL이 오염되지 않도록 별도 라우트(`/study/complete`) 유지
