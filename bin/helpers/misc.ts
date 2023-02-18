export async function wait(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

export function round(num: number) {
    return (Math.round(num * 100)) / 100;
}