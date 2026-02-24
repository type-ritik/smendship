const jwt = require("jsonwebtoken");

// Verify JWT and extract user info
function verifyToken(token) {
  if (!token) {
    throw new Error("Unauthorized");
  }
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error("Invalid token");
  }
}

function generateToken(userId, isAdmin) {
  return jwt.sign(
    {
      id: userId,
      role: isAdmin,
    },
    process.env.JWT_SECRET,
  );
}

module.exports = { verifyToken, generateToken };
