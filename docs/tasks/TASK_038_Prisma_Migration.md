# TASK_038: Prisma ORM 마이그레이션 및 RLS 통합

> 상태: TODO

## 목표

- Supabase SDK 기반 DB 접근 방식을 Prisma ORM으로 마이그레이션하고, 기존 RLS 정책을 유지하는 아키텍처를 구축한다.

## 맥락

- **현재 상황:** 프로젝트 내 80개 이상의 `.from()` 호출이 존재하며, DB 조작 로직이 복잡해짐에 따라 생산성 저하 및 타입 관리의 번거로움이 발생함. 향후 모바일 앱 확장을 위해 DB 수준의 RLS 유지가 필수적인 상황임.
- **분석 내용 (장단점 및 효율성):**
    - **장점**: 쿼리 가독성 비약적 향상, 완벽한 타입 안전성, 스키마 관리 일원화, 모바일-서버 간 보안 정책 일관성.
    - **단점**: RLS 세션 주입을 위한 `set_config` 실행 오버헤드, Prisma 엔진 번들 크기 증가.
    - **효율성**: 복잡한 비즈니스 로직(예: 통계, 다중 필터링)에서 코드 라인 수 약 20% 감소 및 유지보수 속도 향상.
- **연관 파일:**
    - `src/lib/prisma.ts` (신규)
    - `src/lib/supabase/server.ts`
    - `prisma/schema.prisma` (신규)
    - `src/app/api/progress/route.ts` (시범 전환)

## 완료 기준

- [ ] Prisma CLI 및 Client 설치 및 `.env` 연결 완료
- [ ] `prisma db pull`을 통해 기존 DB 스키마가 `schema.prisma`에 성공적으로 반영됨
- [ ] `getPrismaWithAuth` 익스텐션을 통해 Supabase JWT 기반 RLS 작동 확인
- [ ] 서비스 계정(`service_role`)용 Admin Prisma 인스턴스 정상 동작 확인
- [ ] `user_progress` 관련 API 1종 이상이 Prisma로 성공적으로 전환됨

## 제약

- Supabase Auth/Storage는 기존 SDK 유지
- DB 접근은 서버(API Route/Server Action)에서만 Prisma 사용
- Prisma Client는 싱글턴 패턴으로 관리하여 커넥션 풀 낭비 방지
- RLS 정책을 우회하지 않도록 Client Extension을 강제 적용
