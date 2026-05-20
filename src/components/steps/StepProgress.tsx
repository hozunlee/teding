'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  currentStep: number
  isCompleted?: boolean
}

const STEPS = [
  { n: 1, label: '시청' },
  { n: 2, label: '학습지' },
  { n: 3, label: '핵심표현' },
  { n: 4, label: '재시청' },
]

export function StepProgress({ currentStep, isCompleted = false }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleStepClick(stepNum: number) {
    if (stepNum >= currentStep && !isCompleted) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('step', String(stepNum))
    router.push(`/study?${params.toString()}`)
  }

  return (
    <div className='step-progress flex items-center gap-0 print:hidden'>
      {STEPS.map((step, i) => {
        const isStepCompleted = isCompleted || step.n < currentStep
        const isCurrent = step.n === currentStep

        return (
          <div key={step.n} className='flex items-center'>
            <div className='flex flex-col items-center gap-1'>
              <div
                onClick={() => handleStepClick(step.n)}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isCurrent
                    ? 'cursor-default bg-foreground text-background'
                    : isStepCompleted
                    ? 'cursor-pointer bg-[var(--brand-orange)] text-white hover:opacity-75'
                    : 'cursor-default bg-muted text-muted-foreground'
                }`}
              >
                {isStepCompleted && !isCurrent ? '✓' : step.n}
              </div>
              <span
                className={`text-mono-label ${
                  isCurrent ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1 mb-4 h-px w-8 sm:w-12 ${
                  isStepCompleted ? 'bg-[var(--brand-orange)]' : 'bg-border'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
