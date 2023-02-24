import { Page } from "puppeteer-core";
import { parseTweets } from "../../helpers/parse";
import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type ProfileEvents = {
    tweet: (info: {
        text: string | null | undefined;
        authorUrl: string;
        posturl: string;
        context: string | null | undefined;
        postid: string;
        pictures: string[];
    }) => void
}

export class ProfileLiveTracking {
    // Spawn a new browser for this!
    private emitter = new EventEmitter() as TypedEmitter<ProfileEvents>;
    private tweetId = "";
    constructor(private page: Page, private msRefresh: number) {}

    getEmitter() {
        return this.emitter;
    }
    getTweetID() {
        return this.tweetId;
    }
    async trackTweets() {
        setInterval(async () => {
            await new Promise(async res => {
                await this.page.reload({ waitUntil: "networkidle2" })

                await this.page.waitForSelector("[data-testid=\"tweet\"]");
                await this.page.evaluate('window.scrollBy(0, 1500)');
                const tw = await this.page.$$("[data-testid=\"tweet\"]",);
                const text = await parseTweets(tw); // performance issue?
                const currentTweet = text
                    .filter(v => v.context !== "Pinned Tweet")
                    .at(0);
                if (!currentTweet) return;
                if (this.tweetId !== currentTweet.postid) {
                    this.emitter.emit("tweet", currentTweet);
                    this.tweetId = currentTweet.postid;
                }
            })
        }, this.msRefresh);
    }
}