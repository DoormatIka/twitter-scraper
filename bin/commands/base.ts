import { CommandBuilder, Arguments } from "yargs";

export interface Base extends Arguments {
    at: string[], timeout: number | undefined, path: string, filepath: string | undefined
}
export const baseBuilder: CommandBuilder<unknown, Base> = {
    at: {
        description: "The Twitter @ of the User.",
        alias: "@", array: true, demandOption: true,
        type: "string"
    },
    timeout: {
        description: "How much time (30000ms multiplied by x) puppeteer will wait for the site to load.",
        type: "number", alias: "t"
    },
    path: {
        description: "The file path of your chrome browser!",
        default: "C:/Program Files/Google/Chrome/Application/chrome.exe",
        type: "string"
    },
    filepath: {
        description: "The file path to write the results on! Note: Needs full file path!",
        type: "string"
    }
}