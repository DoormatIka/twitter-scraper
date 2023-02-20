import { CustomBrowser } from "../src/browser";
import { tabMaker } from "../bin/helpers/tab";
import { round, wait } from "../bin/helpers/misc";
/*
import bluebird from "bluebird"

async function perfCheck() {
    const firefox = "C:/Program Files/Mozilla Firefox/firefox.exe";
    const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";

    const start = performance.now();
    const browser = new CustomBrowser();
    await browser.init({ headless: true, execPath: chrome })
    const users = [
        "LilynHana", "haiyame_20c", "operagxofficial", "kunitoro",
        "Rannument", "voicemod", "PowerWashSim", "Ebaweba", "yaeneb",
        "Tyler_462", "mcsquiddies", "mrekkosu", "hoshinochar",
        "bannedvtmemes", "WholesomeMeme", "OSURGC", "fuckyouiquit",
        "Doomsday_fanboy", "ku_roiko", "Aireuu_", "flatpancakesss"
    ]

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
            console.log(`Execution time: ${round(ms)} ms | ${round(second)} second/s | ${round(minute)} minute/s`);
            
            console.log(`${profiles.map(v => v?.name)}`)

            await wait(5000);

            console.log(`RSS: ${process.memoryUsage().rss / 1024 / 1024} MB`);
            console.log(`External: ${process.memoryUsage().external / 1024 / 1024} MB`);
            console.log(`===========`);
    }
    const end = performance.now();
    const ms = end - start
    const second = ms * 0.001;
    const minute = second * 0.01667;
    console.log(`Total Execution time: ${round(ms)} ms | ${round(second)} second/s | ${round(minute)} minute/s`)
}
perfCheck()

async function loadProfiles(browser: CustomBrowser, users: { at: string[], timeout: number }) {
    return bluebird.map(users.at, async (at) => {
        return tabMaker(browser, at, (tw) => tw.getProfile(), users.timeout);
    }, { concurrency: 3 });
}
*/