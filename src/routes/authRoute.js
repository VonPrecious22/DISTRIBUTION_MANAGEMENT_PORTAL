const express = require('express');
const router = express.Router();
const {loginForm, login, logOut} = require("../controllers/loginController");

router.get("/login", loginForm);
router.post("/login", login);
router.post("/logout", logOut);

module.exports = router;
