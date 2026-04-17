# TASK_021: 메인 UI 조정

> 상태: DONE

## 목표

홈 화면 타이틀 반응형 텍스트 크기 조정 및 마이크로 카피 추가로 서비스 가치를 즉각 전달.

## 맥락

- 모바일에서 타이틀 텍스트가 줄바꿈되는 문제 수정
- 서비스 핵심 가치를 한 줄로 요약한 마이크로 카피 추가
- 대상: `src/components/home/DailyVideoBanner.tsx` 또는 `src/app/(main)/page.tsx`

## 완료 기준

- [ ] 모바일(375px)에서 타이틀 줄바꿈 없음 확인
- [ ] 마이크로 카피 "5분짜리 TED-Ed 영상으로 가볍게 시작하는 영어 루틴" 표시
- [ ] 데스크톱(1280px)에서 레이아웃 깨짐 없음 확인

## 구현 세부

**타이틀 반응형:**
```tsx
// text-3xl → text-2xl sm:text-3xl 로 변경
<h1 className="text-2xl sm:text-3xl font-bold ...">오늘의 큐레이션</h1>
```

**마이크로 카피 위치:**
- 타이틀 상단 또는 하단에 `<p>` 태그로 추가
- 스타일: `text-sm text-muted-foreground`

```tsx
<p className="text-sm text-muted-foreground">
  5분짜리 TED-Ed 영상으로 가볍게 시작하는 영어 루틴
</p>
```

## 제약

- 하드코딩 컬러 금지, Tailwind 유틸리티만 사용
- 기존 카드 레이아웃 구조 변경 최소화
