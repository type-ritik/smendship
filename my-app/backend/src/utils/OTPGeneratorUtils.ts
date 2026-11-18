// verification code generator
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Verification code 15 minutes expiry generator and verification
export const generateExpiryTime = () => {
  const expiryTime = new Date();
  expiryTime.setMinutes(expiryTime.getMinutes() + 15);
  return expiryTime;
};
