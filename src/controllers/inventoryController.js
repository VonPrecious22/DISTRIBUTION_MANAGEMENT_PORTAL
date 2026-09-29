const inventoryService = require("../services/inventoryService");
const createInventoryValidator = require("../validator/inventoryValidator");
const { getProductsByInventory } = require("../services/productService");

const inventoryForm = (req, res) => {
  return res.render("manager/inventory/create", { error: null });
};

const createInventory = async (req, res) => {
  try {
    const { error } = createInventoryValidator.validate(req.body);
    if (error) {
      return res.status(400).render("manager/inventory/create", {
        error: error.details[0].message,
      });
    }

    await inventoryService.createInvetory(req.body);
    return res.redirect("/manager/inventory");
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    return res.status(status).render("error/500", {
      error: err.message || "Something went wrong, please try again!!",
    });
  }
};

const getAllInventory = async (req, res) => {
  try {
    const inventories = await inventoryService.allInventory();
    return res.status(200).render("manager/inventory/index", { inventories });
  } catch (err) {
    console.error(err);
    return res.status(500).render("error/500", {
      error: "Something went wrong, please try again!!",
    });
  }
};

const getInventoryQuantity = async (req, res) => {
  try {
    const { inventoryId } = req.params;
    const result = await inventoryService.getTotalQuantity(inventoryId);
    const products = await getProductsByInventory(inventoryId);

    return res.status(200).render("manager/inventory/detail", { result, products });
  } catch (err) {
    console.error(err);
    const status = err.statusCode || 500;
    return res.status(status).render("error/500", {
      error: err.message || "Something went wrong, please try again!!",
    });
  }
};

module.exports = {
  inventoryForm,
  createInventory,
  getAllInventory,
  getInventoryQuantity,
};
