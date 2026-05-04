"use client";

import { useAuthModal } from "@/lib/store/auth-modal";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { RingGauge } from "./streak/RingGauge";
import { SeasonIcon, CoinIcon } from "./streak/Icons";
import { getSeason, getSeasonLabel } from "./streak/utils";

interface Props {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string | null;
    weeklyProgress?: string[];
    weeklyCoins?: string[];
    weeklyHolidayMap?: Record<string, string>;
    isLoggedIn: boolean;
}

export function StreakCard({
    currentStreak,
    longestStreak,
    weeklyProgress = [],
    weeklyCoins = [],
    weeklyHolidayMap = {},
    isLoggedIn,
}: Props) {
    const openModal = useAuthModal((s) => s.open);
    const season = getSeason(currentStreak);
    const seasonLabel = getSeasonLabel(currentStreak);

    const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
    const now = new Date();
    const kstNow = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
    );
    const offsetKst = new Date(kstNow.getTime() - 3 * 60 * 60 * 1000);
    const dayOfWeek = (offsetKst.getDay() + 6) % 7;
    const monday = new Date(offsetKst);
    monday.setDate(offsetKst.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const dayInfos = Array.from({ length: 7 }, (_, i) => {
        if (!isLoggedIn) return { type: "none" as const, date: "" };
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);

        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const date = String(d.getDate()).padStart(2, "0");
        const dateStr = `${y}-${m}-${date}`;

        let type: "stamp" | "coin" | "none" = "none";
        if (weeklyProgress.includes(dateStr)) type = "stamp";
        else if (weeklyCoins.includes(dateStr)) type = "coin";

        return {
            type,
            date: dateStr,
            isSaturday: d.getDay() === 6,
            isSunday: d.getDay() === 0,
            holidayName: weeklyHolidayMap[dateStr] || null,
        };
    });

    return (
        <TooltipProvider>
            <div className="flex flex-col gap-4">
                <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
                    <div className="flex gap-6">
                        <div className="flex items-center justify-center shrink-0">
                            <RingGauge streak={currentStreak} />
                        </div>
                        <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                            <p className="text-mono-label text-muted-foreground">
                                내 스트릭
                            </p>
                            {isLoggedIn ? (
                                <>
                                    <div className="flex items-baseline gap-1">
                                        <span
                                            className="text-[3.2rem] font-medium leading-none tracking-[-0.04em]"
                                            style={{
                                                color: "var(--dark-blue)",
                                            }}
                                        >
                                            {currentStreak}
                                        </span>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            일
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-0.5">
                                        <span
                                            className="text-sm font-bold"
                                            style={{
                                                color: "var(--brand-orange)",
                                            }}
                                        >
                                            {seasonLabel} 시즌
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                            최고 기록 {longestStreak}일
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-[3rem] font-medium leading-none tracking-[-0.04em] text-muted-foreground">
                                            0
                                        </span>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            일
                                        </span>
                                    </div>
                                    <button
                                        onClick={() =>
                                            openModal(
                                                "로그인하면 공부 기록이 쌓일수록 창밖의 계절이 변합니다.",
                                            )
                                        }
                                        className="text-xs text-left underline underline-offset-2 transition-colors"
                                        style={{ color: "var(--brand-orange)" }}
                                    >
                                        로그인하고 공부 시작하기 →
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-border bg-card px-6 py-4 shadow-[var(--shadow-elegant)]">
                    <p className="text-mono-label text-muted-foreground mb-3">
                        이번 주 학습 현황
                    </p>
                    <div className="flex gap-2">
                        {DAY_LABELS.map((label, i) => {
                            const info = dayInfos[i];
                            const isRed = !!info.holidayName;
                            const isWeekend = info.isSaturday || info.isSunday;
                            const hasTooltip = !!(info.holidayName || isWeekend);

                            return (
                                <div
                                    key={label}
                                    className="flex flex-1 flex-col items-center gap-2"
                                >
                                    <div
                                        className="relative h-10 w-full rounded-md transition-all duration-500 flex items-center justify-center overflow-hidden"
                                        style={
                                            info.type === "stamp"
                                                ? {
                                                      background:
                                                          "linear-gradient(135deg, #fef3c7, #fde68a)",
                                                      border: "1px solid #fbbf24",
                                                      boxShadow:
                                                          "0 2px 4px rgba(251,191,36,0.2)",
                                                  }
                                                : info.type === "coin"
                                                  ? {
                                                        background:
                                                            "rgba(251, 191, 36, 0.05)",
                                                        border: "1px solid rgba(251, 191, 36, 0.3)",
                                                    }
                                                  : {
                                                        backgroundColor:
                                                            "rgba(0,0,0,0.03)",
                                                        border: "1px dashed rgba(0,0,0,0.1)",
                                                    }
                                        }
                                    >
                                        {info.type === "stamp" && (
                                            <div className="w-7 h-7 animate-in fade-in zoom-in duration-700">
                                                <SeasonIcon season={season} />
                                            </div>
                                        )}
                                        {info.type === "coin" && (
                                            <div className="w-7 h-7 animate-in fade-in zoom-in slide-in-from-bottom-2 duration-500">
                                                <CoinIcon />
                                            </div>
                                        )}
                                    </div>

                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span
                                                className={`text-[11px] font-medium transition-colors ${isRed ? "text-red-500 underline underline-offset-2 decoration-red-500/30" : "text-muted-foreground"}`}
                                            >
                                                {label}
                                            </span>
                                        </TooltipTrigger>
                                        {hasTooltip && (
                                            <TooltipContent
                                                side="bottom"
                                                className="max-w-[160px] text-center"
                                            >
                                                <p className="font-semibold">
                                                    {info.holidayName
                                                        ? info.holidayName
                                                        : "주말은 1회만 해도 스트릭이 유지 되요"}
                                                </p>
                                                {info.date && (
                                                    <p className="text-[10px] opacity-80">
                                                        {info.date}
                                                    </p>
                                                )}
                                            </TooltipContent>
                                        )}
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}
