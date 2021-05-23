const functions = require("firebase-functions");
const caseStatusCheck = require("./caseStatusCheck.js");
const caseStatusWrite = require("./caseStatusWrite.js");
const notify = require("./notify.js");

const DAILY_AT_NINE = "0 9 * * *";

const runCaseStatusAutomation = async () => {
  const recentCaseStatus = await caseStatusCheck();
  return await caseStatusWrite(recentCaseStatus);
};

exports.checkCaseStatus = functions.pubsub
    .schedule(DAILY_AT_NINE)
    .timeZone("America/New_York")
    .onRun(async () => {
      await runCaseStatusAutomation();
      return null;
    });


exports.writeCaseStatus = functions.https.onRequest(
    async (req, res) => {
      const caseStatus = await runCaseStatusAutomation();
      res.send(caseStatus);
    }
);

exports.notifyCaseUpdate = functions.firestore
    .document("/uscis/case-status")
    .onUpdate(async (change) => {
      const oldStatus = change.before.data().status;
      const latestStatus = change.after.data().status;

      console.log(
          `Case Status has changed - \n
         from: "${oldStatus}" \n
         to: "${latestStatus}" \n
        `
      );

      await notify(oldStatus, latestStatus);
    });
