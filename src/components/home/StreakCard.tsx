"use client";

import { useAuthModal } from "@/lib/store/auth-modal";

interface Props {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: string | null;
    weeklyProgress?: string[];
    isLoggedIn: boolean;
}

type Season = "none" | "spring" | "summer" | "autumn" | "winter";

function getSeason(streak: number): Season {
    if (streak >= 22) return "winter";
    if (streak >= 15) return "autumn";
    if (streak >= 8) return "summer";
    if (streak >= 1) return "spring";
    return "none";
}

function getSeasonLabel(streak: number): string {
    if (streak >= 22) return "겨울";
    if (streak >= 15) return "가을";
    if (streak >= 8) return "여름";
    if (streak >= 1) return "봄";
    return "시작 전";
}

// dayInSeason: 0-based index within current season (0 = first day of season)
function getDayInSeason(streak: number): number {
    if (streak >= 22) return Math.min(streak - 22, 7);
    if (streak >= 15) return streak - 15;
    if (streak >= 8) return streak - 8;
    if (streak >= 1) return streak - 1;
    return 0;
}

// ── Tree components (rendered inside window pane, coordinate space 0 0 200 195) ──

// Shared bare trunk + branch skeleton
const BareTree = ({ color = "#7b4f2e" }: { color?: string }) => (
    <>
        <rect x="88" y="105" width="6" height="42" fill={color} />
        <rect x="89" y="80" width="4" height="27" fill={color} />
        <rect x="60" y="93" width="30" height="4" fill={color} />
        <rect x="60" y="72" width="4" height="23" fill={color} />
        <rect x="92" y="87" width="25" height="4" fill={color} />
        <rect x="113" y="67" width="4" height="22" fill={color} />
    </>
);

function SpringTree({ d }: { d: number }) {
    return (
        <>
            <BareTree />
            {d >= 1 && (
                <>
                    <rect x="58" y="69" width="4" height="4" fill="#fda4af" />
                    <rect x="111" y="64" width="4" height="4" fill="#fda4af" />
                    <rect x="87" y="66" width="4" height="4" fill="#fda4af" />
                </>
            )}
            {d >= 2 && (
                <>
                    <rect
                        x="54"
                        y="64"
                        width="10"
                        height="10"
                        rx="2"
                        fill="#f9a8d4"
                    />
                    <rect
                        x="108"
                        y="59"
                        width="10"
                        height="10"
                        rx="2"
                        fill="#f9a8d4"
                    />
                    <rect
                        x="84"
                        y="60"
                        width="10"
                        height="10"
                        rx="2"
                        fill="#f9a8d4"
                    />
                </>
            )}
            {d >= 3 && (
                <>
                    <rect
                        x="48"
                        y="57"
                        width="18"
                        height="16"
                        rx="3"
                        fill="#f472b6"
                    />
                    <rect
                        x="103"
                        y="53"
                        width="18"
                        height="16"
                        rx="3"
                        fill="#f472b6"
                    />
                    <rect
                        x="79"
                        y="52"
                        width="18"
                        height="16"
                        rx="3"
                        fill="#f472b6"
                    />
                </>
            )}
            {d >= 4 && (
                <>
                    <rect
                        x="42"
                        y="50"
                        width="28"
                        height="24"
                        rx="4"
                        fill="#f9a8d4"
                    />
                    <rect
                        x="97"
                        y="47"
                        width="28"
                        height="24"
                        rx="4"
                        fill="#f9a8d4"
                    />
                    <rect
                        x="72"
                        y="45"
                        width="28"
                        height="24"
                        rx="4"
                        fill="#f472b6"
                    />
                </>
            )}
            {d >= 5 && (
                <>
                    <rect
                        x="36"
                        y="44"
                        width="40"
                        height="34"
                        rx="6"
                        fill="#f9a8d4"
                    />
                    <rect
                        x="91"
                        y="41"
                        width="40"
                        height="34"
                        rx="6"
                        fill="#f9a8d4"
                    />
                    <rect
                        x="63"
                        y="39"
                        width="40"
                        height="34"
                        rx="6"
                        fill="#ec4899"
                    />
                    <rect x="52" y="50" width="2" height="2" fill="#fff" />
                    <rect x="78" y="44" width="2" height="2" fill="#fff" />
                    <rect x="106" y="47" width="2" height="2" fill="#fff" />
                </>
            )}
            {d >= 6 && (
                <>
                    <rect
                        x="77"
                        y="35"
                        width="30"
                        height="18"
                        rx="4"
                        fill="#fda4af"
                    />
                    {/* falling petals */}
                    <rect x="44" y="80" width="2" height="2" fill="#fda4af" />
                    <rect x="72" y="85" width="2" height="2" fill="#fda4af" />
                    <rect x="100" y="78" width="2" height="2" fill="#fda4af" />
                    <rect x="118" y="83" width="2" height="2" fill="#fda4af" />
                    <rect x="56" y="90" width="2" height="2" fill="#fda4af" />
                    <rect x="134" y="87" width="2" height="2" fill="#fda4af" />
                </>
            )}
        </>
    );
}

function SummerTree({ d }: { d: number }) {
    return (
        <>
            <BareTree color="#5a3010" />
            {d >= 0 && (
                <>
                    <rect x="62" y="71" width="3" height="3" fill="#4ade80" />
                    <rect x="112" y="66" width="3" height="3" fill="#4ade80" />
                    <rect x="89" y="68" width="3" height="3" fill="#4ade80" />
                </>
            )}
            {d >= 1 && (
                <>
                    <rect
                        x="58"
                        y="66"
                        width="8"
                        height="8"
                        rx="1"
                        fill="#22c55e"
                    />
                    <rect
                        x="109"
                        y="62"
                        width="8"
                        height="8"
                        rx="1"
                        fill="#22c55e"
                    />
                    <rect
                        x="86"
                        y="62"
                        width="8"
                        height="8"
                        rx="1"
                        fill="#22c55e"
                    />
                </>
            )}
            {d >= 2 && (
                <>
                    <rect
                        x="52"
                        y="60"
                        width="16"
                        height="14"
                        rx="2"
                        fill="#16a34a"
                    />
                    <rect
                        x="104"
                        y="56"
                        width="16"
                        height="14"
                        rx="2"
                        fill="#16a34a"
                    />
                    <rect
                        x="81"
                        y="55"
                        width="16"
                        height="14"
                        rx="2"
                        fill="#16a34a"
                    />
                </>
            )}
            {d >= 3 && (
                <>
                    <rect
                        x="46"
                        y="53"
                        width="24"
                        height="22"
                        rx="3"
                        fill="#15803d"
                    />
                    <rect
                        x="98"
                        y="50"
                        width="24"
                        height="22"
                        rx="3"
                        fill="#15803d"
                    />
                    <rect
                        x="74"
                        y="48"
                        width="24"
                        height="22"
                        rx="3"
                        fill="#16a34a"
                    />
                </>
            )}
            {d >= 4 && (
                <>
                    <rect
                        x="40"
                        y="47"
                        width="34"
                        height="30"
                        rx="4"
                        fill="#166534"
                    />
                    <rect
                        x="92"
                        y="44"
                        width="34"
                        height="30"
                        rx="4"
                        fill="#166534"
                    />
                    <rect
                        x="66"
                        y="42"
                        width="34"
                        height="30"
                        rx="4"
                        fill="#15803d"
                    />
                    <rect x="50" y="50" width="2" height="2" fill="#4ade80" />
                    <rect x="78" y="45" width="2" height="2" fill="#4ade80" />
                </>
            )}
            {d >= 5 && (
                <>
                    <rect
                        x="36"
                        y="42"
                        width="44"
                        height="38"
                        rx="6"
                        fill="#15803d"
                    />
                    <rect
                        x="88"
                        y="39"
                        width="44"
                        height="38"
                        rx="6"
                        fill="#15803d"
                    />
                    <rect
                        x="62"
                        y="37"
                        width="44"
                        height="38"
                        rx="6"
                        fill="#166534"
                    />
                </>
            )}
            {d >= 6 && (
                <>
                    <rect
                        x="76"
                        y="33"
                        width="34"
                        height="18"
                        rx="5"
                        fill="#4ade80"
                    />
                    <rect x="46" y="44" width="2" height="2" fill="#86efac" />
                    <rect x="90" y="40" width="2" height="2" fill="#86efac" />
                    <rect x="118" y="43" width="2" height="2" fill="#86efac" />
                </>
            )}
        </>
    );
}

function AutumnTree({ d }: { d: number }) {
    const fullCanopyColor =
        d <= 1
            ? "#15803d"
            : d <= 2
              ? "#eab308"
              : d <= 3
                ? "#d97706"
                : "#b45309";
    const innerCanopyColor =
        d <= 1
            ? "#16a34a"
            : d <= 2
              ? "#ca8a04"
              : d <= 3
                ? "#b45309"
                : "#92400e";

    return (
        <>
            <BareTree color="#78350f" />
            {/* Ground leaves accumulate as season progresses */}
            {d >= 4 && (
                <rect x="19" y="144" width="147" height="4" fill="#ca8a04" />
            )}
            {d >= 5 && (
                <>
                    <rect
                        x="19"
                        y="142"
                        width="147"
                        height="6"
                        fill="#d97706"
                    />
                    <rect
                        x="30"
                        y="140"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#eab308"
                    />
                    <rect
                        x="55"
                        y="141"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#f59e0b"
                    />
                    <rect
                        x="110"
                        y="140"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#eab308"
                    />
                    <rect
                        x="140"
                        y="141"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#d97706"
                    />
                </>
            )}
            {d >= 6 && (
                <>
                    <rect
                        x="19"
                        y="140"
                        width="147"
                        height="8"
                        fill="#b45309"
                    />
                    <rect
                        x="25"
                        y="138"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#fbbf24"
                    />
                    <rect
                        x="70"
                        y="139"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#fbbf24"
                    />
                    <rect
                        x="120"
                        y="138"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#f59e0b"
                    />
                    <rect
                        x="155"
                        y="139"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#fbbf24"
                    />
                </>
            )}
            {/* Canopy - shrinks as d increases */}
            {d <= 3 && (
                <>
                    <rect
                        x="36"
                        y="42"
                        width="44"
                        height="38"
                        rx="6"
                        fill={fullCanopyColor}
                    />
                    <rect
                        x="88"
                        y="39"
                        width="44"
                        height="38"
                        rx="6"
                        fill={fullCanopyColor}
                    />
                    <rect
                        x="62"
                        y="37"
                        width="44"
                        height="38"
                        rx="6"
                        fill={innerCanopyColor}
                    />
                    <rect
                        x="76"
                        y="33"
                        width="34"
                        height="18"
                        rx="5"
                        fill={fullCanopyColor}
                    />
                </>
            )}
            {d === 4 && (
                <>
                    <rect
                        x="40"
                        y="45"
                        width="30"
                        height="28"
                        rx="4"
                        fill="#b45309"
                    />
                    <rect
                        x="94"
                        y="43"
                        width="28"
                        height="26"
                        rx="4"
                        fill="#92400e"
                    />
                    {/* falling leaves */}
                    <rect
                        x="52"
                        y="78"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#fbbf24"
                    />
                    <rect
                        x="68"
                        y="82"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#f59e0b"
                    />
                    <rect
                        x="100"
                        y="76"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#fbbf24"
                    />
                    <rect
                        x="124"
                        y="80"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#d97706"
                    />
                </>
            )}
            {d === 5 && (
                <>
                    <rect
                        x="44"
                        y="50"
                        width="18"
                        height="18"
                        rx="3"
                        fill="#92400e"
                    />
                    <rect
                        x="100"
                        y="48"
                        width="18"
                        height="18"
                        rx="3"
                        fill="#92400e"
                    />
                    {/* falling leaves */}
                    <rect
                        x="44"
                        y="74"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#fbbf24"
                    />
                    <rect
                        x="62"
                        y="80"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#f59e0b"
                    />
                    <rect
                        x="80"
                        y="72"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#fbbf24"
                    />
                    <rect
                        x="104"
                        y="78"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#d97706"
                    />
                    <rect
                        x="128"
                        y="75"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#eab308"
                    />
                </>
            )}
            {d >= 6 && (
                <>
                    {/* nearly bare - just a few lingering leaves */}
                    <rect
                        x="56"
                        y="64"
                        width="8"
                        height="8"
                        rx="2"
                        fill="#92400e"
                    />
                    <rect
                        x="106"
                        y="61"
                        width="8"
                        height="8"
                        rx="2"
                        fill="#78350f"
                    />
                    {/* many falling leaves */}
                    <rect
                        x="36"
                        y="72"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#fbbf24"
                    />
                    <rect
                        x="52"
                        y="77"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#f59e0b"
                    />
                    <rect
                        x="68"
                        y="68"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#fbbf24"
                    />
                    <rect
                        x="84"
                        y="75"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#d97706"
                    />
                    <rect
                        x="104"
                        y="70"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#eab308"
                    />
                    <rect
                        x="120"
                        y="74"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#fbbf24"
                    />
                    <rect
                        x="136"
                        y="69"
                        width="4"
                        height="4"
                        rx="1"
                        fill="#f59e0b"
                    />
                </>
            )}
        </>
    );
}

function WinterTree({ d }: { d: number }) {
    const snowDepth = d <= 1 ? 4 : d <= 3 ? 8 : d <= 5 ? 12 : 16;
    return (
        <>
            <BareTree color="#334155" />
            {/* snow on ground - grows thicker */}
            <rect
                x="16"
                y={148 - snowDepth}
                width="150"
                height={snowDepth}
                fill="#e2e8f0"
            />
            <rect
                x="16"
                y={148 - snowDepth}
                width="150"
                height="2"
                fill="#f8fafc"
            />
            {/* snow on branches (from d >= 2) */}
            {d >= 2 && (
                <>
                    <rect x="59" y="70" width="6" height="2" fill="#f0f9ff" />
                    <rect x="111" y="65" width="6" height="2" fill="#f0f9ff" />
                    <rect x="87" y="66" width="6" height="2" fill="#f0f9ff" />
                    <rect x="88" y="79" width="6" height="2" fill="#f0f9ff" />
                </>
            )}
            {/* more snow on branches (d >= 4) */}
            {d >= 4 && (
                <>
                    <rect
                        x="57"
                        y="69"
                        width="10"
                        height="4"
                        rx="1"
                        fill="#e0f2fe"
                    />
                    <rect
                        x="109"
                        y="64"
                        width="10"
                        height="4"
                        rx="1"
                        fill="#e0f2fe"
                    />
                    <rect
                        x="86"
                        y="65"
                        width="10"
                        height="4"
                        rx="1"
                        fill="#e0f2fe"
                    />
                    <rect
                        x="61"
                        y="91"
                        width="20"
                        height="3"
                        rx="1"
                        fill="#e0f2fe"
                    />
                    <rect
                        x="93"
                        y="86"
                        width="18"
                        height="3"
                        rx="1"
                        fill="#e0f2fe"
                    />
                </>
            )}
            {/* stars - more visible each stage */}
            <rect x="28" y="22" width="2" height="2" fill="#cbd5e1" />
            <rect x="56" y="18" width="2" height="2" fill="#e2e8f0" />
            <rect x="98" y="28" width="2" height="2" fill="#f1f5f9" />
            <rect x="134" y="20" width="2" height="2" fill="#cbd5e1" />
            {d >= 2 && (
                <>
                    <rect x="42" y="32" width="2" height="2" fill="#e2e8f0" />
                    <rect x="78" y="24" width="2" height="2" fill="#f8fafc" />
                    <rect x="118" y="34" width="2" height="2" fill="#e2e8f0" />
                    <rect x="150" y="26" width="2" height="2" fill="#cbd5e1" />
                </>
            )}
            {d >= 4 && (
                <>
                    <rect x="22" y="42" width="2" height="2" fill="#f1f5f9" />
                    <rect x="65" y="36" width="2" height="2" fill="#f8fafc" />
                    <rect x="106" y="44" width="2" height="2" fill="#e2e8f0" />
                    <rect x="144" y="38" width="2" height="2" fill="#f1f5f9" />
                </>
            )}
        </>
    );
}

function WindowTree({ streak }: { streak: number }) {
    const season = getSeason(streak);
    const d = getDayInSeason(streak);
    if (season === "spring") return <SpringTree d={d} />;
    if (season === "summer") return <SummerTree d={d} />;
    if (season === "autumn") return <AutumnTree d={d} />;
    if (season === "winter") return <WinterTree d={d} />;
    return null;
}

// ── Sky backgrounds ──

function SkyFill({ season, streak }: { season: Season; streak: number }) {
    const d = getDayInSeason(streak);
    if (season === "spring")
        return (
            <>
                <rect x="16" y="12" width="150" height="24" fill="#4a3b70" />
                <rect x="16" y="36" width="150" height="24" fill="#7a6ba0" />
                <rect x="16" y="60" width="150" height="24" fill="#a080b0" />
                <rect x="16" y="84" width="150" height="16" fill="#c0a0c0" />
                <rect
                    x="30"
                    y="30"
                    width="40"
                    height="8"
                    fill="#c0a0c0"
                    opacity="0.6"
                />
                <rect
                    x="34"
                    y="26"
                    width="32"
                    height="4"
                    fill="#c0a0c0"
                    opacity="0.6"
                />
                <rect
                    x="110"
                    y="50"
                    width="30"
                    height="6"
                    fill="#a080b0"
                    opacity="0.5"
                />
            </>
        );
    if (season === "summer")
        return (
            <>
                <rect x="16" y="12" width="150" height="24" fill="#005f73" />
                <rect x="16" y="36" width="150" height="24" fill="#0a9396" />
                <rect x="16" y="60" width="150" height="24" fill="#94d2bd" />
                <rect x="16" y="84" width="150" height="16" fill="#e9d8a6" />
                {d >= 3 && (
                    <rect
                        x="130"
                        y="20"
                        width="12"
                        height="12"
                        fill="#fff"
                        opacity="0.8"
                    />
                )}
            </>
        );
    if (season === "autumn")
        return (
            <>
                <rect x="16" y="12" width="150" height="24" fill="#660708" />
                <rect x="16" y="36" width="150" height="24" fill="#a4161a" />
                <rect x="16" y="60" width="150" height="24" fill="#ba181b" />
                <rect x="16" y="84" width="150" height="16" fill="#e5383b" />
                <rect
                    x="40"
                    y="40"
                    width="50"
                    height="8"
                    fill="#660708"
                    opacity="0.3"
                />
            </>
        );
    // winter or none
    return (
        <>
            <rect x="16" y="12" width="150" height="88" fill="#0b132b" />
            {/* moon grows brighter */}
            {season === "winter" && (
                <>
                    <rect
                        x="130"
                        y="20"
                        width={10 + d}
                        height={10 + d}
                        rx="2"
                        fill="#fef9c3"
                        style={{ opacity: 0.6 + d * 0.05 }}
                    />
                </>
            )}
            {season === "none" && (
                <>
                    <rect x="40" y="25" width="2" height="2" fill="#fff" />
                    <rect x="90" y="40" width="2" height="2" fill="#fff" />
                </>
            )}
        </>
    );
}

function Buildings({ season, streak }: { season: Season; streak: number }) {
    const d = getDayInSeason(streak);
    const isNight = season === "winter" || season === "none";
    const fill = isNight ? "#02040a" : "#1c2541";
    const winColor = "#ff9f1c";

    const winterWindows = [
        { x: 38, y: 90 },
        { x: 44, y: 90 },
        { x: 44, y: 97 },
        { x: 98, y: 80 },
        { x: 105, y: 80 },
        { x: 98, y: 87 },
        { x: 140, y: 95 },
        { x: 140, y: 102 },
        { x: 36, y: 83 },
        { x: 115, y: 88 },
        { x: 152, y: 85 },
    ];

    const litCount = isNight ? Math.min(5 + d * 2, winterWindows.length) : 0;

    return (
        <>
            <rect x="16" y="100" width="20" height="45" fill={fill} />
            <rect x="36" y="80" width="15" height="65" fill={fill} />
            <rect x="51" y="110" width="25" height="35" fill={fill} />
            <rect x="76" y="90" width="20" height="55" fill={fill} />
            <rect x="96" y="70" width="18" height="75" fill={fill} />
            <rect x="114" y="100" width="20" height="45" fill={fill} />
            <rect x="134" y="85" width="15" height="60" fill={fill} />
            <rect x="149" y="105" width="17" height="40" fill={fill} />
            {litCount > 0 && (
                <g opacity="0.85">
                    {winterWindows.slice(0, litCount).map((w, i) => (
                        <rect
                            key={i}
                            x={w.x}
                            y={w.y}
                            width="3"
                            height="3"
                            fill={winColor}
                        />
                    ))}
                </g>
            )}
        </>
    );
}

const PixelDeskScene = ({ streak }: { streak: number }) => {
    const season = getSeason(streak);
    return (
        <div className="mt-4 rounded-md overflow-hidden border-2 border-black/80">
            <svg
                viewBox="0 0 200 195"
                className="w-full bg-[#2b3a4a]"
                shapeRendering="crispEdges"
                style={{ display: "block" }}
            >
                {/* Left bulletin board */}
                <rect x="0" y="30" width="12" height="85" fill="#111" />
                <rect x="2" y="36" width="8" height="12" fill="#eee" />
                <rect x="4" y="55" width="6" height="8" fill="#ccc" />
                <rect x="2" y="78" width="8" height="20" fill="#ddd" />

                {/* Window frame */}
                <rect x="14" y="10" width="154" height="139" fill="#000" />
                <rect x="16" y="12" width="150" height="135" fill="#121212" />

                {/* Sky */}
                <SkyFill season={season} streak={streak} />
                {/* Buildings */}
                <Buildings season={season} streak={streak} />
                {/* Growing tree */}
                <WindowTree streak={streak} />

                {/* Window blinds (top strip) */}
                <rect x="16" y="12" width="150" height="25" fill="#555" />
                <rect x="16" y="37" width="150" height="4" fill="#444" />
                <rect x="16" y="12" width="150" height="4" fill="#333" />

                {/* Window grid */}
                <rect x="65" y="12" width="4" height="135" fill="#000" />
                <rect x="115" y="12" width="4" height="135" fill="#000" />
                <rect x="16" y="75" width="150" height="4" fill="#000" />

                {/* Hanging plants */}
                <g transform="translate(178, 20)">
                    <rect x="4" y="0" width="2" height="100" fill="#000" />
                    <rect x="0" y="15" width="10" height="6" fill="#111" />
                    <rect x="2" y="10" width="6" height="6" fill="#2d6a4f" />
                    <rect x="4" y="8" width="2" height="4" fill="#40916c" />
                    <rect x="0" y="45" width="10" height="6" fill="#111" />
                    <rect x="1" y="40" width="8" height="6" fill="#40916c" />
                    <rect x="0" y="75" width="10" height="6" fill="#111" />
                    <rect x="-2" y="70" width="14" height="6" fill="#1b4332" />
                </g>

                {/* Chair back */}
                <rect x="145" y="145" width="35" height="50" fill="#000" />
                <rect x="148" y="145" width="29" height="5" fill="#1a1a1a" />

                {/* Desk surface */}
                <rect x="0" y="160" width="200" height="35" fill="#4a5a6a" />
                <rect x="0" y="160" width="200" height="4" fill="#000" />
                <rect x="0" y="164" width="200" height="2" fill="#3a4a5a" />

                {/* Desk items */}
                <rect x="25" y="150" width="25" height="18" fill="#000" />
                <rect x="27" y="152" width="21" height="14" fill="#fff" />
                <rect x="60" y="145" width="4" height="20" fill="#000" />
                <rect x="61" y="146" width="2" height="18" fill="#ef4444" />
                <rect x="85" y="148" width="16" height="18" fill="#000" />
                <rect x="87" y="150" width="12" height="14" fill="#3b82f6" />
                <rect x="101" y="153" width="4" height="8" fill="#000" />
            </svg>
        </div>
    );
};

// ── Ring gauge ──

const SeasonIcon = ({ season }: { season: Season }) => {
    if (season === "spring")
        return (
            <svg
                viewBox="0 0 40 40"
                className="w-full h-full"
                shapeRendering="crispEdges"
            >
                <rect x="18" y="24" width="4" height="12" fill="#7b4f2e" />
                <rect
                    x="8"
                    y="8"
                    width="24"
                    height="18"
                    rx="4"
                    fill="#f9a8d4"
                />
                <rect
                    x="12"
                    y="10"
                    width="16"
                    height="14"
                    rx="3"
                    fill="#f472b6"
                />
                <rect x="14" y="14" width="2" height="2" fill="#fff" />
                <rect x="22" y="10" width="2" height="2" fill="#fff" />
            </svg>
        );
    if (season === "summer")
        return (
            <svg
                viewBox="0 0 40 40"
                className="w-full h-full"
                shapeRendering="crispEdges"
            >
                <rect x="18" y="26" width="4" height="12" fill="#713f12" />
                <rect
                    x="6"
                    y="20"
                    width="28"
                    height="10"
                    rx="2"
                    fill="#15803d"
                />
                <rect
                    x="10"
                    y="12"
                    width="20"
                    height="12"
                    rx="2"
                    fill="#16a34a"
                />
                <rect
                    x="14"
                    y="6"
                    width="12"
                    height="10"
                    rx="2"
                    fill="#22c55e"
                />
            </svg>
        );
    if (season === "autumn")
        return (
            <svg
                viewBox="0 0 40 40"
                className="w-full h-full"
                shapeRendering="crispEdges"
            >
                <rect x="18" y="26" width="4" height="14" fill="#78350f" />
                <polygon points="20,4 4,28 36,28" fill="#eab308" />
                <polygon points="20,8 8,26 32,26" fill="#fbbf24" />
            </svg>
        );
    if (season === "winter")
        return (
            <svg
                viewBox="0 0 40 40"
                className="w-full h-full"
                shapeRendering="crispEdges"
            >
                <rect x="18" y="22" width="4" height="16" fill="#334155" />
                <rect x="8" y="16" width="12" height="3" fill="#334155" />
                <rect x="20" y="18" width="10" height="3" fill="#334155" />
                <rect x="9" y="10" width="4" height="4" rx="1" fill="#e11d48" />
                <rect
                    x="12"
                    y="12"
                    width="3"
                    height="3"
                    rx="1"
                    fill="#fbbf24"
                />
                <rect x="6" y="6" width="2" height="2" fill="#e2e8f0" />
                <rect x="26" y="8" width="2" height="2" fill="#e2e8f0" />
            </svg>
        );
    return (
        <svg
            viewBox="0 0 40 40"
            className="w-full h-full"
            shapeRendering="crispEdges"
        >
            <rect x="18" y="20" width="4" height="16" fill="#bdbbff" />
            <rect x="14" y="34" width="12" height="3" rx="1" fill="#bdbbff" />
            <polygon points="20,6 8,22 32,22" fill="#bdbbff" />
        </svg>
    );
};

function RingGauge({ streak }: { streak: number }) {
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
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
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

// ── Main export ──

export function StreakCard({
    currentStreak,
    longestStreak,
    weeklyProgress = [],
    isLoggedIn,
}: Props) {
    const openModal = useAuthModal((s) => s.open);
    const season = getSeason(currentStreak);
    const seasonLabel = getSeasonLabel(currentStreak);

    const DAY_LABELS = ["월", "화", "수", "목", "금", "토", "일"];
    const now = new Date();
    const kstNow = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Seoul" }),
    );
    const offsetKst = new Date(kstNow.getTime() - 3 * 60 * 60 * 1000);
    const dayOfWeek = (offsetKst.getDay() + 6) % 7;
    const monday = new Date(offsetKst);
    monday.setDate(offsetKst.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const stamps = Array.from({ length: 7 }, (_, i) => {
        if (!isLoggedIn) return false;
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, "0");
        const date = String(d.getDate()).padStart(2, "0");
        return weeklyProgress.includes(`${y}-${m}-${date}`);
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-[var(--shadow-elegant)]">
                <div className="flex gap-6">
                    <div className="flex items-center justify-center shrink-0">
                        <RingGauge streak={currentStreak} />
                    </div>
                    <div className="flex flex-col justify-center gap-1 flex-1 min-w-0">
                        <p className="text-mono-label text-muted-foreground">
                            내 스트릭
                        </p>
                        {isLoggedIn ? (
                            <>
                                <div className="flex items-baseline gap-1">
                                    <span
                                        className="text-[3.2rem] font-medium leading-none tracking-[-0.04em]"
                                        style={{ color: "var(--dark-blue)" }}
                                    >
                                        {currentStreak}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        일
                                    </span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: "var(--brand-orange)" }}
                                    >
                                        {seasonLabel} 시즌
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        최고 기록 {longestStreak}일
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[3rem] font-medium leading-none tracking-[-0.04em] text-muted-foreground">
                                        0
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground">
                                        일
                                    </span>
                                </div>
                                <button
                                    onClick={() =>
                                        openModal(
                                            "로그인하면 공부 기록이 쌓일수록 창밖의 계절이 변합니다.",
                                        )
                                    }
                                    className="text-xs text-left underline underline-offset-2 transition-colors"
                                    style={{ color: "var(--brand-orange)" }}
                                >
                                    로그인하고 공부 시작하기 →
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* <div className="mt-6 border-t border-border/50 pt-4">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            🌸 7일차 <span className="font-semibold text-foreground">봄</span>,{' '}
            ☀️ 14일차 <span className="font-semibold text-foreground">여름</span>,{' '}
            🍂 21일차 <span className="font-semibold text-foreground">가을</span>,{' '}
            ❄️ 30일차 <span className="font-semibold text-foreground">겨울</span>로 변화합니다.
          </p>
        </div> */}

                {/* <PixelDeskScene streak={currentStreak} /> */}
            </div>

            <div className="rounded-lg border border-border bg-card px-6 py-4 shadow-[var(--shadow-elegant)]">
                <p className="text-mono-label text-muted-foreground mb-3">
                    이번 주 학습 현황
                </p>
                <div className="flex gap-2">
                    {DAY_LABELS.map((label, i) => (
                        <div
                            key={label}
                            className="flex flex-1 flex-col items-center gap-2"
                        >
                            <div
                                className="relative h-10 w-full rounded-md transition-all duration-500 flex items-center justify-center overflow-hidden"
                                style={
                                    stamps[i]
                                        ? {
                                              background:
                                                  "linear-gradient(135deg, #fef3c7, #fde68a)",
                                              border: "1px solid #fbbf24",
                                              boxShadow:
                                                  "0 2px 4px rgba(251,191,36,0.2)",
                                          }
                                        : {
                                              backgroundColor:
                                                  "rgba(0,0,0,0.03)",
                                              border: "1px dashed rgba(0,0,0,0.1)",
                                          }
                                }
                            >
                                {stamps[i] && (
                                    <div className="w-7 h-7 animate-in fade-in zoom-in duration-700">
                                        <SeasonIcon season={season} />
                                    </div>
                                )}
                            </div>
                            <span className="text-[11px] font-medium text-muted-foreground">
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
