# TASK_025: DB - difficulty_rating 컬럼 추가

> 상태: TODO

## 목표

`user_progress` 테이블에 `difficulty_rating` 컬럼을 추가해 학습 완료 후 난이도 평가를 저장할 수 있도록 한다. TASK_026(완료 화면 폼)의 선행 작업.

## 맥락

- `daily_comment`는 TASK_017에서 이미 추가됨
- `difficulty_rating`: 1(쉬움) / 3(보통) / 5(어려움) 3단계 값 저장
- Supabase 대시보드에서 직접 실행 또는 마이그레이션 파일로 관리
- 대상: `docs/migrations/002_difficulty_rating.sql`, `src/app/api/progress/route.ts`

## 완료 기준

- [ ] `docs/migrations/002_difficulty_rating.sql` 파일 생성
- [ ] Supabase 대시보드 SQL 에디터에서 마이그레이션 실행
- [ ] `pnpm supabase gen types` 재실행 → `src/types/database.ts` 업데이트
- [ ] `/api/progress` POST/PATCH에서 `difficulty_rating` 저장 로직 추가
- [ ] 타입체크 통과

## 마이그레이션 SQL

```sql
-- docs/migrations/002_difficulty_rating.sql
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS difficulty_rating smallint
  CHECK (difficulty_rating IN (1, 3, 5));

COMMENT ON COLUMN user_progress.difficulty_rating IS '학습 난이도 평가: 1=쉬움, 3=할만함, 5=어려움';
```

## API 수정 (progress/route.ts)

```typescript
// POST body에 difficulty_rating 추가 지원
const { videoId, step, difficulty_rating, daily_comment } = await req.json();

await supabase.from("user_progress").upsert({
    video_id: videoId,
    step,
    ...(difficulty_rating !== undefined && { difficulty_rating }),
    ...(daily_comment !== undefined && { daily_comment }),
});
```

## 제약

- CHECK 제약: `IN (1, 3, 5)` (임의 값 방지)
- `pnpm supabase gen types` 실행 후 타입 재생성 필수
- 기존 progress 레코드에 영향 없음 (`nullable` 컬럼)
