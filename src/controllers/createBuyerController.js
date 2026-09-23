const userService = require("../services/userService");
const { createBuyerValidator } = require("../validate/userValidator");

const createBuyerForm = (req, res) => {
  return res.render("manager/createBuyer", { error: null });
};

const dashboard = (req, res) => {
  res.render("manager/dashboard", { user: req.session.user });
};

const createBuyer = async (req, res) => {
  try {
    const { error } = createBuyerValidator.validate(req.body);
    if (error)
      return res
        .status(400)
        .render("manager/createBuyer", { error: error.details[0].message });

    const user = await userService.createBuyer({ ...req.body, role: "buyer" });
    console.log("User created:", user.email);
    return res.redirect("/manager/buyers");
  }  catch (err) {
  console.error(err);
  return res.status(500).render("manager/createBuyer", {
    error: err.message,   // temporarily show the real message
  });
}

}
module.exports = { dashboard, createBuyerForm, createBuyer };
