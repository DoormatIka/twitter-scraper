import { CommandModule } from "yargs";
import { Timeouts, Settings, timeouts } from "./base";
import { tabMaker } from "../helpers/tab";
import { browsered } from "../helpers/browser";
import { writeFileSync } from "fs"

interface Arg extends Timeouts, Settings {}

export const getProfile: CommandModule<unknown, Arg> = {
    command: "getProfile [at]",
    describe: "Get the profile of the user/s.",
    builder: {
        ...timeouts
    },
    handler: async (args) => {
        const browser = await browsered(args.path)
    
        const tabs = []
        for (const at of args.at) {
            console.log(`@${at}: Loading.`)
            tabs.push(tabMaker(browser, at, (tw) => tw.getProfile(), args.timeout));
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