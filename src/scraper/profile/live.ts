import { Page, ElementHandle } from "puppeteer-core";
import { parseTweets } from "../../helpers/parse";
import EventEmitter from "events";
import TypedEmitter from "typed-emitter";
import { delay } from "bluebird";

type ProfileEvents = {
    tweet: (a: {
        text: string | null | undefined;
        authorUrl: string;
        posturl: string;
        context: (string | null)[];
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
    async trackTweets() {
        setInterval(async () => {
            this.page.reload()

            const tw = await this.page.$$("[data-testid=\"tweet\"]",);
            const text = await parseTweets(tw);
            const currentTweet = text.at(0);
            if (!currentTweet) return;

            if (this.tweetId !== currentTweet.postid) {
                this.emitter.emit("tweet", currentTweet);
                this.tweetId = currentTweet.postid;
            }
        }, this.msRefresh);
    }
}