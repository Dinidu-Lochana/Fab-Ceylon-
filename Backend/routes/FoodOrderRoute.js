const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { getFoods} =  require('../controllers/FoodOrderController');



module.exports = router;



