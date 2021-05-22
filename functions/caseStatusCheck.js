const puppeteer = require("puppeteer");
const functions = require("firebase-functions");

const sanitizeStatusResponse = (str) => {
  if ((str===null) || (str==="")) {
    return false;
  } else {
    return str
        .replace("+", "")
        .replace(/\r?\n|\r/g, " ")
        .replace( /(<([^>]+)>)/ig, "")
        .replace("Your Current Status: \t", "")
        .replace("\\s+", " ")
        .trim()
        .toLowerCase();
  }
};

const caseStatusCheck = async () => {
  const functionsConfig = functions.config();
  const url = functionsConfig.uscis.url;
  const receiptNumber = functionsConfig.uscis.receiptnumber;
  if (!receiptNumber) {
    const msg = "No receipt number available!";
    console.log(msg);
    return msg;
  }
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.$eval(
      "#receipt_number",
      (el, receipt) => el.value = `${receipt}`, receiptNumber
  );
  await page.click("input[type=\"submit\"]");
  await page.waitForSelector(
      "div.current-status-sec"
  ).catch((t) => console.log("Not able to load status screen"));
  const status = sanitizeStatusResponse(
      await page.$eval(".current-status-sec", (el) => el.innerText)
  );
  console.log(`Your current status: ${status}`);
  browser.close();
  return status;
};

module.exports = caseStatusCheck;
