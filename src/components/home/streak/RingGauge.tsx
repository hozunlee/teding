import { SeasonIcon } from "./Icons";
import { getSeason } from "./utils";

export function RingGauge({ streak }: { streak: number }) {
    const RADIUS = 54;
    const STROKE = 7;
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
    const SIZE = (RADIUS + STROKE) * 2 + 4;

    let nextMilestone = 7;
    let prevMilestone = 0;
    if (streak >= 30) {
        nextMilestone = 100;
        prevMilestone = 30;
    } else if (streak >= 22) {
        nextMilestone = 30;
        prevMilestone = 22;
    } else if (streak >= 15) {
        nextMilestone = 21;
        prevMilestone = 15;
    } else if (streak >= 8) {
        nextMilestone = 14;
        prevMilestone = 8;
    } else if (streak >= 1) {
        nextMilestone = 7;
        prevMilestone = 1;
    }

    const cycleProgress = Math.min(
        1,
        (streak - prevMilestone) / (nextMilestone - prevMilestone || 1),
    );
    const isComplete = streak >= 1;
    const season = getSeason(streak);
    const fillColor =
        season === "winter"
            ? "#bdbbff"
            : season === "autumn"
              ? "#f59e0b"
              : season === "summer"
                ? "#16a34a"
                : season === "spring"
                  ? "#f472b6"
                  : "#fc4c02";
    const offset = CIRCUMFERENCE * (1 - cycleProgress);

    return (
        <div className="relative flex items-center justify-center">
            <svg
                width={SIZE}
                height={SIZE}
                viewBox={`0 0 ${SIZE} ${SIZE}`}
                className="overflow-visible"
            >
                {isComplete && (
                    <defs>
                        <filter id="ring-glow">
                            <feGaussianBlur
                                stdDeviation="2.5"
                                result="blur"
                            />
                            <feComposite
                                in="SourceGraphic"
                                in2="blur"
                                operator="over"
                            />
                        </filter>
                    </defs>
                )}
                <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    stroke="rgba(0,0,0,0.07)"
                    strokeWidth={STROKE}
                />
                <circle
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    stroke={fillColor}
                    strokeWidth={STROKE}
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                    filter={isComplete ? "url(#ring-glow)" : undefined}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center p-8">
                <SeasonIcon season={season} />
            </div>
        </div>
    );
}
