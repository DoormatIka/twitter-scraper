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
            context: await parseSocialContext(e),
            pictures: await parseTweetPhoto(e)
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
    const contexts = await tweet.$$("[data-testid=\"socialContext\"]");
    const aa = []
    for (const context of contexts) {
        aa.push(await context.evaluate(s => s.textContent));
    }
    return aa.at(0);
}
async function parseTweetPhoto(tweet: ElementHandle<Element>) {
    const contexts = await tweet.$$("[data-testid=\"tweetPhoto\"] img");
    const images = []
    for (const context of contexts) {
        images.push(await context.evaluate(s => s.src))
    }
    return images
}

// single-photo: $$ [data-testid=\"tweetPhoto\"] img
// large: https://pbs.twimg.com/media/FpYhnVHacAI1-YX?format=jpg&amp;name=large
// small: https://pbs.twimg.com/media/FpYhnVHacAI1-YX?format=jpg&amp;name=small

// multiple-photos: 
//      - class it by link (a class)
//      - a class has the link as an href with the link:
//          - "/bannedvtmemes/status/1627147714977992710/photo/x"
//          - x signifying a number - e.g: 1

//      - contents of (a class):
//          - an img html tag
//          - get the href there and add it to a collection of imgs (classed by link)

/*
    Eg:
        const bannedvtmemes_post_5435094385 = [
            "photo link", "photo link", "video link", "etc."
        ]
*/