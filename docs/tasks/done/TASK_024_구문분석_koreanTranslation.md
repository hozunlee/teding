# TASK_024: 구문분석 koreanTranslation 추가

> 상태: DONE

## 목표

Gemini 프롬프트의 `sentences` 객체에 `koreanTranslation` 필드를 추가해, Step4 구문분석 탭에서 각 문장의 한국어 번역을 표시한다.

## 맥락

- 현재 `SentenceAnalysis`에는 `tip` (영한 혼합)만 있고, 전체 문장 번역은 없음
- 기존 캐시된 데이터와 호환성 유지 필요 (옵셔널 필드)
- 대상: `src/lib/gemini.ts`, `src/types/worksheet.ts`, `src/components/steps/Step4Phrases.tsx`

## 완료 기준

- [ ] `src/types/worksheet.ts`의 `SentenceAnalysis`에 `koreanTranslation?: string` 추가
- [ ] `src/lib/gemini.ts` 프롬프트에 `koreanTranslation` 필드 추가 및 설명 포함
- [ ] `Step4Phrases.tsx` 구문분석 탭에 한국어 번역 표시 (회색 소문자)
- [ ] 기존 캐시 데이터(`koreanTranslation` 없음)에서 빈 문자열로 graceful fallback

## 구현 세부

**타입 수정:**
```typescript
// src/types/worksheet.ts
interface SentenceAnalysis {
  text: string
  koreanTranslation?: string  // 추가
  structureLabel: string
  parse: ParseChunk[]
  tip: string
  vocab: string[]
}
```

**프롬프트 수정 (gemini.ts):**
```
sentences 배열의 각 객체에 다음 필드 추가:
"koreanTranslation": "전체 문장의 자연스러운 한국어 번역"
```

**Step4Phrases.tsx 표시:**
```tsx
{sentence.koreanTranslation && (
  <p className="text-sm text-muted-foreground mt-1">
    {sentence.koreanTranslation}
  </p>
)}
```

## 제약

- 기존 캐시된 learning_materials 데이터는 `koreanTranslation` 없음 → 옵셔널 처리 필수
- 새로 생성되는 영상부터만 번역 표시 (기존 데이터 재생성 불필요)
