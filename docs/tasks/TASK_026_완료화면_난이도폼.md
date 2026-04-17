# TASK_026: 학습 완료 - 난이도 + 한 줄 평 입력 폼

> 상태: DONE
> 의존: TASK_025 (difficulty_rating 컬럼 추가 후 진행)

## 목표

학습 완료 화면(`/study/complete`)에 난이도 평가 칩 버튼과 한 줄 평 입력 폼을 추가해 학습 피드백을 수집한다.

## 맥락

- `daily_comment` 컬럼: TASK_017에서 추가됨
- `difficulty_rating` 컬럼: TASK_025에서 추가됨
- 로그인 사용자에게만 노출 (비로그인 시 숨김)
- 대상: `src/app/(study)/study/complete/page.tsx`
  ui는 shadcn 사용.

## 완료 기준

- [ ] 난이도 칩 버튼 3개: "쉬워요" / "할만해요" / "어려워요" (값: 1 / 3 / 5)
- [ ] 한 줄 평 textarea (placeholder, 최대 100자, optional)
- [ ] "저장하기" 버튼 → `/api/progress` PATCH 호출
- [ ] 저장 성공 시 버튼 비활성화 + "저장됨" 상태 표시
- [ ] 로그인 사용자만 노출 (Supabase auth.user 체크)
- [ ] 타입체크·린트 통과

## UI 구조

```
[ 학습 완료 체크 애니메이션 + 통계 ]
─────────────────────────────
오늘 학습 어땠나요?
[ 쉬워요 ]  [ 할만해요 ]  [ 어려워요 ]

한 줄 평 (선택)
┌─────────────────────────────────┐
│ 오늘 배운 내용을 한 줄로 남겨보세요   │
└─────────────────────────────────┘
                          [ 저장하기 ]
─────────────────────────────
[ 공유하기 ] [ 홈으로 ]
```

## 구현 세부

```tsx
// PATCH /api/progress
const response = await fetch("/api/progress", {
    method: "PATCH",
    body: JSON.stringify({
        videoId,
        difficulty_rating: selectedDifficulty, // 1 | 3 | 5
        daily_comment: comment.trim() || null,
    }),
});
```

## 제약

- 비로그인 사용자: 폼 미표시 (AuthModal 이미 노출됨)
- 저장 후 재저장 가능 (override, upsert 방식)
- 텍스트 최대 100자 클라이언트 검증
