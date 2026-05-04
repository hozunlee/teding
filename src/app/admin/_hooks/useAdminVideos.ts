"use client";

import { useState, useEffect } from "react";
import { TodayData } from "../_lib/types";
import { getKSTDateStr } from "../_lib/date";
import { parseVideoId } from "../_lib/youtube";

export function useAdminVideos() {
    const [today, setToday] = useState<TodayData | null>(null);
    const [tomorrow, setTomorrow] = useState<TodayData | null>(null);
    
    const [editMode, setEditMode] = useState<"today" | "tomorrow" | null>(null);
    const [targetDate, setTargetDate] = useState<"today" | "tomorrow">("today");
    
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

    const fetchVideos = () => {
        fetch("/api/today")
            .then((r) => r.json())
            .then((d: TodayData) => setToday(d))
            .catch(() => {});
        fetch(`/api/today?date=${getKSTDateStr(1)}`)
            .then((r) => r.json())
            .then((d: TodayData) => setTomorrow(d))
            .catch(() => {});
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const todayHasVideo = !!today?.video;
    const tomorrowHasVideo = !!tomorrow?.video;

    // 오늘 등록 완료 시 기본 대상을 내일로 전환
    useEffect(() => {
        if (todayHasVideo && !tomorrowHasVideo && editMode === null) {
            setTargetDate("tomorrow");
        }
    }, [todayHasVideo, tomorrowHasVideo, editMode]);

    const handleSubmit = async (
        e: React.FormEvent,
        { videoInput, title, duration, force }: { videoInput: string; title: string; duration: string; force: boolean },
        onSuccess: () => void
    ) => {
        e.preventDefault();
        setSubmitting(true);
        setResult(null);

        const date = getKSTDateStr(targetDate === "tomorrow" ? 1 : 0);
        const videoId = parseVideoId(videoInput);
        const res = await fetch("/api/admin/daily", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoId, title, duration, force, date }),
        });

        const data = (await res.json()) as {
            ok?: boolean;
            error?: string;
            transcriptCached?: boolean;
            materialsCached?: boolean;
        };
        setSubmitting(false);

        if (!res.ok) {
            setResult({ ok: false, message: data.error ?? "오류 발생" });
        } else {
            setResult({
                ok: true,
                message: `${targetDate === "tomorrow" ? "내일" : "오늘"} 등록 완료 · 스크립트 ${data.transcriptCached ? "캐시" : "신규"} · 학습자료 ${data.materialsCached ? "캐시" : "신규 생성"}`,
            });
            setEditMode(null);
            onSuccess();
            fetchVideos();
        }
    };

    const handleReset = async (
        videoInput: string,
        onSuccess: () => void
    ) => {
        if (
            !confirm(
                "정말로 오늘의 학습자료(영상, 스크립트, 학습지 전체)를 초기화하시겠습니까?",
            )
        )
            return;
        setSubmitting(true);
        setResult(null);

        const videoId = parseVideoId(videoInput);
        const res = await fetch("/api/admin/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                videoId: videoId || today?.video?.video_id,
            }),
        });

        const data = (await res.json()) as {
            ok?: boolean;
            error?: string;
            message?: string;
        };
        setSubmitting(false);

        if (!res.ok) {
            setResult({ ok: false, message: data.error ?? "초기화 실패" });
        } else {
            setResult({ ok: true, message: data.message ?? "초기화 성공" });
            setEditMode(null);
            onSuccess();
            fetchVideos();
        }
    };

    return {
        today,
        tomorrow,
        todayHasVideo,
        tomorrowHasVideo,
        editMode,
        setEditMode,
        targetDate,
        setTargetDate,
        submitting,
        result,
        setResult,
        handleSubmit,
        handleReset,
    };
}
