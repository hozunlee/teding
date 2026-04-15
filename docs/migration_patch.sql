-- Teding Supabase Migration Patch
-- 이미 테이블이 생성된 기존 DB에 대해 실행
-- Supabase Dashboard > SQL Editor에 붙여넣고 실행


-- ────────────────────────────────────────────────────────────
-- profiles.role 컬럼 추가
-- ────────────────────────────────────────────────────────────

alter table profiles
  add column if not exists role text not null default 'user';


-- ────────────────────────────────────────────────────────────
-- 어드민 지정 (최초 1회)
-- ────────────────────────────────────────────────────────────

update profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'ho2yahh@gmail.com'
);
