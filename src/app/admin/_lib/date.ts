export function getKSTDateStr(offset = 0): string {
    const d = new Date();
    d.setTime(d.getTime() + (9 * 60 + offset * 24 * 60) * 60 * 1000);
    return d.toISOString().slice(0, 10);
}
