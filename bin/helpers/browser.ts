import { CustomBrowser } from "../../src/browser";

export async function browsered(path: string, headless: boolean) {
    const browser = new CustomBrowser();
    await browser.init({ headless: headless, execPath: path });
    return browser;
}