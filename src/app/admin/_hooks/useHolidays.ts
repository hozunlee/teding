"use client";

import { useState } from "react";
import { HolidayItem } from "../_lib/types";

export function useHolidays() {
    const now = new Date();
    const [holidayYear, setHolidayYear] = useState(String(now.getFullYear()));
    const [holidayMonth, setHolidayMonth] = useState(
        String(now.getMonth() + 1).padStart(2, "0"),
    );
    const [holidays, setHolidays] = useState<HolidayItem[] | null>(null);
    const [holidaysLoading, setHolidaysLoading] = useState(false);

    async function fetchHolidays() {
        setHolidaysLoading(true);
        setHolidays(null);
        try {
            const res = await fetch(
                `/api/admin/holidays?year=${holidayYear}&month=${holidayMonth}`,
            );
            const data = (await res.json()) as {
                holidays?: HolidayItem[];
                error?: string;
            };
            setHolidays(data.holidays ?? []);
        } catch {
            setHolidays([]);
        } finally {
            setHolidaysLoading(false);
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
    };
}
