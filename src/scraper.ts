import { Page, ElementHandle } from "puppeteer-core";
// twitter loading (1 page) takes 13.9% of CPU (2GHz) and 120MB of RAM (headful)
// twitter loading (3 pages) takes 20-30% of CPU (2GHz) and 300MB of RAM (headful)
// (new Browser()).init(false, "C:/Program Files/Google/Chrome/Application/chrome.exe")

export class ProfileHandler {
    constructor(private page: Page) {}
    async getProfileInfo() {
        await Promise.allSettled([
            this.page.waitForSelector("[data-testid=\"UserName\"] div span"),
            this.page.waitForSelector("[data-testid=\"UserName\"] div:nth-of-type(2) span"),
            this.page.waitForSelector("[data-testid=\"UserDescription\"]"),
            this.page.waitForSelector("[href$=\"/photo\"] img"),
            this.page.waitForSelector("[href$=\"/header_photo\"] img"),
        ])
        return {
            name: await this.getName(),
            at: await this.getAt(),
            description: await this.getDescription(),
            profile_picture: await this.getProfilePicture(),
            banner: await this.getBanner()
        }
    }
    async getName() {
        const name = await this.page.$("[data-testid=\"UserName\"] div span");
        return await name?.evaluate(c => c.textContent);
    }
    async getAt() {
        const at = await this.page.$("[data-testid=\"UserName\"] div:nth-of-type(2) span");
        return await at?.evaluate(c => c.textContent);
    }
    async getDescription() {
        const description = await this.page.$("[data-testid=\"UserDescription\"]");
        return await description?.evaluate(c => c.textContent);
    }
    async getProfilePicture() {
        const picture = await this.page.$("[href$=\"/photo\"] img");
        return await picture?.evaluate(c => c.src)
    }
    async getBanner() {
        const banner = await this.page.$("[href$=\"/header_photo\"] img");
        return await banner?.evaluate(c => c.src)
    }
}

// TODO: UNDER THIS CLASS, GET THE FUNCTIONS!
export class ProfileTweetsHandler {
    constructor(private page: Page) {}
    async getTweetsUntilID(id: string) {
        await this.page.evaluate('window.scrollTo(0, 30)'); // resets twitter scroll
        const { posts, twtID } = await this.getScrollingTweets(id);
        return { posts: this.removeDuplicates(posts), indexOfPost: twtID }
    }
    async getTweetsbyPage(n: number) {
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
        const text = await parse(tw);
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


// parse the elements!
async function parse(tweets: ElementHandle<Element>[]) {
    const texts = []
    for (const e of tweets) {
        const { authorUrl, postUrl } = await parseAuthorandURL(e)
        texts.push({
            text: await parseText(e),
            authorUrl: authorUrl,
            posturl: postUrl,
            context: await parseSocialContext(e)
        });
    }
    return texts;
}
async function parseText(tweet: ElementHandle<Element>) {
    await tweet.waitForSelector("span");
    const e = await tweet.$("div[data-testid=\"tweetText\"] span");
    return await e?.evaluate(r => r.textContent);
}
async function parseAuthorandURL(tweet: ElementHandle<Element>) {
    const a = await tweet.$$("div[data-testid=\"User-Names\"] a");
    return {
        authorUrl: await a[1].evaluate(c => c.href),
        postUrl: await a[2].evaluate(c => c.href)
    }
}
async function parseSocialContext(tweet: ElementHandle<Element>) {
    const contexts = await tweet.$$("span[data-testid=\"socialContext\"]");
    const aa = []
    for (const context of contexts) {
        aa.push(await context.evaluate(s => s.textContent));
    }
    return aa;
}

function delay(time: number) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}