const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const statusRef = db.collection("uscis").doc("case-status");

const caseStatusWrite = async ( recentStatus ) => {
  const doc = await statusRef.get();
  const savedStatus = doc.data().status;
  if (savedStatus === recentStatus) {
    return recentStatus;
  } else {
    await statusRef.set({
      "status": recentStatus,
    });
    return `***Status was updated with:*** ${recentStatus}`;
  }
};

module.exports = caseStatusWrite;
