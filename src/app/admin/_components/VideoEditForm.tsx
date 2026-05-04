import { Button } from "@/components/ui/button";
import { getKSTDateStr } from "../_lib/date";
import { parseVideoId } from "../_lib/youtube";

interface Props {
    editMode: "today" | "tomorrow" | null;
    targetDate: "today" | "tomorrow";
    todayHasVideo: boolean;
    videoInput: string;
    title: string;
    duration: string;
    force: boolean;
    submitting: boolean;
    result: { ok: boolean; message: string } | null;
    setTargetDate: (val: "today" | "tomorrow") => void;
    setVideoInput: (val: string) => void;
    setTitle: (val: string) => void;
    setDuration: (val: string) => void;
    setForce: (val: boolean) => void;
    cancelEdit: () => void;
    onSubmit: (e: React.FormEvent) => void;
    onReset: () => void;
}

export function VideoEditForm({
    editMode,
    targetDate,
    todayHasVideo,
    videoInput,
    title,
    duration,
    force,
    submitting,
    result,
    setTargetDate,
    setVideoInput,
    setTitle,
    setDuration,
    setForce,
    cancelEdit,
    onSubmit,
    onReset,
}: Props) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {editMode !== null ? (
                <div className="flex items-center justify-between">
                    <p className="text-mono-label text-muted-foreground">
                        {editMode === "today"
                            ? `오늘 (${getKSTDateStr(0)})`
                            : `내일 (${getKSTDateStr(1)})`}{" "}
                        변경
                    </p>
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-xs text-muted-foreground hover:text-foreground"
                    >
                        취소
                    </button>
                </div>
            ) : !todayHasVideo ? (
                <div className="flex flex-col gap-1.5">
                    <label className="text-mono-label text-muted-foreground">
                        등록 날짜
                    </label>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setTargetDate("today")}
                            className={`flex-1 rounded-[4px] border px-3 py-2 text-sm transition-colors ${targetDate === "today" ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
                        >
                            오늘 ({getKSTDateStr(0)})
                        </button>
                        <button
                            type="button"
                            onClick={() => setTargetDate("tomorrow")}
                            className={`flex-1 rounded-[4px] border px-3 py-2 text-sm transition-colors ${targetDate === "tomorrow" ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
                        >
                            내일 ({getKSTDateStr(1)})
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-mono-label text-muted-foreground">
                    내일 ({getKSTDateStr(1)}) 등록
                </p>
            )}

            <div className="flex flex-col gap-1.5">
                <label className="text-mono-label text-muted-foreground">
                    YouTube URL 또는 Video ID
                </label>
                <input
                    type="text"
                    value={videoInput}
                    onChange={(e) => setVideoInput(e.target.value)}
                    placeholder="https://youtube.com/watch?v=vAKCmMNHdHw"
                    required
                    className="rounded-[4px] border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                />
                {videoInput && (
                    <p className="text-xs text-muted-foreground">
                        Video ID:{" "}
                        <code className="font-mono">
                            {parseVideoId(videoInput)}
                        </code>
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-mono-label text-muted-foreground">제목</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Why are sloths so slow?"
                    required
                    className="rounded-[4px] border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-mono-label text-muted-foreground">재생 시간</label>
                <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="5:15"
                    required
                    className="rounded-[4px] border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
                />
            </div>

            {result && (
                <div
                    className={`rounded-lg border p-3 text-sm ${result.ok ? "border-green-300 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-300" : "border-destructive/30 bg-destructive/10 text-destructive"}`}
                >
                    {result.message}
                </div>
            )}

            <div className="flex gap-2 mt-2">
                {editMode === "today" && (
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onReset}
                        disabled={submitting}
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                    >
                        초기화
                    </Button>
                )}
                <Button type="submit" disabled={submitting} className="flex-1">
                    {submitting
                        ? "생성 중... (최대 60초)"
                        : editMode
                          ? "변경하기"
                          : "등록 + 학습자료 생성"}
                </Button>
            </div>

            <label className="flex cursor-pointer items-center gap-2 px-1 mt-1 text-xs text-muted-foreground">
                <input
                    type="checkbox"
                    checked={force}
                    onChange={(e) => setForce(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-border accent-[var(--brand-orange)]"
                />
                기존 캐시 무시하고 강제 생성 (Prompt 업데이트 시 사용)
            </label>
        </form>
    );
}
