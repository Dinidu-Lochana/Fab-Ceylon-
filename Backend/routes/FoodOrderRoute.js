const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { getFoods, getFoodsByType , getFoodsDeliveryAvailable , orderFoods} =  require('../controllers/FoodOrderController');

router.get('/getfoods/:admin_id',getFoods);
router.get('/getfoods/:admin_id', getFoodsDeliveryAvailable );
router.post('/getfoods/:admin_id/put-order', orderFoods);


module.exports = router;



