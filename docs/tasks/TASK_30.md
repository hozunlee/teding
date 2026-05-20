# 주말/공휴일 스마트 콘텐츠 추천 + 공휴일 DB 캐싱 + 홈 화면 성능 최적화

## 배경

1. **주말/공휴일 학습 부담**: 토·일·공휴일에도 새 영상이 등록되면 사용자가 새 영상을 처음부터 시작해야 하는 부담. 진행 중인 영상을 이어서 가볍게 완료하는 것이 자연스러운 학습 패턴.
2. **공휴일 외부 API 호출 과다**: 현재 `getHolidayName()`이 홈 화면에서 7회 호출되고, 스트릭 API에서도 gap 일수만큼 호출됨. 외부 공공 API(`apis.data.go.kr`)에 대한 불필요한 의존.
3. **홈 화면 로딩 느림**: 서버 컴포넌트에서 외부 API + DB 쿼리가 순차 실행되어 TTFB가 느림.

---

## Part A: 공휴일 DB 캐싱 (근본 해결)

### 설계 방침

> 외부 공휴일 API 호출을 런타임에서 **완전히 제거**한다. 공휴일 데이터는 DB `holidays` 테이블에 저장하고, 모든 조회는 DB에서 O(1)로 수행한다.

### `holidays` 테이블 스키마

```sql
CREATE TABLE holidays (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date       TEXT UNIQUE NOT NULL,  -- "2026-05-05"
    name       TEXT NOT NULL,          -- "어린이날"
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 전역 읽기 허용 (로그인 사용자)
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_holidays" ON holidays
    FOR SELECT TO authenticated USING (true);
-- anon도 읽기 허용 (비로그인 사용자 홈 화면용)
CREATE POLICY "read_holidays_anon" ON holidays
    FOR SELECT TO anon USING (true);
```

### 데이터 입력 방식 (2가지 병행)

#### 방식 1: 매월 1일 자동 fetch → DB 저장

`/api/admin/holidays/sync` POST 엔드포인트 신규:

- 현재 월 + 다음 달의 공휴일을 공공 API에서 조회
- `holidays` 테이블에 upsert (중복 무시)
- 근로자의 날(5/1) 등 수동 공휴일도 자동 포함
- **트리거**: `/api/admin/daily` (매일 영상 등록 시) 내부에서 "오늘이 1일이면" 자동 실행
    - 이미 매일 호출되는 어드민 API이므로 추가 cron 불필요

```typescript
// /api/admin/daily/route.ts 내부에서
const today = getKSTDate();
if (today.endsWith("-01")) {
    // 이번 달 + 다음 달 공휴일 자동 동기화
    await syncHolidays(adminSupabase, today);
}
```

#### 방식 2: 어드민 페이지에서 수동 조회 → 저장

기존 `AdminHolidayTab`의 "조회" 버튼에 **"DB에 저장"** 기능 추가:

- 공공 API에서 조회한 결과를 바로 `holidays` 테이블에 upsert
- 관리자가 원하는 월을 선택해서 미리 입력 가능
- 기존 조회 기능은 유지하되, "저장" 버튼 추가

### holiday.ts 리팩토링

기존 `getHolidayName()`, `isPublicHoliday()`, `getHolidays()` 함수를 모두 **DB 조회 기반**으로 교체:

```typescript
// Before: 외부 API 호출
export const getHolidayName = async (date) => {
    const holidays = await fetchHolidaysFromPublicApi(year, month); // ❌ 외부 호출
    return holidays.find((h) => h.date === date)?.name ?? null;
};

// After: DB 조회 (Supabase service client)
export const getHolidayName = async (
    supabase: SupabaseClient,
    date: string,
): Promise<string | null> => {
    const { data } = await supabase
        .from("holidays")
        .select("name")
        .eq("date", date)
        .maybeSingle();
    return data?.name ?? null;
};
```

> [!TIP]
> **배치 조회 헬퍼**도 추가하여, 여러 날짜의 공휴일을 한 번의 쿼리로 조회:
>
> ```typescript
> export const getHolidaysForDates = async (
>     supabase: SupabaseClient,
>     dates: string[],
> ): Promise<Map<string, string>> => {
>     const { data } = await supabase
>         .from("holidays")
>         .select("date, name")
>         .in("date", dates);
>     return new Map(data?.map((h) => [h.date, h.name]) ?? []);
> };
> ```
>
> 이 함수를 사용하면 홈 화면의 공휴일 조회가 **7회 → 1회 DB 쿼리**로 해결.

### 호출 지점 마이그레이션

| 호출 지점               | Before                            | After                                         |
| ----------------------- | --------------------------------- | --------------------------------------------- |
| `page.tsx` (홈)         | `getHolidayName(dateStr)` × 7     | `getHolidaysForDates(supabase, dates)` × 1    |
| `streak/route.ts`       | `isPublicHoliday(gapDateStr)` × N | `getHolidaysForDates(supabase, gapDates)` × 1 |
| `AdminHolidayTab`       | 조회만                            | 조회 + DB 저장                                |
| `HolidayCheckComponent` | `isPublicHoliday(now)`            | DB 조회 or 삭제 (불필요 시)                   |

---

## Part B: 주말/공휴일 스마트 콘텐츠 추천

### 콘텐츠 결정 우선순위

```
오늘 daily_videos에 영상이 등록되어 있는가?
├─ YES → 관리자가 의도적으로 올린 영상. 그대로 제공. (우선순위 0)
│
└─ NO → 오늘이 주말 or 공휴일인가?
    ├─ YES (가벼운 학습 모드)
    │   ├─ 로그인 사용자
    │   │   ├─ 진행 중인 영상 있음 (step4 미완료) → "이어서 학습" 모드
    │   │   └─ 진행 중인 영상 없음 → 가장 최근 영상 fallback
    │   └─ 비로그인 사용자
    │       └─ 가장 최근 daily_videos 영상 제공
    │
    └─ NO (평일)
        └─ 기존 동작 유지 ("아직 등록되지 않았습니다")
```

### "진행 중인 영상" 쿼리

```typescript
// user_progress에서 step1은 시작했지만 step4가 미완료인 가장 최근 영상
const { data: inProgress } = await supabase
    .from("user_progress")
    .select(
        "video_id, step1_completed_at, step2_completed_at, step3_completed_at, step4_completed_at",
    )
    .eq("user_id", user.id)
    .not("step1_completed_at", "is", null)
    .is("step4_completed_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

// 해당 영상의 daily_videos 정보 조회
if (inProgress) {
    const { data: videoInfo } = await adminSupabase
        .from("daily_videos")
        .select("*")
        .eq("video_id", inProgress.video_id)
        .limit(1)
        .maybeSingle();
}
```

### UI 변경: DailyVideoBanner `mode` prop

| mode       | 헤더 라벨         | 메시지                                       | 버튼 텍스트                             |
| ---------- | ----------------- | -------------------------------------------- | --------------------------------------- |
| `today`    | "오늘의 영상"     | (기존)                                       | "학습 시작 →" / "Step N부터 계속하기 →" |
| `continue` | "이어서 학습하기" | "오늘은 가볍게 남은 공부를 이어서 해볼까요?" | "Step N 이어하기 →"                     |
| `fallback` | "최근 영상"       | "주말엔 가볍게 복습해보세요"                 | "학습 시작 →"                           |

### study 페이지 링크 생성

`continue` 모드에서는 해당 영상의 **원래 등록 날짜**를 `?date=` 파라미터로 넘김:

- 예: 금요일(5/22)에 등록된 영상을 토요일(5/23)에 이어서 → `/study?date=2026-05-22&step=3`
- 기존 study/page.tsx의 `targetDate = dateParam ?? today` 로직과 완벽히 호환

---

## Part C: 홈 화면 성능 최적화

### 현재 워터폴 (6단계)

```
1. auth.getUser()
2. daily_videos 조회
3. Promise.all(streak, progress)
4. getHolidayName() × 7 (외부 API!)
5. requesterNickname 조회 (2 쿼리)
6. cacheChecks + user_progress 재조회
```

### 최적화된 워터폴 (3단계)

```
1. auth.getUser() + daily_videos 조회 (병렬)
2. Promise.all([
     streak,
     weeklyProgress,
     holidaysForDates,     ← DB 1회 쿼리 (외부 API 제거)
     requesterNickname,
     cacheChecks,
     currentVideoProgress,
     inProgressVideo,      ← 주말 모드용 (필요 시)
   ])
3. 렌더링
```

### RecentList 서버 프리페치

현재 `RecentList`가 클라이언트에서 `/api/history` 별도 호출 → 서버에서 미리 조회하여 prop 전달:

```diff
- <RecentList />
+ <RecentList initialHistory={historyData} isLoggedIn={!!user} />
```

`RecentList` 컴포넌트는 `initialHistory` prop이 있으면 fetch를 스킵하고 바로 렌더링.

---

## Open Questions

> [!IMPORTANT]
> **Q1**: 공휴일 동기화 시 "이번 달 + 다음 달"만 가져올지, "이번 달부터 연말까지"를 한 번에 가져올지?
> → 제안: 2개월씩 가져오면 충분. 12개월 한꺼번에도 가능하지만 API 호출이 12번 필요.

> [!IMPORTANT]
> **Q2**: `HolidayCheckComponent.tsx`는 아직 사용 중인지? 삭제 대상인지?
> → 현재 열려있는 파일이라 확인 필요.

> [!IMPORTANT]
> **Q3**: `continue` 모드에서 진행 중인 영상이 여러 개일 경우, 가장 최근 것 하나만 보여줄지?
> → 제안: 하나만 보여주고, 나머지는 "최근 학습 기록"에서 접근 가능.

---

## Proposed Changes

### DB 마이그레이션

#### [NEW] `holidays` 테이블

- Supabase 마이그레이션으로 holidays 테이블 생성 + RLS 정책

---

### 공휴일 동기화 API

#### [NEW] `/api/admin/holidays/sync/route.ts`

- POST: 지정 월의 공휴일을 공공 API에서 조회 → `holidays` 테이블에 upsert
- 근로자의 날 등 수동 공휴일 자동 포함

#### [MODIFY] [/api/admin/daily/route.ts](file:///Users/hoya/nodejs/ted-fi/src/app/api/admin/daily/route.ts)

- 매일 영상 등록 시, 오늘이 1일이면 공휴일 자동 동기화 트리거

---

### 공휴일 유틸리티 리팩토링

#### [MODIFY] [holiday.ts](file:///Users/hoya/nodejs/ted-fi/src/lib/utills/holiday.ts)

- `getHolidayName()`, `isPublicHoliday()` → Supabase 클라이언트를 인자로 받아 DB 조회 방식으로 전환
- `getHolidaysForDates()` 배치 헬퍼 신규 추가
- `fetchHolidaysFromPublicApi()`는 동기화 API에서만 사용, 런타임 호출 제거

---

### 어드민 페이지

#### [MODIFY] [AdminHolidayTab.tsx](file:///Users/hoya/nodejs/ted-fi/src/app/admin/_components/AdminHolidayTab.tsx)

- 기존 "조회" 옆에 "DB 저장" 버튼 추가
- 공공 API 조회 결과를 `holidays` 테이블에 upsert하는 기능

#### [MODIFY] [useHolidays.ts](file:///Users/hoya/nodejs/ted-fi/src/app/admin/_hooks/useHolidays.ts)

- `saveHolidaysToDB()` 함수 추가

---

### 홈 페이지

#### [MODIFY] [page.tsx](<file:///Users/hoya/nodejs/ted-fi/src/app/(main)/page.tsx>)

- 영상 결정 로직 확장 (주말/공휴일 분기)
- 공휴일 조회를 `getHolidaysForDates()` DB 배치 1회로 교체
- 쿼리 워터폴 3단계로 축소
- `mode` 변수 계산 및 DailyVideoBanner에 전달
- RecentList에 서버 프리페치 데이터 전달

---

### DailyVideoBanner 컴포넌트

#### [MODIFY] [DailyVideoBanner.tsx](file:///Users/hoya/nodejs/ted-fi/src/components/home/DailyVideoBanner.tsx)

- `mode: "today" | "continue" | "fallback"` prop 추가
- `videoDate` prop 추가 (study 링크의 `?date=` 파라미터용)
- mode별 헤더/메시지/버튼 분기

---

### RecentList 컴포넌트

#### [MODIFY] [RecentList.tsx](file:///Users/hoya/nodejs/ted-fi/src/components/home/RecentList.tsx)

- `initialHistory` / `isLoggedIn` optional prop 수용
- prop이 있으면 fetch 스킵

---

### 스트릭 API

#### [MODIFY] [streak/route.ts](file:///Users/hoya/nodejs/ted-fi/src/app/api/streak/route.ts)

- `isPublicHoliday()` 개별 호출 → `getHolidaysForDates()` 배치 조회로 교체

---

### 정리

#### [DELETE or DEPRECATE] `HolidayCheckComponent.tsx`

- 사용 여부 확인 후 삭제 (미사용 시)

---

## Verification Plan

### Automated Tests

```bash
pnpm typecheck
pnpm lint
```

### Manual Verification

- 어드민에서 공휴일 조회 → DB 저장 → `holidays` 테이블 데이터 확인
- 홈 화면 로딩 속도 비교 (DevTools TTFB)
- 주말 모드: 영상 미등록 + 진행 중 영상 있음 → "이어서 학습" 확인
- 주말 모드: 관리자가 영상 등록 → 기존 "오늘의 영상" 우선 확인
- 스트릭 계산 정상 동작 확인 (공휴일 보너스 코인)

### 타입 안전성

- `database.ts`에 `holidays` 테이블 타입 추가
