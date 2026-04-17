"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuthModal } from "@/lib/store/auth-modal";

interface StreakData {
    current_streak: number;
    longest_streak: number;
}

function CompleteContent() {
    const searchParams = useSearchParams();
    const videoId = searchParams.get("videoId");
    const [streak, setStreak] = useState<StreakData | null>(null);
    const [shared, setShared] = useState(false);
    const openModal = useAuthModal((s) => s.open);
    const [selectedDifficulty, setSelectedDifficulty] = useState<1 | 3 | 5 | null>(null);
    const [comment, setComment] = useState('');
    const [feedbackSaved, setFeedbackSaved] = useState(false);
    const [feedbackSaving, setFeedbackSaving] = useState(false);

    useEffect(() => {
        // 스트릭 정보 가져오기 (비로그인이면 null 반환)
        fetch("/api/streak")
            .then((r) => r.json())
            .then((d: { streak: StreakData | null }) => {
                setStreak(d.streak);
                if (!d.streak) {
                    // 비로그인 — Aha-moment 모달
                    openModal();
                }
            });
    }, [openModal]);

    async function handleSaveFeedback() {
        if (!videoId || feedbackSaved) return;
        setFeedbackSaving(true);
        await fetch('/api/progress', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                videoId,
                ...(selectedDifficulty !== null && { difficulty_rating: selectedDifficulty }),
                daily_comment: comment.trim() || null,
            }),
        });
        setFeedbackSaved(true);
        setFeedbackSaving(false);
    }

    async function handleShare() {
        const streakDays = streak?.current_streak ?? 0;
        const shareText = `오늘 Teding로 영어 공부 완주! 🦥\n${streakDays}일 연속 학습 중\n\n${process.env.NEXT_PUBLIC_APP_URL ?? "https://ted-hoho-web.vercel.app"}`;

        if (typeof navigator !== "undefined" && navigator.share) {
            await navigator.share({ title: "Teding", text: shareText });
        } else {
            await navigator.clipboard.writeText(shareText);
            setShared(true);
            setTimeout(() => setShared(false), 2000);
        }
    }

    return (
        <div className="container mx-auto flex min-h-[85vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center">
            {/* Success Icon */}
            <div className="relative mb-8">
                <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30">
                    <svg
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
            </div>

            <h1 className="text-[2.5rem] font-medium leading-tight tracking-[-0.03em] text-[var(--dark-blue)]">
                Great Job!
            </h1>
            <p className="mt-2 text-lg font-medium text-muted-foreground">
                오늘의 학습을 무사히 마쳤습니다.
            </p>

            {/* Streak Info Card */}
            {streak && (
                <div className="mb-10 flex w-full flex-col items-center justify-center rounded-2xl border border-border bg-[var(--dark-blue)] p-8 text-white shadow-xl">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[3.5rem] font-medium tracking-tighter text-[var(--brand-orange)]">
                            {streak.current_streak}
                        </span>
                        <span className="text-xl font-medium opacity-80">
                            일 연속 학습 중
                        </span>
                    </div>
                    <p className="mt-2 text-sm font-medium opacity-60">
                        최고 기록 {streak.longest_streak}일
                    </p>
                    <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                            className="h-full bg-[var(--brand-orange)] shadow-[0_0_15px_rgba(252,76,2,0.5)]"
                            style={{ width: "100%" }}
                        />
                    </div>
                </div>
            )}

            {/* Feedback Form — 로그인 사용자만 */}
            {streak && (
                <div className="mb-4 w-full rounded-2xl border border-border bg-card p-6 text-left shadow-sm">
                    <p className="mb-4 text-sm font-semibold text-[var(--dark-blue)]">오늘 학습 어땠나요?</p>

                    {/* 난이도 칩 */}
                    <div className="mb-5 flex gap-2">
                        {([
                            { label: '쉬워요', value: 1 as const },
                            { label: '할만해요', value: 3 as const },
                            { label: '어려워요', value: 5 as const },
                        ] as const).map(({ label, value }) => (
                            <button
                                key={value}
                                onClick={() => setSelectedDifficulty(selectedDifficulty === value ? null : value)}
                                disabled={feedbackSaved}
                                className={cn(
                                    'flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all',
                                    selectedDifficulty === value
                                        ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/10 text-[var(--brand-orange)]'
                                        : 'border-border bg-background text-muted-foreground hover:border-border/80 hover:text-foreground',
                                    feedbackSaved && 'opacity-60 cursor-not-allowed'
                                )}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* 한 줄 평 */}
                    <div className="mb-4 space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground">한 줄 평 <span className="font-normal">(선택)</span></p>
                        <textarea
                            value={comment}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value.slice(0, 100))}
                            placeholder="오늘 배운 내용을 한 줄로 남겨보세요"
                            rows={2}
                            disabled={feedbackSaved}
                            className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-60"
                        />
                        <p className="text-right text-[10px] text-muted-foreground">{comment.length}/100</p>
                    </div>

                    <button
                        onClick={handleSaveFeedback}
                        disabled={feedbackSaved || feedbackSaving || (selectedDifficulty === null && !comment.trim())}
                        className={cn(
                            'w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-all',
                            feedbackSaved
                                ? 'bg-green-500/10 text-green-600 cursor-default'
                                : 'bg-[var(--dark-blue)] text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed'
                        )}
                    >
                        {feedbackSaved ? '저장됨 ✓' : feedbackSaving ? '저장 중...' : '저장하기'}
                    </button>
                </div>
            )}

            {/* Share & Actions */}
            <div className="flex w-full flex-col gap-4">
                <button
                    onClick={handleShare}
                    className="flex h-14 items-center justify-center gap-3 rounded-xl bg-[#FEE500] px-6 text-sm font-bold text-[#3C1E1E] shadow-sm transition-transform active:scale-95"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 3c-4.97 0-9 3.185-9 7 0 3.16 2.761 5.813 6.53 6.71l-1.31 4.81c-.13.48.43.85.83.56l5.68-3.83c.41.02.83.03 1.27.03 4.97 0 9-3.185 9-7s-4.03-7-9-7z" />
                    </svg>
                    {shared
                        ? "링크가 복사되었습니다!"
                        : "카카오톡으로 자랑하기"}
                </button>
                <Link
                    href="/"
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-14 rounded-xl border-border bg-white text-base font-semibold shadow-sm",
                    )}
                >
                    홈으로 돌아가기
                </Link>
            </div>
        </div>
    );
}

export default function CompletePage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center">
                    Loading...
                </div>
            }
        >
            <CompleteContent />
        </Suspense>
    );
}
