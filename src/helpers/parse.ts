import { ElementHandle } from "puppeteer-core";

// parse the elements!
export async function parseTweets(tweets: ElementHandle<Element>[]) {
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