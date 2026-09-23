const express = require('express');
const router = express.Router();

const isAuthenticated = require("../middleware/auth");
const requireRole = require("../middleware/role");
const {  createBuyer, createBuyerForm, dashboard} = require("../controllers/createBuyerController");

router.use(isAuthenticated, requireRole("manager"));

router.get("/dashboard", dashboard);
router.get("/buyers/create", createBuyerForm);
router.post("/buyers", createBuyer);


module.exports = router;