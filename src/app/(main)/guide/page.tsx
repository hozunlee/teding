import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
    title: "학습 가이드 — Teding",
    description: "TED-Ed 영상으로 영어를 배우는 4단계 학습법",
};

const STEPS = [
    {
        n: 1,
        emoji: "🎬",
        label: "무자막 시청",
        time: "5분",
        color: "#fc4c02",
        bg: "#fff4f0",
        description:
            '자막 없이 영상을 처음부터 끝까지 본다. 모르는 단어가 나와도 멈추지 말고 맥락으로 의미를 추측한다. 이 단계의 목표는 "완벽한 이해"가 아니라 "듣기 근육 훈련"이다.',
        tip: "전부 못 알아들어도 괜찮다. 첫 시청에서 30–50%를 이해하면 이미 훌륭한 출발점이다.",
    },
    {
        n: 2,
        emoji: "📄",
        label: "스크립트 확인",
        time: "10분",
        color: "#ef2cc1",
        bg: "#fdf0fb",
        description:
            "AI가 추출한 스크립트 전문을 읽는다. 1단계에서 놓쳤던 부분을 확인하고, 소리와 문자를 연결한다. 단어 하나하나를 사전에서 찾기보다 문장 전체의 흐름을 먼저 파악한다.",
        tip: '읽으면서 "아, 그 소리가 이 단어였구나!" 하는 순간이 핵심이다. 이 연결이 실력을 끌어올린다.',
    },
    {
        n: 3,
        emoji: "✏️",
        label: "학습지",
        time: "15–20분",
        color: "#7c3aed",
        bg: "#f5f3ff",
        description:
            "AI가 생성한 기초 영어수준의 학습지, 빈칸 채우기·객관식·주관식 문제를 푼다. PDF로 다운로드해 손으로 적어도 좋고, 화면에서 바로 풀어도 된다. 완료 후 필기 파일을 업로드하면 기록으로 남는다.",
        tip: "손으로 직접 쓰는 것이 기억 정착에 더 효과적이다. 가능하면 프린트해서 풀어보자.",
    },
    {
        n: 4,
        emoji: "💡",
        label: "핵심표현",
        time: "15분",
        color: "#010120",
        bg: "#f0f0f8",
        description:
            '영상에서 자주 쓰이는 핵심 표현 패턴과 구문 분석을 학습한다. 각 문장의 역할(주어·동사·목적어)을 색깔로 구분해서 보여준다. "알았어요" 버튼으로 확실히 익힌 문장을 체크한다.',
        tip: '패턴을 외우는 것보다 "왜 이 구조인지"를 이해하는 것이 중요하다. 구문 분석 팁 박스를 꼼꼼히 읽자.',
    },
];

const FAQS = [
    {
        q: "매일 꼭 해야 하나요?",
        a: "꾸준함이 핵심이지만, 완벽주의는 금물이다. 바쁜 날엔 Step 1 시청만 해도 충분하다. 스트릭이 끊겨도 괜찮다. 다시 시작하면 된다.",
    },
    {
        q: "영어를 잘 못 해도 괜찮나요?",
        a: "오히려 초급자에게 더 잘 맞는 방법이다. TED-Ed 영상은 복잡한 주제를 쉬운 언어로 설명한다. Step 2 스크립트가 있으니 이해 못 한 부분은 텍스트로 확인할 수 있다.",
    },
    {
        q: "Step 1에서 하나도 못 알아들으면요?",
        a: '정상이다. "듣기는 실력이 아니라 노출량"이다. 처음엔 30% 이해해도 한 달 뒤에는 70%가 된다. 포기하지 말고 Step 2로 넘어가자.',
    },
    {
        q: "학습지를 꼭 출력해야 하나요?",
        a: "아니다. 화면에서 바로 풀어도 되고, PDF로 저장해 디지털로 필기해도 된다. 다만 손 필기가 기억 효율이 더 높다는 연구 결과가 많다.",
    },
    {
        q: "이미 완료한 날의 영상을 다시 볼 수 있나요?",
        a: '사이드바의 "보고또보고" 메뉴에서 날짜별 학습 목록을 확인하고 다시 학습할 수 있다.',
    },
];

export default function GuidePage() {
    return (
        <div className="container mx-auto max-w-2xl px-4 py-8">
            {/* Hero */}
            <div className="mb-10">
                <p className="text-mono-label text-muted-foreground mb-2">
                    LEARNING METHOD
                </p>
                <h1 className="text-[2rem] font-semibold leading-tight tracking-tight mb-3">
                    Teding 4단계 학습법
                </h1>
                <p className="text-muted-foreground text-sm leading-relaxed">
                    매일 TED-Ed 영상 한 편을 4단계로 깊이 학습한다. 단순 반복이
                    아닌{" "}
                    <strong className="text-foreground">능동적 처리</strong>를
                    통해 표현이 자연스럽게 내재화된다.
                </p>
                <a
                    href="https://www.youtube.com/watch?v=Z6NXm05VC14"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    학습 방법론 참고 영상
                </a>
            </div>

            {/* Steps */}
            <div className="relative mb-12">
                {/* Timeline line */}
                <div className="absolute left-[19px] top-10 bottom-10 w-px bg-border hidden sm:block" />

                <div className="flex flex-col gap-6">
                    {STEPS.map((step) => (
                        <div key={step.n} className="flex gap-4">
                            {/* Step number circle */}
                            <div className="shrink-0 relative z-10">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-sm"
                                    style={{
                                        backgroundColor: step.color,
                                        color: "#fff",
                                    }}
                                >
                                    {step.n}
                                </div>
                            </div>

                            {/* Card */}
                            <div
                                className="flex-1 rounded-xl border border-border p-4 pb-5"
                                style={{ backgroundColor: step.bg }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">
                                        {step.emoji}
                                    </span>
                                    <span className="font-semibold text-sm">
                                        {step.label}
                                    </span>
                                    <span
                                        className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                                        style={{
                                            backgroundColor: step.color + "20",
                                            color: step.color,
                                        }}
                                    >
                                        {step.time}
                                    </span>
                                </div>

                                <p className="text-sm text-foreground leading-relaxed mb-3">
                                    {step.description}
                                </p>

                                {/* Tip box */}
                                <div
                                    className="rounded-lg px-3 py-2 text-xs leading-relaxed"
                                    style={{
                                        backgroundColor: step.color + "18",
                                        color:
                                            step.color === "#010120"
                                                ? "#3d3d6e"
                                                : step.color,
                                    }}
                                >
                                    <span className="font-semibold">
                                        💬 팁{" "}
                                    </span>
                                    {step.tip}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border mb-10" />

            {/* Flow summary */}
            <div className="mb-10">
                <h2 className="text-base font-semibold mb-4">
                    한눈에 보는 학습 흐름
                </h2>
                <div className="grid grid-cols-4 gap-2">
                    {STEPS.map((step, i) => (
                        <div
                            key={step.n}
                            className="flex flex-col items-center gap-1.5 relative"
                        >
                            <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{
                                    backgroundColor: step.color,
                                    color: "#fff",
                                }}
                            >
                                {step.n}
                            </div>
                            <span className="text-xs text-center font-medium leading-tight">
                                {step.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                                {step.time}
                            </span>
                            {i < STEPS.length - 1 && (
                                <div className="absolute top-4 left-[calc(50%+18px)] right-0 h-px bg-border" />
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                    총 소요시간: 약 50–60분 / 일
                </p>
            </div>

            {/* Divider */}
            <div className="border-t border-border mb-10" />

            {/* FAQ */}
            <div className="mb-10">
                <h2 className="text-base font-semibold mb-4">자주 묻는 질문</h2>
                <Accordion>
                    {FAQS.map((faq, i) => (
                        <AccordionItem key={i} value={String(i)}>
                            <AccordionTrigger className="text-sm py-3">
                                {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground">
                                {faq.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Reference */}
            <div className="rounded-xl border border-border p-4 bg-muted/40">
                <p className="text-xs text-muted-foreground leading-relaxed">
                    이 학습법은{" "}
                    <a
                        href="https://www.youtube.com/watch?v=Z6NXm05VC14"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2 hover:text-foreground transition-colors"
                    >
                        영어 공부법 참고 영상
                    </a>
                    의 방법론을 바탕으로 설계되었으며, AI 생성 학습자료와 결합해
                    Teding에 맞게 재구성한 것이다.
                </p>
            </div>
        </div>
    );
}
