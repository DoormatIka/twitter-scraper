import { writeFileSync } from "fs"

export async function wait(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

export function round(num: number) {
    return (Math.round(num * 100)) / 100;
}

export function storePrint(filepath: string | undefined, result: any) {
    if (filepath) {
        writeFileSync(filepath, JSON.stringify(result, null, 2))
    }

    console.dir(result, { depth: null })
}