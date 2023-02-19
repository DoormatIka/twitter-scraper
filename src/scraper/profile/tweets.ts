import { Page } from "puppeteer-core";
import { parseTweets } from "../../helpers/parse";
import { delay } from "../../helpers/delay";

export class ProfileTweetsHandler {
    constructor(private page: Page) {}
    async getTweetsUntilID(id: string) {
        await this.page.evaluate('window.scrollTo(0, 30)'); // resets twitter scroll
        const { posts, twtID } = await this.getScrollingTweets(id);
        return { posts: this.removeDuplicates(posts), indexOfPost: twtID }
    }
    async getTweetsbyPage(n: number) {
        // hack to make scroll load
        await this.page.evaluate('window.scrollTo(0, 30)');
        const posts = []
        for (let i = 0; i < n; i++) {
            await this.scroll();
            const tweets = await this.getVisibleTweets();
            posts.push(...tweets);
            await delay(2000);
        }
        return this.removeDuplicates(posts);
    }

    private async getVisibleTweets() {
        const tw = await this.page.$$("[data-testid=\"tweet\"]",);
        const text = await parseTweets(tw);
        return text;
    }
    private async scroll() {
        await this.page.evaluate('window.scrollBy(0, 2000)'); // 2000 is better.
    }
    private async getScrollingTweets(id: string) {
        const posts = [];
        let twtID: number;
        while (true) {
            await this.scroll();
            const tweets = await this.getVisibleTweets();
            twtID = tweets.findIndex(v => v.posturl.match(id));
            posts.push(...tweets);
            if (twtID !== -1) {
                break;
            }
            await delay(2000); // hard delay to avoid being ratelimited
        }
        return { posts, twtID };
    }
    private removeDuplicates(posts: {
        text: string | null | undefined;
        authorUrl: string;
        posturl: string;
        context: (string | null)[];
    }[]) {
        const ids = posts.map(v => v.posturl);
        return posts.filter((v, i) => !ids.includes(v.posturl, i + 1));
    }
}