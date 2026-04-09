# ARCHITECTURE

> 스키마·API·공유 타입 변경 이력. 변경 즉시 기록. AI 환각 방지용.

---

## 초기 스키마 (v0.1 MVP)

테이블 목록:
- `daily_videos` — 오늘의 영상 (관리자 등록)
- `transcripts` — 스크립트 캐시 (video_id 기준)
- `learning_materials` — AI 생성 학습자료 통합 캐시 (worksheet_json · phrases_json · sentences_json · raw_json)
- `user_progress` — 개인별 학습 진행 (step1~4 완료 시각 · known_sentences · quiz_results)
- `user_uploads` — 필기본 PDF 업로드 기록
- `streaks` — 연속 학습 일수
- `profiles` — auth.users 확장 (nickname · avatar_url)

캐시 키: 모든 전역 캐시 테이블의 캐시 키는 `video_id` (text unique).

타입 생성:
```bash
pnpm supabase gen types typescript --project-id <id> > src/types/database.ts
```

---

<!-- 이후 변경 사항은 아래에 추가 -->
