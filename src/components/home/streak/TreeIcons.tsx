export const BareTree = ({ color = "#7b4f2e" }: { color?: string }) => (
    <>
        <rect x="88" y="105" width="6" height="42" fill={color} />
        <rect x="89" y="80" width="4" height="27" fill={color} />
        <rect x="60" y="93" width="30" height="4" fill={color} />
        <rect x="60" y="72" width="4" height="23" fill={color} />
        <rect x="92" y="87" width="25" height="4" fill={color} />
        <rect x="113" y="67" width="4" height="22" fill={color} />
    </>
);

export function SpringTree({ d }: { d: number }) {
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

export function SummerTree({ d }: { d: number }) {
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
                        x="105"
                        y="56"
                        width="16"
                        height="14"
                        rx="2"
                        fill="#16a34a"
                    />
                    <rect
                        x="82"
                        y="58"
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
                        y="54"
                        width="24"
                        height="20"
                        rx="4"
                        fill="#15803d"
                    />
                    <rect
                        x="100"
                        y="50"
                        width="24"
                        height="20"
                        rx="4"
                        fill="#15803d"
                    />
                    <rect
                        x="75"
                        y="52"
                        width="24"
                        height="20"
                        rx="4"
                        fill="#15803d"
                    />
                </>
            )}
            {d >= 4 && (
                <>
                    <rect
                        x="38"
                        y="48"
                        width="36"
                        height="28"
                        rx="6"
                        fill="#16a34a"
                    />
                    <rect
                        x="94"
                        y="44"
                        width="36"
                        height="28"
                        rx="6"
                        fill="#16a34a"
                    />
                    <rect
                        x="65"
                        y="42"
                        width="36"
                        height="28"
                        rx="6"
                        fill="#15803d"
                    />
                </>
            )}
            {d >= 5 && (
                <>
                    <rect
                        x="30"
                        y="42"
                        width="48"
                        height="38"
                        rx="8"
                        fill="#15803d"
                    />
                    <rect
                        x="88"
                        y="38"
                        width="48"
                        height="38"
                        rx="8"
                        fill="#15803d"
                    />
                    <rect
                        x="55"
                        y="35"
                        width="48"
                        height="38"
                        rx="8"
                        fill="#166534"
                    />
                </>
            )}
            {d >= 6 && (
                <>
                    <rect
                        x="75"
                        y="30"
                        width="30"
                        height="20"
                        rx="5"
                        fill="#15803d"
                    />
                </>
            )}
        </>
    );
}

export function AutumnTree({ d }: { d: number }) {
    return (
        <>
            <BareTree color="#5a3010" />
            {d >= 0 && (
                <>
                    <rect x="62" y="71" width="3" height="3" fill="#f59e0b" />
                    <rect x="112" y="66" width="3" height="3" fill="#4ade80" />
                    <rect x="89" y="68" width="3" height="3" fill="#f59e0b" />
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
                        fill="#ea580c"
                    />
                    <rect
                        x="109"
                        y="62"
                        width="8"
                        height="8"
                        rx="1"
                        fill="#ea580c"
                    />
                    <rect
                        x="86"
                        y="62"
                        width="8"
                        height="8"
                        rx="1"
                        fill="#ea580c"
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
                        fill="#d97706"
                    />
                    <rect
                        x="105"
                        y="56"
                        width="16"
                        height="14"
                        rx="2"
                        fill="#d97706"
                    />
                    <rect
                        x="82"
                        y="58"
                        width="16"
                        height="14"
                        rx="2"
                        fill="#d97706"
                    />
                </>
            )}
            {d >= 3 && (
                <>
                    <rect
                        x="46"
                        y="54"
                        width="24"
                        height="20"
                        rx="4"
                        fill="#b45309"
                    />
                    <rect
                        x="100"
                        y="50"
                        width="24"
                        height="20"
                        rx="4"
                        fill="#b45309"
                    />
                    <rect
                        x="75"
                        y="52"
                        width="24"
                        height="20"
                        rx="4"
                        fill="#b45309"
                    />
                </>
            )}
            {d >= 4 && (
                <>
                    <rect
                        x="38"
                        y="48"
                        width="36"
                        height="28"
                        rx="6"
                        fill="#ea580c"
                    />
                    <rect
                        x="94"
                        y="44"
                        width="36"
                        height="28"
                        rx="6"
                        fill="#ea580c"
                    />
                    <rect
                        x="65"
                        y="42"
                        width="36"
                        height="28"
                        rx="6"
                        fill="#d97706"
                    />
                </>
            )}
            {d >= 5 && (
                <>
                    <rect
                        x="30"
                        y="42"
                        width="48"
                        height="38"
                        rx="8"
                        fill="#d97706"
                    />
                    <rect
                        x="88"
                        y="38"
                        width="48"
                        height="38"
                        rx="8"
                        fill="#d97706"
                    />
                    <rect
                        x="55"
                        y="35"
                        width="48"
                        height="38"
                        rx="8"
                        fill="#92400e"
                    />
                </>
            )}
            {d >= 6 && (
                <>
                    <rect
                        x="75"
                        y="30"
                        width="30"
                        height="20"
                        rx="5"
                        fill="#d97706"
                    />
                </>
            )}
        </>
    );
}

export function WinterTree({ d }: { d: number }) {
    const snowDepth = d <= 1 ? 4 : d <= 3 ? 8 : d <= 5 ? 12 : 16;
    return (
        <>
            <BareTree color="#334155" />
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
            {d >= 2 && (
                <>
                    <rect x="59" y="70" width="6" height="2" fill="#f0f9ff" />
                    <rect x="111" y="65" width="6" height="2" fill="#f0f9ff" />
                    <rect x="87" y="66" width="6" height="2" fill="#f0f9ff" />
                    <rect x="88" y="79" width="6" height="2" fill="#f0f9ff" />
                </>
            )}
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
            <rect x="28" y="22" width="2" height="2" fill="#cbd5e1" />
            <rect x="56" y="18" width="2" height="2" fill="#e2e8f0" />
            <rect x="98" y="28" width="2" height="2" fill="#f1f5f9" />
            <rect x="134" y="20" width="2" height="2" fill="#cbd5e1" />
        </>
    );
}
