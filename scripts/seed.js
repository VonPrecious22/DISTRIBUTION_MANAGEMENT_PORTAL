const mongoose = require("mongoose");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const bcrypt = require("bcryptjs");
const User = require("../src/models/user");

const createManager = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    const existingManager = await User.findOne({
      email: "atudprecious2@gmail.com",
    });
    if (existingManager) return console.log("manager already exist");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("precious12", salt);
    const manager = await User.create({
      name: "Atud Precious",
      email: "atudprecious2@gmail.com",
      contact: "652675688",
      password: hashedPassword,
      role: "manager",
    });
    console.log("manager created: ", manager.email);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
};

createManager();
