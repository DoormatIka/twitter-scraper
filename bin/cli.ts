#!/usr/bin/env node
// npx twitter-scraper to test
// todo: detect suspended accounts
import yargs from "yargs";
import { cpuUsage } from "os-utils"
import { TwitterUser } from "../src/twitter";
import { hideBin } from "yargs/helpers";
import { CustomBrowser } from "../src/browser";
import { getProfile } from "./commands/getProfile";

async function main() {

    const start = performance.now();
    const browser = new CustomBrowser();
    await browser.init({ headless: false, execPath: "C:/Program Files/Google/Chrome/Application/chrome.exe" })
    
    // [] for options, <> for positionals
    await yargs(hideBin(process.argv))

        .command(getProfile)
        .command("getTweetsByPage <number-of-pages> [at]", "Get the tweets of a user/s by pages.", (y) => {
                return y
                    .options("at", { 
                        description: "The @ of the Twitter people you want to track.",
                        array: true, type: "string",
                        alias: "@", demandOption: true
                    })
                    .positional("pages", { 
                        alias: "n", 
                        description: "The amount of pages to scrape.",
                        type: "number",
                        demandOption: true
                    })
            }, async (args) => {
                for (const at of args.at) {
                    const tw = new TwitterUser(browser, at);
                    await tw.init();
                    console.log(await tw.getTweetsbyPage(args.pages));
                    await tw.close();
                }
            })
        .command("getTweetsUntilID [at] [id]", "Scan every tweet until it encounters the id.", (y) => {
                return y
                    .options("at", {
                        description: "The iulgriuagh nw",
                        type: "string", alias: "@", demandOption: true
                    })
                    .options("id", {
                        description: "From https://twitter.com/operagxofficial/status/1625463615603216387",
                        type: "string", demandOption: true
                    })
            }, async (args) => {
                    const tw = new TwitterUser(browser, args.at);
                    await tw.init();
                    console.log(await tw.getTweetsUntilID(args.id));
                    await tw.close();
            })
        .help()
        .demandCommand(1)
        .strict()
        .parse();
    
    await browser.close();

    const end = performance.now();
    const ms = end - start
    const second = ms * 0.001;
    const minute = second * 0.01667;
    console.log(`Execution time: ${round(ms)} ms | ${round(second)} second/s | ${round(minute)} minute/s`)
}
main();

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

async function wait(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}
async function tabMaker<T>(browser: CustomBrowser, at: string, callback: (tw: TwitterUser) => Promise<T>, timeout?: number) {
    return new Promise<T>(async (res, rej) => {
        const tw = new TwitterUser(browser, at, 30000 * (timeout ?? 1));
        await tw.init();
        const data = await callback(tw);
        await tw.close();
        res(data)
    })
}
function round(num: number) {
    return (Math.round(num * 100)) / 100;
}