function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return uuidRegex.test(uuid);
}

function isValidEmail(email) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  if (!email || email.length < 6) {
    return false;
  }

  if (!emailRegex.test(email)) {
    return false;
  }

  return true;
}

function isValidPassword(password) {
  const passwordRegex = /^[\w]{8,}/;
  console.log("Working condition 0...");

  if (!password || password.length < 8) {
    return false;
  }
  console.log("Working completed!");

  console.log("Working condition 1...");

  if (!passwordRegex.test(password)) {
    return false;
  }

  console.log("Password is validated");

  return true;
}

function isValidName(name) {
  const nameRegex = /^[a-zA-Z\s]+$/;

  if (!name || name.trim().length === 0) {
    return false;
  }

  if (name.length < 3) {
    return false;
  }

  if (!nameRegex.test(name)) {
    return false;
  }

  return true;
}

module.exports = {
  isValidUUID,
  isValidEmail,
  isValidPassword,
  isValidName,
};
