const axios = require("axios");
const { OAuth2Client } = require("google-auth-library");

const oAuth2Client = new OAuth2Client(
  process.env.GOOGLE_API_CLIENT_ID,
  process.env.GOOGLE_API_SECRET_KEY,
  "postmessage",
);

const githubAccessToken = async (code) => {
  try {
    const res = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_API_CLIENT_ID,
        client_secret: process.env.GITHUB_API_SECRET_KEY,
        code,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    return res.data.access_token;
  } catch (error) {
    console.log("[GitHub Auth Profile Info Error]:", error.message);
    throw new Error(error.message);
  }
};

const githubProfileInfo = async (accessToken) => {
  try {
    const profileRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "NodeJS-App",
      },
    });

    return profileRes.data;
  } catch (error) {
    console.log("[GitHub Auth Access Token Error]:", error.message);
    throw new Error(error.message);
  }
};

const githubEmailInfo = async (accessToken) => {
  try {
    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "NodeJS-App",
      },
    });

    const emailRecords = emailRes.data;

    let primaryEmail = null;
    if (Array.isArray(emailRecords)) {
      const foundEmail = emailRecords.find(
        (email) => email.primary && email.verified,
      );
      primaryEmail = foundEmail ? foundEmail.email : emailRecords[0]?.email;
    }

    return primaryEmail;
  } catch (error) {
    console.log("[GitHub Auth Email Error]:", error.message);
    throw new Error(error.message);
  }
};

module.exports = {
  oAuth2Client,
  githubProfileInfo,
  githubEmailInfo,
  githubAccessToken,
};
