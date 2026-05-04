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
                    {holidaysLoading ? "조회 중..." : "조회"}
                </Button>
            </div>

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
                    {holidays.map((h, i) => {
                        const d = String(h.locdate);
                        const dateStr = `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
                        return (
                            <li
                                key={h.locdate + i}
                                className="flex items-center justify-between py-2 text-sm"
                            >
                                <span>{h.dateName}</span>
                                <span className="text-xs font-mono text-muted-foreground">
                                    {dateStr}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
