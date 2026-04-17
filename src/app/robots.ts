import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://eng.hololog.dev";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin", "/auth/callback"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
