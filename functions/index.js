const functions = require("firebase-functions");
const caseStatusCheck = require("./caseStatusCheck.js");

const DAILY_AT_NINE = "0 9 * * *";

exports.checkCaseStatus = functions.pubsub
    .schedule(DAILY_AT_NINE)
    .timeZone("America/New_York")
    .onRun(async () => {
      await caseStatusCheck();
      return null;
    });
