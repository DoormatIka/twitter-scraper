#!/usr/bin/env node
// npx twitter-scraper to test
// todo: detect suspended accounts
import yargs from "yargs/yargs";
import { TwitterUser } from "../src/twitter";
import { hideBin } from "yargs/helpers";
import { CustomBrowser } from "../src/browser";

async function main() {
    const browser = new CustomBrowser();
    await browser.init({ headless: false, execPath: "C:/Program Files/Google/Chrome/Application/chrome.exe" })

    // [] for options, <> for positionals
    await yargs(hideBin(process.argv))
        .command("getProfile [at]", "Get the profile of the user/s.", (y) => {
                return y.options("at", { 
                    description: "The @ of the Twitter people you want to track.\nUsage: twitter-scraper getProfile --at LilynHana --at AA",
                    array: true, type: "string",
                    alias: "@", demandOption: true
                });
            }, async (args) => {
                const tabs = []
                for (const at of args.at) {
                    tabs.push(tabMaker(browser, at, (tw) => tw.getProfile()))
                }
                const a = await Promise.allSettled(tabs);
                console.log(a.map(c => {
                    if (c.status === "fulfilled") {
                        return c.value
                    }
                }))
            })
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
}
main();

async function tabMaker<T>(browser: CustomBrowser, at: string, callback: (tw: TwitterUser) => Promise<T>) {
    return new Promise<T>(async (res, rej) => {
        const tw = new TwitterUser(browser, at);
        await tw.init();
        const data = await callback(tw);
        await tw.close();
        res(data)
    })
}