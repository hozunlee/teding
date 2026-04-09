# TASK_001: 인증_구글로그인

> 상태: DONE

## 목표
- 사용자가 구글 계정으로 로그인하고 메인 대시보드(`/home`)로 접근할 수 있으며, 필요 시 로그아웃할 수 있다.

## 맥락
- **현재 상황:** 기존에 `GoogleSignInButton.tsx`와 Supabase 설정이 기초적으로 마련되었으나, 인증 후 리다이렉트 처리(`auth/callback`) 및 세션 검증(`AuthGuard`), 그리고 최근 발생한 Hook 에러 파악 등 실제 구동 전반에 대한 점검과 완성이 필요.
- **연관 파일:**
  - `src/components/auth/GoogleSignInButton.tsx`
  - `src/components/auth/AuthGuard.tsx`
  - `src/app/auth/callback/route.ts` (구현 필요/수정)
  - `src/proxy.ts` (미들웨어 세션 체크)

## 완료 기준
- [x] 구글 로그인 버튼 클릭 시 Supabase OAuth 흐름이 정상 작동하는가
- [x] 로그인 성공 후 `auth/callback`을 거쳐 인증 세션 쿠키가 발급되는가
- [x] 인증 완료 시 자동적으로 `/home` 으로 리다이렉션 되는가
- [x] 사이드바 또는 네비게이션에 로그아웃 버튼이 존재하고 정상 작동하는가
- [x] 비로그인 사용자가 `/home`, `/study` 접근 시 `/` 로 튕겨내는가 (AuthGuard, Proxy)

## 제약
- Supabase 클라이언트는 반드시 `getSupabaseBrowser()` 싱글턴 사용
- DB 통신 없이 쿠키 기반으로 세션 처리할 것
