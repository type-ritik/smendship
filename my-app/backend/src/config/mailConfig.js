const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NO_REPLY_USER_EMAIL,
    pass: process.env.NO_REPLY_USER_SECRET_KEY,
  },
});

const verifyNodemailerServer = async () => {
  try {
    await transporter.verify();
    console.log("Nodemailer server is ready to send emails");
  } catch (error) {
    console.error("Error verifying Nodemailer server:", error);
  }
};

const sendVerificationCode = async (emailTo, verificationCode) => {
  const mailOptions = {
    from: `"Smendship" <noreply@example.com>`,
    to: emailTo,
    subject: "Verify your Email Address",
    text: `Your verification code is: ${verificationCode}. It will expire in 15 minutes.`,
  };

  const payload = await transporter.sendMail(mailOptions);
  return payload;
};

const sendVerificationSuccessfullMessage = async (emailTo) => {
  const mailOptions = {
    from: `"Smendship" <noreply@example.com>`,
    to: emailTo,
    subject: "Verification is successful",
    text: `Your account verification is successful, Enjoy your stay.`,
  };

  const payload = await transporter.sendMail(mailOptions);
  return payload;
};
module.exports = {
  verifyNodemailerServer,
  sendVerificationCode,
  sendVerificationSuccessfullMessage,
};
