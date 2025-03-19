const { updateProfile } = require("../controllers/UserProfileSettingController");

const express = require("express");
const router = express.Router();

// Route for updating the user profile (contact number, password)
router.put("/update-profile", updateProfile);

module.exports = router;
