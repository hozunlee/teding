import Link from "next/link";
import { TedingLogo } from "@/components/layout/TedingLogo";

export default function StudyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Minimal Header for Focus Mode */}
            <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur print:hidden">
                <div className="container mx-auto flex h-14 items-center justify-between px-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M19 12H5" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <span className="text-sm font-medium">
                            {/* 학습 일지 나가기 */}
                        </span>
                    </Link>
                    <div className="absolute left-1/2 -translate-x-1/2">
                        <TedingLogo className="text-base" />
                    </div>
                </div>
            </header>
            <div className="flex-1 flex flex-col w-full">{children}</div>
        </div>
    );
}
