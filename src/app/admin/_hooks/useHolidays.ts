"use client";

import { useState } from "react";
import { SimplifiedHoliday } from "@/lib/utills/holiday";

export function useHolidays() {
    const now = new Date();
    const [holidayYear, setHolidayYear] = useState(String(now.getFullYear()));
    const [holidayMonth, setHolidayMonth] = useState(
        String(now.getMonth() + 1).padStart(2, "0"),
    );
    const [holidays, setHolidays] = useState<SimplifiedHoliday[] | null>(null);
    const [holidaysLoading, setHolidaysLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    async function fetchHolidays() {
        setHolidaysLoading(true);
        setHolidays(null);
        try {
            const res = await fetch(
                `/api/admin/holidays?year=${holidayYear}&month=${holidayMonth}`,
            );
            const data = await res.json();
            setHolidays(data.holidays ?? []);
        } catch {
            setHolidays([]);
        } finally {
            setHolidaysLoading(false);
        }
    }

    async function saveHolidaysToDB() {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/holidays/sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: `${holidayYear}-${holidayMonth}-01` })
            });
            const data = await res.json();
            if (res.ok) {
                alert(`DB 저장 완료: ${data.count}개의 공휴일이 동기화되었습니다.`);
            } else {
                alert(`오류: ${data.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("저장 중 오류가 발생했습니다.");
        } finally {
            setSaving(false);
        }
    }

    return {
        holidayYear,
        setHolidayYear,
        holidayMonth,
        setHolidayMonth,
        holidays,
        holidaysLoading,
        fetchHolidays,
        saveHolidaysToDB,
        saving
    };
}
