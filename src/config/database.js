const mongoose = require("mongoose");
require("dotenv").config({
  path: require('path').resolve(__dirname,"..env/.")
});
const connectDatabase = async () => {
  const databaseUrl = process.env.MONGODB_URL
  try {
    await mongoose.connect(databaseUrl);
    console.log("Database connected successfully");
  } catch (err) {
    console.error(err);
    console.log("Failed to connect to database");
    process.exit(1);
  }
};

module.exports = connectDatabase;
