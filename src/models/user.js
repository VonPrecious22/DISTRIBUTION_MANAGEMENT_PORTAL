const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 45,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 20,
    },
    role: {
      type: String,
      enum: ["manager", "buyer"],
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      // Removed maxlength and fixed typos,
      // because bcrypt hashes are ~60 characters long!
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
