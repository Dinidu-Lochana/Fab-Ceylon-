const express = require("express");
const router = express.Router();
const { createFood, getFoods } =  require('../controllers/FoodController');

router.post('/createfood',createFood);
router.get('/foods',getFoods);


module.exports =  router;



