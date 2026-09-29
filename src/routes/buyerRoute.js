const express = require("express");
const router = express.Router();

const isAuthenticated = require("../middleware/auth");
const requireRole = require("../middleware/role");

const { dashboard } = require("../controllers/buyerController");
const {
  getAllInventory,
  getInventoryQuantity,
} = require("../controllers/inventoryController");
const {
  buyerProducts,
  createOrder,
  buyerOrders,
  buyerOrderDetail,
} = require("../controllers/orderController");

router.use(isAuthenticated, requireRole("buyer"));

router.get("/dashboard", dashboard);

//Inventory
router.get("/inventory", getAllInventory);
router.get("/inventory/:inventoryId", getInventoryQuantity);

//Product
router.get("/products", buyerProducts);
router.post("/orders", createOrder);
router.get("/orders", buyerOrders);
router.get("/orders/:orderId", buyerOrderDetail);

module.exports = router;
