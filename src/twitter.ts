import { Page } from "puppeteer-core";
import { CustomBrowser } from "./browser";
import { ProfileHeaderHandler, ProfileLiveTracking, ProfileTweetsHandler } from "./scraper";

/**
 * An object to interact with the Twitter scraper.
 * 
 * @param {CustomBrowser} browser - Custom Browser
 * @param {at} at - The @ of the user you want to track.
 */
export class TwitterUser { // wrapper object
    private profileHandler?: ProfileHeaderHandler
    private tweetHandler?: ProfileTweetsHandler
    private liveTracking?: ProfileLiveTracking
    private page?: Page
    private error?: string
    constructor(
        private browser: CustomBrowser,
        private at: string,
        private msRefresh?: number,
        private timeout?: number
    ) {}
    async init() {
        this.page = await this.browser.newPage();
        try {
            await this.page.goto(`https://twitter.com/${this.at}`, { waitUntil: "networkidle2", timeout: this.timeout });
        } catch (err) {
            if (!(err instanceof Error)) return console.error(err);

            this.error = err.name; // disables the class without crashing it
            // is this even a good idea.
            console.error(
                "@%s: Can't connect to https://twitter.com/%s due to a %s." + 
                "\n     " + 
                "Trace: %s", 
                this.at, this.at, err.name, err.message
            );
        }
        this.profileHandler = new ProfileHeaderHandler(this.page);
        this.tweetHandler = new ProfileTweetsHandler(this.page);

        if (this.msRefresh)
            this.liveTracking = new ProfileLiveTracking(this.page, this.msRefresh);
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
    async getEmitter() {
        if (!this.liveTracking) return;
        if (this.error) return;

        await this.liveTracking.trackTweets();
        return this.liveTracking.getEmitter();
    }
    async close() {
        if (!this.page) throw Error(`Run \`init()\` on TwitterUser \"${this.at}\".`)
        await this.page.close();
    }
    toString() {
        return `TwitterUser ${this.at}`
    }
}