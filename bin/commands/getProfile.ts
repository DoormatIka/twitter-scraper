import { CommandModule } from "yargs";
import { Timeouts, Settings, timeouts } from "./base";
import { tabMaker, browsered, storePrint } from "../helpers"
import bluebird from "bluebird";

interface Arg extends Timeouts, Settings { }

export const getProfile: CommandModule<unknown, Arg> = {
    command: "getProfile [at]",
    describe: "Get the profile of the user/s.",
    builder: {
        ...timeouts
    },
    handler: async (args) => {
        const browser = await browsered(args.path, args.headless);

        const result = await bluebird.map(args.at, async (at, i) => {
            return tabMaker(browser, at, (tw) => tw.getProfile(), args.timeout);
        }, { concurrency: args.concurrency });
        storePrint(args.filepath, result);
        await browser.close()
    }
}