import { CommandModule } from "yargs";
import { Timeouts, Settings, timeouts } from "./base";
import { makeTabAndClose, storePrint } from "../helpers"
import bluebird from "bluebird";
import { CustomBrowser } from "../../src/browser";

interface Arg extends Timeouts, Settings {
    id: string[]
}

export const getTweetsUntilID: CommandModule<unknown, Arg> = {
    command: "getTweetsUntilID [at] [id]",
    describe: "Scan every tweet until it encounters the id. Example: getTweetsUntilID -@ LilynHana -id 9342084 -@ Soleil -id 89734",
    builder: {
        id: {
            description: "The tweet ID from the user.",
            demandOption: true, type: "string", array: true
        },
        ...timeouts
    },
    handler: async (args) => {
        const browser = new CustomBrowser();
        await browser.init({ headless: args.headless, execPath: args.path });
    
        const result = await bluebird.map(args.at, async (at, i) => {
            return makeTabAndClose(browser, at, (tw) => tw.getTweetsUntilID(args.id[i]), args.timeout);
        }, { concurrency: args.concurrency });
        storePrint(args.filepath, result);
        await browser.close()
    }
}