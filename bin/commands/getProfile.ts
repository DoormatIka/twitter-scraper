import { ArgumentsCamelCase, CommandModule } from "yargs";
import { CustomBrowser } from "../../src/browser";
import { baseBuilder, Base } from "./base";
import { tabMaker } from "../helpers/tab";

interface Arg extends Base {
    pat: string
}

export const getProfile: CommandModule<unknown, Arg> = {
    command: "getProfile [timeout] [at]",
    describe: "Get the profile of the user/s.",
    builder: {
        ...baseBuilder
    },
    handler: async (args) => {
        const browser = new CustomBrowser();
        await browser.init({ headless: false, execPath: args.at })
    
        const tabs = []
        for (const at of args.at) {
            console.log(`@${at}: Loading.`)
            tabs.push(tabMaker(browser, at, (tw) => tw.getProfile(), args.timeout));
        }

        const a = await Promise.allSettled(tabs);
        console.log(a.map(c => {
            if (c.status === "fulfilled") {
                return c.value
            }
        }))
    }
}
/*
yargs(hideBin(process.argv))
    .command(approve)
    .demandCommand()
    .help()
    .strict()
    .parse()
*/