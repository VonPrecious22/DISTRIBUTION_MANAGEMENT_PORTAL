const userService = require("../services/userService");
const { createBuyerValidator } = require("../validator/userValidator");
const Inventory = require("../models/inventory");
const Product = require("../models/product");

const createBuyerForm = (req, res) => {
  return res.render("manager/createBuyer", { error: null });
};

const dashboard = async (req, res) => {
  try {
    const totalInventory = await Inventory.countDocuments();
    const totalProducts = await Product.countDocuments();

    res.render("manager/dashboard", {
      user: req.session.user,
      totalInventory,
      totalProducts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error/500", {
      error: "Something went wrong, please try again.",
    });
  }
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
  } catch (err) {
    console.error(err);
    return res.status(500).render("manager/createBuyer", {
      error: err.message,
    });
  }
};

const getAllBuyers = async (req, res) => {
  try {
    const buyers = await userService.getBuyers();
    return res.status(400).render("manager/buyers", { buyers });
  } catch (err) {
    console.error(err);
    res.status(500).render("error/500", {
      error: "Something went wrong, please try again.",
    });
  }
};

module.exports = { getAllBuyers, dashboard, createBuyerForm, createBuyer };
