export class Mailer {
  private readonly apiUrl = "https://brevo.com";
  private readonly apiKey = process.env.BREVO_API_KEY;
  private readonly senderEmail = process.env.NO_REPLY_USER_EMAIL;

  async serverStart() {
    if (!this.apiKey || !this.senderEmail) {
      console.warn(
        "Mail Server warning: BREVO_API_KEY or NO_REPLY_USER_EMAIL is missing."
      );
      return;
    }
    console.log("Mail Server start successfully.");
  }

  private async sendRequest(payload: {
    toEmail: string;
    subject: string;
    html?: string;
    text?: string;
  }) {
    if (!this.apiKey) {
      throw new Error("BREVO_API_KEY is not configured.");
    }

    const body: Record<string, any> = {
      sender: {
        name: "Face-net",
        email: this.senderEmail,
      },
      to: [{ email: payload.toEmail }],
      subject: payload.subject,
    };

    if (payload.html) body.htmlContent = payload.html;
    if (payload.text) body.textContent = payload.text;

    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": this.apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo API Error (${response.status}): ${errorText}`);
    }

    return await response.json();
  }

  async sendCode(toEmail: string, OTP: string) {
    return await this.sendRequest({
      toEmail,
      subject: "Verify your Email Address",
      html: `Your verification code is <b>${OTP}</b>. It will expire in 15 minutes.`,
    });
  }

  async sendSuccessMessage(toEmail: string) {
    return await this.sendRequest({
      toEmail,
      subject: "Verification is successful",
      text: `Your account is verified successful. Enjoy the service.`,
    });
  }

  async sendResetPasswordLink(name: string, toEmail: string, link: string) {
    return await this.sendRequest({
      toEmail,
      subject: "Password reset: Email",
      html: `<p>Hello ${name},</p>

              <p>Please use the following link to reset your password. This link will be valid for only 15 minutes.</p>

              <p>Link: <a href="${link}">Reset Password Here</a></p>

              <p>Thank you,</p>`,
    });
  }

  async sendResetPasswordSuccessMessage(name: string, toEmail: string) {
    return await this.sendRequest({
      toEmail,
      subject: `${name}, your password was successfully RESET`,
      html: `
    <p>Hello ${name},</p>

    <p>Your password has been <b style="color: #eab308;">RESET</b> successfully. Hope you have a great experience.</p>

    <p>Thank you,</p>
  `,
    });
  }
}
