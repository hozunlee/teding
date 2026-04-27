import type { Metadata } from "next";
import { Geist, Geist_Mono, Lexend, Lora } from "next/font/google";
import "./globals.css";
import { AuthModal } from "@/components/auth/AuthModal";
import { KakaoExternalBrowser } from "@/components/common/KakaoExternalBrowser";
import { NotificationOnboarding } from "@/components/NotificationOnboarding";
import { NetworkSync } from "@/components/NetworkSync";
import { DeepLinkHandler } from "@/components/DeepLinkHandler";
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
    title: "테딩 teding — AI 영어 학습지 X ted-ed",
    description:
        "TED-Ed의 지식을 AI가 쉽게 큐레이션하여 학습지를 제공합니다. 매일 하나씩, 내 안의 영어가 자라나는 감각을 경험하세요.",
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
        title: "테딩 teding — AI 영어 학습지 X ted-ed",
        description:
            "TED-Ed의 지식을 AI가 쉽게 큐레이션하여 학습지를 제공합니다. 매일 하나씩, 내 안의 영어가 자라나는 감각을 경험하세요.",
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
        title: "테딩 teding — AI 영어 학습지 X ted-ed",
        description:
            "TED-Ed의 지식을 AI가 쉽게 큐레이션하여 학습지를 제공합니다. 매일 하나씩, 내 안의 영어가 자라나는 감각을 경험하세요.",
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
                    <NotificationOnboarding />
                    <NetworkSync />
                    <DeepLinkHandler />
                </KakaoExternalBrowser>
            </body>
            {process.env.NEXT_PUBLIC_GA_ID && (
                <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
            )}
        </html>
    );
}
