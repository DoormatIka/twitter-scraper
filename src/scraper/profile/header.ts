import { Page } from "puppeteer-core";

export class ProfileHeaderHandler {
    constructor(private page: Page) {}
    async getProfileInfo() {

        await Promise.allSettled([
            this.page.waitForSelector("[data-testid=\"UserName\"] div span"),
            this.page.waitForSelector("[data-testid=\"UserName\"] div:nth-of-type(2) span"),
            // this.page.waitForSelector("[data-testid=\"UserDescription\"]"),
            this.page.waitForSelector("[href$=\"/photo\"] img"),
            // this.page.waitForSelector("[href$=\"/header_photo\"] img"),
        ])
        return {
            name: await this.getName(),
            at: await this.getAt(),
            description: await this.getDescription(),
            profile_picture: await this.getProfilePicture(),
            banner: await this.getBanner(),
            link: this.page.url()
        }
    }
    private async getName() {
        const name = await this.page.$("[data-testid=\"UserName\"] div span");
        return await name?.evaluate(c => c.textContent);
    }
    private async getAt() {
        const at = await this.page.$("[data-testid=\"UserName\"] div:nth-of-type(2) span");
        return await at?.evaluate(c => c.textContent);
    }
    private async getDescription() {
        const description = await this.page.$("[data-testid=\"UserDescription\"]");
        return await description?.evaluate(c => c.textContent);
    }
    private async getProfilePicture() {
        const picture = await this.page.$("[href$=\"/photo\"] img");
        return await picture?.evaluate(c => c.src)
    }
    private async getBanner() {
        const banner = await this.page.$("[href$=\"/header_photo\"] img");
        return await banner?.evaluate(c => c.src)
    }
}