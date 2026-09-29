const Inventory = require("../models/inventory");
const Product = require("../models/product");

const createProduct = async (inventoryId, { name, quantity, price }) => {
  const inventory = await Inventory.findById(inventoryId);
  if (!inventory) {
    const error = new Error("Inventory of this category not found");
    error.StatusCode = 400;
    throw error;
  }
  return await Product.create({
    name,
    quantity,
    price,
    inventory: inventoryId,
  });
};

const getAllProducts = async () => {
  return Product.find();
};

const updateProduct = async(ProductId,{name, quantity, price}) =>{
const product = await Product.findOne({ProductId});
if(!product) {
  const error = new Error("Unable find product");
  error.StatusCode = 400;
  throw error;
}
const updatedProduct = await Product.findByAndUpdate({
  ProductId
},
{name, quantity, price},
{returnDocument: "after", runValidators: true},
);
return updatedProduct
}


const getProductsByInventory = async (inventoryId) => {
  return Product.find({ inventory: inventoryId });
};






module.exports = {
  getProductsByInventory,
  getAllProducts,
  createProduct,
  updateProduct,
};
