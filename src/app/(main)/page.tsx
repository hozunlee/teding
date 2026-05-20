import { createClient, createServiceClient } from "@/lib/supabase/server";
import { DailyVideoBanner } from "@/components/home/DailyVideoBanner";
import { StreakCard } from "@/components/home/StreakCard";
import { RecentList } from "@/components/home/RecentList";
import { getKSTDate, getDayOfWeekKST } from "@/lib/utils";
import { getHolidaysForDates } from "@/lib/utills/holiday";

export default async function TodayPage() {
    const supabase = await createClient();
    const adminSupabase = createServiceClient();
    
    // 1. Initial parallel fetches
    const today = getKSTDate();
    const [authRes, todayVideoRes] = await Promise.all([
        supabase.auth.getUser(),
        adminSupabase.from("daily_videos").select("*").eq("date", today).maybeSingle()
    ]);
    
    const user = authRes.data.user;
    let video = todayVideoRes.data;
    let mode: 'today' | 'continue' | 'fallback' = 'today';
    let displayDate = video?.date;
    let requesterNickname: string | null = null;
    let history: any[] | undefined = undefined;

    const dow = getDayOfWeekKST(today);
    const isWeekend = dow === 0 || dow === 6;

    let streak = null;
    let weeklyProgress: string[] = [];
    let weeklyCoins: string[] = [];
    const weeklyHolidayMap: Record<string, string> = {};

    // Generate dates for the week to check holidays
    let datesToCheck = [today];
    let dates: string[] = [];
    
    if (user) {
        const [ty, tm, td] = today.split("-").map(Number);
        const todayUTC = Date.UTC(ty, tm - 1, td);
        const dayOffset = (dow + 6) % 7; // 0: 월, 6: 일
        const mondayUTC = todayUTC - dayOffset * 24 * 60 * 60 * 1000;
        
        dates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(mondayUTC + i * 24 * 60 * 60 * 1000);
            const year = d.getUTCFullYear();
            const month = String(d.getUTCMonth() + 1).padStart(2, "0");
            const day = String(d.getUTCDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        });
        
        dates.forEach(d => {
            if (!datesToCheck.includes(d)) datesToCheck.push(d);
        });
    }

    // Parallel fetch for user progress + holidays
    const fetchPromises: any[] = [
        getHolidaysForDates(supabase, datesToCheck)
    ];

    let streakResIdx = -1;
    let progressResIdx = -1;
    let historyResIdx = -1;

    if (user) {
        const [ty, tm, td] = today.split("-").map(Number);
        const todayUTC = Date.UTC(ty, tm - 1, td);
        const dayOffset = (dow + 6) % 7; 
        const mondayUTC = todayUTC - dayOffset * 24 * 60 * 60 * 1000;
        const lastMondayUTC = mondayUTC - 7 * 24 * 60 * 60 * 1000;
        
        const lmDate = new Date(lastMondayUTC);
        const lmY = lmDate.getUTCFullYear();
        const lmM = String(lmDate.getUTCMonth() + 1).padStart(2, "0");
        const lmD = String(lmDate.getUTCDate()).padStart(2, "0");
        const lastMondayStr = `${lmY}-${lmM}-${lmD}`;

        streakResIdx = fetchPromises.push(supabase.from("streaks").select("*").eq("user_id", user.id).single()) - 1;
        progressResIdx = fetchPromises.push(
            supabase.from("user_progress").select("date, step1_completed_at, step2_completed_at, step3_completed_at, step4_completed_at").eq("user_id", user.id).gte("date", lastMondayStr)
        ) - 1;
        historyResIdx = fetchPromises.push(
            supabase.from("user_progress").select(`
                date, step1_completed_at, step2_completed_at, step3_completed_at, step4_completed_at,
                video_id, daily_comment
            `).eq("user_id", user.id).not("step1_completed_at", "is", null).order("date", { ascending: false }).limit(5)
        ) - 1;
    }

    const fetchResults = await Promise.all(fetchPromises);
    const holidaysMap = fetchResults[0] as Map<string, string>;
    const isHoliday = holidaysMap.has(today);

    if (user) {
        streak = fetchResults[streakResIdx].data;
        const progressResData = fetchResults[progressResIdx].data || [];
        const historyData = fetchResults[historyResIdx].data || [];

        if (historyData.length > 0) {
            const videoIds = historyData.map((h: any) => h.video_id);
            const { data: videosData } = await adminSupabase.from("daily_videos").select("video_id, title, duration, date").in("video_id", videoIds);
            const videoMap = new Map(videosData?.map(v => [v.video_id, v]));
            history = historyData.map((p: any) => {
                const videoInfo = videoMap.get(p.video_id);
                return {
                    ...p,
                    date: videoInfo?.date || p.date,
                    daily_videos: {
                        title: videoInfo?.title || '제목 없음',
                        duration: videoInfo?.duration || ''
                    }
                }
            });
        } else {
            history = [];
        }

        // Logical KST Date calculation
        const getLogicalKSTDate = (isoString: string | null): string | null => {
            if (!isoString) return null;
            const date = new Date(isoString);
            const kstTime = date.getTime() + 9 * 60 * 60 * 1000; 
            const logicalTime = kstTime - 3 * 60 * 60 * 1000; 
            const d = new Date(logicalTime);
            const year = d.getUTCFullYear();
            const month = String(d.getUTCMonth() + 1).padStart(2, "0");
            const day = String(d.getUTCDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        };

        const progressSet = new Set<string>();
        progressResData.forEach((p: any) => {
            [p.step1_completed_at, p.step2_completed_at, p.step3_completed_at, p.step4_completed_at].forEach((ts) => {
                const dateStr = getLogicalKSTDate(ts);
                if (dateStr && dates.includes(dateStr)) {
                    progressSet.add(dateStr);
                }
            });
        });
        weeklyProgress = Array.from(progressSet);

        // Calculate coins and holidays
        dates.forEach((dateStr, idx) => {
            const holName = holidaysMap.get(dateStr);
            const dayOfWeek = getDayOfWeekKST(dateStr);
            let coin = null;
            
            if (!weeklyProgress.includes(dateStr)) {
                if (holName) {
                    coin = dateStr;
                } else if (dayOfWeek === 0 && dateStr <= today) {
                    coin = dateStr;
                } else if (dayOfWeek === 6 && dateStr < today) {
                    const sundayStr = dates[idx + 1];
                    if (weeklyProgress.includes(sundayStr) || sundayStr === today) {
                        coin = dateStr;
                    }
                }
            }

            if (holName) weeklyHolidayMap[dateStr] = holName;
            if (coin) weeklyCoins.push(coin);
        });
    }

    // 3. Resolve video (Fallback / Continue)
    if (!video && (isWeekend || isHoliday)) {
        if (user && history) {
            const incomplete = history.find((h: any) => !h.step4_completed_at);
            if (incomplete) {
                mode = 'continue';
                video = {
                    id: 'continue-mode-mock-id',
                    video_id: incomplete.video_id,
                    title: incomplete.daily_videos?.title || '',
                    duration: incomplete.daily_videos?.duration || '',
                    date: incomplete.date,
                    created_at: new Date().toISOString()
                };
                displayDate = incomplete.date;
            }
        }
        
        if (!video) {
            const { data: latestVideo } = await adminSupabase
                .from("daily_videos")
                .select("*")
                .order("date", { ascending: false })
                .limit(1)
                .maybeSingle();
            
            if (latestVideo) {
                mode = 'fallback';
                video = latestVideo;
                displayDate = latestVideo.date;
            }
        }
    }

    // 4. Resolve cached & progress for the chosen video
    let cached = { transcript: false, materials: false };
    let startStep = 1;
    let isCompleted = false;

    if (video) {
        const videoChecks = [];
        videoChecks.push(adminSupabase.from("transcripts").select("id").eq("video_id", video.video_id).maybeSingle());
        videoChecks.push(adminSupabase.from("learning_materials").select("id").eq("video_id", video.video_id).maybeSingle());
        
        if (mode === 'today') {
            videoChecks.push(adminSupabase.from("video_requests").select("user_id").eq("scheduled_date", today).eq("status", "scheduled").maybeSingle());
        }

        if (user) {
            videoChecks.push(supabase.from("user_progress").select("step1_completed_at,step2_completed_at,step3_completed_at,step4_completed_at").eq("user_id", user.id).eq("video_id", video.video_id).maybeSingle());
        }

        const checkResults = await Promise.all(videoChecks);
        cached.transcript = !!checkResults[0].data;
        cached.materials = !!checkResults[1].data;

        if (mode === 'today') {
            const requestData = checkResults[2]?.data as any;
            if (requestData?.user_id) {
                const { data: profileData } = await adminSupabase.from("profiles").select("nickname").eq("id", requestData.user_id).single();
                requesterNickname = profileData?.nickname ?? null;
            }
        }

        if (user) {
            const progress = checkResults[checkResults.length - 1]?.data as any;
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
                        {isCompleted ? "학습 완료 🎉" : "오늘의 AI 학습지 🤓"}
                    </h1>
                </div>
            </div>
            <p className="text-right mt-1 pb-3 shrink-0 text-mono-label text-muted-foreground">
                {displayDate?.replace(/-/g, ".") || today.replace(/-/g, ".")}
            </p>
            <div className="flex flex-col gap-8">
                {video ? (
                    <DailyVideoBanner
                        video={video}
                        cached={cached}
                        startStep={startStep}
                        requesterNickname={requesterNickname}
                        mode={mode}
                        videoDate={video.date}
                    />
                ) : (
                    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center text-muted-foreground">
                        <p className="text-sm font-medium">
                            오늘의 영상이 아직 등록되지 않았습니다.
                        </p>
                        <p className="mt-1 text-xs">
                            관리자가 영상을 준비 중입니다. 잠시 후 다시 확인해주세요.
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

                <RecentList initialHistory={history} initialLoggedIn={!!user} />
            </div>
        </div>
    );
}
