import { CommandBuilder, Arguments } from "yargs";

export interface Timeouts extends Arguments {
    at: string[], timeout: number | undefined,
}
export interface Settings extends Arguments {
    path: string, filepath: string | undefined, headless: boolean,
}

export const timeouts: CommandBuilder<unknown, Timeouts> = {
    at: {
        description: "The Twitter @ of the User.",
        alias: "@", array: true, demandOption: true,
        type: "string"
    },
    timeout: {
        description: "How much time (30000ms multiplied by x) puppeteer will wait for the site to load.",
        type: "number", alias: "t"
    },
}
export const settings: CommandBuilder<unknown, Settings> = {
    path: {
        description: "The file path of your chrome browser!",
        default: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        type: "string"
    },
    filepath: {
        description: "The file path to write the results on! Note: Needs full file path!",
        type: "string"
    },
    headless: {
        description: "If puppeteer would show the window it's working on.",
        default: true,
        type: "boolean"
    }
}