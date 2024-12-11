const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { getFoods, getFoodsByType , getFoodsDeliveryAvailable} =  require('../controllers/FoodOrderController');

router.get('/getfoods/:admin_id',getFoods);
router.get('/getfoods/:admin_id', getFoodsDeliveryAvailable );


module.exports = router;



