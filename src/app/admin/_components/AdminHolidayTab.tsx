import { Button } from "@/components/ui/button";
import { useHolidays } from "../_hooks/useHolidays";

export function AdminHolidayTab() {
    const {
        holidayYear,
        setHolidayYear,
        holidayMonth,
        setHolidayMonth,
        holidays,
        holidaysLoading,
        fetchHolidays,
        saveHolidaysToDB,
        saving
    } = useHolidays();

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
                <input
                    type="number"
                    value={holidayYear}
                    onChange={(e) => setHolidayYear(e.target.value)}
                    className="w-20 rounded-[4px] border bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                />
                <select
                    value={holidayMonth}
                    onChange={(e) => setHolidayMonth(e.target.value)}
                    className="flex-1 rounded-[4px] border bg-background px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                >
                    {Array.from({ length: 12 }, (_, i) => (
                        <option
                            key={i + 1}
                            value={String(i + 1).padStart(2, "0")}
                        >
                            {i + 1}월
                        </option>
                    ))}
                </select>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={fetchHolidays}
                    disabled={holidaysLoading}
                    className="shrink-0"
                >
                    {holidaysLoading ? "조회 중..." : "공공 API 조회"}
                </Button>
                <Button
                    type="button"
                    size="sm"
                    onClick={saveHolidaysToDB}
                    disabled={saving}
                    className="shrink-0"
                >
                    {saving ? "저장 중..." : "DB에 저장"}
                </Button>
            </div>

            <p className="text-xs text-muted-foreground">
                'DB에 저장' 클릭 시 선택한 월과 그 다음 월의 공휴일이 데이터베이스에 캐싱됩니다.
            </p>

            {holidays === null && (
                <p className="text-sm text-muted-foreground">
                    연도·월 선택 후 조회하세요.
                </p>
            )}
            {holidays !== null && holidays.length === 0 && (
                <p className="text-sm text-muted-foreground">공휴일 없음</p>
            )}
            {holidays !== null && holidays.length > 0 && (
                <ul className="flex flex-col divide-y">
                    {holidays.map((h, i) => (
                        <li
                            key={h.date + i}
                            className="flex items-center justify-between py-2 text-sm"
                        >
                            <span>{h.name}</span>
                            <span className="text-xs font-mono text-muted-foreground">
                                {h.date}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
