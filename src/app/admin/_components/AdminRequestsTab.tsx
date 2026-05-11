"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useVideoRegister } from "@/hooks/useVideoRegister";
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    format,
    addMonths,
} from "date-fns";
import { ko } from "date-fns/locale";

interface RequestItem {
    id: string;
    user_id: string;
    video_id: string;
    video_url: string;
    video_title: string | null;
    video_duration: string | null;
    thumbnail_url: string | null;
    user_message: string | null;
    status: string;
    scheduled_date: string | null;
    created_at: string;
    nickname: string;
}

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

function AdminCalendar({
    currentMonthDate,
    registeredDates,
    selectedDate,
    onDateSelect,
}: {
    currentMonthDate: Date;
    registeredDates: Set<string>;
    selectedDate: string | null;
    onDateSelect: (date: string) => void;
}) {
    const monthStart = startOfMonth(currentMonthDate);
    const monthEnd = endOfMonth(currentMonthDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: calStart, end: calEnd });

    return (
        <div>
            <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                {WEEKDAYS.map((d) => (
                    <div key={d} className="py-1 text-[10px] text-muted-foreground">
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
                {days.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const inMonth = isSameMonth(day, monthStart);
                    const isRegistered = registeredDates.has(dateStr);
                    const isSelected = selectedDate === dateStr;

                    return (
                        <button
                            key={dateStr}
                            type="button"
                            disabled={!inMonth}
                            onClick={() => inMonth && onDateSelect(dateStr)}
                            className={`relative flex aspect-square items-center justify-center rounded-[4px] text-xs transition-colors ${
                                !inMonth
                                    ? "opacity-20 cursor-default"
                                    : isSelected
                                      ? "bg-foreground text-background font-semibold"
                                      : "hover:bg-muted"
                            }`}
                        >
                            {format(day, "d")}
                            {isRegistered && inMonth && (
                                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-[var(--brand-orange)]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export function AdminRequestsTab() {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [registeredDates, setRegisteredDates] = useState<Set<string>>(new Set());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [rejectLoading, setRejectLoading] = useState<string | null>(null);

    const { register, isRegistering, result: registerResult, setResult: setRegisterResult } = useVideoRegister();

    const currentMonth = format(calendarDate, "yyyy-MM");

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/requests?status=pending");
            const data = (await res.json()) as { requests?: RequestItem[] };
            setRequests(data.requests ?? []);
        } catch {
            setRequests([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRegisteredDates = useCallback(async (month: string) => {
        try {
            const res = await fetch(`/api/admin/schedule-map?month=${month}`);
            const data = (await res.json()) as { dates?: string[] };
            setRegisteredDates(new Set(data.dates ?? []));
        } catch {
            setRegisteredDates(new Set());
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    useEffect(() => {
        fetchRegisteredDates(currentMonth);
    }, [currentMonth, fetchRegisteredDates]);

    async function handleSchedule(req: RequestItem) {
        if (!selectedDate) return;

        setSelectedRequestId(req.id);
        setRegisterResult(null);

        const registerRes = await register({
            videoId: req.video_id,
            title: req.video_title ?? req.video_id,
            duration: req.video_duration ?? '',
            date: selectedDate,
        });

        if (!registerRes.ok) return;

        const patchRes = await fetch(`/api/admin/requests/${req.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "schedule", scheduledDate: selectedDate }),
        });

        if (!patchRes.ok) {
            const data = (await patchRes.json()) as { error?: string };
            setRegisterResult({ ok: false, error: data.error ?? "상태 업데이트 실패" });
            return;
        }

        setRegisterResult({
            ok: true,
            transcriptCached: registerRes.transcriptCached,
            materialsCached: registerRes.materialsCached,
        });
        setSelectedDate(null);
        setSelectedRequestId(null);
        await fetchRequests();
        await fetchRegisteredDates(currentMonth);
    }

    async function handleReject(requestId: string) {
        if (!confirm("이 요청을 거절하시겠습니까?")) return;

        setRejectLoading(requestId);
        setRegisterResult(null);

        const res = await fetch(`/api/admin/requests/${requestId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "reject" }),
        });

        const data = (await res.json()) as { ok?: boolean; error?: string };
        setRejectLoading(null);

        if (!res.ok) {
            setRegisterResult({ ok: false, error: data.error ?? "거절 실패" });
        } else {
            setRegisterResult(null);
            if (selectedRequestId === requestId) setSelectedRequestId(null);
            await fetchRequests();
        }
    }

    return (
        <div className="flex flex-col gap-6">
            {/* 달력 */}
            <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => setCalendarDate((d) => addMonths(d, -1))}
                        className="rounded p-1 hover:bg-muted transition-colors text-sm"
                    >
                        ←
                    </button>
                    <span className="text-sm font-medium">
                        {format(calendarDate, "yyyy년 M월", { locale: ko })}
                    </span>
                    <button
                        type="button"
                        onClick={() => setCalendarDate((d) => addMonths(d, 1))}
                        className="rounded p-1 hover:bg-muted transition-colors text-sm"
                    >
                        →
                    </button>
                </div>
                <AdminCalendar
                    currentMonthDate={calendarDate}
                    registeredDates={registeredDates}
                    selectedDate={selectedDate}
                    onDateSelect={(date) =>
                        setSelectedDate((prev) => (prev === date ? null : date))
                    }
                />
                {selectedDate && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">
                        선택된 날짜:{" "}
                        <span className="font-medium text-foreground">
                            {selectedDate}
                        </span>
                        {registeredDates.has(selectedDate) && (
                            <span className="ml-1 text-[var(--brand-orange)]">
                                ⚠ 이미 영상이 있음
                            </span>
                        )}
                    </p>
                )}
            </div>

            {/* 피드백 */}
            {registerResult && (
                <div
                    className={`rounded-lg border p-3 text-sm ${
                        registerResult.ok
                            ? "border-green-300 bg-green-50 text-green-800"
                            : "border-destructive/30 bg-destructive/10 text-destructive"
                    }`}
                >
                    {registerResult.ok
                        ? `등록 완료 · 스크립트 ${registerResult.transcriptCached ? "캐시" : "신규"} · 학습자료 ${registerResult.materialsCached ? "캐시" : "신규 생성"}`
                        : registerResult.error}
                </div>
            )}

            {/* 요청 목록 */}
            {loading ? (
                <p className="text-sm text-muted-foreground">불러오는 중...</p>
            ) : requests.length === 0 ? (
                <p className="text-sm text-muted-foreground">대기 중인 요청이 없습니다.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {requests.map((req) => {
                        const isScheduling = isRegistering && selectedRequestId === req.id;
                        const isRejecting = rejectLoading === req.id;
                        const isProcessing = isScheduling || isRejecting;
                        const isSelected = selectedRequestId === req.id;

                        return (
                            <div
                                key={req.id}
                                className={`rounded-lg border p-4 transition-colors ${isSelected ? "border-foreground" : ""}`}
                            >
                                <div className="flex gap-3">
                                    {req.thumbnail_url && (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={req.thumbnail_url}
                                            alt={req.video_title ?? req.video_id}
                                            className="w-28 shrink-0 rounded-[4px] object-cover aspect-video"
                                        />
                                    )}
                                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                                        <p className="text-sm font-medium line-clamp-2">
                                            {req.video_title ?? req.video_id}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[10px]">
                                                {req.nickname}
                                            </Badge>
                                            {req.video_duration && (
                                                <span className="text-[10px] font-mono text-muted-foreground">
                                                    {req.video_duration}
                                                </span>
                                            )}
                                        </div>
                                        {req.user_message && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                                &ldquo;{req.user_message}&rdquo;
                                            </p>
                                        )}
                                        <p className="text-[10px] text-muted-foreground mt-0.5">
                                            {new Date(req.created_at).toLocaleDateString("ko-KR")}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 flex gap-2">
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        disabled={isProcessing}
                                        onClick={() => handleReject(req.id)}
                                        className="text-xs border-destructive/40 text-destructive hover:bg-destructive/10"
                                    >
                                        {isRejecting ? "처리 중..." : "거절"}
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        disabled={isProcessing || !selectedDate}
                                        onClick={() => handleSchedule(req)}
                                        className="flex-1 text-xs"
                                    >
                                        {isScheduling
                                            ? "처리 중..."
                                            : selectedDate
                                              ? `${selectedDate}에 등록`
                                              : "날짜를 먼저 선택하세요"}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
