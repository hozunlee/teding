import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TodayData } from "../_lib/types";

interface Props {
    title: string;
    dateStr: string;
    data: TodayData | null;
    onEdit: () => void;
}

export function VideoStatusCard({ title, dateStr, data, onEdit }: Props) {
    return (
        <div className="mb-3 rounded-lg border p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="text-mono-label text-muted-foreground">
                        {title} · {dateStr}
                    </p>
                    {data?.video ? (
                        <>
                            <p className="text-sm font-medium truncate">
                                {data.video.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {data.video.video_id}{data.video.duration ? ` · ${data.video.duration}` : ""}
                            </p>
                            <div className="mt-1 flex gap-2">
                                {data.cached?.transcript !== undefined && (
                                    <Badge
                                        variant={
                                            data.cached.transcript
                                                ? "default"
                                                : "outline"
                                        }
                                    >
                                        스크립트{" "}
                                        {data.cached.transcript ? "✓" : "미생성"}
                                    </Badge>
                                )}
                                <Badge
                                    variant={
                                        data.cached?.materials
                                            ? "default"
                                            : "outline"
                                    }
                                >
                                    학습자료{" "}
                                    {data.cached?.materials ? "✓" : "미생성"}
                                </Badge>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-muted-foreground">미등록</p>
                    )}
                </div>
                {data?.video && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="shrink-0 text-xs"
                        onClick={onEdit}
                    >
                        변경
                    </Button>
                )}
            </div>
        </div>
    );
}
