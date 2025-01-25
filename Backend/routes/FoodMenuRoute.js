const express = require("express");
const router = express.Router();
const { RequireAuth } = require('../middleware/RequireAuth')
const { getFoods, getFoodsByType} =  require('../controllers/FoodMenuController');

router.get('/getfoods/:admin_id',getFoods);
router.get('/getfoods/:admin_id/:foodCategory',getFoodsByType );


module.exports = router;



