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
            postid: parsePostID(postUrl),
            context: await parseSocialContext(e)
        });
    }
    return texts;
}
function parsePostID(url: string) {
    const id = url.match(/https:\/\/.*?\/status\/(\d+)/);
    if (id) {
        return id[1];
    }
    return "";
}
// console.log(parsePostID("https://twitter.com/zuckkk_/status/1627455375346900993"));
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