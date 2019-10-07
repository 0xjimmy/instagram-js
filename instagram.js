// Puppeteer dependecy for assesing Instagram
const Puppeteer = require('puppeteer')

class Client {
    // Initialises the browser and page
    // @param Dev: Bool for debugging, bool
    // @dev Sets this.browser and this.page variables
    init(dev) {
        let options = {}
        if (dev === true) {
            options = {"headless": false, 'devtools': true}
        }
        return new Promise(async (resolve, reject) => {
            try {
                this.browser = await Puppeteer.launch(options)
                this.page = await this.browser.newPage()
                await this.page.emulate(Puppeteer.devices['iPhone 6'])
                resolve()
            }
            catch (e) {
                reject(e)
            }
        })
    }
    // Closes the browser
    // @dev Closes the Chromium Instance
    close() {
        return new Promise(async (resolve, reject) => {
            try {
                await this.browser.close()
                resolve()
            }
            catch (e) {
                reject(e)
            }
        })
    }
    // Login To Instagram
    // @param Username & Password to log in to instagram, both strings
    // @dev Navigates to Instagram.com, Logins In
    login(username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.page.goto('https://instagram.com', {waitUntil: 'networkidle0'})
                await this.page.click('#react-root > section > main > article > div > div > div > div:nth-child(2) > button')
                await this.page.waitFor('#react-root > section > main > article > div > div > div > form > div:nth-child(4) > div > label > input')
                await this.page.waitFor('#react-root > section > main > article > div > div > div > form > div:nth-child(7) > button')
                await this.page.waitFor('#react-root > section > main > article > div > div > div > form > div:nth-child(5) > div > label > input')
                await this.page.tap('#react-root > section > main > article > div > div > div > form > div:nth-child(4) > div > label > input')
                await this.page.type('#react-root > section > main > article > div > div > div > form > div:nth-child(4) > div > label > input', username, {delay: 50})
                await this.page.tap('#react-root > section > main > article > div > div > div > form > div:nth-child(5) > div > label > input')
                await this.page.type('#react-root > section > main > article > div > div > div > form > div:nth-child(5) > div > label > input', password, {delay: 50})
                await Promise.all([
                    this.page.waitForNavigation(),
                    this.page.tap('#react-root > section > main > article > div > div > div > form > div:nth-child(7) > button')
                ])
                resolve()
            }
            catch (e) {
                reject(e)
            }
        })
    }
    // Get Followers
    // @param Username: Username to check follower amounts of, string
    // @dev Goes to instagram.com/${username} and reads the follower number
    followerCount(username) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.page.goto(`https://instagram.com/${username}`, {waitUntil: 'networkidle0'})
                await this.page.waitFor('#react-root > section > main > div > ul > li:nth-child(2) > a > span')
                let count = await this.page.evaluate(() => document.querySelector('#react-root > section > main > div > ul > li:nth-child(2) > a > span').title)
                resolve(count.replace(/,/g,''))
            }
            catch (e) {
                reject(e)
            }     
        })
    }
    // Follow
    // @param Username: User to follow, string
    // @dev Goes to user's profile, if not following, clicks follow
    follow(username) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.page.goto(`https://instagram.com/${username}`, {waitUntil: 'networkidle0'})
                await this.page.waitFor('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button')
                let followButton = await this.page.evaluate(() => document.querySelector('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button').innerHTML)
                if (followButton === 'Follow') {
                    await this.page.tap('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button')
                    resolve()
                } else {
                    resolve()
                }
            }
            catch (e) {
                reject(e)
            }
        })
    }
    // Unfollow
    // @param Username: User to unfollow, string
    // @dev Goes to user's profile, if following, clicks unfollow
    unfollow(username) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.page.goto(`https://instagram.com/${username}`, {waitUntil: 'networkidle0'})
                await this.page.waitFor('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button')
                let followButton = await this.page.evaluate(() => document.querySelector('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button').innerHTML)
                if (followButton === 'Follow') {
                    resolve()
                } else {
                    await this.page.tap('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button')
                    await this.page.waitFor('body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_')
                    await this.page.tap('body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_')
                    resolve()
                }
            }
            catch (e) {
                reject(e)
            }
        })
    }
    // Comment
    // @param URL of post to comment on, string
    // @param Message content of the post, string
    comment(post, message) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.page.goto(post, {waitUntil: 'networkidle0'})
                await this.page.waitFor('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span._15y0l > button')
                await Promise.all([
                    this.page.waitForNavigation({waitUntil: 'networkidle0'}),
                    this.page.tap('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span._15y0l > button')
                ])
                await this.page.waitFor('#react-root > section > main > section > div > form > textarea')
                await this.page.tap('#react-root > section > main > section > div > form > textarea')
                await this.page.type('#react-root > section > main > section > div > form > textarea', message, {delay: 50})
                await this.page.tap('#react-root > section > main > section > div > form > button')
                await new Promise((resolve, reject) => {
                    setTimeout(function() {
                    resolve('foo')
                    },  5000)
                })
                resolve()
            }
            catch (e) {
                reject(e)
            }
        })
    }
    // Like Post
    // @param Post - URL of the post, string
    likePost(post) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.page.goto(post, {waitUntil: 'networkidle0'})
                await this.page.waitFor('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button')
                let likeButton = await this.page.evaluate(() => document.querySelector('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button > span').className)
                if (likeButton === 'glyphsSpriteHeart__outline__24__grey_9 u-__7') {
                    await this.page.tap('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button')
                    await this.page.waitFor('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.FY9nT.fr66n > button > span')
                    resolve()
                } else {
                    resolve()
                }
            }
            catch (e) {
                reject(e)
            }
        })
    }
    // Unlike Post
    // @param Post - URL of the post, string
    unlikePost(post) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.page.goto(post, {waitUntil: 'networkidle0'})
                await this.page.waitFor('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button')
                let likeButton = await this.page.evaluate(() => document.querySelector('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button > span').className)
                if (likeButton === 'glyphsSpriteHeart__outline__24__grey_9 u-__7') {
                    resolve()
                } else {
                    await this.page.tap('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button')
                    await this.page.waitFor('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.FY9nT.fr66n > button > span')
                    resolve()
                }
            }
            catch (e) {
                reject(e)
            }
        })
    }
}

/* TODO */
// - Post
// - Create Story
// - Send DM
// - Block
// - Accept private follow request

module.exports = { Client }