# TASK_027: 대시보드 - 한 줄 평 노출

> 상태: DONE
> 의존: TASK_026 (한 줄 평 입력 기능 완료 후 진행)

## 목표

홈 화면 최근 학습 기록 리스트에 사용자가 남긴 한 줄 평(`daily_comment`)을 노출해 학습 회상을 돕는다.

## 맥락

- `src/components/home/RecentList.tsx`에서 최근 학습 이력 렌더링
- API 응답에 `daily_comment` 포함 여부 확인 필요
- 말줄임표 처리 후 클릭 시 전체 텍스트 노출
- 대상: `src/components/home/RecentList.tsx`, 필요 시 API 응답 확장
- ui는 shadcnn 사용
- 모바일/ 아이패드 / 데스크톱 모두 연동 반응형 고려

## 완료 기준

- [ ] `daily_comment`가 있는 학습 이력 카드에 한 줄 평 표시
- [ ] 긴 텍스트 말줄임표 처리 (`truncate` or `line-clamp-1`)
- [ ] 클릭 또는 hover 시 전체 텍스트 노출 (Tooltip 또는 인라인 토글)
- [ ] `daily_comment` 없는 경우 해당 영역 미표시
- [ ] API 응답에 `daily_comment` 포함 확인 (미포함 시 API 쿼리 확장)

## 구현 세부

**RecentList 카드:**

```tsx
{
    item.daily_comment && (
        <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            💬 {item.daily_comment}
        </p>
    );
}
```

**클릭 펼침 방식 (Tooltip 대안):**

```tsx
const [expanded, setExpanded] = useState(false)
<p
  onClick={() => setExpanded(!expanded)}
  className={`text-xs text-muted-foreground cursor-pointer ${expanded ? '' : 'line-clamp-1'}`}
>
  💬 {item.daily_comment}
</p>
```

## API 확인 사항

- 현재 최근 학습 기록 API (또는 SSR 쿼리)에서 `daily_comment` SELECT 포함 여부 확인
- 미포함 시 쿼리에 `.select('..., daily_comment')` 추가

## 제약

- `daily_comment` 없는 카드는 영역 완전 제거 (빈 공간 남기지 않음)
- Tooltip 사용 시 shadcn/ui `<Tooltip>` 컴포넌트 재사용
