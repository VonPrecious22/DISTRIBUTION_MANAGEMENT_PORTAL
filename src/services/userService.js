// services/userService.js
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const createBuyer = async ({ name, email, contact, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email already exists.");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    contact,
    password: hashedPassword,
    role,
  });

  return user;
};

module.exports = { createBuyer };
