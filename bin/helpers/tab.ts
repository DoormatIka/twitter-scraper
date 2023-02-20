import { CustomBrowser } from "../../src/browser";
import { TwitterUser } from "../../src/twitter";

export async function makeTabAndClose<T>(
    browser: CustomBrowser, 
    at: string,
    callback: (tw: TwitterUser) => Promise<T>, 
    timeout?: number,
    msRefresh?: number,
) {
    return new Promise<T>(async (res, rej) => {
        const tw = new TwitterUser(browser, at, msRefresh, 30000 * (timeout ?? 1));
        await tw.init();
        const data = await callback(tw);
        await tw.close();
        res(data)
    })
}