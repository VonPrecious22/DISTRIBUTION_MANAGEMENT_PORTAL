const bcrypt = require("bcryptjs");
const { loginValidator } = require("../validate/userValidator");
const User = require("../models/user");

const loginForm = (req, res) => {
  return res.render("auth/login", { error: null });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginValidator.validate(req.body);
    if (error)
      return res.status(400).render("auth/login", {
        error: error.details[0].message,
      });
 
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).render("error/404", {
        error: "User not found.",
      });

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .render("auth/login", { error: "Invalid email or password." });
    }
    if (!user.isActive)
      return res.status(403).render("auth/login", {
        error: "Your account is inActive.",
      });
    req.session.user = {
      id: user._id,
      role: user.role,
    }
    if (user.role === "manager") return res.redirect("/manager/dashboard");

    if (user.role === "buyer") return res.redirect("/buyer/dashboard");
  } catch (err) {
    console.error(err);
    return res.status(500).render("error/500", {
      error: "Something went wrong",
    });
  }
};

const logOut = async(req, res) =>{
 req.session.destroy((error) =>{
  if(error){
    console.error(error);
    return res.status(500).render("error/500", {error: "Something went wrong.."})
  }
  return res.redirect("auth/login");
 })
}



module.exports = { logOut, login, loginForm };
