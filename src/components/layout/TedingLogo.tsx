export function TedingLogo({ className }: { className?: string }) {
    return (
        <span
            className={className}
            style={{
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--dark-blue)",
            }}
        >
            ted<span className="logo-colon">:</span>ing
        </span>
    );
}
