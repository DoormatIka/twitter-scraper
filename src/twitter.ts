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
    private error?: string
    constructor(
        private browser: CustomBrowser,
        private at: string,
        private timeout?: number
    ) {}
    async init() {
        this.page = await this.browser.newPage();
        try {
            await this.page.goto(`https://twitter.com/${this.at}`, { waitUntil: "networkidle2", timeout: this.timeout });
        } catch (err) {
            if (typeof err === "string") {
                console.error(err);
            } else if (err instanceof Error) {
                this.error = err.name;
                console.error("@%s: Can't connect to https://twitter.com/%s due to a %s. \n     Trace: %s", this.at, this.at, err.name, err.message);
            }
        }
        this.profileHandler = new ProfileHandler(this.page);
        this.tweetHandler = new ProfileTweetsHandler(this.page);
    }
    async getTweetsUntilID(id: string) {
        if (!this.tweetHandler) throw Error(`Run \`init()\` on TwitterUser \"${this.at}\".`)
        if (this.error) return;
        return await this.tweetHandler.getTweetsUntilID(id);
    }
    async getTweetsbyPage(n: number) {
        if (!this.tweetHandler) throw Error(`Run \`init()\` on TwitterUser \"${this.at}\".`)
        if (this.error) return;
        return await this.tweetHandler.getTweetsbyPage(n);
    }
    async getProfile() {
        if (!this.profileHandler) throw Error(`Run \`init()\` on TwitterUser \"${this.at}\".`)
        if (this.error) return;
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