const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRounds = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compareSync(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
