# TASK_023: Web Speech API - useSpeech 훅 + Step3/4 연결

> 상태: DONE

## 목표

`SpeechSynthesis API`를 래핑한 `useSpeech` 훅을 구현하고, Step3(학습지 본문)와 Step4(핵심 문장) 텍스트 옆에 🔊 버튼을 추가해 영어 발음을 즉시 들을 수 있도록 한다.

## 맥락

- 브라우저 네이티브 `window.speechSynthesis` 사용 (외부 API 불필요)
- SSR 환경에서 `window` 접근 시 에러 방지 필요
- 대상: `src/lib/hooks/use-speech.ts` (신규), `Step3Worksheet.tsx`, `Step4Phrases.tsx`

## 완료 기준

- [ ] `src/lib/hooks/use-speech.ts` 구현
- [ ] Step3 학습지 본문 각 문단 옆 🔊 버튼 동작
- [ ] Step4 핵심표현 탭 각 문장(pattern) 옆 🔊 버튼 동작
- [ ] Step4 구문분석 탭 각 문장(text) 옆 🔊 버튼 동작
- [ ] 재생 중 버튼 시각적 피드백 (재생 중 색상 변경)
- [ ] 동일 텍스트 재클릭 시 정지 토글

## 구현 세부

**`src/lib/hooks/use-speech.ts`:**
```typescript
'use client'
import { useState, useCallback } from 'react'

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false)

  const speak = useCallback((text: string, lang = 'en-US') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 0.9
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }, [])

  return { speak, speaking }
}
```

**버튼 컴포넌트 예시:**
```tsx
<button
  onClick={() => speak(text)}
  className={`text-xs p-1 rounded ${speaking ? 'text-orange-500' : 'text-muted-foreground'}`}
  aria-label="발음 듣기"
>
  🔊
</button>
```

## 제약

- `typeof window !== 'undefined'` 체크로 SSR 안전 처리
- iOS Safari의 `speechSynthesis` 제한 고려 (터치 이벤트 이후만 동작)
- 버튼 크기 최소 44px (모바일 터치 타겟)
