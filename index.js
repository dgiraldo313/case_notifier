const puppeteer = require('puppeteer')
require('dotenv').config()

const CASE_NUMBER = 'LIN2190272841'
const url = `https://egov.uscis.gov/casestatus/landing.do`

const sanitizeStatusResponse = (str) => {
    if ((str===null) || (str===''))
    return false
    else  {
        return str
            .replace('+','')
            .replace(/\r?\n|\r/g, " ")
            .replace( /(<([^>]+)>)/ig, '')
            .replace('Your Current Status: \t', '')
            .replace("\\s+", " ")
            .trim()
            .toLowerCase()
    }
    
 }
async function run () {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    await page.$eval('#receipt_number', (el,receipt) => el.value = `${receipt}`, process.env.RECEIPT_NUMBER)
    await page.click('input[type="submit"]')
    await page.waitForSelector('div.current-status-sec').catch(t => console.log('Not able to load status screen'))
    const status = sanitizeStatusResponse(
        await page.$eval('.current-status-sec', el => el.innerText)
    )
    console.log(`Your current status: ${status}`)
    browser.close()
}

run()