import { CommandModule } from "yargs";
import { Timeouts, Settings, timeouts } from "./base";
import { tabMaker } from "../helpers/tab";
import { browsered } from "../helpers/browser";
import { writeFileSync } from "fs"

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
        const browser = await browsered(args.path)
    
        const tabs = []
        for (let i = 0; i < args.at.length; ++i) {
            console.log(`@${args.at[i]}: Loading.`);
            tabs.push(tabMaker(browser, args.at[i], (tw) => tw.getTweetsUntilID(args.id[i]), args.timeout));
        }

        const data = (await Promise.allSettled(tabs)).map(c => {
            if (c.status === "fulfilled") {
                return c.value
            }
        })
        if (args.filepath) {
            writeFileSync(args.filepath, JSON.stringify(data, null, 2))
        }

        console.dir(data, { depth: null })
        await browser.close()
    }
}