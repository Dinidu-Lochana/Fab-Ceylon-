const express = require('express');
const { rateFood, getRating, getOrders, submitFoodRating} = require('../controllers/FoodRatingController');

const router = express.Router();

router.get("/getOrders/:userId/:admin_id", getOrders);
router.patch('/submitFoodRating', submitFoodRating);



module.exports = router;
