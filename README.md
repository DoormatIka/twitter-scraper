# twitter-scraper
A puppeteer-core powered scraper for Twitter.

![](https://img.shields.io/npm/l/@lilyn/twitter-scraper?style=flat-square) ![](https://img.shields.io/npm/v/@lilyn/twitter-scraper?style=flat-square)


It's still in a minimal state, will add new features to it soon.
```ts
async function main() {
    const browser = new CustomBrowser();
    await browser.init({
        headless: true,
        execPath: "C:/Program Files/Google/Chrome/Application/chrome.exe" 
    });
    const lilyn = new TwitterUser(browser, "LilynHana");
    await lilyn.init();

    // get profile info!
    await lilyn.getProfile();

    // get tweets every n scroll down
    await lilyn.getTweetsbyPage(2);

    // https://twitter.com/LilynHana/status/1624553417120022531
    // gets every tweets until you encounter that tweet.
    await lilyn.getTweetsUntilID("1624553417120022531");

    // dont forget to close the browser
    await browser.close()
}
```

Feel free to send feature requests & issues in the Issues tab.

### Note:
1.0.0 is broken, don't download it. Go with 1.0.1.
