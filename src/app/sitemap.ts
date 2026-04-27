import { MetadataRoute } from "next";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = 'force-static'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://eng.hololog.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let videos: { date: string }[] = []
    try {
        const supabase = createServiceClient();
        const { data } = await supabase
            .from("daily_videos")
            .select("date")
            .order("date", { ascending: false })
            .limit(30);
        videos = data ?? []
    } catch {
        // 앱 빌드 환경 등 DB 접근 불가 시 정적 페이지만 반환
    }

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}/`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/guide`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/archive`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
    ];

    const videoPages: MetadataRoute.Sitemap = (videos ?? []).map((v) => ({
        url: `${BASE_URL}/study?date=${v.date}`,
        lastModified: new Date(v.date),
        changeFrequency: "never",
        priority: 0.6,
    }));

    return [...staticPages, ...videoPages];
}
