"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useAdminCheck } from "./_hooks/useAdminCheck";
import { AdminVideoTab } from "./_components/AdminVideoTab";
import { AdminHolidayTab } from "./_components/AdminHolidayTab";
import { AdminRequestsTab } from "./_components/AdminRequestsTab";
import { AdminFeedbackList } from "@/widgets/AdminFeedbackList";

type AdminTab = "video" | "holiday" | "requests" | "feedback";

const TAB_LABELS: Record<AdminTab, string> = {
    video: "영상",
    holiday: "공휴일",
    requests: "요청",
    feedback: "피드백",
};

export default function AdminPage() {
    const { isAdmin } = useAdminCheck();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabParam = searchParams.get("tab") as AdminTab;
    
    const activeTab = (tabParam && ["video", "holiday", "requests", "feedback"].includes(tabParam))
        ? tabParam
        : "video";

    const handleTabChange = (tab: AdminTab) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.push(`/admin?${params.toString()}`);
    };

    if (isAdmin === null) {
        return (
            <div className="container mx-auto max-w-lg px-4 py-8 text-sm text-muted-foreground">
                확인 중...
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="container mx-auto max-w-lg px-4 py-8 text-center">
                <p className="text-lg font-semibold">권한 없음</p>
                <p className="mt-1 text-sm text-muted-foreground">
                    관리자 계정으로 로그인하세요.
                </p>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-lg px-4 py-8">
            <div className="mb-6 flex items-center gap-2">
                <h1 className="text-xl font-bold">어드민</h1>
                <Badge variant="secondary">ho2yahh@gmail.com</Badge>
                <a
                    href="https://www.youtube.com/@TEDEd/playlists"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                >
                    TED-Ed 플레이리스트
                </a>
            </div>

            {/* 탭 */}
            <div className="mb-6 flex gap-1 rounded-[6px] border bg-muted/40 p-1">
                {(["video", "holiday", "requests", "feedback"] as const).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => handleTabChange(tab)}
                        className={`flex-1 rounded-[4px] py-1.5 text-sm transition-colors ${activeTab === tab ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        {TAB_LABELS[tab]}
                    </button>
                ))}
            </div>

            {activeTab === "video" && <AdminVideoTab />}
            {activeTab === "holiday" && <AdminHolidayTab />}
            {activeTab === "requests" && <AdminRequestsTab />}
            {activeTab === "feedback" && <AdminFeedbackList />}
        </div>
    );
}
