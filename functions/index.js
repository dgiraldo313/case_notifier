const functions = require("firebase-functions");
const caseStatusCheck = require("./caseStatusCheck.js");
const caseStatusWrite = require("./caseStatusWrite.js");

const DAILY_AT_NINE = "0 9 * * *";

exports.checkCaseStatus = functions.pubsub
    .schedule(DAILY_AT_NINE)
    .timeZone("America/New_York")
    .onRun(async () => {
      const recentCaseStatus = await caseStatusCheck();
      await caseStatusWrite(recentCaseStatus);
      return null;
    });


exports.writeCaseStatus = functions.https.onRequest(
    async (req, res) => {
      const recentCaseStatus = await caseStatusCheck();
      const caseStatus = await caseStatusWrite(recentCaseStatus);
      res.send(caseStatus);
    }
);
