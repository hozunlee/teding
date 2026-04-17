# TASK_022: StepProgress 클릭 네비게이션

> 상태: DONE

## 목표

학습 진행 중 이전 스텝 아이콘 클릭 시 해당 스텝으로 바로 이동 가능하게 수정. 복습 편의성 향상.

## 맥락

- 현재 `StepProgress.tsx`는 표시 전용 (클릭 불가)
- `currentStep`보다 낮은 스텝만 클릭 가능 (앞으로 건너뛰기 금지)
- URL SearchParams 변경만으로 동작, DB 저장 없음
- 대상: `src/components/steps/StepProgress.tsx`

## 완료 기준

- [ ] 완료한 스텝 아이콘 클릭 시 `router.push('?step=N')` 동작
- [ ] 현재 스텝 및 미완료 스텝은 클릭 불가 (커서: default)
- [ ] `"use client"` + `useRouter` 추가

## 구현 세부

```tsx
'use client'
import { useRouter } from 'next/navigation'

export function StepProgress({ currentStep, completedSteps }: Props) {
  const router = useRouter()

  const handleStepClick = (step: number) => {
    if (step < currentStep) {
      router.push(`?step=${step}`)
    }
  }

  return (
    // 기존 렌더링 구조 유지
    // 각 스텝 아이콘에:
    // onClick={step < currentStep ? () => handleStepClick(step) : undefined}
    // className에 step < currentStep ? 'cursor-pointer' : 'cursor-default'
  )
}
```

## 제약

- 미래 스텝 건너뛰기 금지 (완료되지 않은 스텝 클릭 차단)
- SSR hydration 불일치 방지를 위해 `"use client"` 필수
