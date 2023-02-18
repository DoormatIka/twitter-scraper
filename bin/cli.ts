#!/usr/bin/env node
// npx twitter-scraper to test
// todo: detect suspended accounts
import yargs, { Options } from "yargs";
import { hideBin } from "yargs/helpers";
import { getProfile } from "./commands/getProfile";
import { getTweetsByPage } from "./commands/getTweetsByPage";
import { getTweetsUntilID } from "./commands/getTweetsUntilID";
import { round } from "./helpers/misc";
import { settings } from "./commands/base";

async function main() {
    const start = performance.now();

    await yargs(hideBin(process.argv))
        .options(settings as {[key: string]: Options})
        .command(getProfile)
        .command(getTweetsByPage)
        .command(getTweetsUntilID)
        .help()
        .demandCommand(1)
        .strict()
        .parse();
    const end = performance.now();
    const ms = end - start
    const second = ms * 0.001;
    const minute = second * 0.01667;
    console.log(`Execution time: ${round(ms)} ms | ${round(second)} second/s | ${round(minute)} minute/s`)
}
main();