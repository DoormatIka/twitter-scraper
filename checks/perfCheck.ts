import { cpuUsage } from "os-utils";
import { CustomBrowser } from "../src/browser";
import { tabMaker } from "../bin/helpers/tab";
import { round, wait } from "../bin/helpers/misc";

async function perfCheck() {
    const firefox = "C:/Program Files/Mozilla Firefox/firefox.exe";
    const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";

    const start = performance.now();
    const browser = new CustomBrowser();
    await browser.init({ headless: false, execPath: chrome })
    const users = [
        "LilynHana", "haiyame_20c", "operagxofficial", "kunitoro",
        "Rannument", "voicemod", "PowerWashSim", "Ebaweba"
    ]

    for (let u = 0; u < users.length; u++) {
        for (let i = 0; i < 3; i++) {
            const filtered = users.filter((_, index) => index > u);
            console.log(`Number of users: ${filtered.length}`)
            await loadProfiles(browser, { 
                at: filtered,
                timeout: 2
            });
            await wait(5000);

            cpuUsage((percentage) => console.log(`CPU Usage: ${percentage}%`));
            console.log(`RSS: ${process.memoryUsage().rss / 1024 / 1024} MB`);
            console.log(`External: ${process.memoryUsage().external / 1024 / 1024} MB`);
            console.log(`===========`);
        }
    }
    const end = performance.now();
    const ms = end - start
    const second = ms * 0.001;
    const minute = second * 0.01667;
    console.log(`Total Execution time: ${round(ms)} ms | ${round(second)} second/s | ${round(minute)} minute/s`)
}
perfCheck()



async function loadProfiles(browser: CustomBrowser, args: { at: string[], timeout: number }) {
    const start = performance.now();
    
    const tabs = []
    for (const at of args.at) {
        // console.log(`@${at}: Loading.`)
        tabs.push(tabMaker(browser, at, (tw) => tw.getProfile(), args.timeout));
    }
    const a = await Promise.allSettled(tabs);
    a.map(c => {
        if (c.status === "fulfilled") {
            return c.value
        }}
    )

    const end = performance.now();
    const ms = end - start
    const second = ms * 0.001;
    const minute = second * 0.01667;
    console.log(`Execution time: ${round(ms)} ms | ${round(second)} second/s | ${round(minute)} minute/s`)
}