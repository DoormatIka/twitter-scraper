import { CustomBrowser } from "./browser";
import { ProfileHandler, ProfileTweetsHandler } from "./scraper";
class TwitterUser {
    private profileHandler?: ProfileHandler
    private tweetHandler?: ProfileTweetsHandler
    constructor(
        private browser: CustomBrowser,
        private at: string,
    ) {}
    async init() {
        const page = await this.browser.newPage();
        const response = await page.goto(this.at);
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
async function main() {
    const browser = new CustomBrowser();
    await browser.init({
        headless: true, 
        execPath: "C:/Program Files/Google/Chrome/Application/chrome.exe" 
    })
    const lilyn = new TwitterUser(browser, "LilynHana");
    await lilyn.init();

    // get profile info!
    await lilyn.getProfile();

    // get tweets every n scroll down
    await lilyn.getTweetsbyPage(2);

    // https://twitter.com/LilynHana/status/1624553417120022531
    // gets every tweets until you encounter that tweet.
    await lilyn.getTweetsUntilID("1624553417120022531");

    await browser.close()
}