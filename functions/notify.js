const nodemailer = require("nodemailer");
const functions = require("firebase-functions");

const notify = async (oldStatus, latestStatus) => {
  const functionsConfig = functions.config();
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      type: "LOGIN",
      user: functionsConfig.email.admin.user,
      pass: functionsConfig.email.admin.pass,
    },
  });
  const mailOptions = {
    from: `USCIS Case Notifier <${functionsConfig.email.admin.user}>`,
    to: `
        ${functionsConfig.email.admin.user}, ${functionsConfig.email.recipients}
    `,
    subject: "USCIS Case Status Update",
    html: `<h1 style="font-size: 20px;margin=20px 0 10px;">
            USCIS Case Status Update
            </h1>
            <p>Receipt Number: ${functionsConfig.uscis.receiptnumber}</p>
            <br />
            <p style="font-size: 14px">There has been a case status change!</>
            <p style="font-weight: bold;font-size: 14px;">
                From: ${oldStatus}
            </p>
            <p style="font-weight: bold;font-size: 14px;">
                To: ${latestStatus}
            </p>
            <br />
            <a href="${functionsConfig.uscis.url}">
                Go to USCIS website for more details
            </a>
            <br />
            <br />
            <br />
            <p style="font-size: 12px;color=#ccc;">
                ${functionsConfig.email.secretmessage}
            </p>
        `,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
};


module.exports = notify;
