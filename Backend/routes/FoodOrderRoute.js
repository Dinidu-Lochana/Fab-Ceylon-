const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { getFoods, getFoodsByType , getFoodsDeliveryAvailable , orderFoods, getOrders} =  require('../controllers/FoodOrderController');

router.get('/getfoods/:admin_id',getFoods);
router.get('/getfoods/:admin_id', getFoodsDeliveryAvailable );
//router.post('/getfoods/:admin_id/put-order', orderFoods);
router.get("/getOrders/:userId/:admin_id", getOrders);
router.post("/submitRating", orderFoods);



module.exports = router;



