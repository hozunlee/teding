-- ============================================================
-- tedding v2 마이그레이션
-- Supabase SQL Editor에서 실행
-- ============================================================

-- 1. learning_materials: raw_json 컬럼 추가
ALTER TABLE learning_materials
  ADD COLUMN IF NOT EXISTS raw_json jsonb;

-- 2. user_progress: daily_comment 컬럼 추가
ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS daily_comment text;

-- 3. learning_materials Public Read RLS
-- (기존 정책 없을 경우에만 추가)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'learning_materials'
      AND policyname = 'public_read_learning_materials'
  ) THEN
    EXECUTE 'CREATE POLICY public_read_learning_materials
      ON learning_materials FOR SELECT USING (true)';
  END IF;
END
$$;

-- RLS 활성화 확인 (이미 활성화돼 있으면 무시)
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 완료 후 타입 재생성 필수:
-- pnpm supabase gen types typescript --project-id <id> > src/types/database.ts
-- ============================================================
