import { CustomBrowser } from "../../src/browser";

export async function browsered(path: string) {
    const browser = new CustomBrowser();
    await browser.init({ headless: false, execPath: path });
    return browser;
}