const User = require("../models/user");
const bcrypt = require("bcryptjs");

const createBuyer = async ({name, email, contact, password, role}) => {
  //const { name, email, contact, password, role } = req.body;
 
  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res
      .status(404)
      .render("/auth/login", { error: "Email already exist" });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    password: hashedPassword,
    email,
    contact,
    role
  });
  return user;
};

module.exports = createBuyer;
