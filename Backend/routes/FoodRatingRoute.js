const express = require('express');
const { rateFood, getRating, getOrders, submitRating } = require('../controllers/FoodRatingController');

const router = express.Router();

router.patch('/submitRating/:userId/:foodId', submitRating);
router.get('/getRatings/:_id/:foodId', getRating);
router.get('/getOrders/:_id/:userId',getOrders);

module.exports = router;
