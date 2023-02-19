import puppeteer, { Browser } from "puppeteer-core";
/**
 * An overall more optimized setup for chrome-puppeteer.
 */
export class CustomBrowser {
    private browser?: Browser
    private blocked_domains: string[] = [
        'googlesyndication.com',
        'adservice.google.com',
    ]
    private blocked_contents: ("document" | "stylesheet" | "image" | "media" | "font" | "script" | "texttrack" | "xhr" | "fetch" | "prefetch" | "eventsource" | "websocket" | "manifest" | "signedexchange" | "ping" | "cspviolationreport" | "preflight" | "other")[] = [
        "font", "media", "stylesheet"
    ]
    constructor(blocked_domains?: string[]) {
        if (blocked_domains) this.blocked_domains.push(...blocked_domains);
    }
    async init(options: { headless: boolean, execPath: string }) {
        this.browser = await puppeteer.launch({
            headless: options.headless,
            executablePath: options.execPath,
            args: [
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu',
                '--disable-speech-api',
                '--window-size=800,1280'
            ]
        });
    }
    async newPage() {
        if (!this.browser) throw Error("No browser gotten!");

        const page = await this.browser.newPage();
        await page.setRequestInterception(true);
        await page.setViewport({ width: 800, height: 1280 })
        page.on("request", req => { // optimization
            const url = req.url();
            if (
                this.blocked_domains.some(domain => url.includes(domain)) ||
                this.blocked_contents.some(contents => req.resourceType() === contents) ||
                url.endsWith(".mp4") || url.endsWith(".avi") || url.endsWith(".flv") || 
                url.endsWith(".mov") || url.endsWith(".wmv")
            ) { 
                req.abort(); 
            } else { 
                req.continue(); 
            }
        })
        return page;
    }
    async close() {
        await this.browser?.close();
    }
}