import { CommandModule } from "yargs";
import { Timeouts, Settings, timeouts } from "./base";
import { makeTabAndClose, storePrint } from "../helpers"
import bluebird from "bluebird";
import { CustomBrowser } from "../../src/browser";
import { TwitterUser } from "../../src/twitter";

interface Arg extends Timeouts, Settings {
    msRefresh: number | undefined
}

export const trackUser: CommandModule<unknown, Arg> = {
    command: "trackUser [at] [msRefresh]",
    describe: "Tracks a user's profile and prints when there's a tweet posted.",
    builder: {
        msRefresh: {
            description: "An update interval noted in ms. It reloads the site every x ms.",
            demandOption: true, type: "number", default: 20 * 1000
        },
        ...timeouts
    },
    handler: async (args) => {
        const browser = new CustomBrowser();
        await browser.init({ headless: args.headless, execPath: args.path });
    
        const result = await bluebird.map(args.at, async (at, i) => {
            const tw = new TwitterUser(browser, at, args.msRefresh, 30000 * (args.timeout ?? 1));
            await tw.init();
            const emitters = await tw.getEmitter();
            emitters?.on("tweet", a => console.log(a))
        }, { concurrency: args.concurrency });
        storePrint(args.filepath, result);
        // await browser.close()
    }
}