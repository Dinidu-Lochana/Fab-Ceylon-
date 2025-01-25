const { adminLogin, adminSignup } = require("../controllers/AdminController");
const express = require("express");
const router = express.Router();

router.post("/login", adminLogin);

router.post("/signup", adminSignup);



module.exports = router;
