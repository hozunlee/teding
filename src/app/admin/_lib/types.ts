export interface TodayData {
    video: {
        video_id: string;
        title: string;
        duration: string;
        date: string;
    } | null;
    cached: {
        transcript: boolean;
        materials: boolean;
    } | null;
}

export interface HolidayItem {
    dateKind: string;
    dateName: string;
    isHoliday: string;
    locdate: number;
    seq: number;
}
