import { CommandModule } from "yargs";
import { Timeouts, Settings, timeouts } from "./base";
import { makeTabAndClose, storePrint } from "../helpers";
import bluebird from "bluebird";
import { CustomBrowser } from "../../src/browser";

interface Arg extends Timeouts, Settings {
    pages: number
}

export const getTweetsByPage: CommandModule<unknown, Arg> = {
    command: "getTweetsByPage [number-of-pages] [at]",
    describe: "Get the tweets of a user/s by pages.",
    builder: {
        pages: {
            alias: "n", description: "The amount of pages to scrape.",
            type: "number", demandOption: true
        },
        ...timeouts
    },
    
    handler: async (args) => {
        const browser = new CustomBrowser();
        await browser.init({ headless: args.headless, execPath: args.path });

        const result = await bluebird.map(args.at, async (at, i) => {
            return makeTabAndClose(browser, at, (tw) => tw.getTweetsbyPage(args.pages), args.timeout);
        }, { concurrency: args.concurrency });
        storePrint(args.filepath, result);
        await browser.close();
    }
}