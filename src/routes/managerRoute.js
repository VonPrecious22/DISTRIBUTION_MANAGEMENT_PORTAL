const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middleware/auth");
const requireRole = require("../middleware/role");

const {
  createBuyer,
  createBuyerForm,
  dashboard,
  getAllBuyers,
} = require("../controllers/createBuyerController");
const {
  inventoryForm,
  getAllInventory,
  createInventory,
  getInventoryQuantity,
} = require("../controllers/inventoryController");

const {
  productForm,
  createNewProduct,
  getProducts,
  updateExistingProduct,
} = require("../controllers/productController");

const {
  managerOrders,
  managerOrderDetail,
  approveOrder,
  rejectOrder,
} = require("../controllers/orderController");

router.use(isAuthenticated, requireRole("manager"));

router.get("/dashboard", dashboard);

//create buyer
router.get("/buyers", getAllBuyers);
router.get("/buyers/create", createBuyerForm);
router.post("/buyers", createBuyer);

//Inventory
router.get("/inventory", getAllInventory);
router.get("/inventory/create", inventoryForm);
router.post("/inventory/create", createInventory);
router.get("/inventory/:inventoryId", getInventoryQuantity);

//product routes
router.get("/inventory/:inventoryId/products/create", productForm);
router.post("/inventory/:inventoryId/products", createNewProduct);
router.get("/products", getProducts);
router.patch("/products/:productId", updateExistingProduct);
module.exports = router;

// Orders
router.get("/orders", managerOrders);
router.get("/orders/:orderId", managerOrderDetail);
router.patch("/orders/:orderId/approve", approveOrder);
router.patch("/orders/:orderId/reject", rejectOrder);
