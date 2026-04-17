# TASK_028: Archive(보고또보고) 고도화

> 상태: DONE
> 의존: TASK_025, TASK_026 (difficulty_rating 데이터 축적 후 의미 있음)

## 목표

아카이브 페이지에 3가지 기능을 추가해 사회적 동기 부여와 학습 이력 접근성을 강화한다.

## 맥락

- 현재 아카이브: 날짜·제목·완료자 목록만 표시
- 대상: `src/app/(main)/archive/page.tsx`
- 신규 API 확장 또는 SSR 쿼리 직접 추가

## 완료 기준

### 기능 1: 난이도 통계

- [ ] 각 영상 카드에 전체 유저 평균 `difficulty_rating` 기반 텍스트 표시
    - 1~2: "😌 쉬워요"
    - 2~4: "🔥 할만해요"
    - 4~5: "💪 어려워요"
- [ ] 평가 인원 수 함께 표시 (예: "할만해요 · 12명")
- [ ] 평가 데이터 없는 경우 미표시

### 기능 2: 랜덤 한 줄 평 롤링

- [ ] 각 영상 카드에 다른 유저의 `daily_comment` 1개씩 노출
- [ ] 3~5초 간격 fade-in/out 애니메이션 (CSS keyframes)
- [ ] 로그인 사용자에게만 노출 (본인 댓글 제외)
- [ ] 한 줄 평 없는 영상은 해당 영역 미표시
- [ ] 쿼리에 부담 없는 선에서 진행. 모든 데이터불러오면 과부하가 오겠지?

### 기능 3: 내 학습지 링크

- [ ] 해당 영상에 내가 업로드한 학습지 있으면 링크 버튼 표시
- [ ] Supabase Storage Public URL → `<a href="..." target="_blank">` 렌더링
- [ ] 로그인 사용자만 표시 (본인 업로드만) // 어차피 비로그인은 접근못함.

## 구현 세부

**SSR 쿼리 확장 (archive/page.tsx):**

```typescript
// 1. 난이도 통계: GROUP BY + AVG
const { data: difficultyStats } = await supabase
    .from("user_progress")
    .select("video_id, difficulty_rating")
    .not("difficulty_rating", "is", null);

// 2. 랜덤 한 줄 평: 영상별 최대 5개 샘플링 (클라이언트에서 랜덤 선택)
const { data: comments } = await supabase
    .from("user_progress")
    .select("video_id, daily_comment, user_id")
    .not("daily_comment", "is", null)
    .neq("user_id", userId); // 본인 제외

// 3. 내 학습지: user_uploads 조회
const { data: myUploads } = await supabase
    .from("user_uploads")
    .select("video_id, file_url")
    .eq("user_id", userId);
```

**롤링 애니메이션 (CSS):**

```css
@keyframes fadeComment {
    0%,
    100% {
        opacity: 0;
    }
    10%,
    90% {
        opacity: 1;
    }
}
```

## API 고려사항

- 아카이브 페이지가 SSR이므로 서비스 클라이언트로 쿼리 가능
- 난이도 통계는 클라이언트 측에서 집계 (Supabase RPC 불필요)
- 비로그인 시 기능 2, 3 완전 숨김

## 제약

- 성능: 쿼리 수 최소화 (롤링 댓글은 전체 한 번에 fetch 후 클라이언트 필터)
- 롤링 컴포넌트는 `"use client"` 분리 필요 (useState + setInterval)
