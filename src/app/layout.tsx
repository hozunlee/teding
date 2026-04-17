import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend, Lora } from "next/font/google";
import "./globals.css";
import { AuthModal } from "@/components/auth/AuthModal";
import { KakaoExternalBrowser } from "@/components/common/KakaoExternalBrowser";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const lexend = Lexend({
    variable: "--font-lexend",
    subsets: ["latin", "latin-ext"],
});

const lora = Lora({
    variable: "--font-lora",
    subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
    title: "teding — 영어 앱 결제 버튼을 누르기 직전,",
    description:
        "헐레벌떡 직접 만든 AI 영어학습 서비스. TED-Ed의 지식을 AI가 심플하게 큐레이션합니다. 매일 하나씩, 내 안의 영어가 자라나는 감각을 경험하세요.",
    icons: {
        icon: [
            { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
            { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/favicon.ico" },
        ],
        apple: "/apple-icon.png",
    },
    manifest: "/manifest.json",
    openGraph: {
        title: "teding — 영어 앱 결제 버튼을 누르기 직전,",
        description:
            "헐레벌떡 직접 만든 AI 영어학습 서비스. TED-Ed의 지식을 AI가 심플하게 큐레이션합니다. 매일 하나씩, 내 안의 영어가 자라나는 감각을 경험하세요.",
        url: process.env.NEXT_PUBLIC_APP_URL,
        siteName: "teding",
        images: [
            {
                url: "/og.png",
                width: 1200,
                height: 630,
                alt: "teding",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "teding — 영어 앱 결제 버튼을 누르기 직전,",
        description:
            "헐레벌떡 직접 만든 AI 영어학습 서비스. TED-Ed의 지식을 AI가 심플하게 큐레이션합니다. 매일 하나씩, 내 안의 영어가 자라나는 감각을 경험하세요.",
        images: ["/og.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="ko"
            className={`${geistSans.variable} ${geistMono.variable} ${lexend.variable} ${lora.variable} h-full antialiased`}
        >
            <body
                className="min-h-full flex flex-col bg-background text-foreground"
                suppressHydrationWarning
            >
                <KakaoExternalBrowser>
                    {children}
                    <AuthModal />
                </KakaoExternalBrowser>
            </body>
            {process.env.NEXT_PUBLIC_GA_ID && (
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
        </html>
    );
}
