-- ============================================================
-- teding v2.2 마이그레이션: 아카이브 뷰 생성
-- Supabase SQL Editor에서 실행
-- ============================================================

CREATE OR REPLACE VIEW archive_videos_view AS
SELECT
  v.id,
  v.date,
  v.video_id,
  v.title,
  v.duration,
  v.created_at,
  COUNT(p.completed_at) FILTER (WHERE p.completed_at IS NOT NULL) AS completion_count,
  AVG(p.difficulty_rating) FILTER (WHERE p.difficulty_rating IS NOT NULL) AS avg_difficulty
FROM
  daily_videos v
LEFT JOIN
  user_progress p ON v.video_id = p.video_id
GROUP BY
  v.id, v.date, v.video_id, v.title, v.duration, v.created_at;

-- RLS: 뷰는 기본적으로 테이블 권한을 따르지만, Supabase에서는 뷰에 대한 SELECT 권한이 필요할 수 있습니다.
-- daily_videos와 user_progress가 이미 authenticated 읽기 허용이므로 보통 문제 없으나 명시적으로 부여.
GRANT SELECT ON archive_videos_view TO authenticated;
GRANT SELECT ON archive_videos_view TO service_role;

-- ============================================================
-- 완료 후 타입 재생성 필수:
-- pnpm supabase gen types typescript --project-id <id> > src/types/database.ts
-- ============================================================
