const Inventory = require("../models/inventory");
const Product = require("../models/product");

const createInvetory = async ({ name, description, quantity, category }) => {
  const existing = await Inventory.findOne({ category });
  if (existing) {
    const error = new Error("Inventory of this category already exist...");
    error.statusCode = 400;
    throw error;
  }
  return Inventory.create({
    name,
    description,
    quantity,
    category,
  });
};

const allInventory = async () => {
  return Inventory.find();
};

const getTotalQuantity = async(inventoryId) =>{
const inventory = await Inventory.findById(inventoryId);
if(!inventory) {
    const error = new Error("Inventory not found.");
    error.statusCode = 400;
    throw error
}
const products = await Product.find({inventory: inventoryId});
let totalQuantity = 0;
products.forEach((product) =>{
  totalQuantity += product.quantity
});

return {inventory, totalQuantity, products}

};

module.exports = { createInvetory, allInventory, getTotalQuantity };

