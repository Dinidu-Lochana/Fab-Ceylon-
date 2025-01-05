const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { getFoods, getFoodsByType, getFoodsWithRatings} =  require('../controllers/FoodMenuController');

router.get('/getFoodsWithRatings/:admin_id', getFoodsWithRatings);
router.get('/getfoods/:admin_id/:foodCategory',getFoodsByType );


module.exports = router;



