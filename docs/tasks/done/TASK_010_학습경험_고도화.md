# TASK_010: Step 3/4 학습 경험(Progressive Disclosure) 고도화

> 상태: IN_PROGRESS

## 목표
- Step 3/4 학습 경험을 개선하여 "영어 중심 학습 + 필요 시 한글 지원" 환경을 구축한다.
- 하이라이트 연동, 단어장 스타일 점진적 노출, 상세 해설 및 모범 에세이를 추가한다.

## 완료 기준
- [ ] `src/types/worksheet.ts` 및 프롬프트에 `koreanMeaning`, `explanation`, `modelEssay` 필드가 추가되고 AI가 이를 정상적으로 생성하는가
- [ ] Step 3 지문 내에서 핵심표현/구문이 하이라이트되고, 클릭 시 반응형(BottomSheet/Popover)으로 설명이 노출되는가
- [ ] Step 3 Part 2 단어(Vocabulary) 영역에서 한글 뜻이 호버/탭 시에만 나타나는가
- [ ] 정답지(Answer Key) 섹션에 문제별 상세 해설 및 AI 모범 에세이가 포함되었는가
- [ ] Step 4 핵심 표현 카드에서 한글 해석이 기본적으로 가려져 있고 클릭 시 나타나는가

## 제약
- `gemini-1.5-flash-lite` 사용
- 인쇄 시(`@media print`) 가려진 텍스트들이 모두 정상적으로 보이도록 처리
