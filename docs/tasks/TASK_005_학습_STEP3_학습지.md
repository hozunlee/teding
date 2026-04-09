# TASK_005: Step 3 (학습지 렌더링 및 PDF 기능)

> 상태: TODO

## 목표

- 생성된 JSON을 기반으로 A4 해상도 PDF에 맞게 화면을 렌더링하고, 인쇄 및 업로드 기능 처리

## 맥락

- **현재 상황:** AI 기반 Worksheet JSON 구조는 결정되었으나 HTML 렌더링 코드가 없음
- **연관 파일:**
    - `src/components/steps/Step3Worksheet.tsx`
    - `src/components/worksheet/WorksheetRenderer.tsx`
    - `src/components/worksheet/PDFDownloadButton.tsx`
    - `src/components/worksheet/UploadAnnotated.tsx`

## 완료 기준

- [ ] `learning_materials.worksheet_json`을 읽고 UI 가이드 사양에 맞춰 시각적으로 렌더링하는가 (골드 색상, 이중선 등)
- [ ] "PDF 다운로드" 버튼을 눌렀을 때 `window.print()`를 트리거하고, `@media print`가 정확히 작동하여 A4 템플릿만 출력하는가
- [ ] "필기본 업로드"로 PDF 파일을 선택하면 Supabase Storage 버킷에 저장되고 `user_uploads` 테이블에 기록되는가

## 제약

- `jsPDF`, `html2canvas` 라이브러리 사용 전면 금지 (브라우저 네이티브 인쇄 필수)
- CSS에서 `@media print` 타겟팅 시 네비게이션 및 여타 UI를 `display: none !important`로 강제
