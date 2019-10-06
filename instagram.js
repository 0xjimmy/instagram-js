// Puppeteer dependecy for assesing Instagram
const Puppeteer = require('puppeteer')

// Browser and Page Object
let browser
let page

// Initialises the browser and page
// @param Dev: Bool for debugging, bool
// @dev Sets Browser and Page variables
function init(dev) {
    let options = {}
    if (dev === true) {
        options = {"headless": false, 'devtools': true}
    }
    return new Promise(async (resolve, reject) => {
        try {
            browser = await Puppeteer.launch(options)
            page = await browser.newPage()
            await page.emulate(Puppeteer.devices['iPhone 6'])
            resolve()
        }
        catch (e) {
            reject(e)
        }
    })
}

// Closes the browser
// @dev Closes the Chromium Instance
async function close() {
    await browser.close();
}

// Login To Instagram
// @param Username & Password to log in to instagram, both strings
// @dev Navigates to Instagram.com, Logins In
function login(username, password) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto('https://instagram.com', {waitUntil: 'networkidle0'})
            await page.click('#react-root > section > main > article > div > div > div > div:nth-child(2) > button')
            await page.waitFor('#react-root > section > main > article > div > div > div > form > div:nth-child(4) > div > label > input')
            await page.waitFor('#react-root > section > main > article > div > div > div > form > div:nth-child(7) > button')
            await page.waitFor('#react-root > section > main > article > div > div > div > form > div:nth-child(5) > div > label > input')
            await page.tap('#react-root > section > main > article > div > div > div > form > div:nth-child(4) > div > label > input')
            await page.type('#react-root > section > main > article > div > div > div > form > div:nth-child(4) > div > label > input', username, {delay: 50})
            await page.tap('#react-root > section > main > article > div > div > div > form > div:nth-child(5) > div > label > input')
            await page.type('#react-root > section > main > article > div > div > div > form > div:nth-child(5) > div > label > input', password, {delay: 50})
            await Promise.all([
                page.waitForNavigation(),
                page.tap('#react-root > section > main > article > div > div > div > form > div:nth-child(7) > button')
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
function followerCount(username) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(`https://instagram.com/${username}`, {waitUntil: 'networkidle0'})
            await page.waitFor('#react-root > section > main > div > ul > li:nth-child(2) > a > span')
            let count = await page.evaluate(() => document.querySelector('#react-root > section > main > div > ul > li:nth-child(2) > a > span').title)
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
function follow(username) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(`https://instagram.com/${username}`, {waitUntil: 'networkidle0'})
            await page.waitFor('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button')
            let followButton = await page.evaluate(() => document.querySelector('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button').innerHTML)
            if (followButton === 'Follow') {
                await page.tap('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button')
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
function unfollow(username) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(`https://instagram.com/${username}`, {waitUntil: 'networkidle0'})
            await page.waitFor('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button')
            let followButton = await page.evaluate(() => document.querySelector('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button').innerHTML)
            if (followButton === 'Follow') {
                resolve()
            } else {
                await page.tap('#react-root > section > main > div > header > section > div.Y2E37 > div > span > span.vBF20._1OSdk > button')
                await page.waitFor('body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_')
                await page.tap('body > div.RnEpo.Yx5HN > div > div > div.mt3GC > button.aOOlW.-Cab_')
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
function comment(post, message) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(post, {waitUntil: 'networkidle0'})
            await page.waitFor('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span._15y0l > button')
            await Promise.all([
                page.waitForNavigation({waitUntil: 'networkidle0'}),
                page.tap('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span._15y0l > button')
            ])
            await page.waitFor('#react-root > section > main > section > div > form > textarea')
            await page.tap('#react-root > section > main > section > div > form > textarea')
            await page.type('#react-root > section > main > section > div > form > textarea', message, {delay: 50})
            await page.tap('#react-root > section > main > section > div > form > button')
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
function likePost(post) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(post, {waitUntil: 'networkidle0'})
            await page.waitFor('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button')
            let likeButton = await page.evaluate(() => document.querySelector('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button > span').className)
            if (likeButton === 'glyphsSpriteHeart__outline__24__grey_9 u-__7') {
                await page.tap('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button')
                await page.waitFor('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.FY9nT.fr66n > button > span')
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
function unlikePost(post) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto(post, {waitUntil: 'networkidle0'})
            await page.waitFor('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button')
            let likeButton = await page.evaluate(() => document.querySelector('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button > span').className)
            if (likeButton === 'glyphsSpriteHeart__outline__24__grey_9 u-__7') {
                resolve()
            } else {
                await page.tap('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.fr66n > button')
                await page.waitFor('#react-root > section > main > div > div > article > div.eo2As > section.ltpMr.Slqrh > span.FY9nT.fr66n > button > span')
                resolve()
            }
        }
        catch (e) {
            reject(e)
        }
    })
}

// Create A Post
// @param
function post() {
    // Image / Video -- add possibly multiple
    // Filter
    
}

/* TODO */
// - Post
// - Create Story
// - Send DM
// - Block
// - Accept private follow request

(async () => {
    // Config File for account credentials for testing
    const config = require('./config.json')

    await init(true)
    await login(config.username, config.password)
    
})()

module.exports = { init, close, login, followerCount, follow, unfollow, comment, likePost, unlikePost }