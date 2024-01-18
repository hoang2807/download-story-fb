// ./book-scraper/pageController.js
const pageScraper = require('./pageScraper');
async function scrapeAll(browserInstance, link) {
    try {
        const browser = await browserInstance;

        const url = 'https://bravedown.com/vi/facebook-video-downloader'
        let page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        console.log(`Navigating to ${url}...`);
        await page.goto(url);
        await page.type('[class="form-control"]', link);
        await page.keyboard.press('Enter')
        const finalResponse = await page.waitForResponse(response =>
        (response.request().method() === 'PATCH'
            || response.request().method() === 'POST'), 11);
        await finalResponse.json();

        const data = await page.evaluate(() => {
            const items = document.querySelectorAll('a.btn.text-white')
            const links = []

            items.forEach(async item => {
                let linkdown = item.getAttribute('linkdown')
                let type = item.getAttribute('type')

                links.push({ url: linkdown, type, size: "N/A" })
            })

            return links
        })

        const spans = await page.$$('span.d-block')
        const array = []
        for (let i = 0; i < spans.length; ++i) {
            const textContent = await spans[i].evaluate(node => node.textContent);
            array.push(textContent.split('\n').filter(e => e.length > 0))
        }
        array.filter(e => e.length > 0)
        const dataFormat = array.filter(e => e.length > 0)

        for (let i = 0, j = 0; i < dataFormat.length; i += 2, ++j) {
            if (dataFormat[i][0].includes('1080p') || dataFormat[i][0].includes('HD'))
                data[j].format = 'hd'
            else if (dataFormat[i + 1][0].includes('jpg'))
                data[j].format = ''
            else data[j].format = 'sd'
        }

        const img = await page.$eval('img.position-relative.img-fluid.rounded-3.w-100', img => img.src);

        // await page.waitForNavigation();
        await browser.close();
        console.log('Browser closed')
        return { data, img }
    }
    catch (err) {
        console.log("Could not resolve the browser instance => ", err);
    }
    finally {
    }
}

module.exports = scrapeAll