export function isValidUUID(uuid) {
  const uuidRegex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[1-5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return uuidRegex.test(uuid);
}

export function isValidEmail(email) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  if (!email || email.length < 6) {
    return false;
  }

  if (!emailRegex.test(email)) {
    return false;
  }

  return true;
}

export function isValidPassword(password) {
  const passwordRegex = /^[\w]{8,}/;

  if (!password || password.length < 8) {
    return false;
  }

  if (!passwordRegex.test(password)) {
    return false;
  }

  return true;
}

export function isValidName(name) {
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
