import nodemailer from "nodemailer";

export class Mailer {
  private transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NO_REPLY_USER_EMAIL,
        pass: process.env.NO_REPLY_USER_SECRET_KEY,
      },
    });
  }

  async serverStart() {
    try {
      await this.transporter.verify();
      console.log("Mail Server start successfully.");
    } catch (error) {
      console.error("Error verifying Nodemailer server:", error);
      throw error;
    }
  }

  async sendCode(toEmail: string, OTP: string) {
    const mailOptions = {
      from: `"Face-net" <noreply@example.com>`,
      to: toEmail,
      subject: "Verify your Email Address",
      html: `Your verification code is <b>${OTP}</b>. It will expire in 15 minutes.`,
    };

    return await this.transporter.sendMail(mailOptions);
  }

  async sendSuccessMessage(toEmail: string) {
    const mailOption = {
      from: `"Face-net" <noreply@example.com>`,
      to: toEmail,
      subject: "Verfication is successful",
      text: `Your account is verified successful. Enjoy the service.`,
    };

    return await this.transporter.sendMail(mailOption);
  }
  async sendResetPasswordLink(name: string, toEmail: string, link: string) {
    const mailOption = {
      from: `"Face-net" <noreply@example.com>`,
      to: toEmail,
      subject: "Password reset: Email",
      html: `<p>Hello ${name},</p>

              <p>Please use the following link to reset your password. This link will be valid for only 15 minutes.</p>

              <p>Link: <a href="${link}">Reset Password Here</a></p>

              <p>Thank you,</p>`,
    };

    return await this.transporter.sendMail(mailOption);
  }

  async sendResetPasswordSuccessMessage(name: string, toEmail: string) {
    const mailOption = {
      from: `"Face-net" <noreply@example.com>`,
      to: toEmail,
      subject: `${name}, your password was successfully RESET`,
      html: `
    <p>Hello ${name},</p>

    <p>Your password has been <b style="color: #eab308;">RESET</b> successfully. Hope you have a great experience.</p>

    <p>Thank you,</p>
  `,
    };

    return await this.transporter.sendMail(mailOption);
  }
}
