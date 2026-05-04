export interface YTPlayerEvent {
    target: { getDuration: () => number; destroy: () => void };
}
export interface YTPlayer {
    destroy: () => void;
}
export interface YTStatic {
    Player: new (
        el: string,
        opts: {
            videoId: string;
            events: { onReady: (e: YTPlayerEvent) => void };
        },
    ) => YTPlayer;
}
declare global {
    interface Window {
        YT: YTStatic;
        onYouTubeIframeAPIReady: () => void;
    }
}

export function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
}

export function parseVideoId(input: string): string {
    const trimmed = input.trim();
    const patterns = [
        /[?&]v=([a-zA-Z0-9_-]{11})/,
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /embed\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
        const match = trimmed.match(pattern);
        if (match) return match[1];
    }
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    return trimmed;
}
