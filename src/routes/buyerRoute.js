const express = require('express');
const router = express.Router();
const isAuthenticated = require("../middleware/auth");
const requireRole = require("../middleware/role");

const {dashboard} = require("../controllers/buyerController");

router.use(isAuthenticated, requireRole("buyer"));

router.get("/dashboard", dashboard);

module.exports = router;