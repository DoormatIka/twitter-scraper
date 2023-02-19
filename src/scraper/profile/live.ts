import { Page, ElementHandle } from "puppeteer-core";
import { parseTweets } from "../../helpers/parse";

export class ProfileLiveTracking {
    constructor(private page: Page) {}
    // use RXJS
    private async getTweets() {
        const tw = await this.page.$$("[data-testid=\"tweet\"]",);
        const text = await parseTweets(tw);
        return text;
    }
}