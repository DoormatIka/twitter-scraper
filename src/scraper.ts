import { ProfileHeaderHandler } from "./scraper/profile/header";
import { ProfileTweetsHandler } from "./scraper/profile/tweets";
import { ProfileLiveTracking } from "./scraper/profile/live";

export {
    ProfileHeaderHandler,
    ProfileTweetsHandler,
    ProfileLiveTracking
}
// twitter loading (1 page) takes 13.9% of CPU (2GHz) and 120MB of RAM (headful)
// twitter loading (3 pages) takes 20-30% of CPU (2GHz) and 300MB of RAM (headful)
// (new Browser()).init(false, "C:/Program Files/Google/Chrome/Application/chrome.exe")