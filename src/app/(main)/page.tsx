import { createClient, createServiceClient } from "@/lib/supabase/server";
import { DailyVideoBanner } from "@/components/home/DailyVideoBanner";
import { StreakCard } from "@/components/home/StreakCard";
import { RecentList } from "@/components/home/RecentList";
import { getKSTDate, getDayOfWeekKST } from "@/lib/utils";
import { getHolidayName } from "@/lib/utills/holiday";

export default async function TodayPage() {
    const supabase = await createClient();
    const adminSupabase = createServiceClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const today = getKSTDate();

    const videoResult = await adminSupabase
        .from("daily_videos")
        .select("*")
        .eq("date", today)
        .single();
    const video = videoResult.data;

    let streak = null;
    let weeklyProgress: string[] = [];
    let weeklyCoins: string[] = [];
    const weeklyHolidayMap: Record<string, string> = {};

    if (user) {
        // 이번 주 월요일 찾기 (KST 기준)
        const [ty, tm, td] = today.split("-").map(Number);
        const todayUTC = Date.UTC(ty, tm - 1, td);
        const dayOfWeek = getDayOfWeekKST(today);
        const dayOffset = (dayOfWeek + 6) % 7; // 0: 월, 6: 일

        const mondayUTC = todayUTC - dayOffset * 24 * 60 * 60 * 1000;

        const dates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(mondayUTC + i * 24 * 60 * 60 * 1000);
            const year = d.getUTCFullYear();
            const month = String(d.getUTCMonth() + 1).padStart(2, "0");
            const day = String(d.getUTCDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        });

        // 성능 최적화: 전체 조회를 피하고 최근 2주일(지난주 월요일부터 이번주 일요일까지) 데이터로 스캔 제한
        const lastMondayUTC = mondayUTC - 7 * 24 * 60 * 60 * 1000;
        const lmDate = new Date(lastMondayUTC);
        const lmY = lmDate.getUTCFullYear();
        const lmM = String(lmDate.getUTCMonth() + 1).padStart(2, "0");
        const lmD = String(lmDate.getUTCDate()).padStart(2, "0");
        const lastMondayStr = `${lmY}-${lmM}-${lmD}`;

        const [streakRes, progressRes] = await Promise.all([
            supabase
                .from("streaks")
                .select("*")
                .eq("user_id", user.id)
                .single(),
            supabase
                .from("user_progress")
                .select(
                    "date, step1_completed_at, step2_completed_at, step3_completed_at, step4_completed_at",
                )
                .eq("user_id", user.id)
                .gte("date", lastMondayStr),
        ]);

        streak = streakRes.data;

        // 타임스탬프를 새벽 3시 오프셋 기준 KST 날짜 문자열(YYYY-MM-DD)로 변환
        const getLogicalKSTDate = (isoString: string | null): string | null => {
            if (!isoString) return null;
            const date = new Date(isoString);
            const kstTime = date.getTime() + 9 * 60 * 60 * 1000; // KST(UTC+9) 보정
            const logicalTime = kstTime - 3 * 60 * 60 * 1000; // 새벽 3시 기준 소급
            const d = new Date(logicalTime);
            const year = d.getUTCFullYear();
            const month = String(d.getUTCMonth() + 1).padStart(2, "0");
            const day = String(d.getUTCDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const progressSet = new Set<string>();
        (progressRes.data ?? []).forEach((p) => {
            // 각 스텝 완료 타임스탬프에서 날짜를 파싱하여 이번 주 학습일 목록에 추가
            [
                p.step1_completed_at,
                p.step2_completed_at,
                p.step3_completed_at,
                p.step4_completed_at,
            ].forEach((ts) => {
                const dateStr = getLogicalKSTDate(ts);
                if (dateStr && dates.includes(dateStr)) {
                    progressSet.add(dateStr);
                }
            });
        });
        weeklyProgress = Array.from(progressSet);

        // 이번 주 공휴일 및 보너스 코인 날짜 계산
        const dateInfoResults = await Promise.all(
            dates.map(async (dateStr, idx) => {
                const holName = await getHolidayName(dateStr);
                const dow = getDayOfWeekKST(dateStr); // 0: 일, 6: 토

                let coin = null;
                // 학습하지 않은 날 중 보너스 코인 지급 대상
                if (!weeklyProgress.includes(dateStr)) {
                    // 1. 공휴일 (과거/오늘/미래 무관하게 코인 표시)
                    if (holName) {
                        coin = dateStr;
                    }
                    // 2. 일요일인 경우 (학습 여부와 상관없이 휴식일 코인 표시)
                    else if (dow === 0 && dateStr <= today) {
                        coin = dateStr;
                    }
                    // 3. 토요일인 경우 (일요일에 학습했거나, 오늘이 일요일이고 현재 학습 중인 경우)
                    else if (dow === 6 && dateStr < today) {
                        const sundayStr = dates[idx + 1];
                        // 일요일에 학습 기록이 있거나, 오늘이 일요일인데 아직 기록이 없는 경우(보너스 예고)
                        if (
                            weeklyProgress.includes(sundayStr) ||
                            sundayStr === today
                        ) {
                            coin = dateStr;
                        }
                    }
                }

                return { dateStr, holName, coin };
            }),
        );

        dateInfoResults.forEach((r) => {
            if (r.holName) weeklyHolidayMap[r.dateStr] = r.holName;
        });
        weeklyCoins = dateInfoResults
            .map((r) => r.coin)
            .filter((d): d is string => d !== null);
    }

    let requesterNickname: string | null = null;
    if (video) {
        const { data: requestData } = await adminSupabase
            .from("video_requests")
            .select("user_id")
            .eq("scheduled_date", today)
            .eq("status", "scheduled")
            .maybeSingle();

        if (requestData?.user_id) {
            const { data: profileData } = await adminSupabase
                .from("profiles")
                .select("nickname")
                .eq("id", requestData.user_id)
                .single();
            requesterNickname = profileData?.nickname ?? null;
        }
    }

    let cached = { transcript: false, materials: false };
    let startStep = 1;
    let isCompleted = false;

    if (video) {
        const cacheChecks = await Promise.all([
            adminSupabase
                .from("transcripts")
                .select("id")
                .eq("video_id", video.video_id)
                .single(),
            adminSupabase
                .from("learning_materials")
                .select("id")
                .eq("video_id", video.video_id)
                .single(),
        ]);
        cached = {
            transcript: !!cacheChecks[0].data,
            materials: !!cacheChecks[1].data,
        };

        if (user) {
            const { data: progress } = await supabase
                .from("user_progress")
                .select(
                    "step1_completed_at,step2_completed_at,step3_completed_at,step4_completed_at",
                )
                .eq("user_id", user.id)
                .eq("video_id", video.video_id)
                .single();

            if (progress) {
                if (!progress.step1_completed_at) startStep = 1;
                else if (!progress.step2_completed_at) startStep = 2;
                else if (!progress.step3_completed_at) startStep = 3;
                else if (!progress.step4_completed_at) startStep = 4;
                else startStep = 1;
            }
            isCompleted = !!progress?.step4_completed_at;
        }
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-5 md:py-12">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <p className="mb-1 text-xs text-muted-foreground">
                        {isCompleted
                            ? "오늘의 학습을 완료하셨네요! 혹시 복습 한번 할까요?"
                            : "5분짜리 TED-Ed 영상으로 가볍게 시작하는 영어 루틴"}
                    </p>
                    <h1 className="text-3xl sm:text-[2.5rem] font-medium leading-[1.2] tracking-[-0.03em]">
                        {isCompleted ? "학습 완료 🎉" : "오늘의 AI 학습지 !"}
                    </h1>
                </div>
            </div>
            <p className="text-right mt-1 pb-3 shrink-0 text-mono-label text-muted-foreground">
                {today.replace(/-/g, ".")}
            </p>
            <div className="flex flex-col gap-8">
                {video ? (
                    <DailyVideoBanner
                        video={video}
                        cached={cached}
                        startStep={startStep}
                        requesterNickname={requesterNickname}
                    />
                ) : (
                    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
                        <p className="text-sm font-medium">
                            오늘의 영상이 아직 등록되지 않았습니다.
                        </p>
                        <p className="mt-1 text-xs">
                            관리자가 영상을 준비 중입니다. 잠시 후 다시
                            확인해주세요.
                        </p>
                    </div>
                )}

                <StreakCard
                    currentStreak={streak?.current_streak ?? 0}
                    longestStreak={streak?.longest_streak ?? 0}
                    lastStudyDate={streak?.last_study_date ?? null}
                    weeklyProgress={weeklyProgress}
                    weeklyCoins={weeklyCoins}
                    weeklyHolidayMap={weeklyHolidayMap}
                    isLoggedIn={!!user}
                />

                <RecentList />
            </div>
        </div>
    );
}
