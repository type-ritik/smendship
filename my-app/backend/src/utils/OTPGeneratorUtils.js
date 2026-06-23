// verification code generator
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verification code 15 minutes expiry generator and verification
const generateExpiryTime = () => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 15);
  return expiryTime;
};

module.exports = {
  generateVerificationCode,
  generateExpiryTime,
};
