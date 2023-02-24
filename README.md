![twit-puppeteer-loho](https://user-images.githubusercontent.com/68234036/220058870-dcc40d37-68c0-4861-993f-99c794056dba.png) 
# twitter-scraper

A puppeteer-core powered scraper for Twitter.

![](https://img.shields.io/npm/l/@lilyn/twitter-scraper?style=flat-square) ![](https://img.shields.io/npm/v/@lilyn/twitter-scraper?style=flat-square)

### Installation
`npm i @lilyn/twitter-scraper`
  - from this: https://www.npmjs.com/package/@lilyn/twitter-scraper

### Typescript Usage
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

### CLI Usage
```

$ twitter-scraper
Commands:
  bin.js getProfile [at]                    Get the profile of the user/s.
  bin.js getTweetsByPage [number-of-pages]  Get the tweets of a user/s by pages.
  [at]
  bin.js getTweetsUntilID [at] [id]         Scan every tweet until it encounters
                                            the id. Example: getTweetsUntilID -@
                                            LilynHana -id 9342084 -@ Soleil -id
                                            89734
  bin.js trackUser [at] [msRefresh]         Tracks a user's profile and prints
                                            when there's a tweet posted.

Options:
  --version      Show version number                                   [boolean]
  --path         The file path of your chrome browser!
     [string] [default: "C:/Program Files/Google/Chrome/Application/chrome.exe"]
  --filepath     The file path to write the results on! Note: Needs full file
                 path!                                                  [string]
  --headless     If puppeteer would show the window it's working on.
                                                       [boolean] [default: true]
  --concurrency  How much tabs puppeteer opens in a run.   [number] [default: 3]
  --help         Show help                                             [boolean]

Not enough non-option arguments: got 0, need at least 1
```
Feel free to send feature requests & issues in the Issues tab.

If you want to ask me about stuff, send me a DM at Discord: `Alice_#5945`.

### Note:
*Latest Update: 1.2.0:*
  - [X] Image & Video Parsing in Twitter Posts
  - [X] Live Tracking
    - Check the Twitter user periodically if they posted something new!
  - [X] Major Performance Boost:
    - 20s-30s~ load times to 7-8s~ load times (for 8 users)
  - [X] New cache for Puppeteer
      - faster loading times of twitter.com when warmed up
  - [X] Bluebird promise handling (only available in CLI, you'd need to implement this yourself in TS)
      - better concurrency
      - new `concurrency` option is added to determine how many tabs puppeteer will handle in one go
  - [X] Minor bug-fixes:
      - changed resolution values (for twitter scrolling to work)

1.0.0 is broken, don't download it. Go with 1.0.1.

Ctrl + Shift + V to preview markdown in VSCode. Not related but.. I need a reminder here.
