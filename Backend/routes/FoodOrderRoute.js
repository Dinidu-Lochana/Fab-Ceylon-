const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { getFoods, getFoodsByType , getFoodsDeliveryAvailable , orderFoods} =  require('../controllers/FoodOrderController');

router.get('/foods/:admin_id',getFoods);
router.get('/orderfoods/:admin_id', getFoodsDeliveryAvailable );
router.post('/orderfoods/:admin_id/put-order', orderFoods);
router.get('/orderfoods/:admin_id/:foodCategory',getFoodsByType );


module.exports = router;



