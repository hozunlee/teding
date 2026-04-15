import Link from "next/link";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { Badge } from "@/components/ui/badge";

export function LandingHero() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-4 py-16 text-center bg-linear-to-br from-pink-50/60 via-white to-blue-50/60 dark:from-[#010120] dark:via-[#010120] dark:to-[#0a0a2a] relative overflow-hidden">
            {/* Decorative gradient blur in background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-linear-to-r from-[#ef2cc1]/10 to-[#bdbbff]/20 dark:from-[#ef2cc1]/10 dark:to-[#bdbbff]/15 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex flex-col items-center gap-6 max-w-lg w-full relative z-10">
                <h1 className="text-display text-foreground">Teding</h1>

                <Badge variant="secondary" className="uppercase mb-2">
                    TED-Ed × AI 영어 학습
                </Badge>

                <div className="space-y-3 mb-4">
                    <h2 className="text-3xl font-medium tracking-tight text-foreground leading-tight">
                        매일 조금씩,
                        <br />
                        영어 귀가 트이는 경험
                    </h2>
                    <p className="text-base text-muted-foreground mt-2 font-medium tracking-tight">
                        TED-Ed 영상 한 편으로 읽기·듣기·쓰기를 한 번에
                    </p>
                </div>

                <div className="flex flex-col items-center gap-3 w-full">
                    <GoogleSignInButton />

                    <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
                        <span>무료</span>
                        <span>·</span>
                        <span>광고 없음</span>
                        <span>·</span>
                        <span>매일 1영상</span>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center gap-4 w-full">
                    <div className="grid grid-cols-2 gap-4 w-full text-left">
                        {[
                            {
                                step: "1",
                                label: "무자막 시청",
                                desc: "영어 듣기 감각 깨우기",
                            },
                            {
                                step: "2",
                                label: "스크립트 확인",
                                desc: "영어 원문 독해",
                            },
                            {
                                step: "3",
                                label: "학습지",
                                desc: "AI 생성 문제 풀기",
                            },
                            {
                                step: "4",
                                label: "핵심 표현",
                                desc: "일상 영어 표현 겟",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="flex flex-col gap-1.5 rounded-[8px] p-4 bg-card border border-border shadow-[0px_4px_10px_rgba(1,1,32,0.1)] transition-transform hover:-translate-y-1 duration-300"
                            >
                                <div className="text-mono-label text-muted-foreground">
                                    STEP {item.step}
                                </div>
                                <div>
                                    <div className="font-medium text-foreground tracking-tight text-base">
                                        {item.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        {item.desc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <Link
                    href="/guide"
                    className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline font-medium"
                >
                    학습 가이드 보기 →
                </Link>
            </div>
        </div>
    );
}
