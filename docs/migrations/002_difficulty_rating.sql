-- ============================================================
-- teding v2.1 마이그레이션
-- Supabase SQL Editor에서 실행
-- ============================================================

-- user_progress: difficulty_rating 컬럼 추가
ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS difficulty_rating smallint
  CHECK (difficulty_rating IN (1, 3, 5));

COMMENT ON COLUMN user_progress.difficulty_rating IS '학습 난이도 평가: 1=쉬워요, 3=할만해요, 5=어려워요';

-- ============================================================
-- 완료 후 타입 재생성 필수:
-- pnpm supabase gen types typescript --project-id <id> > src/types/database.ts
-- ============================================================
