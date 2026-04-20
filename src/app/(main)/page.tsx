import { createClient, createServiceClient } from "@/lib/supabase/server";
import { DailyVideoBanner } from "@/components/home/DailyVideoBanner";
import { StreakCard } from "@/components/home/StreakCard";
import { RecentList } from "@/components/home/RecentList";
import { getKSTDate } from "@/lib/utils";

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

    if (user) {
        // 새벽 3시 오프셋을 적용한 '논리적 오늘'의 자정 시각 구하기
        const now = new Date();
        const logicalNow = new Date(now.getTime() - 3 * 60 * 60 * 1000);
        const kstLogicalNow = new Date(
            logicalNow.toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
        );

        // 해당 주의 월요일 구하기
        const dayOfWeek = (kstLogicalNow.getDay() + 6) % 7;
        const monday = new Date(kstLogicalNow);
        monday.setDate(kstLogicalNow.getDate() - dayOfWeek);
        monday.setHours(0, 0, 0, 0);

        const dates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            
            // d는 이미 논리적 오늘 기준의 월요일부터 계산된 값이므로 
            // 단순히 YYYY-MM-DD 포맷만 필요함.
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        });

        const [streakRes, progressRes] = await Promise.all([
            supabase
                .from("streaks")
                .select("*")
                .eq("user_id", user.id)
                .single(),
            supabase
                .from("user_progress")
                .select("date")
                .eq("user_id", user.id)
                .in("date", dates)
                .not("step1_completed_at", "is", null),
        ]);

        streak = streakRes.data;
        weeklyProgress = (progressRes.data ?? []).map((p) => p.date);
    }

    let cached = { transcript: false, materials: false };
    let startStep = 1;

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
        }
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-5 md:py-12">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <p className="mb-1 text-xs text-muted-foreground">
                        5분짜리 TED-Ed 영상으로 가볍게 시작하는 영어 루틴
                    </p>
                    <h1 className="text-3xl sm:text-[2.5rem] font-medium leading-[1.2] tracking-[-0.03em]">
                        오늘의 AI 큐레이션
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
                    isLoggedIn={!!user}
                />

                <RecentList />
            </div>
        </div>
    );
}
