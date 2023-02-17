import { Page } from "puppeteer-core";
import { CustomBrowser } from "./browser";
import { ProfileHandler, ProfileTweetsHandler } from "./scraper";

/**
 * An object to interact with the Twitter scraper.
 * 
 * @param {CustomBrowser} browser - Custom Browser
 * @param {at} at - The @ of the user you want to track.
 */
export class TwitterUser { // wrapper object
    private profileHandler?: ProfileHandler
    private tweetHandler?: ProfileTweetsHandler
    private page?: Page
    constructor(
        private browser: CustomBrowser,
        private at: string,
    ) {}
    async init() {
        this.page = await this.browser.newPage();
        const response = await this.page.goto(`https://twitter.com/${this.at}`);
        this.profileHandler = new ProfileHandler(this.page);
        this.tweetHandler = new ProfileTweetsHandler(this.page);

        if (response?.status() != 200) { // i don't know the behavior of page.goto() so im a bit skeptical.
            throw Error(`Can't connect to https://twitter.com/${this.at}! ${response?.statusText}`)
        }
    }
    async getTweetsUntilID(id: string) {
        if (!this.tweetHandler) throw Error(`Run \`init()\` on TwitterUser \"${this.at}\".`)
        return await this.tweetHandler.getTweetsUntilID(id);
    }
    async getTweetsbyPage(n: number) {
        if (!this.tweetHandler) throw Error(`Run \`init()\` on TwitterUser \"${this.at}\".`)
        return await this.tweetHandler.getTweetsbyPage(n);
    }
    async getProfile() {
        if (!this.profileHandler) throw Error(`Run \`init()\` on TwitterUser \"${this.at}\".`)
        return await this.profileHandler.getProfileInfo()
    }
    async close() {
        if (!this.page) throw Error(`Run \`init()\` on TwitterUser \"${this.at}\".`)
        await this.page.close();
    }
    toString() {
        return `TwitterUser ${this.at}`
    }
}