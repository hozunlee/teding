# TASK_004: Step 1 (무자막 시청) & Step 2 (스크립트)

> 상태: TODO

## 목표

- 학습 사이클의 시작점인 무자막 영상 시청 및 스크립트 데이터 로딩

## 맥락

- **현재 상황:** 학습 메인 뼈대 구성 필요. 상태를 유지하기 위한 SearchParams 기반 패러다임 구현 필요.
- **연관 파일:**
    - `src/app/study/page.tsx`
    - `src/components/steps/StepProgress.tsx`
    - `src/components/steps/Step1Player.tsx`
    - `src/components/steps/Step2Script.tsx`

## 완료 기준

- [ ] URL `?step=N`을 SSoT로 사용하여 스텝을 전환할 수 있는가 (useState 사용 지양)
- [ ] YouTube iFrame에서 `cc_load_policy=0` 속성이 정상 적용되어 기본적으로 자막이 꺼지는가
- [ ] Step 2에서 `/api/materials` 캐시를 확인하고 없다면 추출/생성을 자연스럽게 트리거하며 Loading State를 지원하는가
- [ ] Step 전환별 DB 진행 저장 (`/api/progress`) 연동이 동작하는가

## 제약

- 잦은 스피너 호출 지양 (React Suspense 경계 최소화)
- `getSupabaseBrowser()` 싱글턴 활용
