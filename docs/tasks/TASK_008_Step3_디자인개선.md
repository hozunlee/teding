# TASK_008: Step 3 학습지 UI 디자인 가이드 적용 및 로직 강화

> 상태: IN_PROGRESS

## 목표
- `DESIGN.md` (Together AI) 및 `docs/worksheet_guide.html` 기반으로 학습지 렌더링을 완성하고, `Step 3` 진입 시 학습자료 생성 및 로딩 프로세스를 튼튼하게 구현한다.

## 완료 기준
- [ ] `WorksheetRenderer.tsx` 가 `worksheet_guide.html` 의 모든 섹션(헤더, 인포바, 스크립트 박스, 문제 등)을 디자인 가이드에 맞춰 시각적으로 완벽하게 렌더링하는가
- [ ] `globals.css` 에 인쇄용 컬러 변수 및 `@media print` 스타일이 올바르게 추가되었는가
- [ ] `src/app/study/page.tsx` 에서 학습자료 부재 시 단순히 무한 로딩이 아닌, 사용자 친화적인 대기 화면(디자인 시스템 적용)을 제공하는가

## 제약
- `DESIGN.md` 의 폰트(`The Future`, `Mono Label`) 및 컬러 시스템 준수
- 인쇄 시에는 `worksheet_guide.html` 의 클래식한 학습지 스타일 유지
