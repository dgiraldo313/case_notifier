const functions = require("firebase-functions");
const caseStatusCheck = require("./caseStatusCheck.js");

exports.checkCaseStatus = functions.https.onRequest(
    async (request, response) => {
      const caseStatus = await caseStatusCheck();
      response.send(caseStatus);
    }
);
