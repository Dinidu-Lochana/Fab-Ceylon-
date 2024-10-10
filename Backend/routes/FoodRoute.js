const express = require("express");
const router = express.Router();
const { createFood } =  require('../controllers/FoodController');

router.post('/createfood',createFood);

module.exports =  router;



