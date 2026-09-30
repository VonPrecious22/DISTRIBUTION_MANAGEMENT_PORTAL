const express = require("express");

const router = express.Router();

const {
  startPayment,
  paymentCallback,
} = require("../controllers/paymentController");

const isAuthenticated = require("../middleware/auth");
const requireRole = require("../middleware/role")

router.get(
  "/pay/:orderId",
  isAuthenticated,
  requireRole("buyer"),
  startPayment,
);

router.get("/callback", paymentCallback);

module.exports = router;
