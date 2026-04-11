# Supabase Schema Migration

Supabase Dashboard → SQL Editor에서 아래 SQL을 순서대로 실행한다.

---

## 1. 테이블 생성

```sql
-- 오늘의 영상 (관리자가 매일 1건 등록)
create table if not exists daily_videos (
  id         uuid primary key default gen_random_uuid(),
  date       text unique not null,
  video_id   text not null,
  title      text not null,
  duration   text not null,
  created_at timestamptz default now()
);

-- 스크립트 캐시 (video_id 기준 전역 캐시)
create table if not exists transcripts (
  id             uuid primary key default gen_random_uuid(),
  video_id       text unique not null,
  raw_text       text not null,
  word_count     int not null,
  sentence_count int not null,
  created_at     timestamptz default now()
);

-- AI 생성 학습자료 통합 캐시
-- Gemini 1회 호출 → 1회 upsert → 부분 실패 없음
-- Step 3(학습지)과 Step 4(핵심표현/구문분석) 모두 이 1개 row 사용
create table if not exists learning_materials (
  id              uuid primary key default gen_random_uuid(),
  video_id        text unique not null,
  worksheet_json  jsonb not null,
  phrases_json    jsonb not null,
  sentences_json  jsonb not null,
  raw_json        jsonb not null,
  created_at      timestamptz default now()
);

-- 사용자 학습 진행 (개인별)
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

-- 필기본 업로드 기록
create table if not exists user_uploads (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  video_id   text not null,
  file_url   text not null,
  file_name  text not null,
  created_at timestamptz default now()
);

-- 스트릭
create table if not exists streaks (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users unique not null,
  current_streak  int default 0,
  longest_streak  int default 0,
  last_study_date text,
  updated_at      timestamptz default now()
);

-- 유저 프로필 (auth.users 확장)
create table if not exists profiles (
  id         uuid primary key references auth.users,
  nickname   text not null,
  avatar_url text,
  created_at timestamptz default now()
);
```

---

## 2. RLS 활성화

```sql
alter table user_progress  enable row level security;
alter table user_uploads   enable row level security;
alter table streaks        enable row level security;
alter table profiles       enable row level security;
```

---

## 3. RLS 정책

```sql
-- 본인 데이터만 접근
create policy "own_progress" on user_progress
  for all using (auth.uid() = user_id);

create policy "own_uploads" on user_uploads
  for all using (auth.uid() = user_id);

create policy "own_streak" on streaks
  for all using (auth.uid() = user_id);

create policy "own_profile" on profiles
  for all using (auth.uid() = id);

-- 전역 캐시 테이블은 로그인 사용자 읽기 허용
create policy "read_transcripts" on transcripts
  for select to authenticated using (true);

create policy "read_learning_materials" on learning_materials
  for select to authenticated using (true);

create policy "read_daily_videos" on daily_videos
  for select to authenticated using (true);
```

---

## 4. Storage 버킷 생성

Supabase Dashboard → Storage → "New bucket"

| 버킷명 | Public | 용도 |
|--------|--------|------|
| `worksheets` | No (private) | 사용자 필기본 PDF 업로드 |

Storage Policy (SQL Editor):

```sql
create policy "own_worksheets" on storage.objects
  for all using (
    bucket_id = 'worksheets'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## 테이블 구조 요약

| 테이블 | 캐시 키 | RLS | 설명 |
|--------|---------|-----|------|
| `daily_videos` | `date` | 없음 | 관리자가 매일 등록 |
| `transcripts` | `video_id` | 없음 | YouTube 자막 전역 캐시 |
| `learning_materials` | `video_id` | 없음 | AI 학습자료 전역 캐시 |
| `user_progress` | `user_id + video_id` | ✓ | 개인 학습 진행 |
| `user_uploads` | - | ✓ | 개인 필기본 업로드 |
| `streaks` | `user_id` | ✓ | 개인 스트릭 |
| `profiles` | `user_id` | ✓ | 개인 프로필 |
