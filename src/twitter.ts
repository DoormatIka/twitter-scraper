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
    constructor(
        private browser: CustomBrowser,
        private at: string,
    ) {}
    async init() {
        const page = await this.browser.newPage();
        const response = await page.goto(`https://twitter.com/${this.at}`);
        this.profileHandler = new ProfileHandler(page);
        this.tweetHandler = new ProfileTweetsHandler(page);

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
    toString() {
        return `TwitterUser ${this.at}`
    }
}