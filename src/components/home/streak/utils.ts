export type Season = "none" | "spring" | "summer" | "autumn" | "winter";

export function getSeason(streak: number): Season {
    if (streak >= 22) return "winter";
    if (streak >= 15) return "autumn";
    if (streak >= 8) return "summer";
    if (streak >= 1) return "spring";
    return "none";
}

export function getSeasonLabel(streak: number): string {
    if (streak >= 22) return "겨울";
    if (streak >= 15) return "가을";
    if (streak >= 8) return "여름";
    if (streak >= 1) return "봄";
    return "시작 전";
}

export function getDayInSeason(streak: number): number {
    if (streak >= 22) return Math.min(streak - 22, 7);
    if (streak >= 15) return streak - 15;
    if (streak >= 8) return streak - 8;
    if (streak >= 1) return streak - 1;
    return 0;
}
