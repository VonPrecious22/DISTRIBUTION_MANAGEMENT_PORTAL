const userService = require("../services/userService");
const createValidator = require("../middleware/validate");

const createBuyerForm = (req, res) => {
  return res.render("/manger/createBuyer", { error: null });
};

const createBuyer = async (req, res) => {
  try {
    const { error } = createValidator(req.body);
    if (error)
      return res
        .status(400)
        .render("/manager/createBuyer", { error: error.detail[0].message });

    const user = await userService.createBuyer({...req.body, role: "buyer"});
    console.log("User created:", user.email);
    return res.redirect("/manager/buyers");
  } catch (err) {
    console.error(err);
    return res.status(500).render("manager/createBuyer", {error: "Something went wrong. Please try again"});
  }
};


module.exports = {createBuyerForm, createBuyer}