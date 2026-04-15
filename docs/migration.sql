-- Teding Supabase Migration (초기 설치)
-- 신규 프로젝트에서 Supabase Dashboard > SQL Editor에 붙여넣고 실행
-- 이미 테이블이 생성된 경우 → migration_patch.sql 실행


-- ────────────────────────────────────────────────────────────
-- 1. 테이블 생성
-- ────────────────────────────────────────────────────────────

create table if not exists daily_videos (
  id         uuid primary key default gen_random_uuid(),
  date       text unique not null,
  video_id   text not null,
  title      text not null,
  duration   text not null,
  created_at timestamptz default now()
);

create table if not exists transcripts (
  id             uuid primary key default gen_random_uuid(),
  video_id       text unique not null,
  raw_text       text not null,
  word_count     int not null,
  sentence_count int not null,
  created_at     timestamptz default now()
);

create table if not exists learning_materials (
  id              uuid primary key default gen_random_uuid(),
  video_id        text unique not null,
  worksheet_json  jsonb not null,
  phrases_json    jsonb not null,
  sentences_json  jsonb not null,
  raw_json        jsonb not null,
  created_at      timestamptz default now()
);

create table if not exists user_progress (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users not null,
  video_id            text not null,
  date                text not null,
  step1_completed_at  timestamptz,
  step2_completed_at  timestamptz,
  step3_completed_at  timestamptz,
  step4_completed_at  timestamptz,
  completed_at        timestamptz,
  known_sentences     jsonb default '[]',
  quiz_results        jsonb default '{}',
  created_at          timestamptz default now(),
  unique(user_id, video_id)
);

create table if not exists user_uploads (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  video_id   text not null,
  file_url   text not null,
  file_name  text not null,
  created_at timestamptz default now()
);

create table if not exists streaks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users unique not null,
  current_streak  int default 0,
  longest_streak  int default 0,
  last_study_date text,
  updated_at      timestamptz default now()
);

create table if not exists profiles (
  id         uuid primary key references auth.users,
  nickname   text not null,
  avatar_url text,
  role       text not null default 'user',
  created_at timestamptz default now()
);


-- ────────────────────────────────────────────────────────────
-- 2. RLS 활성화
-- ────────────────────────────────────────────────────────────

alter table user_progress  enable row level security;
alter table user_uploads   enable row level security;
alter table streaks        enable row level security;
alter table profiles       enable row level security;


-- ────────────────────────────────────────────────────────────
-- 3. RLS 정책
-- ────────────────────────────────────────────────────────────

create policy "own_progress" on user_progress
  for all using (auth.uid() = user_id);

create policy "own_uploads" on user_uploads
  for all using (auth.uid() = user_id);

create policy "own_streak" on streaks
  for all using (auth.uid() = user_id);

create policy "own_profile" on profiles
  for all using (auth.uid() = id);

create policy "read_transcripts" on transcripts
  for select to authenticated using (true);

create policy "read_learning_materials" on learning_materials
  for select to authenticated using (true);

create policy "read_daily_videos" on daily_videos
  for select to authenticated using (true);


-- ────────────────────────────────────────────────────────────
-- 4. Storage 정책 (버킷 'worksheets'는 Dashboard에서 수동 생성)
-- ────────────────────────────────────────────────────────────

create policy "own_worksheets" on storage.objects
  for all using (
    bucket_id = 'worksheets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
