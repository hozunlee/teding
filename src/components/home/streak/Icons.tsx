import type { Season } from "./utils";

export function SeasonIcon({ season }: { season: Season }) {
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
                {/* 짙은 네이비-그레이 나뭇가지 몸통 */}
                <rect x="18" y="24" width="4" height="12" fill="#475569" />
                
                {/* 겹겹이 소복하게 쌓인 겨울 설목(눈뭉치) 표현 */}
                <rect x="6" y="18" width="28" height="10" rx="3" fill="#cbd5e1" />
                <rect x="10" y="11" width="20" height="12" rx="3" fill="#e2e8f0" />
                <rect x="14" y="5" width="12" height="10" rx="2" fill="#ffffff" />
                
                {/* 반짝이는 눈꽃/빛 반사 디테일 픽셀 */}
                <rect x="8" y="14" width="2" height="2" fill="#ffffff" />
                <rect x="28" y="10" width="2" height="2" fill="#ffffff" />
                <rect x="22" y="7" width="2" height="2" fill="#ffffff" />
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
}

export const CoinIcon = () => (
    // <svg
    //     viewBox="0 0 40 40"
    //     className="w-full h-full"
    //     shapeRendering="crispEdges"
    // >
    //     <rect x="14" y="6" width="12" height="2" fill="#000" />
    //     <rect x="14" y="32" width="12" height="2" fill="#000" />
    //     <rect x="12" y="8" width="2" height="24" fill="#000" />
    //     <rect x="26" y="8" width="2" height="24" fill="#000" />
    //     <rect x="14" y="8" width="12" height="24" fill="#fbbf24" />
    //     <rect x="14" y="8" width="2" height="24" fill="#fef3c7" />
    //     <rect x="18" y="12" width="4" height="16" fill="#000" />
    //     <rect x="18" y="12" width="2" height="16" fill="#d97706" />
    // </svg>

    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 300"
        width="100%"
        height="100%"
    >
        <defs>
            <g id="q-mark-path">
                <path d="M 30 35 C 30 15, 70 15, 70 35 C 70 45, 55 50, 55 65 L 45 65 C 45 55, 60 52, 60 35 C 60 25, 40 25, 40 35 Z" />
                <rect x="45" y="73" width="10" height="10" rx="2" />
            </g>
            <g id="rivets">
                <circle cx="12" cy="12" r="3.5" fill="#000000" opacity="0.25" />
                <circle cx="88" cy="12" r="3.5" fill="#000000" opacity="0.25" />
                <circle cx="12" cy="88" r="3.5" fill="#000000" opacity="0.25" />
                <circle cx="88" cy="88" r="3.5" fill="#000000" opacity="0.25" />

                <circle
                    cx="11.5"
                    cy="11.5"
                    r="1.5"
                    fill="#FFFFFF"
                    opacity="0.5"
                />
                <circle
                    cx="87.5"
                    cy="11.5"
                    r="1.5"
                    fill="#FFFFFF"
                    opacity="0.5"
                />
                <circle
                    cx="11.5"
                    cy="87.5"
                    r="1.5"
                    fill="#FFFFFF"
                    opacity="0.5"
                />
                <circle
                    cx="87.5"
                    cy="87.5"
                    r="1.5"
                    fill="#FFFFFF"
                    opacity="0.5"
                />
            </g>
        </defs>

        <g transform="translate(150, 140) scale(1.15)">
            <g transform="matrix(0.866, 0.5, -0.866, 0.5, 0, -100)">
                <rect x="0" y="0" width="100" height="100" fill="#FFD600" />
                <rect
                    x="3"
                    y="3"
                    width="94"
                    height="94"
                    fill="none"
                    stroke="#FFE866"
                    stroke-width="1.5"
                />
                <use href="#rivets" />
            </g>

            <g transform="matrix(0.866, 0.5, 0, 1, -86.6, -50)">
                <rect x="0" y="0" width="100" height="100" fill="#F2B700" />

                <use href="#q-mark-path" x="-3" y="4" fill="#B3B3B3" />
                <use href="#q-mark-path" x="-1.5" y="2" fill="#E6E6E6" />
                <use href="#q-mark-path" x="0" y="0" fill="#FFFFFF" />
                <use href="#rivets" />
            </g>

            <g transform="matrix(0.866, -0.5, 0, 1, 0, 0)">
                <rect x="0" y="0" width="100" height="100" fill="#D99400" />

                <use href="#q-mark-path" x="-3" y="4" fill="#999999" />
                <use href="#q-mark-path" x="-1.5" y="2" fill="#CCCCCC" />
                <use href="#q-mark-path" x="0" y="0" fill="#F2F2F2" />
                <use href="#rivets" />
            </g>

            <g stroke-linecap="round" stroke-linejoin="round">
                <line
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="100"
                    stroke="#FFE34D"
                    stroke-width="3"
                />

                <line
                    x1="0"
                    y1="0"
                    x2="-86.6"
                    y2="-50"
                    stroke="#FFE34D"
                    stroke-width="3"
                />

                <line
                    x1="0"
                    y1="0"
                    x2="86.6"
                    y2="-50"
                    stroke="#FFE34D"
                    stroke-width="3"
                />

                <line
                    x1="-86.6"
                    y1="-50"
                    x2="0"
                    y2="-100"
                    stroke="#FFEA80"
                    stroke-width="2"
                />
                <line
                    x1="86.6"
                    y1="-50"
                    x2="0"
                    y2="-100"
                    stroke="#FFEA80"
                    stroke-width="2"
                />

                <line
                    x1="-86.6"
                    y1="50"
                    x2="0"
                    y2="100"
                    stroke="#B37A00"
                    stroke-width="2"
                />
                <line
                    x1="86.6"
                    y1="50"
                    x2="0"
                    y2="100"
                    stroke="#996800"
                    stroke-width="2"
                />

                <line
                    x1="-86.6"
                    y1="-50"
                    x2="-86.6"
                    y2="50"
                    stroke="#E6AD00"
                    stroke-width="2"
                />
                <line
                    x1="86.6"
                    y1="-50"
                    x2="86.6"
                    y2="50"
                    stroke="#BF8200"
                    stroke-width="2"
                />
            </g>
        </g>
    </svg>
);
