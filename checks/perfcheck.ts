import { CustomBrowser } from "../src/browser";
import { makeTabAndClose } from "../bin/helpers/tab";
import { round } from "../bin/helpers/misc";
import { delay } from "../src/helpers/delay";
import { createWriteStream } from "fs"
import bluebird from "bluebird"

const users = [
    "LilynHana", "haiyame_20c", "operagxofficial", "kunitoro",
    "Rannument", "voicemod", "PowerWashSim", "Ebaweba", "yaeneb",
    "Tyler_462", "mcsquiddies", "mrekkosu", "hoshinochar",
    "bannedvtmemes", "WholesomeMeme", "OSURGC", "fuckyouiquit",
    "Doomsday_fanboy", "ku_roiko", "Aireuu_", "flatpancakesss"
]
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";

async function perfCheckwithCache() {
    const stream = createWriteStream("./w-cache.txt", { flags: "a" });

    const start = performance.now();
    const browser = new CustomBrowser();
    await browser.init({ headless: true, execPath: chrome }, true)

    for (let u = 0; u < users.length; u++) {
            const filtered = users.filter((_, index) => index > u);
            console.log(`Number of users: ${filtered.length}`);

            const start = performance.now();

            const profiles = await loadProfiles(browser, { 
                at: filtered,
                timeout: 2
            });

            const end = performance.now();
            const ms = end - start
            const second = ms * 0.001;
            const minute = second * 0.01667;
            console.log(`${profiles.map(v => v?.name)}`)

            await delay(5000);

            stream.write(
                `Exec Time: ${round(ms)} ms | ${round(second)} second/s | ${round(minute)} minute/s | ` +
                `RSS: ${process.memoryUsage().rss / 1024 / 1024} MB | `+
                `External: ${process.memoryUsage().external / 1024 / 1024} MB\n`
            );
    }
    const end = performance.now();
    const ms = end - start
    const second = ms * 0.001;
    const minute = second * 0.01667;
    stream.write(`\n\nTotal Execution time: ${round(ms)} ms | ${round(second)} second/s | ${round(minute)} minute/s`);
    await browser.close();
    stream.close();
}

async function perfCheckNoCacheNoBluebird() {
    const stream = createWriteStream("./w-out-cache.txt", { flags: "a" });

    const start = performance.now();
    const browser = new CustomBrowser();
    await browser.init({ headless: true, execPath: chrome }, false)

    for (let u = 0; u < users.length; u++) {
            const filtered = users.filter((_, index) => index > u);
            console.log(`Number of users: ${filtered.length}`);

            const start = performance.now();

            const profiles = await loadProfileswithPromise(browser, { 
                at: filtered,
                timeout: 2
            });
            const data = profiles.map(c => {
                if (c.status === "fulfilled") {
                    return c.value;
                } 
            })

            const end = performance.now();
            const ms = end - start
            const second = ms * 0.001;
            const minute = second * 0.01667;            
            console.log(`${data.map(v => v?.name)}`)

            await delay(5000);

            stream.write(
                `Exec Time: ${round(ms)} ms | ${round(second)} second/s | ${round(minute)} minute/s | ` +
                `RSS: ${process.memoryUsage().rss / 1024 / 1024} MB | `+
                `External: ${process.memoryUsage().external / 1024 / 1024} MB\n`
            );
    }
    const end = performance.now();
    const ms = end - start
    const second = ms * 0.001;
    const minute = second * 0.01667;
    stream.write(`\n\nTotal Execution time: ${round(ms)} ms | ${round(second)} second/s | ${round(minute)} minute/s`);
    await browser.close()
    stream.close()
}
(async () => {
    console.log("PerfCheckWithCache and bluebird concurrency!")
    await perfCheckwithCache();
    console.log(`
    ==========================
    ==========================
    ==========================
    `)
    console.log("PerfCheckNOCache and NO bluebird concurrency!")
    await perfCheckNoCacheNoBluebird();
})()


async function loadProfiles(browser: CustomBrowser, users: { at: string[], timeout: number }) {
    return bluebird.map(users.at, async (at) => {
        return makeTabAndClose(browser, at, (tw) => tw.getProfile(), users.timeout);
    }, { concurrency: 3 });
}
async function loadProfileswithPromise(browser: CustomBrowser, users: { at: string[], timeout: number }) {
    return Promise.allSettled(users.at.map(user => makeTabAndClose(browser, user, (tw) => tw.getProfile(), users.timeout)))
}