-- holidays 테이블 생성
CREATE TABLE holidays (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date       TEXT UNIQUE NOT NULL,  -- "2026-05-05" 형식
    name       TEXT NOT NULL,         -- "어린이날"
    created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS 활성화
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- 전역 읽기 허용 (로그인 사용자)
CREATE POLICY "read_holidays" ON holidays
    FOR SELECT TO authenticated USING (true);

-- anon도 읽기 허용 (비로그인 사용자 홈 화면용)
CREATE POLICY "read_holidays_anon" ON holidays
    FOR SELECT TO anon USING (true);
