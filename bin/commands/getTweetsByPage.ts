import { CommandModule } from "yargs";
import { CustomBrowser } from "../../src/browser";
import { baseBuilder, Base } from "./base";
import { tabMaker } from "../helpers/tab";
import { browsered } from "../helpers/browser";
import { writeFileSync } from "fs"

interface Arg extends Base {
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
        ...baseBuilder
    },
    
    handler: async (args) => {
        const browser = await browsered(args.path)
        const tabs = [];
        for (const at of args.at) {
            console.log(`@${at}: Loading.`)
            tabs.push(tabMaker(browser, at, (tw) => tw.getTweetsbyPage(args.pages), args.timeout));
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